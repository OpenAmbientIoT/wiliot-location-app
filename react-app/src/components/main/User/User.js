import React, {useEffect, useMemo, useRef, useState} from 'react';
import '../../../assets/styles/styles.css';
import {
    getZoneMappingByLocationId,
    subscribeToAssetsChanges,
    updateAssetIdsInWavelet
} from '../../../services/firebase/firebase-data-service';
import {collection, getDocs, query} from 'firebase/firestore';
import {firestore} from '../../../services/firebase/firebaseConfig';
import LocationSelector from '../../common/LocationSelector';
import useDataFetching from "./hooks/useDataFetching";
import useZoneManagement from "./hooks/useZoneManagement";
import SearchPanelAutoComplete from "../../common/search-component/SearchPanelAutoComplete";
import UserLayout from "../../layout/user/UserLayout";
import {AppBar, Box, Grid, Typography} from "@mui/material";
import UserMenu from "../../layout/user/UserMenu";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import useAppBarHeight from "./hooks/useAppBarHeight";
import useChildScaleToFitParent from "./hooks/useChildScaleToFitParent";
import ZonesSVGRenderer from "../../common/scavenger-hunt/ZonesSVGRenderer";


import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AssetContainer from "../../common/scavenger-hunt/AssetContainer";
import WaveletRenderer from "../../common/WaveletRenderer";
import HeatmapRendererLocal from "../../common/heatmapLocal/HeatmapRendererLocal";
import {generateBridgeToZoneMapping} from "../../common/scavenger-hunt/utils/generateBridgeZoneMapping";
import {generateGroupedAssets, getZoneAssetsMapping, groupDockDoors} from "../../common/scavenger-hunt/utils/zoneUtils";
import {processZones} from "../../common/scavenger-hunt/utils/processZones";
import {determineHighlightedPinToShow} from "../../common/scavenger-hunt/utils/determineHighlightedPinToShow";

