import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
  name: String,
  phone: String,
  apartmentNo: String,
  visitReason: String,
  entryTime: { type: Date, default: Date.now },
  exitTime: Date,
  qrCode: String,
},{ timestamps: true });

export default mongoose.models.Visitor || mongoose.model("Visitor", VisitorSchema);
