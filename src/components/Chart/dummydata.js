import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { createChart, CrosshairMode } from "lightweight-charts";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import LastTradedPrice from "../Constituents";
import moment from 'moment';

export default function Chart({
    market,
    selectedMarket,
    setSelectedMarket,
    exchanges,
    selectedExchange,
    setSelectedExchange,
    price,
}) {
    const chartContainerRef = useRef();
    const chart = useRef();
    const resizeObserver = useRef();
    const [value, setValue] = React.useState("1");
    const candleSeries = useRef();
    const [state, setstate] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (value == "1") {
            chart.current = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 300,
                layout: {
                    backgroundColor: "#253248",
                    textColor: "rgba(255, 255, 255, 0.9)",
                },
                grid: {
                    vertLines: {
                        color: "#334158",
                    },
                    horzLines: {
                        color: "#334158",
                    },
                },
                crosshair: {
                    mode: CrosshairMode.Normal,
                },
                priceScale: {
                    borderColor: "#485c7b",
                },
                timeScale: {
                    borderColor: "#485c7b",
                    timeVisible: true,
                    secondsVisible: false,
                },
            });

            candleSeries.current = chart.current.addLineSeries({
                upColor: "#4bffb5",
                downColor: "#ff4976",
                borderDownColor: "#ff4976",
                borderUpColor: "#4bffb5",
                wickDownColor: "#838ca1",
                wickUpColor: "#838ca1",
            });
        }
    }, [value]);

    async function fetchData() {
        const res = await axios.get(
            `/api/ohlcv/daily`
        );

        const jsonRes = res.data.values;

        const cdata = jsonRes
            .sort((a, b) => (moment(a[0], "DD/MM/YYYY") > moment(b[0], "DD/MM/YYYY") ? 1 : -1))
            .map((d) => {
                if (!isNaN(moment(d[0], "DD/MM/YYYY").unix())) {
                    /*return {
                      time: moment.unix(moment(d[0], "DD/MM/YYYY").unix()).format("YYYY-MM-DD"),
                      open: parseFloat(d[1].replace(',', '.')).toFixed(2),
                      high: parseFloat(d[2].replace(',', '.')).toFixed(2),
                      low: parseFloat(d[3].replace(',', '.')).toFixed(2),
                      close: parseFloat(d[4].replace(',', '.')).toFixed(2),
                    };*/

                    return {
                        time: moment.unix(moment(d[0], "DD/MM/YYYY").unix()).format("YYYY-MM-DD"),
                        value: parseFloat(d[4].replace(',', '.')).toFixed(2),
                    };
                }
            });

        setstate(cdata);
    }

    async function fetchDataMonthly() {
        const res = await axios.get(
            `/api/ohlcv/monthly`
        );

        const jsonRes = res.data;

        console.log(res.data)

        const cdata = jsonRes
            .sort((a, b) => (moment(a[0], "YYYY-MM-DD") > moment(b[0], "YYYY-MM-DD") ? 1 : -1))
            .map((d) => {
                /*return {
                  time: d[0],
                  open: d[1],
                  high: d[2],
                  low: d[3],
                  close: d[4],
                };*/

                return {
                    time: d[0],
                    value: d[4],
                };
            });

        setstate(cdata);
    }

    useEffect(async () => {
        await candleSeries.current.setData(state);
    }, [state]);

    // Resize chart on container resizes.
    useEffect(() => {
        resizeObserver.current = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            chart.current.applyOptions({ width, height });
            setTimeout(() => {
                chart.current.timeScale().fitContent();
            }, 0);
        });

        resizeObserver.current.observe(chartContainerRef.current);

        return () => resizeObserver.current.disconnect();
    }, []);

    useEffect(async () => {
        fetchDataMonthly();
    }, [])


    const handleChangeMarket = (event) => {
        setSelectedMarket(event.target.value);
    };

    const handleChangeExchange = (event) => {
        setSelectedExchange(event.target.value);
    };

    return (
        <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Chart" value="1" />
                        <Tab label="Prices" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                        <Grid item xs={12}>
                            <FormControl style={{ margin: 10 }} sx={{ m: 1, minWidth: 150 }}>
                                <InputLabel id="demo-simple-select-label">Market</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedMarket}
                                    label="Market"
                                    onChange={handleChangeMarket}
                                >
                                    {market &&
                                        market.map((m) => (
                                            <MenuItem value={m}>
                                                {m.baseSymbol}/{m.quoteSymbol}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl style={{ margin: 10 }} sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-label">Exchange</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedExchange}
                                    label="Exchange"
                                    onChange={handleChangeExchange}
                                >
                                    {exchanges &&
                                        exchanges.map((ex) => (
                                            <MenuItem value={ex}>{ex.name}</MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <div ref={chartContainerRef} style={{ flex: 1 }}></div>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value="2">
                    {/* <FormControl style={{ margin: 10 }} sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Exchange</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedExchange}
              label="Exchange"
              onChange={handleChangeExchange}
            >
              {exchanges &&
                exchanges.map((ex) => (
                  <MenuItem value={ex}>{ex.name}</MenuItem>
                ))}
            </Select>
          </FormControl> */}
                    {/* <LastTradedPrice tab={value} selectedExchange={selectedExchange} /> */}
                </TabPanel>
            </TabContext>
        </Box>
    );
}
