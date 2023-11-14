import React from 'react';
import DraggableZone from './DraggableZone';
import theme from "../../theme";

const ZonePanel = ({zones, handleDragStart, handleDragEnd}) => {

    return (
        <div className="zone-panel" style={{overflowX: 'scroll', overflowY: 'hidden', whiteSpace: 'nowrap'}}>
            <div mb={2} style={{fontSize: "11px", color: theme.palette.grey[700]}}>Drag & drop zone on map</div>
            {zones.map((zone) => (
                <DraggableZone
                    key={zone.name}
                    zone={zone}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragged={zone.isDragged}
                />
            ))}
        </div>
    );
};

export default ZonePanel;