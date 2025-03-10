import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: { type: Date, default: Date.now() },
}, { timestamps: true });

export default mongoose.models.Notice || mongoose.model("Notice", NoticeSchema);