function UserView() {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [image, setImage] = useState(null);
    const [zoneData, setZoneData] = useState([]);
    const imgRef = useRef(null);
    const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0});
    const [selectedLocation, setSelectedLocation] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [locationAddress, setLocationAddress] = useState(null);
    const [locationName, setLocationName] = useState(null);
    const [filteredAssets, setFilteredAssets] = useState([]);
    const svgRef = useRef(null);
    const [issueAsset, setIssueAsset] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [highlightedAssets, setHighlightedAssets] = useState([]);
    const [assets, setAssets] = useState([]);
    const [selectedAssets, setSelectedAssets] = useState([]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const {
        locations,
        fetchedZones,
        // assets,
        categories,
        fetchZonesWrapper,
        zoneCategory
    } = useDataFetching();

    const {
        zones,
        setZones,
        selectedZone,
    } = useZoneManagement(fetchedZones);


    const appBarHeight = useAppBarHeight()
    const contentMaxHeight = `calc(100vh - ${appBarHeight}px - ${theme.spacing(4)})`
    const searchMaxHeight = `calc(100vh - ${appBarHeight}px - ${theme.spacing(2)})`

    // Scaler
    const parentRef = useRef(null);
    const childRef = useRef(null);
    const [isPortrait, setPortrait] = useState(false);
    const {scale, recalculateScaleCallback} = useChildScaleToFitParent(parentRef, imgRef, isPortrait);

    const prevHighlightedAssetsIdRef = useRef();

    const mapping = useMemo(() => generateBridgeToZoneMapping(zones), [zones]);


    const prevSelectedAssetsRef = useRef([]);


    useEffect(() => {
        const prevSelectedAssets = prevSelectedAssetsRef.current;
        prevSelectedAssetsRef.current = selectedAssets;

        if (JSON.stringify(prevSelectedAssets) !== JSON.stringify(selectedAssets)) {
            console.warn('selectedAssets changed to', selectedAssets);

            const handleUpdate = async () => {
                const updatedAssetIds = selectedAssets.map(asset => asset.id);
                await updateAssetIdsInWavelet(updatedAssetIds);
            }

            handleUpdate();
        }

    }, [selectedAssets]);


    useEffect(() => {
        // Start listening to assets changes
        const unsubscribe = subscribeToAssetsChanges((newAssets) => {
            setAssets(newAssets);
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, []);


    useEffect(() => {
        if (imgRef.current) {
            setImageDimensions({
                width: imgRef.current.clientWidth,
                height: imgRef.current.clientHeight,
            });
        }
    }, [image]);

    useEffect(() => {
        const fetchLocationDetails = async () => {
            if (!selectedLocation) {
                setImage(null);
                setLocationAddress("");
                setLocationName("");
                setZoneData([]);
                return;
            }

            const existingZoneMapping = await getZoneMappingByLocationId(selectedLocation);

            if (existingZoneMapping && 'imageUrl' in existingZoneMapping) {
                setImage(existingZoneMapping.imageUrl);
                setUploadedImage(existingZoneMapping.imageUrl);

                if (imgRef.current) {
                    imgRef.current.src = existingZoneMapping.imageUrl;
                }

                setLocationAddress(existingZoneMapping.address || "");
                setLocationName(existingZoneMapping.locationName || "");
            } else {
                setImage(null);
                setUploadedImage(null);

                if (imgRef.current) {
                    imgRef.current.src = '';
                }

                setLocationAddress("");
                setLocationName("");
            }

            const zoneMappingDetailsSnapshot = await getDocs(query(collection(firestore, 'bridge-mapping-details-boutique')));
            const fetchedZoneData = zoneMappingDetailsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    name: data.name,
                    x: data.x,
                    y: data.y,
                    width: data.width,
                    height: data.height,
                    id: data.id,
                    isDragged: data.isDragged,
                    zoneId: data.zoneId,
                    zoneName: data.zoneName,
                    dockDoorGroup: data.dockDoorGroup,
                };
            });

            if (fetchedZoneData.length > 0)
                drawRectanglesForZones(fetchedZoneData);
        };

        fetchLocationDetails();
    }, [selectedLocation]);

    const drawRectanglesForZones = (zoneData) => {
        const updatedZones = zoneData.map(zone => ({
            ...zone,
            rect: {
                x: zone.x,
                y: zone.y,
                width: zone.width,
                height: zone.height,
            },
            isDragged: zone.isDragged
        }));
        setZones(updatedZones);
    };


    const searchInputRef = useRef();

    const groupedAssets = generateGroupedAssets(assets);
    const zoneAssetsMapping = getZoneAssetsMapping(zones, mapping, groupedAssets);
    const dockDoorGroups = groupDockDoors(zones);
    const selectedZonesSet = new Set(selectedAssets.map(asset => asset.poiIdEvent));


    return (
        <UserLayout>

            <AppBar position="static" sx={{background: '#fafafa', boxShadow: 'none', borderBottom: '1px solid #e0e0e0'}}
                    elevation={0}>
                {selectedLocation && <UserMenu/>}

                <SearchPanelAutoComplete
                    assets={assets}
                    filteredAssets={filteredAssets}
                    setFilteredAssets={setFilteredAssets}
                    highlightedAssets={highlightedAssets}
                    setHighlightedAssets={setHighlightedAssets}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    searchInputRef={searchInputRef}
                />
            </AppBar>

            <Container maxWidth="xl" sx={{mt: 5}}>
                {selectedLocation ? (
                    image ? (
                        <Box sx={{mb: 3}}>
                            <Paper elevation={2} sx={{p: 2, borderRadius: '8px'}}>
                                <Typography variant="h6" gutterBottom>Assets Selection Panel</Typography>
                                <AssetContainer assets={assets} onAssetSelection={setSelectedAssets}/>
                            </Paper>
                        </Box>
                    ) : null
                ) : null}

                {selectedLocation ? (
                    image ? (
                        <Box sx={{width: '100%', height: 'calc(100vh - 240px)', position: 'relative'}}>
                            <Paper elevation={3}
                                   sx={{borderRadius: '8px', overflow: 'hidden', height: '100%', width: '100%'}}
                                   ref={parentRef}>

                                <div style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    transform: `scale(${scale})`,
                                    transformOrigin: 'left top'
                                }}
                                     ref={childRef}
                                >
                                    <img
                                        ref={imgRef}
                                        src={image}
                                        alt="Floor Plan"

                                        onLoad={() => {
                                            setImageDimensions({
                                                width: imgRef.current.clientWidth,
                                                height: imgRef.current.clientHeight,
                                            });
                                            recalculateScaleCallback()
                                        }}
                                    />

                                    <div
                                        ref={svgRef}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            overflow: 'visible',
                                            width: imageDimensions.width,
                                            height: imageDimensions.height
                                        }}
                                    >

                                        <WaveletRenderer zones={zones} width={imageDimensions.width}
                                                         height={imageDimensions.height}/>


                                        {
                                            zones.map((zone, index) => {
                                                const zoneProps = processZones(
                                                    zone,
                                                    new Set(),
                                                    mapping,
                                                    dockDoorGroups,
                                                    imageDimensions.width,
                                                    imageDimensions.height,
                                                    zoneAssetsMapping,
                                                    selectedZonesSet,
                                                    selectedAssets
                                                );

                                                const highlightedPinToShow = determineHighlightedPinToShow(
                                                    zoneProps,
                                                    groupDockDoors(zones),
                                                    new Set(selectedAssets.map(asset => asset.poiIdEvent)),
                                                    selectedAssets
                                                );

                                                return (
                                                    <React.Fragment key={`zone-${index}`}>
                                                        {/* Render the heatmap for each selected asset within the zone */}
                                                        <HeatmapRendererLocal
                                                            zone={zone}
                                                            highlightedAssetsArray={selectedAssets}
                                                            assets={assets}
                                                            zones={zones}
                                                        />
                                                        {highlightedPinToShow}
                                                    </React.Fragment>
                                                );
                                            })

                                        }


                                        {
                                            !highlightedAssets && selectedAssets && selectedAssets.length === 0 && (
                                                <ZonesSVGRenderer
                                                    assets={assets}
                                                    zones={zones}
                                                    width={imageDimensions.width}
                                                    height={imageDimensions.height}
                                                    selectedAssets={selectedAssets}
                                                />
                                            )
                                        }
                                    </div>
                                </div>
                            </Paper>
                        </Box>
                    ) : (
                        <Grid container justifyContent="center" alignItems="center" style={{height: '50vh'}}>
                            <CircularProgress/>
                        </Grid>
                    )
                ) : (
                    <Paper elevation={1} sx={{borderRadius: '8px', p: 3}}>
                        <Typography variant="h6" gutterBottom>Select a Location</Typography>
                        <LocationSelector
                            locations={locations}
                            selectedLocation={selectedLocation}
                            handleLocationChange={(e) => {
                                const locationId = e.target.value;
                                setSelectedLocation(locationId === "" ? null : locationId);
                                fetchZonesWrapper(locationId);
                            }}
                        />
                    </Paper>
                )}
            </Container>
        </UserLayout>
    );
}

export default UserView;
