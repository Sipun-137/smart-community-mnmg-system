import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookingRef: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["UnderReview", "Pending", "Verified", "Rejected"], default: "Pending" },
  paymentDate: { type: Date, default: Date.now },
  modeOfPayment: { type: String, enum: ["UPI", "NetBanking", "BankTransfer", "Cash"], required: true },
  invoiceUrl: { type: String },
  proofUrl: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
