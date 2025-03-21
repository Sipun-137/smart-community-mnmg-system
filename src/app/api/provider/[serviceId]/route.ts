/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { AuthUser } from "../../auth/route";
import Service from "@/models/Service";
import connect from "@/services/Config";

connect();

// provider update the service
export async function PUT(req: NextRequest, { params }: {params: Promise<{ serviceId: string }> }) {
    const user = await AuthUser(req);
    if (!user || user.role !== "Provider") {
        return NextResponse.json({ success: false, message: "Access Denied: Providers only" }, { status: 403 });
    }
    try {
        const { name, description, category, price, availability, status } = await req.json();
        const {serviceId}=await params;
        const service = await Service.findById(serviceId);
        if (!service) {
            return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
        }

        // Ensure the provider is updating their own service
        if (service.providerId.toString() !== user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Update fields
        if (name) service.name = name;
        if (description) service.description = description;
        if (category) service.category = category;
        if (price !== undefined) service.price = price;
        if (availability) service.availability = availability;
        if (status) service.status = status;

        await service.save();

        return NextResponse.json({ success: true, message: "Service updated successfully", service }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

// ✅ Delete Service (DELETE) role Provider
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
    const user = await AuthUser(req);

    if (!user || user.role !== "Provider") {
        return NextResponse.json({ success: false, message: "Access Denied: Providers only" }, { status: 403 });
    }

    try {
        const { serviceId } = await params;
        const service = await Service.findById(serviceId);
        if (!service) {
            return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
        }

        // Ensure provider owns this service
        if (service.providerId.toString() !== user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        await service.deleteOne();

        return NextResponse.json({ success: true, message: "Service deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
