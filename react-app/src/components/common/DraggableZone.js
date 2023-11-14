import React from 'react';
import theme from "../../theme";

const DraggableZone = ({zone, onDragStart, onDragEnd, isDragged}) => {
    return (
        <div
            className="draggable-zone"
            // draggable={true}
            draggable={!isDragged}
            onDragStart={(e) => onDragStart(e, zone)}
            onDragEnd={onDragEnd}
            style={{
                border: `1px solid ${isDragged ? theme.palette.grey[300] : theme.palette.secondary.main}`,
                borderRadius: '5px',
                padding: '5px',
                marginBottom: '10px',
                // cursor: 'grab',
                cursor: isDragged ? 'not-allowed' : 'grab',
                backgroundColor: isDragged ? theme.palette.grey[200] : theme.palette.secondary.main,
                color: isDragged ? theme.palette.grey[500] : "white",
            }}
        >
            {zone.name}
        </div>
    );
};

export default DraggableZone;