import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    assetButton: {
        margin: theme.spacing(1),
        padding: theme.spacing(1, 2),
        [theme.breakpoints.down('xs')]: {
            minWidth: '80px',
            minHeight: '40px',
        },
        [theme.breakpoints.up('sm')]: {
            minWidth: '100px',
            minHeight: '50px',
        },
        transition: theme.transitions.create(['background-color', 'box-shadow']),
    },
    selected: {
        '&$assetButton': {
            backgroundColor: '#2196F3',
            color: 'white',
            '&:hover': {
                backgroundColor: '#1976D2',
            },
        },
    },
    assetContainer: {
        border: '1px solid #d4d4d4', // Simple gray border
        borderRadius: '8px',       // Rounded edges
        padding: theme.spacing(2), // Inner spacing
        marginBottom: theme.spacing(2), // Spacing from bottom
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Optional: a subtle shadow for depth
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',  // For spacing between the buttons
        marginTop: theme.spacing(2),      // Top spacing for visual separation
    },

    controlButton: {
        color: '#fff',
        backgroundColor: '#3f51b5',      // Blue color taken from Material-UI's default primary color
        '&:hover': {
            backgroundColor: '#303f9f',   // Darkened version for hover state
        }
    },
    darkGreyButton: {
        backgroundColor: 'rgba(128,128,128,0.56)',
        '&:hover': {
            backgroundColor: 'grey',
        },
    },
}));

const AssetBox = ({asset, isSelected, onClick}) => {
    const classes = useStyles();

    const bridgeIdExists = Boolean(asset.bridgeId);

    return (
        <Button
            variant="contained"
            className={
                `${classes.assetButton}
                 ${isSelected ? classes.selected : ''}
                 ${bridgeIdExists ? classes.darkGreyButton : ''}`
            }
            onClick={() => onClick(asset)}
        >
            {asset.name}
        </Button>
    );
};

const AssetContainer = ({assets, onAssetSelection}) => {
    const [selectedAssetIds, setSelectedAssetIds] = useState([]);
    const [showAssets, setShowAssets] = useState(false); // For collapsing the asset list
    const classes = useStyles();

    const handleAssetClick = (asset) => {
        if (selectedAssetIds.includes(asset.id)) {
            setSelectedAssetIds(prevIds => prevIds.filter(id => id !== asset.id));
        } else {
            setSelectedAssetIds(prevIds => [...prevIds, asset.id]);
        }
    };

    useEffect(() => {
        const actualSelectedAssets = assets.filter(asset => selectedAssetIds.includes(asset.id));
        onAssetSelection(actualSelectedAssets);
    }, [selectedAssetIds, assets]);

    const sortedAssets = [...assets].sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
    );


    return (
        <div className={classes.assetContainer}>
            <Box className={classes.buttonContainer}>
                <Button
                    variant="contained"
                    className={classes.controlButton}
                    onClick={() => setShowAssets(!showAssets)}>
                    {showAssets ? 'Hide Assets' : 'Show Assets'}
                </Button>

                <Button
                    variant="contained"
                    className={classes.controlButton}
                    onClick={() => setSelectedAssetIds([])}
                >
                    Clear Selection
                </Button>
            </Box>

            {/*<Collapse in={showAssets}>*/}
            {/*    <Grid container spacing={2}>*/}
            {/*        {sortedAssets.map((asset) => (*/}
            {/*            <Grid item key={asset.id}>*/}
            {/*                <AssetBox*/}
            {/*                    asset={asset}*/}
            {/*                    isSelected={selectedAssetIds.includes(asset.id)}*/}
            {/*                    onClick={handleAssetClick}*/}
            {/*                />*/}
            {/*            </Grid>*/}
            {/*        ))}*/}
            {/*    </Grid>*/}
            {/*</Collapse>*/}
            <Collapse in={showAssets}>
                <Grid container spacing={2}>
                    {sortedAssets.map((asset) => (
                        asset.isVisible !== false ? (
                            <Grid item key={asset.id}>
                                <AssetBox
                                    asset={asset}
                                    isSelected={selectedAssetIds.includes(asset.id)}
                                    onClick={handleAssetClick}
                                />
                            </Grid>
                        ) : null
                    ))}
                </Grid>
            </Collapse>

        </div>
    );
};

export default AssetContainer;
