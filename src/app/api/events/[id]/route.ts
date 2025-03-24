/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Event from "@/models/Event";
import { AuthUser } from "@/services/AuthService";



export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resident = await AuthUser(req);
        if (!resident) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: "Invalid event ID" }, { status: 400 });
        }

        const event = await Event.findById(id);
        if (!event) {
            return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
        }

        if (!event.participants.includes(resident.id)) {
            return NextResponse.json({ success: false, message: "User is not registered for this event" }, { status: 400 });
        }

        event.participants = event.participants.filter((id: mongoose.Types.ObjectId | string) =>
            id.toString() !== resident.id.toString()
        );
        await event.save();

        return NextResponse.json({ success: true, message: "Unregistered successfully." });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Server Error", error: error.message }, { status: 500 });
    }
}
