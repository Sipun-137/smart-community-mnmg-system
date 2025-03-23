import { NextRequest, NextResponse } from "next/server";
import Service from "@/models/Service";
import { AuthUser } from "@/services/AuthService";


// 🏗 Provider Adds a New Service
export async function POST(req: NextRequest) {
    try {
        // ✅ Get Authenticated Provider
        const provider = await AuthUser(req);
        if (!provider) return NextResponse.json({ success: false, message: "UnAuthorized Provider" }, { status: 401 });
        if (provider.role !== "Provider") {
            return NextResponse.json({ success: false, message: "Access Denied: Providers only" }, { status: 403 });
        }

        // 📩 Extract Data from Request
        const { name, description, category, price, availability } = await req.json();

        // 🔍 Validate Required Fields
        if (!name || !category || !price || !availability?.days || !availability?.timeSlots) {
            return NextResponse.json({ status: false, message: "Missing required fields" });
        }

        // 🎯 Create New Service
        const newService = new Service({
            providerId: provider.id,
            name,
            description,
            category,
            price,
            availability,
            status: "active",
        });

        // 📌 Save to Database
        await newService.save();

        // 📤 Return Success Response
        return NextResponse.json({
            success: true,
            message: "Service added successfully",
            service: newService,
        });
    } catch (error) {
        console.error("Error adding service:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" });
    }
};


export async function GET(req: NextRequest) {
    try {

        const user = await AuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "UnAuthorized User" }, { status: 401 })
        if (!["Provider"].includes(user.role)) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })
        const services = await Service.find({ providerId: user.id }).populate("providerId", "name email");
        return NextResponse.json({ success: true, services }, { status: 200 });

    } catch (error) {
        console.error("Error adding service:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" });
    }
}