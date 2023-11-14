import React from 'react';

const ZoneButtons = ({zones, setSelectedZone, selectedZone, showAssetText, setShowAssetText}) => {
    return (
        <div>
            {zones.map((zone) => (
                <button
                    key={zone.id} // or zone.name
                    onClick={() => setSelectedZone(zone)}
                    style={{
                        backgroundColor: selectedZone === zone ? 'lightblue' : 'white',
                    }}
                >
                    {zone.name}
                </button>
            ))}
            <button onClick={() => setShowAssetText(!showAssetText)}>Show Assets</button>
        </div>
    );
};

export default ZoneButtons;