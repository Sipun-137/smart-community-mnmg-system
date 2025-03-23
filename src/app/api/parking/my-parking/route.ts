/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import ParkingSlot from "@/models/ParkingSlot";
import { AuthUser } from "@/services/AuthService";


export async function GET(req: NextRequest) {
    try {
        const user = await AuthUser(req);
        if (!user) return NextResponse.json({ message: "UnAuthorized", success: false }, { status: 401 });
        if (!['Resident'].includes(user?.role)) {
            return NextResponse.json({ message: "Forbidden", success: false }, { status: 403 });
        }
        const slots = await ParkingSlot.find({ reservedBy: user?.id });
        if (slots) {
            return NextResponse.json({ success: true, slots }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: "No Data Found" }, { status: 404 })
        }
    } catch (error: any) {
        return NextResponse.json({ status: false, message: "Failed to fetch parking slots", error: error.message }, { status: 500 });
    }
}

