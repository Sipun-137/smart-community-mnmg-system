/* eslint-disable @typescript-eslint/no-explicit-any */
import Visitor from "@/models/Visitor";
import { AuthUser } from "@/services/AuthService"
import { NextRequest, NextResponse } from "next/server";






export async function PATCH(req: NextRequest, { params
}: {
    params: Promise<{ id: string }>
}) {
    try {
        const user = await AuthUser(req);
        if (!user || !["Admin", "Security"].includes(user.role)) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 401 })
        }
        const { id } = await params;
        const { status } = await req.json();
        const result = await Visitor.findByIdAndUpdate(id, { status: status }, { new: true });
        if (result) {
            return NextResponse.json({ success: true, message: "status updated Successfully" }, { status: 200 })
        } else {
            return NextResponse.json({ success: false, message: "unable to update the status" });
        }
    } catch (e: any) {
        return NextResponse.json({ error: e.message, success: false, message: "Service Error" })
    }
}
