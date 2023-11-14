import LocationInput from "../../../common/LocationInput";
import {Stack} from "@mui/material";
import Button from "@mui/material/Button";

export default function SiteDetails({
                                        locationAddress,
                                        setLocationAddress,
                                        locationName,
                                        setLocationName,
                                        saveZoneMappingDetails
                                    }) {
    return (
        <Stack direction="row" spacing={4} alignItems="center" justifyContent="flex-start">
            <LocationInput
                label="Site Address"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
            />
            <LocationInput
                label="Site Name"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
            />
            <div className="zone-mapping-form">
                <Button variant="contained" color="primary" size="large"
                        onClick={saveZoneMappingDetails}>Save Zones</Button>
            </div>
        </Stack>
    );
}
