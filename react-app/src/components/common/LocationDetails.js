import React from 'react';
import {Box} from "@mui/material";
import theme from "../../theme";

function LocationDetails({locationAddress, locationName}) {

    return (
        <Box sx={{color: 'black',}} mb={1} mt={3}>
            {locationName ? (<Box sx={{color: theme.palette.grey[900], fontSize: 25}} mb={1}>
                <strong>{locationName}</strong>
            </Box>) : null}
            {locationAddress ? (<Box sx={{color: theme.palette.grey[600], fontSize: 16}}>
                {locationAddress}
            </Box>) : null}
        </Box>
    );
}

export default LocationDetails;
