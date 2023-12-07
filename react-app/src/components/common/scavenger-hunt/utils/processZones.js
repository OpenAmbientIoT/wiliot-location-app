import {getAssetsCountForGroup, getAverageCoordinates, getDockDoorGroupForZone} from "./zoneUtils";

export const processZones = (zone, renderedZones, mapping, dockDoorGroups, width, height, zoneAssetsMapping) => {
    const refBridge = mapping.zoneRefBridge[zone.zoneId];
    const dockDoorGroup = getDockDoorGroupForZone(zone, dockDoorGroups);
    let zoneProps;

    if (renderedZones.has(zone.zoneId)) {
        return null; // Skip rendering for this zone
    }
    renderedZones.add(zone.zoneId);

    if (dockDoorGroup) {
        const averageCoordinates = getAverageCoordinates(dockDoorGroup, mapping);
        const assetsCount = getAssetsCountForGroup(dockDoorGroup, zoneAssetsMapping);
        zoneProps = {
            key: zone.id + '-group',
            zone: {
                ...zone,
                name: `Dock ${zone.dockDoorGroup}`,
                rect: {
                    x: averageCoordinates.x - 40,
                    y: averageCoordinates.y - 5,
                    width: zone.rect?.width,
                    height: zone.rect?.height
                },
            },
            width,
            height,
        };

        if (assetsCount) {
            zoneProps.assetCount = assetsCount;
        }
        dockDoorGroup.forEach(groupZone => renderedZones.add(groupZone.zoneId));
    } else {
        zoneProps = {
            key: zone.id,
            zone: {
                ...zone,
                rect: {
                    x: refBridge.x,
                    y: refBridge.y,
                    width: zone.rect?.width,
                    height: zone.rect?.height
                }
            },
            width,
            height,
        };
    }

    return zoneProps;
}
