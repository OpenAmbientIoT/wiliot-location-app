// hooks/useDataFetching.js
import {useEffect, useState} from 'react';
import {
    fetchAssets,
    fetchCategories,
    fetchLocations,
    fetchZones,
} from '../../../../services/firebase/firebase-data-service';

const useDataFetching = () => {
    const [locations, setLocations] = useState([]);
    const [fetchedZones, setFetchedZones] = useState([]);
    const [assets, setAssets] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchLocationsWrapper = async () => {
            const locations = await fetchLocations();
            setLocations(locations);
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
    }, []);

    const fetchZonesWrapper = async (locationId) => {
        if (!locationId) {
            setFetchedZones([]);
            return;
        }
        const fetchedZonesData = await fetchZones(locationId);
        setFetchedZones(fetchedZonesData);
    };

    console.log('fetchedZonesData in fetchZonesWrapper ', fetchedZones)

    return {
        locations,
        fetchedZones,
        assets,
        categories,
        fetchZonesWrapper,
    };
};

export default useDataFetching;
