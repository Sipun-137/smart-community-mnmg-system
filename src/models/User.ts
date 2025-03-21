import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["Resident", "Admin", "Security", "Provider"], default: "Resident" },
  apartmentNo: String,
  phone: String,
},{ timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
