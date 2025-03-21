import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  providerId: mongoose.Types.ObjectId; // Reference to the Provider
  name: string;
  description: string;
  category: string;
  price: number;
  availability: {
    days: string[]; // ["Monday", "Tuesday"]
    timeSlots: string[]; // ["10:00 AM - 12:00 PM"]
  };
  status: "active" | "inactive"; // Whether service is currently available
  ratings: number; // Average rating
  totalReviews: number; // Number of reviews
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    availability: {
      days: { type: [String], required: true },
      timeSlots: { type: [String], required: true },
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    ratings: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
