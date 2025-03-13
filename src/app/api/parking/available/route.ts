/* eslint-disable @typescript-eslint/no-explicit-any */
import ParkingSlot from "@/models/ParkingSlot";
import { NextRequest, NextResponse } from "next/server";
import { AuthUser } from "../../auth/route";

export async function GET(req: NextRequest) {

    try {
        const user = await AuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Unauthorized Access" }, { status: 403 });

        const availableSlots = await await ParkingSlot.find({ status: "AVAILABLE" });

        if (availableSlots) {
            return NextResponse.json({ availableSlots }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, mesage: "No slots are available" }, { status: 200 });
        }
    }
    catch (error: any) {
        return NextResponse.json({ success: false, mesage: "Failed to fetch available slots", error: error.message });
    }

}
