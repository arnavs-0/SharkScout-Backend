import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

export default function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        color="lightblue"
                        sx={{mr: 2, display: {xs: "none", md: "flex"}}}
                    >
                        226 Scouting Server
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: "flex", md: "none"}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: "block", md: "none"},
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    window.location.href = "/";
                                }}
                            >
                                <Typography textAlign="center">QR Scanner</Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    window.location.href = "/handle";
                                }}
                            >
                                <Typography textAlign="center">Handle Data</Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    window.location.href = "/viewer";
                                }}
                            >
                                <Typography textAlign="center">Viewer</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    <Typography
                        variant="p"
                        noWrap
                        component="div"
                        color="primary"
                        sx={{flexGrow: 1, display: {xs: "flex", md: "none"}}}
                    >
                        226 Scouting Server
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: "none", md: "flex"}}}>
                        <Button
                            sx={{my: 2, color: "info", display: "block"}}
                            onClick={() => {
                                window.location.href = "/upload";
                            }}
                        >
                            Upload Data
                        </Button>
                        <Button
                            onClick={() => {
                                window.location.href = "/handle";
                            }}
                            sx={{my: 2, color: "info", display: "block"}}
                        >
                            Handle Data
                        </Button>
                        <Button
                            onClick={() => {
                                window.location.href = "/viewer";
                            }}
                            sx={{my: 2, color: "info", display: "block"}}
                        >
                            Viewer
                        </Button>
                    </Box>
                    <Button
                        onClick={() => {
                            window.location.href = "/";
                        }}
                        sx={{my: 2, color: "pink", display: "block"}}
                    >
                        QR Scan
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
