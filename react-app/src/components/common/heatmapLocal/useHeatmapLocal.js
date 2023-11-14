import {useEffect, useState} from "react";

const useHeatmapLocal = (zone, assets, highlightedAssets) => {
    const [localData, setLocalData] = useState([]);

    useEffect(() => {
        const matchedAsset = assets.find(asset => asset.id === highlightedAssets.id);

        if (!matchedAsset) return;

        const pinX = zone.rect.x + zone.rect.width / 2;
        const pinY = zone.rect.y + zone.rect.height / 2;
        const value = Math.pow(100 / matchedAsset.rssi, 7);

        const newPin = {
            x: Math.round(pinX),
            y: Math.round(pinY),
            value: value,
            bridgeId: matchedAsset.bridgeId,
            timeStamp: new Date(Date.now()),
            temperature: matchedAsset.temperature,
        };

        setLocalData(prevData => [newPin, ...prevData].slice(0, 20));  // Keep only the latest 20 items
    }, [zone, assets, highlightedAssets]);

    return localData;
};


export default useHeatmapLocal;