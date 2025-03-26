import mongoose, { Schema } from "mongoose";


export interface IBooking extends Document {
    residentId: mongoose.Types.ObjectId;
    providerId: mongoose.Types.ObjectId;
    serviceId: mongoose.Types.ObjectId;
    date: Date;
    timeSlot: string;
    status: "pending" | "confirmed" | "completed" | "canceled";
    paymentStatus: "pending" |"underReview"| "paid" | "failed";
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        residentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
        date: { type: Date, required: true },
        timeSlot: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "canceled"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);