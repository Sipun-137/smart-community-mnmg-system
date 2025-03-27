import Visitor from "@/models/Visitor";
import { AuthUser } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(req: NextRequest) {
    try {
        const user = await AuthUser(req);
        if (!user || user.role !== "Resident") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        const visitors = await Visitor.find({ residentId: user.id });
        return NextResponse.json({ success: true, visitors })
    } catch (e: any) {
        console.log(e.message)
        return NextResponse.json({ sucess: false, message: "Service Error", error: e.message }, { status: 500 });
    }
}