import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  createdBy: mongoose.Types.ObjectId; // Admin ID
  maxParticipants?: number;
  eventType: "PUBLIC" | "PRIVATE"; // PUBLIC (Open to all), PRIVATE (Only invited)
  participants: mongoose.Types.ObjectId[]; // Array of User IDs
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    location: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    maxParticipants: { type: Number },
    eventType: { type: String, enum: ["PUBLIC", "PRIVATE"], required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"],
      default: "UPCOMING",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
