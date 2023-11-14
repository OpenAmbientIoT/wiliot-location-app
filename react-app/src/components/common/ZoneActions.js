import React from 'react';

const ZoneActions = ({selectedZone, removeRectFromSelectedZone, editSelectedZone}) => {
    return (
        selectedZone && (
            <div>
                <button onClick={removeRectFromSelectedZone}>Remove Rect from Selected Zone</button>
                <button
                    onClick={() => {
                        const newName = prompt('Enter new name for the selected zone:');
                        editSelectedZone(newName);
                    }}
                >
                    Edit Selected Zone
                </button>
            </div>
        )
    );
};

export default ZoneActions;
