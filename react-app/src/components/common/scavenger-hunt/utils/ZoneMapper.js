import {generateBridgeToZoneMapping} from './generateBridgeZoneMapping';

const useZoneMapper = (zones, assets) => {
    const mapping = generateBridgeToZoneMapping(zones);
    const groupedAssets = assets.reduce((acc, asset) => {
        (acc[asset.poiIdEvent] || (acc[asset.poiIdEvent] = [])).push(asset);
        return acc;
    }, {});

    const zoneAssetsMapping = Object.keys(mapping.zoneRefBridge).reduce((acc, zoneId) => {
        acc[zoneId] = groupedAssets[zoneId] || [];
        return acc;
    }, {});

    return {mapping, zoneAssetsMapping};
};

export default useZoneMapper;