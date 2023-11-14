import ZonePanel from "../../../common/ZonePanel";
import Paper from "@mui/material/Paper";

export default function ZonePanelWrapper({selectedLocation, zones, handleDragStart, handleDragEnd, draggedZones}) {
    return (
        <Paper sx={{
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'auto',
            borderRadius: '8px',
        }}>
            {selectedLocation && (
                <ZonePanel
                    zones={zones}
                    handleDragStart={handleDragStart}
                    handleDragEnd={handleDragEnd}
                    draggedZones={draggedZones}
                />
            )}
        </Paper>
    );
}
