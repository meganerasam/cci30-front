import React, { useRef, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import axios from "axios";

function Constituents({ tab, selectedExchange }) {
  const [constituents, setConstituents] = useState([]);
  const [priceNew, setpriceNew] = useState([]);

  // Create our number formatter.
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  const fetchData = async () => {
    const res = await axios.get(`/api/constituents/all`);
    console.log("RE: ", res.data);
    setConstituents(res.data);
  }

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <div>
      <TableContainer sx={{ maxHeight: 300 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>#</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Nom</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Prix</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Capitalisation boursière</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {constituents &&
              constituents
                .map((c, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{c.rank}</TableCell>
                    <TableCell>{c.symbol}</TableCell>
                    <TableCell>0.000</TableCell>
                    <TableCell>{formatter.format(c.market_cap)}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Constituents;
