/* eslint-disable @typescript-eslint/no-explicit-any */
import Visitor from "@/models/Visitor";
import { AuthUser } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";




export async function PATCH(req: NextRequest, { params
}: {
    params: Promise<{ id: string }>
}) {
    try {
        const user = await AuthUser(req);
        if (!user || user.role !== "Security") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 401 });
        const { id } = await params;
        const {status}=await req.json();
        const response = await Visitor.findByIdAndUpdate(id, { entryTime: Date.now(),status:status }, { new: true })
        console.log(response);
        if (response) {
            return NextResponse.json({ success: true, message: "successfully updated Entry Time" }, { status: 200 })
        } else {
            return NextResponse.json({ success: false, message: "Unable to update" }, { status: 400 })
        }
    } catch (e: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: e.message }, { status: 500 })
    }

}



export async function PUT(req: NextRequest, { params
}: {
    params: Promise<{ id: string }>
}) {
    try {
        const user = await AuthUser(req);
        if (!user || user.role !== "Security") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 401 });
        const { id } = await params;
        const response = await Visitor.findByIdAndUpdate(id, { exitTime: Date.now(), status: "completed" }, { new: true });
        if (response) {
            return NextResponse.json({ success: true, message: "successfully updated Time and status" }, { status: 200 })
        } else {
            return NextResponse.json({ success: false, message: "Unable to update" }, { status: 400 })
        }

    } catch (e: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: e.message }, { status: 500 })
    }

}