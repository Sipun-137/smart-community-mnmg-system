/* eslint-disable @typescript-eslint/no-explicit-any */
import ParkingSlot from "@/models/ParkingSlot";
import { AuthUser } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const user = await AuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })

        if (user?.role !== "Admin") return NextResponse.json({ success: false, message: "UnAuthorized Access" }, { status: 403 })

        const { slotNumber } = await req.json();
        if (!slotNumber) return NextResponse.json({ success: false, message: "Slot number required" }, { status: 403 });

        const slot = new ParkingSlot({ slotNumber, status: "AVAILABLE" });
        const response = await slot.save();
        if (response) {
            return NextResponse.json({success:true},{ status: 201 });
        } else {
            return NextResponse.json({ success: false, message: "Unable to create a Slot" }, { status: 400 })
        }

    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Failed to add slot", error: error.message }, { status: 500 });
    }

}
