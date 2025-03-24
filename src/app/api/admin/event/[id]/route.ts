/* eslint-disable @typescript-eslint/no-explicit-any */
// update the attendee of the events

import { AuthUser } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
import mongoose from "mongoose";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { participantIds } = await req.json();

        const user = await AuthUser(req);
        if (!user || user.role !== "Admin") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        if (!participantIds || !Array.isArray(participantIds)) {
            return NextResponse.json({ success: false, message: "Invalid participantIds" }, { status: 400 });
        }
        const { id } = await params;
        // TODO: Update attendees in the database
        await Event.findByIdAndUpdate(id, { participants: participantIds });

        return NextResponse.json({ success: true, message: "attendees updated successfully" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message, success: false, message: "internal Server Error" }, { status: 500 });
    }
}


export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await AuthUser(req);
        if (!user || user.role !== "Admin") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        const { id } = await params;
        const updatedData = await req.json();


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
        }

        const event = await Event.findById(id);
        if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

        const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, { new: true });

        return NextResponse.json({
            success: true,
            message: "Event updated successfully.",
            event: updatedEvent
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message, success: false, message: "internal Server Error" }, { status: 500 });
    }
}



export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await AuthUser(req);
        if (!user || user.role !== "Admin") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        const { id } = await params;
        const event = await Event.findById(id);
        if (!event) return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
        await Event.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Event deleted successfully" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message, success: false, message: "internal Server Error" }, { status: 500 });
    }
}