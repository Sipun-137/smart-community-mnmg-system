import mongoose from "mongoose";

const ServiceRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["Plumbing", "Electrical", "Cleaning", "Other"] },
  status: { type: String, enum: ["Open", "In Progress", "Resolved"], default: "Open" },
  description: String,
},{ timestamps: true });

export default mongoose.models.ServiceRequest || mongoose.model("ServiceRequest", ServiceRequestSchema);
