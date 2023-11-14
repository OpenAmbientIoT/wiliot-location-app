import {useState} from 'react';

const useZoneInteractions = (zones, setZones) => {
    const [draggedZone, setDraggedZone] = useState(null);
    const [draggedZones, setDraggedZones] = useState([]);

    const deleteZone = (zoneToDelete) => {
        const updatedZones = zones.map((zone) => {
            if (zone.name === zoneToDelete.name) {
                return {
                    ...zone,
                    isDragged: false,
                };
            }
            return zone;
        });
        setZones(updatedZones);
    };

    const handleDragStart = (event, zone) => {
        setDraggedZone(zone);
    };

    const handleDragEnd = () => {
        if (!draggedZone) return;

        const updatedZones = zones.map((z) => {
            if (z.name === draggedZone.name) {
                return {
                    ...z,
                    isDragged: true,
                };
            }
            return z;
        });
        setZones(updatedZones);
        setDraggedZone(null);
    };


    console.log('zones in useZoneInteractions ', zones)
    console.log('draggedZone in useZoneInteractions ', draggedZone)


    return {
        draggedZone,
        setDraggedZone,
        draggedZones,
        setDraggedZones,
        handleDragStart,
        handleDragEnd,
        deleteZone
    };
};

export default useZoneInteractions;