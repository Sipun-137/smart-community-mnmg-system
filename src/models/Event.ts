import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
},{ timestamps: true });

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
