/* eslint-disable @typescript-eslint/no-explicit-any */
import connect from "@/services/Config"
import { NextRequest, NextResponse } from "next/server";
import Notice from "@/models/Notice";
import { AuthUser } from "@/services/AuthService";
connect();

export async function GET(req: NextRequest) {
    try {
        const authuser = await AuthUser(req);
        if (!authuser) {
            return NextResponse.json({ success: false, message: "unauthorized access" }); // Added return
        }
        const allNotice = await Notice.find({}).sort({ date: -1 });
        return NextResponse.json({ success: true, message: "", data: allNotice });
    } catch (e: any) {
        console.log(e.message);
        return NextResponse.json({ success: false, message: "Service Error" }, { status: 400 });
    }
}

export async function POST(req: NextRequest) {
    const { title, description } = await req.json();
    try {
        const authuser = await AuthUser(req);
        if (!authuser) {
            return NextResponse.json({ message: "unAuthorized Access", success: false }, { status: 401 });
        }
        if (authuser?.role !== "Admin") {
            return NextResponse.json({ message: "admin Access Required", success: false }, { status: 401 });
        }
        if (!title || !description) { // Added validation for title and description
            return NextResponse.json({ success: false, message: "Title and Description are required" }, { status: 400 });
        }

        const newNotice = await Notice.create({ title, description, date: new Date() });
        if (newNotice) {
            return NextResponse.json({ message: "Notice Published", success: true }, { status: 201 });
        } else {
            return NextResponse.json({ success: false, message: "Unable to Publish the Notice" }, { status: 400 });
        }
    } catch (error: any) {
        console.log("Service Error");
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const { title, description } = await req.json();
        const authuser = await AuthUser(req);
        if (!authuser) {
            return NextResponse.json({
                success: false,
                message: "UnAuthorized request"
            }, { status: 401 });
        }
        if (authuser?.role !== "Admin") {
            return NextResponse.json({
                success: false,
                message: "Admin Access Required"
            }, { status: 401 });
        }
        if (!id || !title || !description) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const updatedNotice = await Notice.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );
        if (!updatedNotice) {
            return NextResponse.json({
                message: "Unable to update the Notice",
                success: false
            }, { status: 400 }); // Added status code
        } else {
            return NextResponse.json({
                message: "Updated Successfully", // Fixed typo
                success: true,
                updatedNotice
            }, { status: 200 }); // Added status code
        }

    } catch (error: any) {
        console.log("Service Error: " + error.message);
        return NextResponse.json({
            success: false, message: error.message,
        }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const authuser = await AuthUser(req);
        if (!authuser) {
            return NextResponse.json({
                success: false, message: "unauthorized access" // Fixed typo
            }, { status: 401 });
        }
        if (authuser?.role !== "Admin") {
            return NextResponse.json({
                success: false,
                message: "Admin access Required"
            }, { status: 401 });
        }
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "ID is required" // Fixed typo
            }, { status: 400 }); // Added status code
        }
        const res = await Notice.findByIdAndDelete({ _id: id });
        if (!res) {
            return NextResponse.json({
                message: "Unable to delete Notice", // Fixed typo
                success: false
            }, { status: 400 });
        } else {
            return NextResponse.json({
                success: true,
                message: "Notice deleted"
            }, { status: 200 }); // Changed status code to 200
        }
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 400 });
    }
}