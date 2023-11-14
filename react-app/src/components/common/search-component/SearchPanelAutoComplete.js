import {useEffect, useState} from "react";
import '../../../assets/styles/styles.css';
import './SearchPanel.module.css';
import AutoComplete from "./AutoComplete";
import "./SearchPanel.module.css"

const SearchPanelAutoComplete = ({
                                     assets,
                                     filteredAssets,
                                     setFilteredAssets,
                                     highlightedAssets,
                                     setHighlightedAssets,
                                     searchText,
                                     setSearchText,
                                     searchInputRef,
                                 }) => {

        const [suggestions, setSuggestions] = useState([]);

        useEffect(() => {
            if (searchText) {
                const lowerSearchText = searchText.toLowerCase();
                const newFilteredAssets = assets.filter((asset) => {
                    return asset.id && asset.id.toLowerCase().includes(lowerSearchText);
                });
                // console.log('new Filtered assets',newFilteredAssets); // Log the new state here
                setFilteredAssets(newFilteredAssets);
            } else {
                setFilteredAssets(assets);
            }
        }, [assets, searchText]);


        useEffect(() => {
            if (highlightedAssets && highlightedAssets.id !== undefined) {
                const matchingAsset = assets.find(asset => asset && asset.id === highlightedAssets.id);
                setHighlightedAssets(matchingAsset);  // or another appropriate choice based on your application's needs
            }
        }, [assets, highlightedAssets]);

        const handleInputChange = (e) => {
            const input = e.target.value;
            setSearchText(input);

            if (input.length > 0) {
                const lowerInput = input.toLowerCase();
                setSuggestions(
                    assets.filter(asset => {
                        if (asset && asset.id) {
                            const lowerAssetId = asset.id.toLowerCase();
                            return lowerAssetId.includes(lowerInput);
                        }
                        return false;
                    })
                );
            } else {
                setSuggestions([]);
            }
        };

        const handleSuggestionSelect = (selectedAsset, selectedZone) => {
            if (!selectedAsset || !selectedAsset.id) {
                console.error('Selected category or its name is null or undefined!');
                return;  // Exit early if selectedCategory or its name is null
            }

            if (!assets) {
                return;  // Exit early if assets is null or undefined
            }
            setSearchText(selectedAsset.id);
            setSuggestions([]);
            const assetsSelected = filteredAssets.filter(
                (asset) => asset && asset.id && asset.id === selectedAsset.id
            );
            if (assetsSelected && assetsSelected.length > 0 && assets.includes(assetsSelected[0])) {
                // if (highlightedAssets) {
                setHighlightedAssets(assetsSelected[0]);
                // } else {
                //     console.warn('HighlightedAssets is null or undefined. Not updating.');
                // }
            } else if (highlightedAssets) {
                setHighlightedAssets(assets[0]);  // or another appropriate choice based on your application's needs
            }
        };

        useEffect(() => {
            if (!searchText || searchText === "") {
                setHighlightedAssets(null);
            }
        }, [searchText, assets]);


        return (
            <AutoComplete
                placeholder="Search (Asset ID, UPC)"
                value={searchText}
                suggestions={suggestions}
                onChange={handleInputChange}
                onSelect={handleSuggestionSelect}
                searchInputRef={searchInputRef}
            />
        );

    }
;

export default SearchPanelAutoComplete;