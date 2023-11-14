import React from 'react';

const deepBlueGradient = {
    '.1': 'rgba(41,0,190,0.1)',
    '.3': 'rgba(41,0,190,0.3)',
    '.7': 'rgba(41,0,190,0.7)',
    '1': 'rgba(0,0,0,1)'
};

const violetGradient = {
    '.1': 'rgba(111,0,175,0.1)',
    '.3': 'rgba(111,0,175,0.3)',
    '.7': 'rgba(111,0,175,0.7)',
    '1': 'rgba(0,0,0,1)'
};

const magentaGradient = {
    '.1': 'rgba(165,0,154,0.1)',
    '.3': 'rgba(165,0,154,0.3)',
    '.7': 'rgba(165,0,154,0.7)',
    '1': 'rgba(0,0,0,1)'
};

const deepPinkGradient = {
    '.1': 'rgba(221,1,107,0.1)',
    '.3': 'rgba(221,1,107,0.3)',
    '.7': 'rgba(221,1,107,0.7)',
    '1': 'rgba(0,0,0,1)'
};

const redGradient = {
    '.1': 'rgba(225,0,0,0.1)',
    '.3': 'rgba(225,0,0,0.3)',
    '.7': 'rgba(225,0,0,0.7)',
    '1': 'rgba(0,0,0,1)'
};

const TemperatureInfoBar = () => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f5f5f5'}}>
            <div style={{...styles.box, background: gradientToColor(deepBlueGradient)}}>Up to 23°C</div>
            <div style={{...styles.box, background: gradientToColor(violetGradient)}}>23°C - 24°C</div>
            <div style={{...styles.box, background: gradientToColor(magentaGradient)}}>24°C - 25°C</div>
            <div style={{...styles.box, background: gradientToColor(deepPinkGradient)}}>25°C - 26°C</div>
            <div style={{...styles.box, background: gradientToColor(redGradient)}}>Above 26°C</div>
        </div>
    );
}

const styles = {
    box: {
        width: '18%',
        padding: '10px',
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: '5px',
    }
}

const gradientToColor = (gradient) => {
    return gradient['.7'];
}

export default TemperatureInfoBar;
