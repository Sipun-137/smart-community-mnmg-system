"use client";
import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Chip,
} from "@mui/material";
import { ArrowBack, Visibility } from "@mui/icons-material";
import { format } from "date-fns";
import Image from "next/image";
import { getMyPayments } from "@/services/PaymentService";

interface paymentI {
  _id: string;
  userId: string;
  amount: number;
  status: "Pending" | "UnderReview" | "Verified" | "Rejected";
  modeOfPayment: string;
  paymentDate: Date;
  proofUrl: string;
}



const statusColors = {
  Pending: "bg-yellow-100 text-yellow-600",
  UnderReview: "bg-blue-100 text-blue-600",
  Verified: "bg-green-100 text-green-600",
  Rejected: "bg-red-100 text-red-600",
};

export default function PaymentHistory() {
  const [payments, setPayments] = useState<paymentI[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<paymentI | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getStatusChip = (status: string) => {
    const colorMap: Record<string, "warning" | "info" | "success" | "error"> = {
      Pending: "warning",
      UnderReview: "info",
      Verified: "success",
      Rejected: "error",
    };
    return (
      <Chip
        label={status}
        color={colorMap[status] || "default"}
        variant="outlined"
      />
    );
  };

  async function getMyAllPayments() {
    const myAllPayments = await getMyPayments();
    setPayments(myAllPayments.payments);
  }

  useEffect(() => {
    getMyAllPayments();
  }, []);

  const filteredPayments = payments.filter(
    (payment) =>
      (statusFilter === "" || payment.status === statusFilter) &&
      (searchQuery === "" ||
        payment.modeOfPayment.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <div className="p-6  mx-auto">
        <div className="flex items-center mb-4 text-white ">
          <IconButton sx={{ color: "white" }}>
            <ArrowBack />
          </IconButton>
          <h1 className="text-2xl font-bold ml-2">My Payments</h1>
        </div>

        <div className="mb-4 ">
          <h2 className="text-lg font-semibold">Payment History</h2>
          <p className="text-gray-600">
            View all your payment transactions and their current status
          </p>
        </div>

        <div className="flex gap-4 mb-4 bg-white rounded-lg text-black p-3">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by amount or payment method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            variant="outlined"
          >
            <MenuItem value="">All Statuses</MenuItem>
            {Object.keys(statusColors).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained" color="primary" href="/dashboard/resident/make-payment">
            Make New Payment
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>
                    {format(payment.paymentDate, "MMMM dd, yyyy")}
                  </TableCell>
                  <TableCell>{payment.modeOfPayment}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[payment.status]}`}
                    >
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setDialogOpen(true);
                      }}
                    >
                      <Visibility /> View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <>
              <Typography>
                Amount: ${selectedPayment.amount.toFixed(2)}
              </Typography>
              <Typography>
                Payment Method: {selectedPayment.modeOfPayment}
              </Typography>
              <Typography>
                Date: {format(selectedPayment.paymentDate, "MMMM dd, yyyy")}
              </Typography>
              <div>Status: {getStatusChip(selectedPayment.status)}</div>

              <Image
                src={selectedPayment.proofUrl || "/placeholder.svg"}
                alt="Payment proof"
                width={400}
                height={300}
                className="rounded-md"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
