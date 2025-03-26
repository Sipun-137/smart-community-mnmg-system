/* eslint-disable @typescript-eslint/no-explicit-any */
import Booking from "@/models/Booking";
import { AuthUser } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";




export async function GET(req: NextRequest) {
    try {
        const user = await AuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "UnAuthorized" }, { status: 401 });
        const payments = await Booking.find({
            residentId: user.id,
            paymentStatus: "pending"
        }).populate("serviceId");
        console.log(payments);
        return NextResponse.json({ success: true, payments })
    } catch (e: any) {
        return NextResponse.json({ success: false, message: "Service Error", error: e.message }, { status: 500 });
    }
}