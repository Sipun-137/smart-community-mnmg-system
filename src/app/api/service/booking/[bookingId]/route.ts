/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthUser } from "@/app/api/auth/route";
import Booking from "@/models/Booking";
import { NextRequest, NextResponse } from "next/server";



// provider update the status of the booking
export async function PATCH(req: NextRequest, { params }: { params: { bookingId: string } }) {
    const user = await AuthUser(req);

    if (!user || user.role !== "Provider") {
        return NextResponse.json({ success: false, message: "Access Denied: Providers only" }, { status: 403 });
    }

    try {
        const { status } = await req.json();
        const allowedStatuses = ["confirmed", "completed", "cancelled"];
        if (!allowedStatuses.includes(status)) {
            return NextResponse.json({ success: false, message: "Invalid status update" }, { status: 400 });
        }

        const booking = await Booking.findById(params.bookingId);
        if (!booking) {
            return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
        }

        if (booking.providerId.toString() !== user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        booking.status = status;
        await booking.save();

        return NextResponse.json({ success: true, message: "Booking status updated successfully", booking }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}



export async function DELETE(req: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
    const user = await AuthUser(req);

    if (!user || user.role !== "Resident") {
        return NextResponse.json({ message: "Access Denied: Residents only" }, { status: 403 });
    }
    const { bookingId } = await params;
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 });
        }

        if (booking.residentId.toString() !== user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await booking.deleteOne();

        return NextResponse.json({success:true, message: "Booking cancelled successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
