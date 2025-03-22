/* eslint-disable @typescript-eslint/no-explicit-any */
import connect from "@/services/Config";
import { NextRequest, NextResponse } from "next/server";
import { AuthUser } from "../../auth/route";
import Service from "@/models/Service";
import Booking from "@/models/Booking";

await connect();

export async function POST(req: NextRequest) {
    const user = await AuthUser(req);

    if (!user || user.role !== "Resident") {
        return NextResponse.json({ success: false, message: "Access Denied: Residents only" }, { status: 403 });
    }

    try {
        const { serviceId, date, timeSlot } = await req.json();

        const service = await Service.findById(serviceId);
        if (!service) {
            return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
        }

        const booking = new Booking({
            residentId: user.id,
            providerId: service.providerId,
            serviceId,
            date,
            status: "pending",
            timeSlot
        });

        await booking.save();

        return NextResponse.json({ success: true, message: "Booking created successfully", booking }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    const user = await AuthUser(req);

    if (!user || user.role !== "Resident") {
        return NextResponse.json({ success: false, message: "Access Denied: Residents only" }, { status: 403 });
    }

    try {
        const bookings = await Booking.find({ residentId: user.id }).populate("serviceId providerId");
        return NextResponse.json({ success: true, bookings }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}





