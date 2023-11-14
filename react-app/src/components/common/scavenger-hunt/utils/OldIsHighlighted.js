import React, {useEffect, useState} from 'react';
import {generateBridgeToZoneMapping} from "./utils/generateBridgeZoneMapping";
import {subscribeToAssetsChanges} from "../../../services/firebase/firebase-data-service";
import AssetDetails from "./AssetDetails";

const ZonePinSVG = ({zone, width, height, assetCount, onClick, highlightedAssets, selectedAssetIds}) => {
    const centerX = zone.rect.x + (zone.rect.width / 2) + 60;
    const centerY = zone.rect.y + (zone.rect.height / 2);
    const radius = '100'//Math.min(zone.rect.width, zone.rect.height) / 2 * 4.2;

    // console.log('radius', radius)

    const fillColor = highlightedAssets && highlightedAssets.poiIdEvent === zone.zoneId ? "green" : "#00b185";

    const isHighlighted = highlightedAssets && highlightedAssets.poiIdEvent === zone.zoneId;


    const extractZoneName = (fullName) => {
        const parts = fullName.split('-');
        if (parts.length >= 3) {
            const mainName = parts[1].replace(/_/g, ' ').split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize each word
            ).join(' ');

            // Check if the next part after the mainName is a number
            if (parts[2] && /^\d+$/.test(parts[2])) {
                return `${mainName} ${parts[2]}`;
            } else {
                return mainName;
            }
        }
        return fullName; // Return the original name if it doesn't match the expected format
    };


    return (
        <svg width={width} height={height} style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>

            {isHighlighted ? (
                // Render the pin shape for highlighted zone
                <>
                    <circle cx={centerX} cy={centerY - 25} r="70" fill="red"/>
                    <path
                        d={`M${centerX - 50} ${centerY + 25} L${centerX} ${centerY + 100} L${centerX + 50} ${centerY + 25} Z`}
                        fill="red"/>

                </>
            ) : (


                <circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    fill={fillColor}
                    fillOpacity={0.7}  // Semi-transparent
                    strokeWidth={2}
                    style={{pointerEvents: 'all'}}
                    onClick={() => onClick(zone.zoneId)}
                />

            )}

            <text x={centerX} y={centerY - 45} fill="white" fontSize="28" textAnchor="middle"
                  alignmentBaseline="middle">
                {extractZoneName(zone.name)}
            </text>


            <text x={centerX} y={centerY} fill="white" fontSize="40" textAnchor="middle" alignmentBaseline="middle">
                {assetCount}
            </text>
            <text x={centerX} y={centerY + 45} fill="white" fontSize="40" textAnchor="middle"
                  alignmentBaseline="middle">
                Assets
            </text>


        </svg>
    );
};

const ZonesSVGRenderer = ({assetsMain, zones, width, height, highlightedAssets, selectedAssetIds}) => {
    const [assets, setAssets] = useState([]);
    const [showAssets, setShowAssets] = useState(false);
    const [currentZoneAssets, setCurrentZoneAssets] = useState([]);

    console.log("assetsMain", assetsMain)

    console.log("highlightedAssets", highlightedAssets)

    // useEffect(() => {
    //     const fetchAssets = async () => {
    //         const result = await fetchTestAssets();
    //         setAssets(result);
    //     };
    //
    //     fetchAssets();
    // }, []);


    useEffect(() => {
        // Start listening to assets changes
        const unsubscribe = subscribeToAssetsChanges((newAssets) => {
            setAssets(newAssets);
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, []);


    const mapping = generateBridgeToZoneMapping(zones);
    const groupedAssets = assets.reduce((acc, asset) => {
        (acc[asset.poiIdEvent] || (acc[asset.poiIdEvent] = [])).push(asset);
        return acc;
    }, {});

    const zoneAssetsMapping = Object.keys(mapping.zoneRefBridge).reduce((acc, zoneId) => {
        acc[zoneId] = groupedAssets[zoneId] || [];
        return acc;
    }, {});

    const handleZoneClick = (zoneId) => {
        setCurrentZoneAssets(zoneAssetsMapping[zoneId]);
        setShowAssets(true);
    };


    const renderedZones = new Set();

    return (
        <div style={{position: 'relative'}}>
            {zones.map(zone => {
                const refBridge = mapping.zoneRefBridge[zone.zoneId];

                if (renderedZones.has(zone.zoneId)) {
                    return null; // Return null to skip rendering for this zone
                }

                renderedZones.add(zone.zoneId);

                return (
                    <ZonePinSVG
                        key={zone.id}
                        zone={{
                            ...zone,
                            rect: {
                                x: refBridge.x,
                                y: refBridge.y,
                                width: zone.rect.width,
                                height: zone.rect.height
                            }
                        }}
                        width={width}
                        height={height}
                        assetCount={zoneAssetsMapping[zone.zoneId].length}
                        onClick={handleZoneClick}
                        highlightedAssets={highlightedAssets}
                        // selectedAssetIds={selectedAssetIds}
                    />
                );
            })}
            {showAssets && <AssetDetails assets={currentZoneAssets} onClose={() => setShowAssets(false)} width={width}
                                         height={height} selectedAssetIds={selectedAssetIds}/>}

        </div>
    );
};

// export default ZonesSVGRenderer;