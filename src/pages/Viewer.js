import {Box} from "@mui/system";
import * as React from "react";
import ReactJson from "react-json-view";
import json from "../api/backup.json";
import MatchData from "../api/csv/compiled.csv";
import OfflineDats from "../api/compiled-scouting/compiled.json";
import {LoadingButton} from "@mui/lab";
import {Grid, Typography} from "@mui/material";

export default function Viewer() {
    const [jsonLoading, setJsonLoading] = React.useState(false);
    const [csvLoading, setCsvLoading] = React.useState(false);
    const theme = {
        scheme: "google",
        base00: "#1d1f21",
        base01: "#282a2e",
        base02: "#373b41",
        base03: "#969896",
        base04: "#b4b7b4",
        base05: "#c5c8c6",
        base06: "#e0e0e0",
        base07: "#ffffff",
        base08: "#CC342B",
        base09: "#F96A38",
        base0A: "#FBA922",
        base0B: "#198844",
        base0C: "#3971ED",
        base0D: "#3971ED",
        base0E: "#A36AC7",
        base0F: "#3971ED",
    };

    function handleDownloadCSV() {
        setCsvLoading(true);
        const link = document.createElement("a");
        var today = new Date();
        link.download =
            today.getHours() +
            "-" +
            today.getMinutes() +
            "-" +
            today.getSeconds() +
            ".csv";
        link.href = encodeURIComponent(MatchData);
        link.click();
        setCsvLoading(false);
    }

    function handleDownloadJSON() {
        setJsonLoading(true);
        const link = document.createElement("a");
        const href = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(json)
        )}`;
        var today = new Date();
        link.download =
            today.getHours() +
            "-" +
            today.getMinutes() +
            "-" +
            today.getSeconds() +
            ".json";
        link.href = href;
        link.click();
        setJsonLoading(false);
    }

    return (
        <div className="viewer">
            <Box textAlign="center">
                <LoadingButton
                    loading={jsonLoading}
                    loadingIndicator="Downloading JSON..."
                    variant="contained"
                    color="primary"
                    style={{margin: "15px"}}
                    onClick={handleDownloadJSON}
                >
                    Download JSON
                </LoadingButton>
                <LoadingButton
                    loading={csvLoading}
                    loadingIndicator="Downloading CSV..."
                    variant="contained"
                    color="primary"
                    style={{margin: "15px"}}
                    onClick={handleDownloadCSV}
                >
                    Download CSV
                </LoadingButton>
            </Box>

            <Grid container spacing={2} columns={16}>
                <Grid item xs={8}>
                    <Box textAlign="center">
                        <Typography variant="h6" color="secondary">
                            Firebase Synced Data
                        </Typography>
                    </Box>
                    <ReactJson
                        src={json}
                        theme={theme}
                        name={"Synced Data Collection"}
                        collapsed="5"
                    />
                </Grid>
                <Grid item xs={8}>
                    <Box textAlign="center">
                        <Typography variant="h6" color="secondary">
                            Offline Match Data
                        </Typography>
                    </Box>
                    <ReactJson
                        src={OfflineDats}
                        theme={theme}
                        name={"Offline Data Collected"}
                        collapsed="1"
                    />
                </Grid>
            </Grid>
        </div>
    );
}
