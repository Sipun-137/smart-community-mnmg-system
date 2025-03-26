"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Search, Visibility, CheckCircle, Cancel } from "@mui/icons-material";
import Image from "next/image";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import { GetAllPayments, UpdatePayment } from "@/services/PaymentService";

interface PaymentI {
  _id: string;
  userId: { _id: string; name: string };
  amount: number;
  status: "UnderReview" | "Pending" | "Verified" | "Rejected";
  paymentDate: Date;
  modeOfPayment: "UPI" | "NetBanking" | "BankTransfer" | "Cash";
  proofUrl: string;
}

// const payment = [
//   {
//     _id: "1",
//     userId: { _id: "user1", name: "John Doe" },
//     amount: 1500,
//     status: "Pending",
//     paymentDate: new Date("2023-05-15"),
//     modeOfPayment: "UPI",
//     proofUrl: "/placeholder.svg?height=300&width=400",
//   },
//   {
//     _id: "2",
//     userId: { _id: "user2", name: "Jane Smith" },
//     amount: 2500,
//     status: "UnderReview",
//     paymentDate: new Date("2023-05-16"),
//     modeOfPayment: "BankTransfer",
//     proofUrl: "/placeholder.svg?height=300&width=400",
//   },
//   {
//     _id: "3",
//     userId: { _id: "user3", name: "Robert Johnson" },
//     amount: 3000,
//     status: "Verified",
//     paymentDate: new Date("2023-05-14"),
//     modeOfPayment: "NetBanking",
//     proofUrl: "/placeholder.svg?height=300&width=400",
//   },
//   {
//     _id: "4",
//     userId: { _id: "user4", name: "Emily Davis" },
//     amount: 1200,
//     status: "Rejected",
//     paymentDate: new Date("2023-05-13"),
//     modeOfPayment: "Cash",
//     proofUrl: "/placeholder.svg?height=300&width=400",
//   },
// ];

export default function PaymentsAdmin() {
  const [payments, setPayment] = useState<PaymentI[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<PaymentI | null>(null);
  const [proofDialogOpen, setProofDialogOpen] = useState(false);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm) ||
      payment.modeOfPayment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewProof = (payment: PaymentI) => {
    setSelectedPayment(payment);
    setProofDialogOpen(true);
  };

  const handleUpdateStatus = async (paymentId: string, newStatus: string) => {
    const res = await UpdatePayment(paymentId, { status: newStatus });
    if (res.success) {
      console.log(`Updating payment ${paymentId} to status: ${newStatus}`);
      toast.success(`Payment ${paymentId} status updated to ${newStatus}`);
      loadPayments();
    } else {
      toast.error(res.message);
    }
  };

  const loadPayments = async () => {
    const data = await GetAllPayments();
    setPayment(data.payments);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="container mx-auto">
      <Toaster position="bottom-right" />
      <div>
        <Typography variant="h5">Payment Management</Typography>
        <Typography variant="h6">
          Review and manage payment requests from users
        </Typography>
      </div>
      <div className="flex gap-4 mb-6 bg-white p-3 rounded-lg">
        <TextField
          placeholder="Search by user, amount or payment method..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="UnderReview">Under Review</MenuItem>
          <MenuItem value="Verified">Verified</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </Select>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell>{payment.userId.name}</TableCell>
                <TableCell>₹ {payment.amount.toFixed(2)}</TableCell>
                <TableCell>
                  {format(payment.paymentDate, "MMM dd, yyyy")}
                </TableCell>
                <TableCell>{payment.modeOfPayment}</TableCell>
                <TableCell>{payment.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewProof(payment)}>
                    <Visibility />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={proofDialogOpen} onClose={() => setProofDialogOpen(false)}>
        <DialogTitle>Payment Proof</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Image
              src={selectedPayment.proofUrl}
              alt="Payment Proof"
              width={400}
              height={300}
            />
          )}
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button onClick={() => setProofDialogOpen(false)}>Close</Button>
          {selectedPayment && (
            <>
              <Button
                onClick={() =>
                  handleUpdateStatus(selectedPayment._id, "Rejected")
                }
                color="error"
              >
                <Cancel /> Reject
              </Button>
              <Button
                onClick={() =>
                  handleUpdateStatus(selectedPayment._id, "Verified")
                }
                color="success"
              >
                <CheckCircle /> Verify
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
