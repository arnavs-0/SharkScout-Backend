import {Alert, Button, IconButton, Snackbar, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import React from "react";

export default function HandleData() {
    const [data, setData] = React.useState(null);
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

    function handleClick() {
        axios
            .get("http://localhost:3001/reformat")
            .then(function (response) {
                console.log(response.status);
                if (response.status === 200) {
                    setData("Refactored Data & Appended to Database");
                    setSnackbarMessage("Refactored Data & Appended to Database");
                    setSnackbarSeverity("success");
                    setSnackbar(true);
                } else {
                    setData("Error");
                    setSnackbarMessage("Error Failed to Refactor Data");
                    setSnackbarSeverity("error");
                    setSnackbar(true);
                }
            })
            .catch(function (error) {
                console.log(error);
                setData("Error");
            });
    }

    return (
        <div className="App">
            <br/>
            <Typography variant="h4" color="primary">
                Handle Data
            </Typography>
            <br/>
            <Button
                onClick={handleClick}
                variant="contained"
                color="primary"
                style={{marginTop: "15px"}}
            >
                Refactor Match Scouting Forms
            </Button>
            <br/>
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
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
