import {Box} from "@mui/material";
import theme from "../../theme";
import React from "react";


const LogoHorizontal = ({logoWidth, logoHeight}) => {

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}
        >
            <Box
                component="img"
                sx={{
                    height: logoHeight || 32,
                    width: logoWidth || 32,
                    maxHeight: {xs: logoHeight || 32, md: logoHeight || 32},
                    maxWidth: {xs: logoWidth || 32, md: logoWidth || 32},
                    borderRadius: theme.spacing(1),
                }}
                mr={1}
                alt="Wiliot"
                src="/img/logo/wiliot.png"
            />
            {/*<Typography noWrap sx={{*/}
            {/*    color: '#444',*/}
            {/*    fontSize: '14px'*/}
            {/*}}>Zone Design Studio</Typography>*/}
        </Box>
    );
}

export default LogoHorizontal;