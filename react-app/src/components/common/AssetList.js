import React from 'react';

const AssetList = ({fetchedZones, assets, displayAssetsForZone, setDisplayAssetsForZone, displayAssets}) => {
    return (
        <div>
            {
                displayAssets &&
                fetchedZones.map((zone) => {
                    const assetsForZone = assets.filter((asset) => asset.poiId === zone.id);
                    return (
                        <div key={zone.id}>
                            <p>{zone.name} ({zone.id})</p>
                            <p
                                onClick={() => {
                                    if (displayAssetsForZone === zone.id) {
                                        setDisplayAssetsForZone(null);
                                    } else {
                                        setDisplayAssetsForZone(zone.id);
                                    }
                                }}
                            >
                                Assets count: {assetsForZone.length}
                            </p>
                            {displayAssetsForZone === zone.id && assetsForZone.map((asset) => <p
                                key={asset.id}>{asset.name} ({asset.id})</p>)}
                        </div>
                    );
                })
            }
        </div>
    );
};

export default AssetList;