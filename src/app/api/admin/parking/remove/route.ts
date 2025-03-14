/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthUser } from "@/app/api/auth/route";
import ParkingSlot from "@/models/ParkingSlot";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {

    try {
        const user = await AuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

        if (user?.role !== "Admin") return NextResponse.json({ success: false, message: "unAuthorized Access" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const slotId = searchParams.get('id');
        if (!slotId) return NextResponse.json({ success: false, message: "Slot ID required" }, { status: 400 });

        const result = await ParkingSlot.findByIdAndDelete(slotId);
        if (result) {
            return NextResponse.json({ success: true, message: "Slot removed successfully" }, { status: 200 })
        } else {
            return NextResponse.json({ success: false, message: "Unable to Remove" }, { status: 400 })
        }
    }
    catch (error: any) {
        return NextResponse.json({ success: false, mesage: "Failed to fetch available slots", error: error.message });
    }

}
