"use client";
import { getAllVisitorsByUser } from "@/services/VisitorService";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface VisitorI {
  _id: string;
  name: string;
  phone: string;
  visitDate: string;
  visitReason: string;
  apartmentNo: string;
}

export default function Page() {
  const [myVisitor, setMyVisitor] = useState<VisitorI[]>([]);
  useEffect(() => {
    async function fetchData() {
      const response = await getAllVisitorsByUser();
      setMyVisitor(response.visitors);
    }
    fetchData();
  }, []);
  return (
    <div className="p-4 m-2 flex justify-center items-center flex-col">
      <div>
        <p className="p-1 font-sans text-lg uppercase font-bold">my Visitors</p>
      </div>
      <hr className="border border-white w-full" />
      <div className="w-full mt-6">
        {myVisitor.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Phone</TableCell>
                  <TableCell align="right">Visit Date</TableCell>
                  <TableCell align="right">visitReason</TableCell>
                  <TableCell align="right">Flat No.</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myVisitor.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.phone}</TableCell>
                    <TableCell align="right">
                      {new Date(row.visitDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">{row.visitReason}</TableCell>
                    <TableCell align="right">{row.apartmentNo}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        // href={`visitor/${row._id}`}
                      >
                        Show Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </div>
    </div>
  );
}
