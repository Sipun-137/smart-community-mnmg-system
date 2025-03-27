import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
  name: String,
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  visitorId: String,
  phone: String,
  apartmentNo: String,
  visitReason: String,
  visitDate: { type: Date },
  entryTime: { type: Date },
  exitTime: Date,
  qrCode: String,
  status: { type: String, enum: ["pending", "approved", "completed", "rejected", "active"], default: "pending" }
}, { timestamps: true });

export default mongoose.models.Visitor || mongoose.model("Visitor", VisitorSchema);
