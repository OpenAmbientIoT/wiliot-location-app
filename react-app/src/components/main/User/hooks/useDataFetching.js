// hooks/useDataFetching.js
import {useEffect, useState} from 'react';
import {
    fetchAssets,
    fetchCategories,
    fetchLocations,
    fetchZoneCategory,
    fetchZones,
} from '../../../../services/firebase/firebase-data-service';

const useDataFetching = () => {
    const [locations, setLocations] = useState([]);
    const [fetchedZones, setFetchedZones] = useState([]);
    const [assets, setAssets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [zoneCategory, setZoneCategory] = useState([]);

    useEffect(() => {
        const fetchLocationsWrapper = async () => {
            const locations = await fetchLocations();
            setLocations(locations);
        };

        const fetchZCWrapper = async () => {
            const ZC = await fetchZoneCategory();
            setZoneCategory(ZC);
        };

        const fetchAssetsWrapper = async () => {
            const assets = await fetchAssets();
            setAssets(assets);
        };

        const fetchCategoriesWrapper = async () => {
            const categories = await fetchCategories();
            setCategories(categories);
        };

        fetchLocationsWrapper();
        fetchAssetsWrapper();
        fetchCategoriesWrapper();
        fetchZCWrapper();
    }, []);

    const fetchZonesWrapper = async (locationId) => {
        if (!locationId) {
            setFetchedZones([]);
            return;
        }
        const fetchedZonesData = await fetchZones(locationId);
        setFetchedZones(fetchedZonesData);
    };

    return {
        locations,
        fetchedZones,
        assets,
        setAssets,
        categories,
        fetchZonesWrapper,
        zoneCategory,
    };
};

export default useDataFetching;
