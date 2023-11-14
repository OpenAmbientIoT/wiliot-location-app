import {useEffect, useState} from "react";
import '../../../assets/styles/styles.css';
import {fetchCategories} from "../../../services/firebase/firebase-data-service";
import IssuePopup from "./IssuePopup";

const SearchPanel = ({
                         assets,
                         filteredAssets,
                         setFilteredAssets,
                         zones,
                         selectedLocation,
                         highlightedAsset,
                         setHighlightedAsset
                     }) => {

    const [searchText, setSearchText] = useState("");
    const [categories, setCategories] = useState([]);
    const [filteredAssetsByLocation, setFilteredAssetsByLocation] = useState([]);
    const [filteredAssetsBySearch, setFilteredAssetsBySearch] = useState([]);

    const [isIssuePopupVisible, setIsIssuePopupVisible] = useState(false);
    const [issueAsset, setIssueAsset] = useState(null);


    useEffect(() => {
        const loadCategories = async () => {
            const categoriesData = await fetchCategories();
            setCategories(categoriesData);
        };
        loadCategories().then(r => console.log('categories loaded'));
    }, []);

    useEffect(() => {
        const filterAssets = () => {

            const assetsByCategory = {};
            filteredAssets.forEach((asset) => {
                if (assetsByCategory[asset.categoryId]) {
                    assetsByCategory[asset.categoryId].count += 1;
                } else {
                    assetsByCategory[asset.categoryId] = {
                        count: 1,
                        category: categories.find(category => category.id === asset.categoryId)
                    };
                }
            });

            const categoryCounts = Object.keys(assetsByCategory).map((categoryId) => {
                const category = assetsByCategory[categoryId].category;
                return {
                    categoryId: category.id,
                    categoryName: category.name,
                    count: assetsByCategory[categoryId].count
                };
            });

            console.log('categoryCounts', categoryCounts);
            console.warn('assetsByCategory', assetsByCategory);


            if (searchText) {
                console.log('searchText', searchText)
                const lowerSearchText = searchText.toLowerCase();

                setFilteredAssets(assets.filter((asset) => {
                    const category = categories.find(category => category.id === asset.categoryId);
                    const categorySearchToLowerCase = category.name ? category.name.toLowerCase() : '';
                    console.error('category', categorySearchToLowerCase)
                    const categoryName = category ? categorySearchToLowerCase : '';
                    return (asset.name && asset.name.toLowerCase().includes(lowerSearchText)) || (categoryName && categoryName.includes(lowerSearchText));
                }));
            } else {
                setFilteredAssets(assets);
            }
        };
        filterAssets();
    }, [assets, searchText, categories]);

    const highlightAsset = (assetId) => {
        console.error('highlightAsset', assetId)
        setHighlightedAsset(assetId);
    };

    const filteredCategories = categories.filter((category) =>
        assets.some((asset) => asset.categoryId === category.id)
    );

    const handlePick = (assetId) => {
        // Implement pick functionality here
    };

    const handleLogIssue = (asset) => {
        setIssueAsset(asset);
        setIsIssuePopupVisible(true);
    };

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search assets"
                onChange={(e) => setSearchText(e.target.value)}
            />
            {selectedLocation && (
                <table>
                    <thead>
                    <tr>
                        <th>Category</th>
                        <th>Number of Assets</th>
                        <th>Zone</th>
                        <th>Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredCategories.map((category) => {
                        const assetsInCategory = filteredAssets.filter(
                            (asset) => asset.categoryId === category.id && zones.some(zone => zone.id === asset.poiId && zone.locationId === selectedLocation)
                        );
                        if (assetsInCategory.length === 0) {
                            return null;
                        }
                        const asset = assetsInCategory[0];
                        const foundZone = zones.find(zone => zone.id === asset.poiId);

                        console.log('foundZone', foundZone)

                        console.warn('assetId', asset.id)

                        return (
                            <tr key={category.id}>
                                <td>{category.name}</td>
                                <td>{assetsInCategory.length}</td>
                                <td>{foundZone && (foundZone.name || foundZone.zoneName)}</td>
                                <td>
                                    <button onClick={() => highlightAsset(asset.id)}>Find</button>
                                    <button onClick={() => handlePick(asset.id)}>Pick</button>
                                    <button onClick={() => handleLogIssue(asset)}>Log Issue</button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}

            {isIssuePopupVisible && (
                <div className="issue-popup-overlay">
                    <IssuePopup
                        asset={issueAsset}
                        onSubmit={() => setIsIssuePopupVisible(false)}
                        onCancel={() => setIsIssuePopupVisible(false)}
                    />
                </div>
            )}
        </div>
    );

};

export default SearchPanel;
