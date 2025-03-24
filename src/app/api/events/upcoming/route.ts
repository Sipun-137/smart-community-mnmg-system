
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
import { AuthUser } from "@/services/AuthService";
import connect from "@/services/Config";



export async function GET(req: NextRequest) {
    connect();
    try {
        const resident = await AuthUser(req);
        if (!resident) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const currentDate = new Date();
        const upcomingEvents = await Event.find({
            eventType: "PUBLIC",
            dateTime: { $gte: currentDate },
            status: "UPCOMING"
        }).populate("createdBy");

        return NextResponse.json({ success: true, events: upcomingEvents });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Server Error", error: error.message }, { status: 500 });
    }
}
