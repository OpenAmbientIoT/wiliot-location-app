import React from "react";
import {CircularProgress, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import theme from "../../theme";

const useStyles = makeStyles((theme) => ({
    formControl: {},
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    selectItem: {},
}));


const LocationSelector = ({
                              locations,
                              selectedLocation,
                              handleLocationChange,
                          }) => {
    const classes = useStyles(theme);


    return (
        <FormControl variant="outlined" className={classes.formControl} size="medium" fullWidth>
            <InputLabel id="location-select-label">Your locations</InputLabel>
            <Select
                labelId="location-select-label"
                id="location-select"
                value={selectedLocation}
                onChange={handleLocationChange}
                label="Select a location"
                MenuProps={{
                    getContentAnchorEl: null,
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                    },
                }}
            >
                {locations.length ? (
                    locations.map((location) => (
                        <MenuItem className={classes.selectItem} key={location.id} value={location.id}>
                            {location.name}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem>
                        <CircularProgress size={16} color="primary"/>
                        <div style={{marginLeft: '10px', color: theme.palette.grey[700]}}>Loading...</div>
                    </MenuItem>
                )}
            </Select>
        </FormControl>
    );
};

export default LocationSelector;
