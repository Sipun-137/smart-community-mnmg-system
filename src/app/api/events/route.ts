/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
import { AuthUser } from "@/services/AuthService";
import connect from "@/services/Config";

export async function GET(req: NextRequest) {
    await connect();
    try {
        const user = await AuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "UnAuthorized" })
        const events = await Event.find().populate("createdBy", "name email");
        return NextResponse.json({ success: true, events }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    await connect();

    try {
        const user = await AuthUser(req);
        if (!user || user.role !== "Resident") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

        const { eventId } = await req.json();
        const event = await Event.findById(eventId);
        if (!event) return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });

        if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
            return NextResponse.json({ success: false, message: "Event is full" }, { status: 400 });
        }

        if (event.participants.includes(user.id)) {
            return NextResponse.json({ success: false, message: "Already registered" }, { status: 400 });
        }

        event.participants.push(user.id);
        await event.save();

        return NextResponse.json({ success: true, message: "Registered successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
