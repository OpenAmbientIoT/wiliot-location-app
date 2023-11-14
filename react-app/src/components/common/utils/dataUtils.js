import {subscribeToBucketSizeChanges} from "../../../services/firebase/firebase-data-service";

let MAX_BUCKET = 20;  // default value

// Subscribe to bucket size changes and update the MAX_BUCKET value dynamically
const unsubscribeFromBucketSize = subscribeToBucketSizeChanges((bucketSize) => {
    MAX_BUCKET = bucketSize;
});


export const transformData = (newData) => {
    return {
        max: MAX_BUCKET,
        data: [...newData]
    };
};

export const calculateHighestZone = (newData, bridgeToZoneMapping) => {
    const zoneAggregateRSSI = {};

    newData.forEach(point => {
        const zoneId = bridgeToZoneMapping.bridgeToZone[point.bridgeId];
        const zoneReferenceData = bridgeToZoneMapping.zoneRefBridge[zoneId];

        const zoneName = zoneReferenceData.name

        if (zoneAggregateRSSI[zoneId]) {
            zoneAggregateRSSI[zoneId].value += point.value;
            zoneAggregateRSSI[zoneId].count += 1;
        } else {
            zoneAggregateRSSI[zoneId] = {
                x: zoneReferenceData.x,
                y: zoneReferenceData.y,
                value: point.value,
                count: 1,
                name: zoneName
            };
        }
    });

    const zoneValues = Object.values(zoneAggregateRSSI);
    let highestAggregateZone;

    if (zoneValues.length > 0) {
        highestAggregateZone = zoneValues.reduce((prev, curr) => (prev.value > curr.value) ? prev : curr);
    } else {
        highestAggregateZone = {value: 0}; // default logic if no zones found
    }

    const totalValue = zoneValues.reduce((sum, zone) => sum + zone.value, 0);
    const averageZoneValue = totalValue / zoneValues.length;
    const threshold = 1.2 * averageZoneValue;

    return {
        highestAggregateZone,
        threshold
    };
};
