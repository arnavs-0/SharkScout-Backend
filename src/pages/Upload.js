import * as React from "react";
import {Alert, IconButton, Snackbar, Typography} from "@mui/material";
import {Offline, Online} from "react-detect-offline";
import {LoadingButton} from "@mui/lab";
import MatchJSON from "../api/compiled-scouting/compiled.json";
import firebase from "firebase";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

export default function Upload() {
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState("Not Uploaded");
    const [snackbar, setSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small"/>
            </IconButton>
        </React.Fragment>
    );

    function uploadMatchJSON() {
        setLoading(true);
        axios
            .get("http://localhost:3001/upload")
            .then(function (response) {
                console.log(response.status);
                if (response.status === 200) {
                    var storage = firebase.storage();
                    var storageRef = storage.ref();
                    var today = new Date();
                    var matchRef = storageRef.child(
                        "json/" +
                        today.getHours() +
                        "-" +
                        today.getMinutes() +
                        "-" +
                        today.getSeconds() +
                        ".json"
                    );
                    var jsonString = JSON.stringify(MatchJSON);
                    var blob = new Blob([jsonString], {type: "application/json"});
                    matchRef.put(blob).then(function () {
                        setLoading(false);
                    });
                    setData("Uploaded Scouting Forms to Firebase");
                    setSnackbarMessage("Uploaded Scouting Forms to Firebase");
                    setSnackbarSeverity("success");
                    setSnackbar(true);

                    setLoading(false);
                } else {
                    setData("Error");
                    setSnackbarMessage("Error Uploading Scouting Forms");
                    setSnackbarSeverity("error");
                    setSnackbar(true);
                    setLoading(false);
                }
            })
            .catch(function (error) {
                console.log(error);
                setData("Error");
            });
    }

    function downloadMatchJSON() {
        axios
            .get("http://localhost:3001/backup")
            .then(function (response) {
                console.log(response.status);
                if (response.status === 200) {
                    setSnackbarMessage("Downloaded Scouting Forms");
                    setSnackbarSeverity("success");
                    setSnackbar(true);
                    setData("Downloaded Scouting Forms");
                } else {
                    setSnackbarMessage("Error Downloading Scouting Forms");
                    setSnackbarSeverity("error");
                    setSnackbar(true);
                    setData("Error Downloading Scouting Forms");
                }
            })
            .catch(function (error) {
                console.log(error);
                setSnackbarMessage("Error Downloading Scouting Forms");
                setSnackbarSeverity("error");
                setSnackbar(true);
                setData("Error Downloading Scouting Forms");
            });
    }

    return (
        <div className="App">
            <br/>
            <Typography variant="h4" color="primary">
                Upload Data
            </Typography>
            <br/>
            <Offline>
                <Typography variant="body1" color="pink">
                    Must have an Internet Connection
                </Typography>
            </Offline>
            <Online>
                <Typography variant="body1" color="secondary">
                    Internet Connection Established
                </Typography>
                <LoadingButton
                    onClick={uploadMatchJSON}
                    loading={loading}
                    loadingIndicator="Uploading..."
                    variant="contained"
                    style={{margin: "10px"}}
                >
                    Upload Match Scouting Data (.json)
                </LoadingButton>
                <br/>
                <LoadingButton
                    onClick={downloadMatchJSON}
                    loading={loading}
                    loadingIndicator="Uploading..."
                    variant="outlined"
                    style={{margin: "10px"}}
                >
                    Download Match Scouting Data from Firebase (.json)
                </LoadingButton>
                <br/>
                <Typography variant="p" style={{marginTop: "30px"}} color="error">
                    Status: {data}
                </Typography>
                <Snackbar
                    open={snackbar}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    action={action}
                >
                    <Alert
                        onClose={handleClose}
                        severity={snackbarSeverity}
                        sx={{width: "100%"}}
                        elevation={6}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Online>
        </div>
    );
}
