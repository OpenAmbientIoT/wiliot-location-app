import React, {useState} from "react";
import "./Configuration.css";
import AdminLayout from "../layout/AdminLayout";
import Container from "@mui/material/Container";
import {Grid} from "@mui/material";
import Paper from "@mui/material/Paper";

function Configuration() {
    const [edgeApiKey, setEdgeApiKey] = useState(
        localStorage.getItem("edgeApiKey") || ""
    );
    const [platformApiKey, setPlatformApiKey] = useState(
        localStorage.getItem("platformApiKey") || ""
    );
    const [ownerId, setOwnerId] = useState(
        localStorage.getItem("ownerId") || ""
    );


    const handleSave = () => {
        localStorage.setItem("edgeApiKey", edgeApiKey);
        localStorage.setItem("platformApiKey", platformApiKey);
        localStorage.setItem("ownerId", ownerId);
    };

    const renewToken = (tokenType, apiKey) => {
        fetch("https://api.wiliot.com/v1/auth/token/api", {
            method: "POST",
            headers: {
                Authorization: apiKey,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                localStorage.setItem(`${tokenType}_TOKEN`, data.access_token);

                setTimeout(() => {
                    renewToken(tokenType, apiKey);
                }, (data.expires_in - 60) * 1000);
            });
    };

    const handleRenewTokens = () => {
        const edgeApiKey = localStorage.getItem("edgeApiKey");
        const platformApiKey = localStorage.getItem("platformApiKey");

        console.warn('handleRenewTokens', edgeApiKey)
        if (edgeApiKey) {
            renewToken("EDGE", edgeApiKey);
        }

        if (platformApiKey) {
            renewToken("PLATFORM", platformApiKey);
        }
    };


    return (
        <AdminLayout>
            <Container maxWidth="false" sx={{mt: 3, mb: 2}}>
                <Grid container spacing={1} mb={1} direction="column"
                      alignItems="center"
                      justifyContent="center">
                    <Grid item xs={12} md={12} lg={12} p={0}>
                        <Paper sx={{p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>

                            <h2>Configuration</h2>
                            <div className="form-group">
                                <label htmlFor="edgeApiKey">EDGE API KEY:</label>
                                <input
                                    type="text"
                                    id="edgeApiKey"
                                    value={edgeApiKey}
                                    onChange={(e) => setEdgeApiKey(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="platformApiKey">PLATFORM API KEY:</label>
                                <input
                                    type="text"
                                    id="platformApiKey"
                                    value={platformApiKey}
                                    onChange={(e) => setPlatformApiKey(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="ownerId">OWNER ID:</label>
                                <input
                                    type="text"
                                    id="ownerId"
                                    value={ownerId}
                                    onChange={(e) => setOwnerId(e.target.value)}
                                />
                            </div>
                            <button className="save-button" onClick={handleSave}>
                                Save
                            </button>
                            <button className="save-button" onClick={handleRenewTokens}>Renew Tokens</button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </AdminLayout>
    );
}

export default Configuration;
