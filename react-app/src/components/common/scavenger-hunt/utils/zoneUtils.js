// zoneUtils.js

export const generateGroupedAssets = (assets) =>
    assets.reduce((acc, asset) => {
        (acc[asset.poiIdEvent] || (acc[asset.poiIdEvent] = [])).push(asset);
        return acc;
    }, {});

export const getZoneAssetsMapping = (zones, mapping, groupedAssets) =>
    Object.keys(mapping.zoneRefBridge).reduce((acc, zoneId) => {
        acc[zoneId] = groupedAssets[zoneId] || [];
        return acc;
    }, {});

export const groupDockDoors = (zones) =>
    zones.reduce((acc, zone) => {
        if (zone.dockDoorGroup) {
            (acc[zone.dockDoorGroup] || (acc[zone.dockDoorGroup] = [])).push(zone);
        }
        return acc;
    }, {});

export const getAverageCoordinates = (dockDoorGroup, mapping) => {
    const totalDoors = dockDoorGroup.length;
    const sumCoordinates = dockDoorGroup.reduce((acc, zone) => {
        const refBridge = mapping.zoneRefBridge[zone.zoneId];
        acc.x += refBridge.x;
        acc.y += refBridge.y;
        return acc;
    }, {x: 0, y: 0});

    return {
        x: sumCoordinates.x / totalDoors,
        y: sumCoordinates.y / totalDoors
    };
};

export const getAssetsCountForGroup = (dockDoorGroup, zoneAssetsMapping) =>
    dockDoorGroup.reduce((sum, zone) => sum + zoneAssetsMapping[zone.zoneId].length, 0);

export const getDockDoorGroupForZone = (zone, dockDoorGroups) =>
    zone.dockDoorGroup ? dockDoorGroups[zone.dockDoorGroup] : null;

export const isAnyZoneInGroupSelected = (dockDoorGroup, selectedZonesSet) =>
    dockDoorGroup.some(groupZone => selectedZonesSet.has(groupZone.zoneId));

export const getZoneNameForDockDoor = (poiId, dockDoorGroup) => {
    const dockDoor = dockDoorGroup.find(door => door.zoneId === poiId);
    return dockDoor ? dockDoor.zoneName : null;
};

export const getCoordinateForAsset = (asset, zones, mapping) => {
    const zone = zones.find(z => z.zoneId === asset.poiIdEvent);
    if (!zone) return null;

    const refBridge = mapping.zoneRefBridge[zone.zoneId];
    if (!refBridge) return null;

    return {
        x: refBridge.x,
        y: refBridge.y
    };
};

export const getZonePropsForDockDoor = (zone, dockDoorGroups, mapping, width, height) => {
    const dockDoorGroup = getDockDoorGroupForZone(zone, dockDoorGroups);
    if (dockDoorGroup) {
        const averageCoordinates = getAverageCoordinates(dockDoorGroup, mapping);
        const assetsCount = getAssetsCountForGroup(dockDoorGroup);
        return {
            key: zone.id + '-group',
            zone: {
                ...zone,
                name: `Dock ${zone.dockDoorGroup}`,
                rect: {
                    x: averageCoordinates.x - 40,
                    y: averageCoordinates.y - 5,
                    width: zone.rect.width,
                    height: zone.rect.height
                },
            },
            width,
            height,
            assetsCount
        };
    } else {
        const refBridge = mapping.zoneRefBridge[zone.zoneId];
        return {
            key: zone.id,
            zone: {
                ...zone,
                rect: {
                    x: refBridge.x,
                    y: refBridge.y,
                    width: zone.rect.width,
                    height: zone.rect.height
                }
            },
            width,
            height,
        };
    }
};

export const shouldRenderHighlightedPin = (zone, selectedZonesSet, dockDoorGroups, selectedAssets) => {
    const dockDoorGroup = getDockDoorGroupForZone(zone);
    if (dockDoorGroup) {
        return isAnyZoneInGroupSelected(dockDoorGroup, selectedZonesSet);
    } else {
        return selectedZonesSet.has(zone.zoneId);
    }
};