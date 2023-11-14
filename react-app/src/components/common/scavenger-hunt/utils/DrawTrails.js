import React, {useEffect} from "react";
import {getCoordinateForAsset} from "./zoneUtils";

useEffect(() => {
    selectedAssets.forEach(asset => {
        const currentCoordinate = getCoordinateForAsset(asset, zones, mapping);
        const prevTrail = assetTrails[asset.id] || [];

        if (!currentCoordinate) return;

        if (prevTrail.length === 0 ||
            prevTrail[prevTrail.length - 1].x !== currentCoordinate.x ||
            prevTrail[prevTrail.length - 1].y !== currentCoordinate.y) {

            setAssetTrails(prevTrails => ({
                ...prevTrails,
                [asset.id]: [...prevTrail, currentCoordinate]
            }));
        }
    });

    // Remove trails for assets that are no longer selected
    const selectedAssetIds = new Set(selectedAssets.map(a => a.id));
    setAssetTrails(prevTrails => {
        const updatedTrails = {...prevTrails};
        for (let id in updatedTrails) {
            if (!selectedAssetIds.has(id)) {
                delete updatedTrails[id];
            }
        }
        return updatedTrails;
    });

}, [selectedAssets]);


const drawTrails = () => {
    return selectedAssets.map(asset => {
        const trail = assetTrails[asset.id];
        if (!trail || trail.length < 2) return null;

        let pathD = `M${trail[0].x} ${trail[0].y}`;
        for (let i = 1; i < trail.length; i++) {
            pathD += ` Q${(trail[i - 1].x + trail[i].x) / 2} ${(trail[i - 1].y + trail[i].y) / 2}, ${trail[i].x} ${trail[i].y}`;
        }

        return (
            <>
                {/* Defining the arrow marker */}
                <defs>
                    <marker id="arrow" markerWidth="100" markerHeight="10" refX="8" refY="3" orient="auto"
                            markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill="blue"/>
                    </marker>
                </defs>
                <path
                    key={asset.id}
                    d={pathD}
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,8"
                    marker-end="url(#arrow)"// This makes the line dotted with dashes of length 5 and gaps of length 5
                />
            </>


        )
    });
};

{/*{showAssets && <AssetDetails assets={currentZoneAssets} onClose={() => setShowAssets(false)} width={width} height={height} />}*/
}
{/*<svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>{drawTrails()}</svg>*/
}