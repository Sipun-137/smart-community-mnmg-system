/* eslint-disable @typescript-eslint/no-explicit-any */
import Service from "@/models/Service";
import { NextRequest, NextResponse } from "next/server";
import { AuthUser } from "../auth/route";


export async function GET(req: NextRequest) {

    try {
        const user = await AuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "UnAuthorized User" }, { status: 401 })
        if (!["Admin", "Resident"].includes(user.role)) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })
        const services = await Service.find({ status: "active" }).populate("providerId", "name email");
        return NextResponse.json({ success: true, services }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}



