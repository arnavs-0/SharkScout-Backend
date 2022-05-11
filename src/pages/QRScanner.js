import React, {useState} from "react";
import {Alert, Box, Button, IconButton, Snackbar, TextareaAutosize,} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QrScan from "react-qr-reader";
import axios from "axios";

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
            .post("http://localhost:3001/match", scan)
            .then(function (response) {
                console.log(response.status);
                setSnackbarMessage("Submitted Scouting Form");
                setSnackbarSeverity("success");
                setSnackbar(true);
                axios
                    .get("http://localhost:3001/reformat")
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
            .post("http://localhost:3001/pit", scan)
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

    return (
        <div className="App">
            {open ? (
                <center>
                    <Box style={{marginTop: 30}}>
                        <QrScan
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            style={{height: 390, width: 520}}
                        />
                    </Box>
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
                    marginTop: 150,
                    fontFamily: "Roboto",
                }}
                rowsMax={4}
                defaultValue={qrscan}
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
