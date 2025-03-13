/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Payment from "@/models/Payment";
import { AuthUser } from "../../auth/route";

export async function GET(req: NextRequest) {
    const user = await AuthUser(req);
    if (!user) {
        return NextResponse.json({ success: false, message: "Unauthorized Access" }, { status: 401 })
    }
    if (user?.role !== "Admin") return NextResponse.json({ success: false, message: "Admin Access Required" }, { status: 401 });

    try {
        const payments = await Payment.find().populate("userId", "name email");
        return NextResponse.json({ payments });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const user = await AuthUser(req);

    if (!user) {
        return NextResponse.json({ success: false, message: "Unauthorizes aceess" }, { status: 401 })
    }

    if (user?.role !== "Admin") {
        return NextResponse.json({ success: false, message: "Admin Access Required" }, { status: 401 })
    }

    const { status } = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!["Verified", "Rejected"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    try {
        const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true });
        return NextResponse.json({ success: true, payment });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
