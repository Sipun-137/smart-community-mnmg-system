import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  paymentDate: Date,
  invoiceUrl: String,
},{ timestamps: true });

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
