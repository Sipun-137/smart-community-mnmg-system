/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { AuthUser } from "../../auth/route";
import Booking from "@/models/Booking";


export async function GET(req: NextRequest) {
    try {
        const user = await AuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "UnAuthorized User" }, { status: 401 })
        if (!["Provider"].includes(user.role)) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })
        const bookings = await Booking.find({ providerId: user.id }).populate("residentId serviceId", " -role -password -createdAt -updatedAt -__v  ");
        return NextResponse.json({ success: true, bookings }, { status: 200 });

    } catch (error) {
        console.error("Error adding service:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" });
    }
}


export async function PATCH(req: NextRequest) {
    const user = await AuthUser(req);

    if (!user) {
        return NextResponse.json({ success: false, message: "Unauthorizes aceess" }, { status: 401 })
    }

    if (user?.role !== "Provider") {
        return NextResponse.json({ success: false, message: "Provider Access Required" }, { status: 401 })
    }

    const { status } = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!["pending", "confirmed", "completed", "canceled"].includes(status)) {
        return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    try {
        const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
        return NextResponse.json({ success: true, booking });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "service error", error: error.message }, { status: 500 });
    }
}