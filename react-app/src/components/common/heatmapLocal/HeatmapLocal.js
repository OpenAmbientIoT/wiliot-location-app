import React, {useEffect, useMemo, useRef, useState} from "react";
import h337 from "heatmap.js";
import {selectGradient} from "../utils/gradients";
// import { generateBridgeToZoneMapping } from "../utils/mappingUtils";
import {generateBridgeToZoneMapping} from "../scavenger-hunt/utils/generateBridgeZoneMapping";
import {calculateHighestZone} from "../utils/dataUtils";

const toFixedPrecision = (value, precision = 2) => parseFloat(value.toFixed(precision));

const aggregateDataByZones = (data, bridgeToZoneMapping) => {
    const aggregatedData = {};

    data.forEach(point => {
        const zoneId = bridgeToZoneMapping.bridgeToZone[point.bridgeId];
        const zoneReferenceData = bridgeToZoneMapping.zoneRefBridge[zoneId];
        // console.log('zoneName for high zone', zoneReferenceData)

        if (!zoneId) {
            console.error("No zoneId found for bridgeId:", point.bridgeId);
            return; // Skip this iteration
        }
        if (aggregatedData[zoneId]) {
            aggregatedData[zoneId].value += toFixedPrecision(point.value);
            aggregatedData[zoneId].value = toFixedPrecision(aggregatedData[zoneId].value);
        } else {
            aggregatedData[zoneId] = {
                x: zoneReferenceData.x,
                y: zoneReferenceData.y,
                value: toFixedPrecision(point.value),
                name: zoneReferenceData.name
            };
        }
    });

    console.log('data for this welch', aggregatedData)
    return Object.values(aggregatedData);
};


const HeatmapLocal = React.memo(({data, zones, imgUrl}) => {


    const jackOLanternImg = "https://firebasestorage.googleapis.com/v0/b/wiliot-asset-tracking.appspot.com/o/kisspng-jack-o-lantern-halloween-pumpkin-clip-art-cute-pumpkin-transparent-background-5a7962a124d2b7.7872577415179045451508%20(1).png?alt=media&token=decad649-c213-4daa-bb96-e5217a8a7c45&_gl=1*lriw00*_ga*NjU4MTkwMzQ5LjE2ODk3NjQwNDg.*_ga_CW55HF8NVT*MTY5NzgzMTM3MS4xNjEuMS4xNjk3ODMxMzg4LjQzLjAuMA.."

    const heatMapImg = imgUrl ? imgUrl : jackOLanternImg;

    const [updateKey, setUpdateKey] = useState(0);
    const forceUpdateHeatmap = () => {
        setUpdateKey(prevKey => prevKey + 1);
    };


    const heatmapInstanceRef = useRef(null);
    const heatmapContainerRef = useRef(null);
    const selectedGradient = selectGradient(Number(data?.[19]?.temperature || 22));
    console.log(selectedGradient)
    // const selectedGradient = {
    //     '.1': 'rgba(41,0,190,0.1)',
    //     '.3': 'rgba(41,0,190,0.3)',
    //     '.7': 'rgba(41,0,190,0.7)',
    //     '1': 'rgba(41,0,190,1)'
    // }


    const bridgeToZoneMapping = useMemo(() => generateBridgeToZoneMapping(zones), [zones]);
    const [jackOLanternPosition, setJackOLanternPosition] = useState(null);

    useEffect(() => {
        if (!heatmapInstanceRef.current || !data) return;

        const aggregatedData = aggregateDataByZones(data, bridgeToZoneMapping);
        const {highestAggregateZone, threshold} = calculateHighestZone(data, bridgeToZoneMapping);

        if (highestAggregateZone.value > threshold) {
            heatmapInstanceRef.current.configure({
                gradient: selectedGradient
            });
        } else {
            heatmapInstanceRef.current.configure({
                // gradient: selectedGradient
            });
        }

        highestAggregateZone.value /= highestAggregateZone.count;

        const highestZoneAggregatedData = {
            x: highestAggregateZone.x,
            y: highestAggregateZone.y,
            value: highestAggregateZone.value * 2, // amplificationValue,
            name: highestAggregateZone.name
        };

        setJackOLanternPosition({
            x: highestZoneAggregatedData.x,
            y: highestZoneAggregatedData.y
        });

        //Clear the current heatmap data
        heatmapInstanceRef.current.setData({data: []});

        // Find the item in aggregatedData with matching x, y, and name
        const existingDataIndex = aggregatedData.findIndex(item =>
            item.x === highestZoneAggregatedData.x &&
            item.y === highestZoneAggregatedData.y &&
            item.name === highestZoneAggregatedData.name
        );

        if (existingDataIndex !== -1) {
            // If found, update the value
            aggregatedData[existingDataIndex].value += highestZoneAggregatedData.value;
        } else {
            // Otherwise, add highestZoneAggregatedData to aggregatedData
            aggregatedData.push(highestZoneAggregatedData);
        }


        let maxValue = -Infinity;
        let minValue = Infinity;
        aggregatedData.forEach(item => {
            maxValue = Math.max(maxValue, item.value);
            minValue = Math.min(minValue, item.value);
        });

        console.log('aggregatedData before', aggregatedData)

        // 2. Normalize the values
        aggregatedData.forEach(item => {
            item.value = 100 * ((item.value - minValue) / (maxValue - minValue));
            if (isNaN(item.value)) {
                item.value = 100;
            }
        });

        console.log('aggregatedData', aggregatedData)


        // heatmapInstanceRef.current.setData({
        //     max: 100, // Since you normalized to [0,1], but adjust as needed
        //     data: aggregatedData
        // });

        aggregatedData.forEach(dataPoint => {
            heatmapInstanceRef.current.addData(dataPoint);
        });


        return () => {
            // Cleanup logic
            heatmapInstanceRef.current.setData({data: []});
        };
    }, [data, updateKey]);


    useEffect(() => {

        console.log('select gradient data', data[0]?.temperature)

        if (!heatmapInstanceRef.current) {
            heatmapInstanceRef.current = h337.create({
                container: heatmapContainerRef.current,
                radius: 160,
                gradient: selectedGradient,
                max: 100, // initial max value
                // maxOpacity: 0.8,  // adjust this if needed
                // minOpacity: 0.1,  // set a low value to make the lower value blobs more transparent
            });
        }
    }, [selectedGradient]);


    return (
        <div style={{position: "absolute", top: 0, left: 0, width: '100%', height: '100%'}}>
            {jackOLanternPosition && (
                <img
                    src={heatMapImg}
                    alt="Jack-O'-Lantern"
                    style={{
                        position: 'absolute',
                        top: `${jackOLanternPosition.y}px`,
                        left: `${jackOLanternPosition.x}px`,
                        width: '100px',  // Adjust as needed
                        height: '100px', // Adjust as neededa
                        transform: 'translate(-50%, -50%)', // Center the image on x,y
                        zIndex: 1000
                    }}
                />
            )}

            <div ref={heatmapContainerRef}
                 style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}></div>


        </div>

    );
});

export default HeatmapLocal;

