/* eslint-disable @typescript-eslint/no-explicit-any */
import connect from "@/services/Config"
import { NextRequest, NextResponse } from "next/server";
import Notice from "@/models/Notice";
import { AuthUser } from "../auth/route";
connect();




export async function GET(req: NextRequest) {
    try {
        const authuser = await AuthUser(req);
        if (!authuser) NextResponse.json({ success: false, message: "unauthorized access" })
        const allNotice = await Notice.find({}).sort({ date: -1 });
        return NextResponse.json({ success: true, message: "", data: allNotice })
    } catch (e: any) {
        console.log(e.message)
        return NextResponse.json({ success: false, message: "Service Error" }, { status: 400 })
    }
}

export async function POST(req: NextRequest) {
    const { title, description } = await req.json();
    try {
        const authuser = await AuthUser(req);
        if (!authuser) {
            return NextResponse.json({ message: "unAuthorized Access", success: false }, { status: 401 })
        }
        if (authuser?.role !== "Admin") {
            return NextResponse.json({ message: "admin Access Required", success: false }, { status: 401 })
        }

        const newNotice = await Notice.create({ title, description, date: new Date() });
        if (newNotice) {
            return NextResponse.json({ message: "Notice Published", success: true }, { status: 201 });
        } else {
            return NextResponse.json({ success: false, message: "Unable to Publish the Notice" }, { status: 400 })
        }
    } catch (error: any) {
        console.log("Service Error")
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
            }, { status: 401 })
        }
        if (authuser?.role !== "Admin") {
            return NextResponse.json({
                sucess: false,
                message: "Admin Access Required"
            }, { status: 401 })
        }
        if (!id || !title || !description) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const updatedNotice = await Notice.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );
        if (!updatedNotice) {
            return NextResponse.json({
                message: "unable to update the Notice",
                success: false
            })
        } else {
            return NextResponse.json({
                message: "updaed Successfully",
                success: true,
                updatedNotice
            })
        }

    } catch (error: any) {
        console.log("service Error: " + error.message)
        return NextResponse.json({
            success: false, message: error.message,
        })

    }

}

export async function DELETE(req: NextRequest) {
    try {

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const authuser = await AuthUser(req);
        if (!authuser) {
            return NextResponse.json({
                success: false, mesage: "unauthorized access"
            }, { status: 401 })
        }
        if (authuser?.role !== "Admin") {
            return NextResponse.json({
                success: false,
                message: "Admin access Required"
            }, { status: 401 })

        }
        if (!id) {
            return NextResponse.json({
                sucess: false,
                messag: "id Required"
            })
        }
        const res = await Notice.findByIdAndDelete({ _id: id });
        if (!res) {
            return NextResponse.json({
                messasge: "Unable to delete Notice",
                success: false
            }, { status: 400 })
        } else {
            return NextResponse.json({
                success: true,
                message: "Notice deleted"
            }, { status: 201 })
        }
    } catch (error: any) {
        console.log(error.message)
        return NextResponse.json({
            message: error.message
        })
    }
}