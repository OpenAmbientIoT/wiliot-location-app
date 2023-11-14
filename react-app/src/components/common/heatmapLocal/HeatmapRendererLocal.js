import {useMemo} from "react";
import HeatmapLocal from "./HeatmapLocal";
import useHeatmapLocal from "./useHeatmapLocal";

// const HeatmapRendererLocal = ({ zone, highlightedAssets, assets, zones }) => {
//
//     const [localData, setLocalData] = useState([]);
//
//     const data = useHeatmapLocal(zone, assets, highlightedAssets,localData, setLocalData);
//
//     const highlightedAsset = useMemo(() => {
//         return assets.find(asset => (highlightedAssets.id === asset.id) && asset.bridgeId === zone.id);
//     }, [assets, highlightedAssets, zone]);
//
//     if (!highlightedAsset || !zone.rect) return null;
//
//     console.log('localData', data)
//     console.log('HeatMap Rendering ')
//
//     return (
//         <HeatmapLocal
//             data={data}
//             zones={zones}
//         />
//     );
// };
//
// export default HeatmapRendererLocal;


const IndividualAssetHeatmap = ({asset, zone, assets, zones}) => {

    const data = useHeatmapLocal(zone, assets, asset);

    const highlightedAsset = useMemo(() => {
        return assets.find(assetItem => (asset.id === assetItem.id) && assetItem.bridgeId === zone.id);
    }, [assets, asset, zone]);

    if (!highlightedAsset || !zone.rect) return null;


    console.log('img for highlightedAsset', highlightedAsset)

    return (
        // <div style={{ position: 'absolute' }}> {/* This div wraps around the heatmap */}
        <HeatmapLocal
            data={data}
            zones={zones}
            imgUrl={highlightedAsset.imgUrl}
        />
        // </div>
    );
};


const HeatmapRendererLocal = ({zone, highlightedAssetsArray, assets, zones}) => {

    return (
        <>
            {/*<div style={{ position: 'relative' }}> /!* This div wraps around all heatmaps *!/*/}
            {highlightedAssetsArray.map(highlightedAsset => (
                <IndividualAssetHeatmap
                    key={highlightedAsset.id}
                    asset={highlightedAsset}
                    zone={zone}
                    assets={assets}
                    zones={zones}
                />
            ))}
            {/*</div>*/}
        </>
    );
};

export default HeatmapRendererLocal;
