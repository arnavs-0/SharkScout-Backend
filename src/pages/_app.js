import Navbar from "@/components/Navbar";
import useClasses from "@/components/useClasses";
import {Alert, createTheme, Snackbar, ThemeProvider, Typography, CssBaseline} from "@mui/material";
import "@/styles/globals.css"
import "@/styles/App.css"

export default function MyApp({ Component, pageProps }) {
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
    
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Navbar/>
            <Component {...pageProps} />
            <footer className="footer">
                <Typography className={styles.root} align="center">
                    <strong> {'\u00A9'} {new Date().getFullYear()} Team 226 - The Hammerheads </strong>
                </Typography>
            </footer>
        </ThemeProvider>
    )
}