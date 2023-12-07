import React, {useEffect, useState} from 'react';
import '../../../assets/styles/styles.css';

import {getZoneMappingByLocationId, uploadImageToStorage} from '../../../services/firebase/firebase-data-service';

import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';

import {firestore} from '../../../services/firebase/firebaseConfig';
import ImageUploader from "../../common/ImageUploader";
import useZoneManagement from "./hooks/useZoneManagement";
import AdminLayout from "../../layout/AdminLayout";
import {Grid, Typography} from "@mui/material";
import Box from '@mui/material/Box';
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import theme from "../../../theme";

import FloorPlan from "./components/FloorPlan";
import LocationSelectorWrapper from "./components/LocationSelectorWrapper";
import ZonePanelWrapper from "./components/ZonePanelWrapper";
import SiteDetails from "./components/SiteDetails";


import useAdminDataFetching from "./hooks/useAdminDataFetching";
import useImageManagement from "./hooks/useImageManagement";
import useZoneInteractions from "./hooks/useZoneInteractions";


function Admin() {

    const [zoneData, setZoneData] = useState([]);
    const [location, setLocation] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [locationAddress, setLocationAddress] = useState(null);
    const [locationName, setLocationName] = useState(null);

    const {
        locations,
        fetchedZones,
        selectedLocation,
        setSelectedLocation,
        fetchZonesWrapper
    } = useAdminDataFetching();

    const {
        image,
        setImage,
        imgRef,
        imageDimensions,
        setImageDimensions,
        imageFile,
        setImageFile,
        handleImageUpload
    } = useImageManagement();

    const {
        zones: initialZones,
        setZones: setInitialZones,
        selectedZone,
        setSelectedZone,
        removeRectFromSelectedZone,
        editSelectedZone,
    } = useZoneManagement(fetchedZones);

    const [zones, setZones] = useState(initialZones.map(zone => ({
        ...zone,
        isDragged: true
    })));


    const {
        draggedZone,
        setDraggedZone,
        draggedZones,
        setDraggedZones,
        handleDragStart,
        handleDragEnd,
        deleteZone
    } = useZoneInteractions(zones, setZones);

    useEffect(() => {
        if (imgRef.current) {
            setImageDimensions({
                width: imgRef.current.clientWidth,
                height: imgRef.current.clientHeight,
            });
        }
    }, [image]);


    useEffect(() => {
        setUploadedImage(null);
    }, [location]);


    useEffect(() => {
        setImage(uploadedImage);
    }, [uploadedImage]);


    const resetDetails = () => {
        setImage(null);
        setLocationAddress("");
        setLocationName("");
        setZoneData([]);
    };

    const updateDetailsFromMapping = (existingZoneMapping) => {
        setImage(existingZoneMapping.imageUrl);
        setUploadedImage(existingZoneMapping.imageUrl);

        if (imgRef.current) {
            imgRef.current.src = existingZoneMapping.imageUrl;
        }

        setLocationAddress(existingZoneMapping.address || "");
        setLocationName(existingZoneMapping.locationName || "");
    };


    const fetchZoneMappingDetails = async () => {
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
            };
        });

        if (fetchedZoneData.length > 0)
            drawRectanglesForZones(fetchedZoneData);
    };


    useEffect(() => {
        const fetchLocationDetails = async () => {
            if (!selectedLocation) {
                resetDetails();
                return;
            }

            const existingZoneMapping = await getZoneMappingByLocationId(selectedLocation);

            if (existingZoneMapping && 'imageUrl' in existingZoneMapping) {
                updateDetailsFromMapping(existingZoneMapping);
            } else {
                resetDetails();
                if (imgRef.current) {
                    imgRef.current.src = '';
                }
            }

            fetchZoneMappingDetails();
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

    //just the image realted stuff====================== nothing to do with the zones
    const saveZoneMapping = async (imageUrl) => {
        const newZoneMapping = {
            ownerId: '607737204301',
            locationId: "b95ceecd-1749-4396-a4a0-54525ce3ace8",
            imageUrl: imageUrl,
            address: locationAddress,
            locationName: locationName,
            lastModifiedTimestamp: serverTimestamp(),
        };

        const zoneMappingQuery = await getDocs(query(collection(firestore, 'zone-mapping'), where('locationId', '==', selectedLocation)));

        if (zoneMappingQuery.empty) {
            await addDoc(collection(firestore, 'zone-mapping'), newZoneMapping);
        } else {
            const docToUpdate = zoneMappingQuery.docs[0];
            await updateDoc(doc(firestore, 'zone-mapping', docToUpdate.id), newZoneMapping);
        }
        alert('Zone mapping data saved successfully!');
    }


    const processZoneData = async () => {
        // Get all existing zone-mapping-details documents for the selected location
        const zoneMappingDetailsQuery = await getDocs(query(collection(firestore, 'bridge-mapping-details-boutique')));

        // Create a Map to store the fetched documents keyed by name
        const existingZoneMappingDetailsMap = new Map(zoneMappingDetailsQuery.docs.map(doc => [doc.data().id, doc]));

        // Split zoneData into smaller chunks
        const chunkSize = 500;
        const zoneDataChunks = [];
        for (let i = 0; i < zones.length; i += chunkSize) {
            zoneDataChunks.push(zones.slice(i, i + chunkSize));
        }

        // Process each chunk
        for (const chunk of zoneDataChunks) {
            await handleBatchProcessing(chunk, existingZoneMappingDetailsMap);
        }

        alert('Zone mapping details saved successfully!');
    }


    const handleBatchProcessing = async (chunk, existingZoneMappingDetailsMap) => {
        const batch = writeBatch(firestore);

        for (const zone of chunk) {
            const existingDoc = existingZoneMappingDetailsMap.get(zone.id);

            if (!existingDoc) {
                const newZoneMappingDetails = {
                    locationId: selectedLocation,
                    ownerId: '607737204301',
                    name: zone.name,
                    x: zone.rect ? zone.rect.x : 30,
                    y: zone.rect ? zone.rect.y : 30,
                    height: zone.rect ? zone.rect.height : 30,
                    width: zone.rect ? zone.rect.width : 30,
                    lastModifiedTimestamp: serverTimestamp(),
                    id: zone.id,
                    isDragged: zone.isDragged,
                };

                const newZoneMappingDetailsRef = doc(collection(firestore, 'bridge-mapping-details-boutique'));
                batch.set(newZoneMappingDetailsRef, newZoneMappingDetails);
            } else {
                batch.update(doc(firestore, 'bridge-mapping-details-boutique', existingDoc.id), {
                    x: parseFloat(parseFloat(zone.rect.x).toFixed(2)) || 30,
                    y: parseFloat(parseFloat(zone.rect.y).toFixed(2)) || 30,
                    height: parseFloat(parseFloat(zone.rect.height).toFixed(2)) || 30,
                    width: parseFloat(parseFloat(zone.rect.width).toFixed(2)) || 30,
                    isDragged: zone.isDragged,
                    lastModifiedTimestamp: serverTimestamp(),
                });
            }
        }

        await batch.commit();
    }

    const saveZoneMappingDetails = async () => {
        if (!selectedLocation || !uploadedImage) {
            alert('Please select a location and upload an image before saving.');
            return;
        }

        try {
            const imageUrl = imageFile ? await uploadImageToStorage(imageFile) : uploadedImage;
            await saveZoneMapping(imageUrl);
            await processZoneData();
        } catch (error) {
            console.error('Error saving zone mapping data: ', error);
        }
    }


    if (imageFile || selectedLocation) {
        return (
            <AdminLayout>
                <Container maxWidth="false" sx={{mt: 3, mb: 2}}>
                    <Grid container spacing={1} mb={1}>
                        <Grid item xs={12} md={12} lg={12} p={0}>
                            <Box sx={{width: '100%'}}>
                                <Paper sx={{p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                    <SiteDetails locationAddress={locationAddress}
                                                 setLocationAddress={setLocationAddress}
                                                 locationName={locationName}
                                                 setLocationName={setLocationName}
                                                 saveZoneMappingDetails={saveZoneMappingDetails}

                                    />
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={10} p={0}>
                            <Paper sx={{
                                p: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'auto',
                                borderRadius: '8px',
                            }}>
                                <FloorPlan image={image}
                                           imgRef={imgRef}
                                           setImageDimensions={setImageDimensions}
                                           zones={zones}
                                           selectedZone={selectedZone}
                                           setZones={setZones}
                                           draggedZones={draggedZones}
                                           setDraggedZones={setDraggedZones}
                                           deleteZone={deleteZone}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={2} p={0}>
                            <ZonePanelWrapper selectedLocation={selectedLocation}
                                              zones={zones}
                                              handleDragStart={handleDragStart}
                                              handleDragEnd={handleDragEnd}
                                              draggedZones={draggedZones}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </AdminLayout>
        );
    } else {
        return (
            <AdminLayout>
                <Container maxWidth="lg">
                    <Grid container spacing={3} direction="column"
                          alignItems="center"
                          justifyContent="center">
                        <Grid item xs={12} md={12} lg={12}>
                            <Box mb={3} mt={"30vh"}>
                                <Typography align="center" variant={'h6'} color={theme.palette.grey[600]}>Choose
                                    Location or Upload New Map</Typography>
                            </Box>
                            <LocationSelectorWrapper locations={locations}
                                                     selectedLocation={selectedLocation}
                                                     setSelectedLocation={setSelectedLocation}
                                                     fetchZonesWrapper={fetchZonesWrapper}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography align="center" variant={'paragraph'} sx={{fontWeight: 'bold',}}
                                        color={theme.palette.grey[400]}>OR</Typography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <ImageUploader handleImageUpload={handleImageUpload}/>
                        </Grid>
                    </Grid>
                </Container>
            </AdminLayout>
        );
    }
}

export default Admin;