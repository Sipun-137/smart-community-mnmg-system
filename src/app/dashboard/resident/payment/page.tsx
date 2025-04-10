/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { format } from "date-fns";
import Image from "next/image";
import {
  GenerateInvoice,
  getMyPayments,
  GetPendingPayments,
  MakeAPayment,
} from "@/services/PaymentService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast, { Toaster } from "react-hot-toast";
import { AlertCircle, Upload } from "lucide-react";

interface paymentI {
  _id: string;
  userId: string;
  amount: number;
  status: "Pending" | "UnderReview" | "Verified" | "Rejected";
  modeOfPayment: string;
  paymentDate: Date;
  proofUrl: string;
  invoiceUrl: string | undefined;
}

interface Booking {
  _id: string;
  serviceId: {
    _id: string;
    name: string;
    description: string;
    price: number;
  };
  providerId: {
    name: string;
    phone: string;
  };
  date: Date;
  timeSlot: string;
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
}

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-600",
  UnderReview: "bg-blue-100 text-blue-600",
  Verified: "bg-green-100 text-green-600",
  Rejected: "bg-red-100 text-red-600",
};

export default function PaymentHistory() {
  const [payments, setPayments] = useState<paymentI[]>([]);
  const [pendingPayments, setPendingpayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<paymentI | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const [amount, setAmount] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState("UPI");
  const [proofFile, setProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedBookings, setSelectedBookings] = useState<Booking | null>(
    null
  );

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setError("");
    setProofFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      } else {
        setPreviewUrl(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!selectedBookings) {
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!proofFile) {
      toast.error("Please upload proof of payment");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("bookingRef", selectedBookings._id);
    formData.append("amount", amount);
    formData.append("modeOfPayment", modeOfPayment);
    formData.append("proof", proofFile);
    try {
      const response = await MakeAPayment(formData);
      console.log(response);
      setAmount("");
      setModeOfPayment("UPI");
      setProofFile(null);
      setPreviewUrl(null);
    } catch (e: any) {
      console.log(e);
      toast.error("Failed to submit payment. Please try again.");
    } finally {
      setIsSubmitting(false);
      setPaymentDialogOpen(false);
      getMyAllPayments();
      LoadPendingPayments();
    }
  };

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

  async function LoadPendingPayments() {
    const pendingPayments = await GetPendingPayments();
    setPendingpayments(pendingPayments.payments);
  }

  
    const handleGenerateInvoice = async (paymentId: string) => {
      const res = await GenerateInvoice(paymentId);
      if (res.success) {
        toast.success("Invoice generated successfully!");
        getMyAllPayments();
      } else {
        toast.error(res.message);
      }
    };

  useEffect(() => {
    getMyAllPayments();
    LoadPendingPayments();
  }, []);

  const filteredPayments = payments.filter(
    (payment) =>
      (statusFilter === "" || payment.status === statusFilter) &&
      (searchQuery === "" ||
        payment.modeOfPayment.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <div className=" mx-auto ">
        <Toaster position="bottom-right" />
        <h1 className="text-3xl font-bold mb-6">Payments</h1>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          </TabsList>

          {/* show alll the complete payments */}
          <TabsContent value="history" className="space-y-6">
            <div className="p-6  mx-auto">
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
                        <TableCell>
                          {payment.invoiceUrl ? (
                            <Button href={payment.invoiceUrl} download>
                              Download Invoice
                            </Button>
                          ) : (payment.status === "Verified" ? <Button
                            onClick={() => {
                              handleGenerateInvoice(payment._id);
                            }}
                          >
                            Genrate Invoice
                          </Button>:"Wait For Verification")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </TabsContent>

          {/* show all the pending payments */}
          <TabsContent value="pending" className="space-y-6">
            <div className="mb-4 ">
              <h2 className="text-lg font-semibold">Pending Payments</h2>
              <p className="text-gray-600">
                View all your pending payment transactions
              </p>
            </div>
            <div>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingPayments.length > 0 ? (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      pendingPayments.map((payment: any) => (
                        <TableRow key={payment._id}>
                          <TableCell className="font-medium">
                            {payment.serviceId.name}
                          </TableCell>
                          <TableCell>
                            {new Date(payment.date).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{payment.serviceId.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => {
                                setSelectedBookings(payment);
                                setPaymentDialogOpen(true);
                                setAmount(payment.serviceId.price);
                              }}
                            >
                              pay
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          No pending payments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </TabsContent>
        </Tabs>
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
        <Dialog
          open={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
        >
          <DialogTitle>
            Pay for Booking{" "}
            {selectedBookings && selectedBookings.serviceId.name}
            <p className="text-sm text-gray-500">
              booking ref: {selectedBookings?._id}
            </p>
          </DialogTitle>
          <DialogContent>
            <div className="flex justify-center items-center text-black">
              <div className="bg-white p-3 rounded-lg shadow-md w-full max-w-md">
                {error && (
                  <div className="text-red-600 flex items-center gap-2 text-sm mb-3">
                    <AlertCircle className="w-5 h-5" /> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <TextField
                    label="Amount"
                    type="number"
                    fullWidth
                    value={selectedBookings?.serviceId.price}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    disabled
                  />

                  <div>
                    <label className="block font-medium text-sm">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["UPI", "NetBanking", "BankTransfer", "Cash"].map(
                        (method) => (
                          <button
                            type="button"
                            key={method}
                            className={`border p-2 rounded-md text-sm font-medium transition ${
                              modeOfPayment === method
                                ? "border-black"
                                : "border-gray-300"
                            }`}
                            onClick={() => setModeOfPayment(method)}
                          >
                            {method}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-sm">
                      Payment Proof
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      id="proof-upload"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="proof-upload"
                      className="border border-dashed border-gray-300 flex flex-col items-center justify-center py-10 rounded-md cursor-pointer text-gray-500 hover:border-gray-400 transition"
                    >
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-sm">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs">
                        PNG, JPG or JPEG (max 5MB)
                      </span>
                    </label>
                  </div>

                  {previewUrl && (
                    <div className="relative mt-2">
                      <Image
                        src={previewUrl}
                        alt="Payment proof preview"
                        width={400}
                        height={300}
                        className="w-full rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                        onClick={() => {
                          setProofFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                    className="bg-black hover:bg-gray-800 text-white w-full"
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Submit Payment"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
