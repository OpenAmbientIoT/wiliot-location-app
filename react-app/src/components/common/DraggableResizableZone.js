import React from 'react';
import {Rnd} from 'react-rnd';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
    },
    zone: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: '1px solid #FFFBB2',
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '17px',
        height: '17px',
        backgroundColor: 'red',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: 2,
        '&:hover': {
            backgroundColor: 'black',
        },
        '& span': {
            position: 'relative',
            top: '-1px',
        },
    },
}));

const DraggableResizableZone = ({
                                    zone,
                                    selectedZone,
                                    zones,
                                    setZones,
                                }) => {
    const classes = useStyles();

    const deleteZone = (zoneToDelete) => {
        const updatedZones = zones.map((zone) =>
            zone.name === zoneToDelete.name ? {...zone, isDragged: false} : zone
        );
        setZones(updatedZones);
    };

    const handleDragStop = (zone, newPosition) => {
        const zoneIndex = zones.findIndex((z) => z.name === zone.name);
        const updatedZones = [...zones];
        updatedZones[zoneIndex] = {
            ...zone,
            rect: {
                ...zone.rect,
                x: newPosition.x,
                y: newPosition.y,
            },
        };

        setZones(updatedZones);
    };

    const handleResizeStop = (zone, ref, position) => {
        const zoneIndex = zones.findIndex((z) => z.name === zone.name);
        const updatedZones = [...zones];
        updatedZones[zoneIndex] = {
            ...zone,
            rect: {
                ...zone.rect,
                x: position.x,
                y: position.y,
                width: ref.offsetWidth,
                height: ref.offsetHeight,
            },
        };
        setZones(updatedZones);
    };

    if (!zone.rect || !zone.isDragged) return null;

    return (
        <Rnd
            position={{x: zone.rect.x, y: zone.rect.y}}
            size={{width: zone.rect.width, height: zone.rect.height}}
            onDragStop={(e, d) => handleDragStop(zone, d)}
            onResizeStop={(e, direction, ref, delta, position) =>
                handleResizeStop(zone, ref, position)
            }
            disabled={!zone.isDragged}
            enableResizing={{
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true
            }}
        >

            <Box className={classes.root}>
                <Box
                    className={classes.zone}
                    bgcolor={`rgba(255, 271, 0, ${
                        selectedZone === zone ? 0.5 : 0.3
                    })`}
                    border={selectedZone === zone ? '2px solid red' : 'none'}
                    data-name={zone.name}
                />
                <Box
                    className={classes.deleteButton}
                    onClick={() => deleteZone(zone)}
                >
                    <span>&times;</span>
                </Box>
            </Box>
        </Rnd>
    );
};

export default DraggableResizableZone;