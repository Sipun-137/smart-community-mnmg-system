/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
import connect from "@/services/Config";
import { AuthUser } from "@/services/AuthService";

export async function POST(req: NextRequest) {
    await connect();

    try {
        const user = await AuthUser(req);
        if (!user || user.role !== "Admin") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

        const { title, description, dateTime, location, eventType, maxParticipants } = await req.json();
        const event = await Event.create({
            title,
            description,
            dateTime,
            location,
            createdBy: user.id,
            eventType,
            maxParticipants,
        });

        return NextResponse.json({ success: true, event }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    await connect();

    try {
        const user = await AuthUser(req);
        if (!user || user.role !== "Admin") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

        const { eventId } = await req.json();
        const event = await Event.findById(eventId);
        if (!event) return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });

        await Event.findByIdAndDelete(eventId);

        return NextResponse.json({ success: true, message: "Event deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
