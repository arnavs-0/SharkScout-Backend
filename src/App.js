import "./App.css";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import QRScanner from "./pages/QRScanner";
import {Alert, createTheme, Snackbar, ThemeProvider, Typography} from "@mui/material";
import Viewer from "./pages/Viewer";
import HandleData from "./pages/HandleData";
import Upload from "./pages/Upload";
import axios from "axios";
import React, {useEffect} from "react";
import useClasses from "./components/useClasses";
import Navbar from "./components/Navbar";

function App() {
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });
    const useStyles = theme => ({
        root: {
            color: '#FFFFFF7A'
        },
    });
    const styles = useClasses(useStyles(darkTheme));


    const [snackbar, setSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

    useEffect(() => {
        axios
            .get("http://localhost:3001/")
            .then(function (response) {
                if (response.status === 200) {
                    setSnackbarMessage("API is connected and running");
                    setSnackbarSeverity("success");
                    setSnackbar(true);
                } else {
                    setSnackbarMessage("Server is not Running");
                    setSnackbarSeverity("error");
                    setSnackbar(true);
                }
            })
            .catch(function (error) {
                console.log(error);
                setSnackbarMessage("Server is not Running");
                setSnackbarSeverity("error");
                setSnackbar(true);
            });
    });

    function handleClose() {
        setSnackbar(false);
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Navbar/>
            <div>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/">
                                <QRScanner/>
                            </Route>
                            <Route path="/viewer">
                                <Viewer/>
                            </Route>
                            <Route path="/handle">
                                <HandleData/>
                            </Route>
                            <Route path="/upload">
                                <Upload/>
                            </Route>
                        </Switch>
                    </div>
                </Router>
                <Snackbar
                    anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                    open={snackbar}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert
                        severity={snackbarSeverity}
                        sx={{width: "100%"}}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
            <footer className="footer">
                <Typography className={styles.root} align="center">
                    <strong> {'\u00A9'} {new Date().getFullYear()} Team 226 - The Hammerheads </strong>
                </Typography>
            </footer>
        </ThemeProvider>
    );
}

export default App;
