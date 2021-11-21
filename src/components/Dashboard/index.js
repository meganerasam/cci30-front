import React, { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import Switch from "@mui/material/Switch";
import axios from "axios";
import Markets from "../Markets";
import Exchanges from "../Exchanges";
import request from "../../Request";
import Chart from "../Chart/index";

//import Chart from './Chart';
//import Deposits from './Deposits';
//import Orders from './Orders';



const drawerWidth = 200;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    width: "100%",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

function DashboardContent() {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  //for dark mode
  const [darkMode, setDarkMode] = useState(false);
  const mdTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  //call
  /*const [market, setMarket] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState({});
  const [selectedExchange, setSelectedExchange] = useState({});

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/markets");
      setMarket(res.data.data);
      setSelectedMarket(res.data.data[0]);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/exchanges");
      setExchanges(res.data.data);
      setSelectedExchange(res.data.data[0]);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setExchanges(exchanges);
    setSelectedExchange(exchanges[0]);
  }, [exchanges]);

  useEffect(() => {
    setMarket(market);
    setSelectedMarket(market[0]);
  }, [market]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await axios.get("/exchanges");
      setExchanges(res.data.data);
      setSelectedExchange(res.data.data[0]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await axios.get("/markets");
      setMarket(res.data.data);
      setSelectedMarket(res.data.data[0]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);*/


  return (
    <ThemeProvider theme={mdTheme}>
      <Paper>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: "24px", // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Dashboard
              </Typography>

              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            </Toolbar>
          </AppBar>
          {/* <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List>{mainListItems}</List>
          </Drawer> */}
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                {/* <Grid item xs={12} md={6} lg={6}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "auto",
                    }}
                  >
                    {/* <Exchanges /> 
                    <Exchanges
                      data={exchanges}
                      setSelectedExchange={setSelectedExchange}
                    />
                  </Paper>
                </Grid> */}
                {/* <Grid item xs={12} md={6} lg={6}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "auto",
                    }}
                  >
                    {/* <Markets />
                    <Markets
                      data={market}
                      setSelectedMarket={setSelectedMarket}
                    />
                  </Paper>
                </Grid> */}

                {/* Recent Deposits */}

                {/* Recent chart */}
                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    {/* <chart /> */}

                    <Chart />
                  </Paper>
                </Grid>
              </Grid>

            </Container>
          </Box>
        </Box>
      </Paper>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
