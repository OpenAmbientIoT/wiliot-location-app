import {getDockDoorGroupForZone, isAnyZoneInGroupSelected} from "./zoneUtils";
import HighlightedZonePin from "../HighlightedZonePin";

export const determineHighlightedPinToShow = (zoneProps, dockDoorGroups, selectedZonesSet, selectedAssets, zoneAssetsMapping) => {
    const dockDoorGroup = getDockDoorGroupForZone(zoneProps.zone, dockDoorGroups);
    if (dockDoorGroup && isAnyZoneInGroupSelected(dockDoorGroup, selectedZonesSet)) {
        const assetNamesForZone = selectedAssets
            .filter(asset => dockDoorGroup.some(groupZone => groupZone.zoneId === asset.poiIdEvent))
            .map(asset => asset.name);

        const assetTempForZone = selectedAssets
            .filter(asset => dockDoorGroup.some(groupZone => groupZone.zoneId === asset.poiIdEvent))
            .map(asset => asset.temperature);

        return <HighlightedZonePin {...zoneProps} assetNamesForZone={assetNamesForZone}
                                   assetTempForZone={assetTempForZone}/>;
    } else if (selectedZonesSet.has(zoneProps.zone.zoneId)) {
        const assetNamesForZone = selectedAssets
            .filter(asset => asset.poiIdEvent === zoneProps.zone.zoneId)
            .map(asset => asset.name);

        const assetTempForZone = selectedAssets
            .filter(asset => asset.poiIdEvent === zoneProps.zone.zoneId)
            .map(asset => asset.temperature);

        return <HighlightedZonePin {...zoneProps} assetNamesForZone={assetNamesForZone}
                                   assetTempForZone={assetTempForZone}/>;
    }
}
