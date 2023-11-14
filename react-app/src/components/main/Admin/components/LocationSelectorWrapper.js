import LocationSelector from "../../../common/LocationSelector";
import {Box} from "@material-ui/core";

export default function LocationSelectorWrapper({locations, selectedLocation, setSelectedLocation, fetchZonesWrapper}) {
    return (
        <Box width={500}>
            <LocationSelector
                locations={locations}
                selectedLocation={selectedLocation}
                handleLocationChange={(e) => {
                    const locationId = e.target.value;
                    setSelectedLocation(locationId === "" ? null : locationId);
                    fetchZonesWrapper(locationId);
                }}
            />
        </Box>
    );
}
