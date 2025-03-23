/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
import connect from "@/services/Config";
import { AuthUser } from "@/services/AuthService";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connect();

    try {
        const user = await AuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
        const { id } = await params;
        const event = await Event.findById(id).populate("createdBy", "name email");
        if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });

        return NextResponse.json({ success: true, event }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
