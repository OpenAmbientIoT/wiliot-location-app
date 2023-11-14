import React, {useMemo} from 'react';
import {generateBridgeToZoneMapping} from "./utils/generateBridgeZoneMapping";
import ZonePinSVG from "./ZonePinSVG";

import {generateGroupedAssets, getZoneAssetsMapping, groupDockDoors,} from './utils/zoneUtils';
import {processZones} from "./utils/processZones";

const ZonesSVGRenderer = ({assets, zones, width, height}) => {

    const mapping = useMemo(() => generateBridgeToZoneMapping(zones), [zones]);

    const groupedAssets = generateGroupedAssets(assets);
    const zoneAssetsMapping = getZoneAssetsMapping(zones, mapping, groupedAssets);
    const dockDoorGroups = groupDockDoors(zones);
    // const selectedZonesSet = new Set(selectedAssets.map(asset => asset.poiIdEvent));

    // const showHighlightedPinsOnly = selectedAssets && selectedAssets.length > 0;

    console.log('ZoneSVGRenderer rendered')


    return (
        <div style={{position: 'relative'}}>
            {zones.map(zone => {
                const zoneProps = processZones(zone, new Set(), mapping, dockDoorGroups, width, height, zoneAssetsMapping);
                // if (showHighlightedPinsOnly) {
                //     return determineHighlightedPinToShow(zoneProps, dockDoorGroups, selectedZonesSet, selectedAssets, zoneAssetsMapping);
                // } else {
                return <ZonePinSVG {...zoneProps} assetCount={zoneAssetsMapping[zoneProps.zone.zoneId].length}/>;
                // }

            })}
        </div>
    );

};

export default ZonesSVGRenderer;