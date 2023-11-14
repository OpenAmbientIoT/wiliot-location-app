// hooks/useZoneManagement.js
import {useEffect, useState} from 'react';

const useZoneManagement = (fetchedZones) => {
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);

    useEffect(() => {
        if (fetchedZones) {
            setZones(fetchedZones);
        }
    }, [fetchedZones]);

    const removeRectFromSelectedZone = () => {
        if (!selectedZone) return;
        const updatedZone = {...selectedZone, rect: null};
        const zoneIndex = zones.findIndex((zone) => zone.name === selectedZone.name);
        const updatedZones = [...zones];
        updatedZones[zoneIndex] = updatedZone;
        setZones(updatedZones);
        setSelectedZone(updatedZone);
    };

    const editSelectedZone = (newName) => {
        if (!selectedZone || !newName) return;
        const updatedZone = {...selectedZone, name: newName};
        const zoneIndex = zones.findIndex((zone) => zone.name === selectedZone.name);
        const updatedZones = [...zones];
        updatedZones[zoneIndex] = updatedZone;
        setZones(updatedZones);
        setSelectedZone(updatedZone);
    };

    return {
        zones,
        setZones,
        selectedZone,
        setSelectedZone,
        removeRectFromSelectedZone,
        editSelectedZone,
    };
};

export default useZoneManagement;
