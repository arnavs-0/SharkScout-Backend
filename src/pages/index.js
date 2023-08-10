import React, {useState, useEffect} from "react";
import {Alert, Box, Button, Container, IconButton, Snackbar, TextareaAutosize,} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from "axios";

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
export const createConfig = (props) => {
    let config = {};
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

const Html5QrcodePlugin = (props) => {
    let html5QrcodeScanner;


    useEffect(() => {
        // when component mounts
        const config = createConfig(props);
        const verbose = props.verbose === true;
        // Suceess callback is required.
        if (!(props.qrCodeSuccessCallback)) {
            throw "qrCodeSuccessCallback is required callback.";
        }
        html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    return (
        <div id={qrcodeRegionId} />
    );
};

export default function QRScanner() {
    const [qrscan, setQrscan] = useState("No result");
    const [open, setOpen] = useState(true);
    const [snackbar, setSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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

    const handleScan = (data) => {
        if (data) {
            setQrscan(data);
            setOpen(false);
        }
    };
    const handleError = (err) => {
        console.error(err);
    };

    const handlePost = () => {
        const scan = JSON.parse(qrscan);
        axios
            .post("/api/match", scan)
            .then(function (response) {
                console.log(response.status);
                setSnackbarMessage("Submitted Scouting Form");
                setSnackbarSeverity("success");
                setSnackbar(true);
                axios
                    .get("/api/reformat")
                    .then(function (response) {
                        console.log(response.status);
                        setSnackbarMessage("Appended Scouting Forms");
                        setQrscan("No Result");
                        setOpen(true);
                    })
                    .catch(function (error) {
                        console.log(error);
                        setSnackbarMessage("Error Appending Scouting Forms");
                        setSnackbarSeverity("error");
                    });
            })
            .catch(function (error) {
                console.log(error);
                setSnackbarMessage("An Error has Occured:" + error);
                setSnackbarSeverity("error");
                setSnackbar(true);
            });
    };

    const handlePit = () => {
        const scan = JSON.parse(qrscan)
        axios
            .post("/api/pit", scan)
            .then(function (response) {
                console.log(response.status);
                setSnackbarMessage("Submitted Pit Form");
                setSnackbarSeverity("success");
                setSnackbar(true);
                setQrscan("No Result");
                setOpen(true);
            })
            .catch(function (error) {
                console.log(error);
                setSnackbarMessage("An Error has Occured:" + error);
                setSnackbarSeverity("error");
                setSnackbar(true);
            });
    }

    const handleCancel = () => {
        setSnackbarMessage("Cancelled");
        setSnackbarSeverity("error");
        setSnackbar(true);
        setQrscan("No Result");
        setOpen(true);
    };

    const onNewScanResult = (decodedText, decodedResult) => {
        if (decodedResult) {
            setQrscan(decodedText);
            setOpen(false);
        }
    };

    return (
        <div className="App">
            {open ? (
                <center>
                    <Container maxWidth="sm" style={{marginTop: 30}}>
                    <Html5QrcodePlugin
                fps={10}
                qrbox={400}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
            />

                    </Container>
                </center>
            ) : (
                <center>
                    <Button
                        style={{marginTop: 30}}
                        variant="contained"
                        color="primary"
                        onClick={handlePost}
                    >
                        Submit Scouting Data
                    </Button>
                    <br/>
                    <Button
                        style={{marginTop: 30}}
                        variant="contained"
                        color="secondary"
                        onClick={handlePit} >
                        Submit Pit Data
                    </Button>
                    <br/>
                    <br/>
                    <Button
                        style={{marginTop: 30}}
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </center>
            )}

            <TextareaAutosize
                style={{
                    fontSize: 18,
                    width: 320,
                    height: 100,
                    marginTop: 25,
                    fontFamily: "Roboto",
                }}
                maxRows={4}
                value={qrscan}
            />
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
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}