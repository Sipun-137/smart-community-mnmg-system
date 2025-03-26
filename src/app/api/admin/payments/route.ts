/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Payment from "@/models/Payment";
import { AuthUser } from "@/services/AuthService";
import Booking from "@/models/Booking";

export async function GET(req: NextRequest) {
    const user = await AuthUser(req);
    if (!user) {
        return NextResponse.json({ success: false, message: "Unauthorized Access" }, { status: 401 })
    }
    if (user?.role !== "Admin") return NextResponse.json({ success: false, message: "Admin Access Required" }, { status: 401 });

    try {
        const payments = await Payment.find().populate("userId", "name email");
        return NextResponse.json({ payments });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const user = await AuthUser(req);

    if (!user) {
        return NextResponse.json({ success: false, message: "Unauthorizes aceess" }, { status: 401 })
    }

    if (user?.role !== "Admin") {
        return NextResponse.json({ success: false, message: "Admin Access Required" }, { status: 401 })
    }

    const { status } = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!["Verified", "Rejected"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    try {
        const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true });
        if (payment && payment.status === "Verified") {
            console.log(payment);
            const res = await Booking.findByIdAndUpdate(payment.bookingRef, {paymentStatus:"paid", status: "confirmed" }, { new: true })
            console.log(res);
            return NextResponse.json({ success: true, message: "Payment Updated" });
        }
        else if (payment && payment.status === "Rejected") {
            const res = await Booking.findByIdAndUpdate(payment.bookingRef, {paymentStatus:"failed", status: "canceled" }, { new: true })
            console.log(res);
            return NextResponse.json({ success: true, message: "Payment Updated" });
        }
        else {
            return NextResponse.json({ success: false, message: "Payment status update failed" }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
