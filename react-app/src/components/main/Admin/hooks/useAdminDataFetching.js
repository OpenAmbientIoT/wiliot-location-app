import {useState} from 'react';
import useDataFetching from './useDataFetching';

const useAdminDataFetching = () => {
    const {
        locations,
        fetchedZones,
        assets,
        categories,
        fetchZonesWrapper,
    } = useDataFetching();
    const [selectedLocation, setSelectedLocation] = useState('');

    return {
        locations,
        fetchedZones,
        selectedLocation,
        setSelectedLocation,
        fetchZonesWrapper
    };
};

export default useAdminDataFetching;