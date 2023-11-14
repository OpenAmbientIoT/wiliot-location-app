import React, {useEffect, useRef, useState} from 'react';

import '../Pin.css'

const ActivityPin = ({x, y}) => {
    console.error('activity pin called', x, y);

    return (
        <svg width="14px" height="18px"
             style={{
                 position: "absolute",
                 top: y - 9,  // Centering based on height
                 left: x - 7, // Centering based on width
                 zIndex: 2,
                 overflow: "visible",
                 cursor: "pointer"
             }}
        >
            <circle
                cx="20" cy="20" r="100"
                fill="none"
                stroke="blue"
                strokeWidth="2"
                className="wave"
            />
        </svg>
    );
};

const AssetsActivityRenderer = ({assets, zones, width, height}) => {
    const [changedAssets, setChangedAssets] = useState([]);
    const prevAssetsRef = useRef();

    console.log('assets', assets)
    console.log('zones', zones)

    useEffect(() => {
        const changed = [];

        if (prevAssetsRef.current) {
            assets.forEach((asset, index) => {
                const prevAsset = prevAssetsRef.current[index];
                if (!prevAsset || JSON.stringify(prevAsset) !== JSON.stringify(asset)) {
                    changed.push(asset);
                }
            });
        } else {
            changed.push(...assets);
        }

        setChangedAssets(changed);
        prevAssetsRef.current = assets;

    }, [assets]);

    console.log('changedAssets', changedAssets)

    return (
        <div style={{position: 'relative', width: `${width}px`, height: `${height}px`, overflow: 'hidden'}}>
            {changedAssets.map((asset, index) => {
                const matchingZone = zones.find(zone => zone.zoneId === asset.poiIdEvent) || zones.find(zone => zone.zoneId === asset.poiId);

                if (matchingZone) {
                    const posX = Math.min(Math.max(matchingZone.x, 7), width - 7);
                    const posY = Math.min(Math.max(matchingZone.y, 9), height - 9);
                    // Using a combination of asset.id and a timestamp to ensure uniqueness.
                    const uniqueKey = `${asset.id}-${Date.now()}-${index}`;
                    return <ActivityPin key={uniqueKey} x={posX} y={posY}/>;
                }
                return null;
            })}
        </div>
    );
};

export default AssetsActivityRenderer;