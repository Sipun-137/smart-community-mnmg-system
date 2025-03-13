import mongoose, { Schema, Document } from "mongoose";

export interface IParkingSlot extends Document {
  slotNumber: string;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
  reservedBy?: mongoose.Types.ObjectId; // User who reserved it
  vehicleNumber?: string;
  reservedAt?: Date;
  updatedAt: Date;
}

const ParkingSlotSchema = new Schema<IParkingSlot>(
  {
    slotNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ["AVAILABLE", "OCCUPIED", "RESERVED"], default: "AVAILABLE" },
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reservedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.ParkingSlot || mongoose.model<IParkingSlot>("ParkingSlot", ParkingSlotSchema);
