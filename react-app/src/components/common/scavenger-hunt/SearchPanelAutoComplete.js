import {useEffect, useState} from "react";
import '../../../assets/styles/styles.css';
import {subscribeToAssetsChanges} from "../../../services/firebase/firebase-data-service";

import './SearchPanel.module.css';
import AutoComplete from "./AutoComplete";
import "./SearchPanel.module.css"
import {tableCellClasses} from '@mui/material/TableCell';
import {collection, onSnapshot, query, where} from "firebase/firestore";

import {TableCell, TableRow,} from "@material-ui/core";
import {styled} from "@mui/material/styles";
import theme from "../../../theme";
import {makeStyles} from "@material-ui/core/styles";
import useAppBarHeight from "../../main/User/hooks/useAppBarHeight";
import {firestore} from "../../../services/firebase/firebaseConfig";

const useStyles = makeStyles(() => ({
    tablePickButton: {
        borderRadius: 50,
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
    },
    tableIssueButton: {
        borderRadius: 50,
    },
    flashGreen: {
        backgroundColor: "green",
    },
}));

// export const subscribeToAssetsUpdates = (callback) => {
//     const assetsRef = collection(firestore, 'assets');
//
//     const unsubscribe = onSnapshot(assetsRef, (snapshot) => {
//         const assets = snapshot.docs.map((doc) => doc.data());
//         callback(assets);
//     });
//
//     return unsubscribe;
// };


export const subscribeToSpecificAssetUpdates = (assetId, callback) => {
    const assetsRef = collection(firestore, 'assets-boutique');

    console.error("assetId: ", assetId)

    // Normalize assetId by converting to lowercase for case-insensitive search
    const normalizedAssetId = assetId.toLowerCase();

    // console.warn("assetId: ", normalizedAssetId)

    const specificQuery = query(
        assetsRef,
        where("id", ">=", normalizedAssetId),
        where("id", "<=", normalizedAssetId + "\uf8ff")
    );

    const unsubscribe = onSnapshot(specificQuery, (snapshot) => {
        const assets = snapshot.docs.map((doc) => doc.data());
        callback(assets);
    });

    return unsubscribe;
};


const SearchPanelAutoComplete = ({
                                     assets,
                                     setAssets,
                                     filteredAssets,
                                     setFilteredAssets,
                                     zones,
                                     highlightedAssets,
                                     setHighlightedAssets,
                                     // setIssueAsset,
                                     searchText,
                                     setSearchText,
                                     searchInputRef,
                                     // setSelectedCategory,
                                 }) => {


        useEffect(() => {
            // Start listening to assets changes
            const unsubscribe = subscribeToAssetsChanges((newAssets) => {
                setAssets(newAssets);
            });

            // Cleanup the listener when the component unmounts
            return () => unsubscribe();
        }, []);

        const [suggestions, setSuggestions] = useState([]);
        const classes = useStyles();

        const [selectedAsset, setSelectedAsset] = useState(null);

        // console.log(assets);


        // useEffect(() => {
        //     const unsubscribe = subscribeToAssetsUpdates((newAssets) => {
        //         setAssets(newAssets);
        //     });
        //
        //     // Cleanup the listener when the component is unmounted.
        //     return () => unsubscribe();
        // }, []);

        // Define a reference for the unsubscribe function
        let unsubscribe;

        useEffect(() => {
            // Only set up the subscription if there's a valid searchText
            if (searchText) {
                unsubscribe = subscribeToSpecificAssetUpdates(searchText, (newAssets) => {
                    setAssets(newAssets);
                });
            }

            // Cleanup: Unsubscribe when the component is unmounted or when searchText changes
            return () => unsubscribe && unsubscribe();
        }, [searchText]);


        useEffect(() => {
            if (searchText) {
                console.error("searchText: ", searchText)

                const lowerSearchText = searchText.toLowerCase();
                const newFilteredAssets = assets.filter((asset) => {
                    console.error("asset: ", asset.id.toLowerCase())
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
                setHighlightedAssets(matchingAsset);
                // }
            }
        }, [assets, highlightedAssets]);

        const handleRowClick = (asset, zone) => {
            handleSuggestionSelect(asset, zone)
        };

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
                console.error('Assets is null or undefined!');
                return;  // Exit early if assets is null or undefined
            }

            setSearchText(selectedAsset.id);

            setSuggestions([]);

            const assetsSelected = filteredAssets.filter(
                (asset) => asset && asset.id && asset.id === selectedAsset.id
            );

            console.log('assetsSelected', assetsSelected);

            if (assetsSelected && assetsSelected.length > 0 && assets.includes(assetsSelected[0])) {
                setHighlightedAssets(assetsSelected[0]);
            } else if (highlightedAssets) {
                setHighlightedAssets(assets[0]);  // or another appropriate choice based on your application's needs
            }
        };

        useEffect(() => {
            if (!searchText) {
                setHighlightedAssets(null);
            }
        }, [searchText, assets]);

        const StyledTableCell = styled(TableCell)(({theme}) => ({
            [`&.${tableCellClasses.head}`]: {
                backgroundColor: theme.palette.common.white,
                color: theme.palette.grey[500],
                fontSize: 11,
                padding: 12,
            },
            [`&.${tableCellClasses.body}`]: {
                fontSize: 11,
                padding: 12,
            },
        }));

        const StyledTableRow = styled(TableRow)(({theme}) => ({
            '&:last-child td, &:last-child th': {
                border: 0,
            },
        }));

        const StyledTableHeadRow = styled(TableRow)(({theme}) => ({
            // '&:nth-of-type(odd)': {
            //     backgroundColor: theme.palette.action.hover,
            // },
            // hide last border
            '&:last-child td, &:last-child th': {
                border: 0,
            },
        }));

        const appBarHeight = useAppBarHeight()


        console.log("assets in Search Panel: ", assets)


        return (
            <AutoComplete
                placeholder="Search (Asset ID, UPC)"
                value={searchText}
                suggestions={suggestions}
                onChange={handleInputChange}
                onSelect={handleSuggestionSelect}
                searchInputRef={searchInputRef}
            />
            //     {selectedAsset ? (
            //         // Render your selected asset details here.
            //         <div>
            //             <h2>Asset Details:</h2>
            //             {/* Display details of your selected asset */}
            //         </div>
            //     ) : searchText && (
            //         <Box style={{ minHeight: "100px", backgroundColor: 'white' }}>
            //         </Box>
            //     )
            //     }
            //
            //
            // </Box>
        );

    }
;

export default SearchPanelAutoComplete;