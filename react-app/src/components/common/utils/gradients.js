export const deepBlueGradient = {
    '.1': 'rgba(41,0,190,0.1)',
    '.3': 'rgba(41,0,190,0.3)',
    '.7': 'rgba(41,0,190,0.7)',
    '1': 'rgba(41,0,190,1)'
};

export const violetGradient = {
    '.1': 'rgba(111,0,175,0.1)',
    '.3': 'rgba(111,0,175,0.3)',
    '.7': 'rgba(111,0,175,0.7)',
    '1': 'rgba(111,0,175,1)'
};

export const magentaGradient = {
    '.1': 'rgba(165,0,154,0.1)',
    '.3': 'rgba(165,0,154,0.3)',
    '.7': 'rgba(165,0,154,0.7)',
    '1': 'rgba(165,0,154,1)'
};

export const deepPinkGradient = {
    '.1': 'rgba(221,1,107,0.1)',
    '.3': 'rgba(221,1,107,0.3)',
    '.7': 'rgba(221,1,107,0.7)',
    '1': 'rgba(221,1,107,1)'
};

export const redGradient = {
    '.1': 'rgba(225,0,0,0.1)',
    '.3': 'rgba(225,0,0,0.3)',
    '.7': 'rgba(225,0,0,0.7)',
    '1': 'rgba(225,0,0,1)'
};


export const selectGradient = (temperature) => {

    if (temperature <= 23) return deepBlueGradient;
    else if (temperature <= 24) return violetGradient;
    else if (temperature <= 25) return magentaGradient;
    else if (temperature <= 26) return deepPinkGradient;
    else return redGradient;

};