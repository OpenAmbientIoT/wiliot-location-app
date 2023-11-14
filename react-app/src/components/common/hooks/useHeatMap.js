import {useEffect, useRef, useState} from 'react';
import {addPinLocation, clearAllPinLocations} from "../../../services/firebase/firebase-data-service";

export const useHeatmap = (zone, assets, highlightedAssets, searchText) => {
    const [assetToRender, setAssetToRender] = useState(null);

    // Find the asset from the assets array using highlightedAssets.id
    useEffect(() => {
        const matchedAsset = assets.find(asset => asset.id === highlightedAssets.id);
        setAssetToRender(matchedAsset);
    }, [assets, highlightedAssets]);

    const pinX = zone.rect.x + zone.rect.width / 2;
    const pinY = zone.rect.y + zone.rect.height / 2;

    const previousAssetsRef = useRef(assets);

    useEffect(() => {
        if (!assetToRender) return;

        const dateNow = new Date(Date.now());
        const value = Math.pow(100 / assetToRender.rssi, 7);

        const newPin = {
            x: Math.round(pinX),
            y: Math.round(pinY),
            value: value,
            bridgeId: assetToRender.bridgeId,
            timeStamp: dateNow,
        };

        if (previousAssetsRef.current.lastModifiedTimestamp !== assetToRender.lastModifiedTimestamp && zone.isDragged) {
            addPinLocation(newPin);
        }

        previousAssetsRef.current = assets;

    }, [pinX, pinY, zone.id, assets, assetToRender]);

    useEffect(() => {
        console.log('searchText', searchText)
        if (!searchText || searchText === "") {
            clearAllPinLocations().catch(error => {
                console.error("Error clearing pin locations from Firestore:", error);
            });
        }
    }, [searchText, assets]);
};

