export const generateBridgeToZoneMapping = (zones) => {
    const mapping = {
        bridgeToZone: {},
        zoneRefBridge: {}
    };

    // First, create a dictionary for quick lookup.
    const northBridgeDict = {};
    zones.forEach(zone => {
        if (zone.name.includes('-N-')) {
            northBridgeDict[zone.zoneId] = zone;
        }
    });

    zones.forEach(zone => {
        // 1. Original mapping of bridgeId to zoneId
        mapping.bridgeToZone[zone.id] = zone.zoneId;

        // 2. Reference bridge for each zone.
        if (zone.name.includes('DOCK_DOOR')) {
            if (!mapping.zoneRefBridge[zone.zoneId]) {
                mapping.zoneRefBridge[zone.zoneId] = {
                    refBridgeId: zone.id,
                    x: zone.x,
                    y: zone.y,
                    name: zone.name,
                    zoneId: zone.zoneId
                };
            }
        } else {
            if (northBridgeDict[zone.zoneId]) {
                mapping.zoneRefBridge[zone.zoneId] = {
                    refBridgeId: northBridgeDict[zone.zoneId].id,
                    x: northBridgeDict[zone.zoneId].x,
                    y: northBridgeDict[zone.zoneId].y,
                    name: northBridgeDict[zone.zoneId].name,
                    zoneId: zone.zoneId
                };
            } else {
                if (!mapping.zoneRefBridge[zone.zoneId]) {
                    mapping.zoneRefBridge[zone.zoneId] = {
                        refBridgeId: zone.id,
                        x: zone.x,
                        y: zone.y,
                        name: zone.name,
                        zoneId: zone.zoneId
                    };
                }
            }
        }
    });
    return mapping;
};