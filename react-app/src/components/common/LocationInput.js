import React from 'react';
import TextField from '@material-ui/core/TextField';

const LocationInput = ({label, value, onChange}) => (
    <TextField

        style={{minWidth: '400px'}}
        label={label}
        value={value || ''}
        onChange={onChange}
        variant="outlined"
        margin="normal"
    />
);

export default LocationInput;