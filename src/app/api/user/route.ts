/* eslint-disable @typescript-eslint/no-explicit-any */
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/services/Config";
import bcryptjs from "bcryptjs";
import { AuthUser } from "@/services/AuthService";

connect()

export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
    const data = await req.json();
    try {
        const auth = await AuthUser(req);
        if (!auth) {
            return NextResponse.json({
                success: false,
                mesage: "Unauthorized Access",
            })
        }
        if (auth?.role !== "Admin") {
            return NextResponse.json({
                success: false,
                message: "Admin Access is Required"
            })
        }
        const { name, email, password, role, apartmentNo, phone } = data;

        const userExisted = await User.findOne({ email: email }).select("-password");
        console.log(userExisted);
        if (userExisted) {
            return NextResponse.json({ success: false, message: "user already exists" }, { status: 404 });
        }
        const hashPassword = await bcryptjs.hash(password, 12);
        const newlyAddedUser = await User.create({ name, email, password: hashPassword, role, apartmentNo, phone });
        if (!newlyAddedUser) {
            return NextResponse.json({ success: false, message: "User Created Successfully" }, { status: 404 });
        } else {
            return NextResponse.json({ success: true, message: "User Added Successfully" }, { status: 200 });
        }
    } catch (e: any) {
        console.log(e)
        return NextResponse.json({ success: false, error: e.message })
    }
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    try {
        const auth = await AuthUser(req);
        if (!auth) {
            return NextResponse.json({
                success: false,
                mesage: "Unauthorized Access",
            })
        }
        if (auth?.role !== "Admin") {
            return NextResponse.json({
                success: false,
                message: "Admin Access is Required"
            })
        }
        if (!id) {
            return NextResponse.json({ success: false, message: "id required to update" }, { status: 404 })
        }
        const result = await User.findByIdAndDelete(id);
        if (!result) {
            return NextResponse.json({ success: false, message: "Unable to Delete User" }, { status: 404 });
        }
        else {
            return NextResponse.json({ success: true, message: "User Deleted Successfully" }, { status: 200 });
        }
    } catch (e: any) {
        console.log(e)
    }
}


export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    try {
        const auth = await AuthUser(req);
        if (!auth) {
            return NextResponse.json({
                success: false,
                mesage: "Unauthorized Access",
            })
        }
        if (auth?.role !== "Admin") {
            return NextResponse.json({
                success: false,
                message: "Admin Access is Required"
            })
        }
        if (!id) {
            return NextResponse.json({ success: false, message: "id required to update" }, { status: 404 })
        }
        const data = await req.json();

        const filter = { _id: id };
        const update = {
            $set: data
        };
        const result = await User.updateOne(filter, update);
        if (!result) {
            return NextResponse.json({ success: false, message: "Unable to update the User ! try after sometime" }, { status: 404 })
        }
        else {
            return NextResponse.json({ success: true, message: "User Updated Successfully" }, { status: 200 })
        }
    } catch (e: any) {
        console.log(e);
    }
}


export async function GET(req: NextRequest) {
    try {
        const auth = await AuthUser(req);
        if (!auth) {
            return NextResponse.json({
                success: false,
                mesage: "Unauthorized Access",
            })
        }
        if (auth?.role !== "Admin") {
            return NextResponse.json({
                success: false,
                message: "Admin Access is Required"
            })
        }
        const users = await User.find({}, '-password');
        return NextResponse.json({ success: true, users });
    } catch (e: any) {
        console.log(e)
        return NextResponse.json({ success: false, error: e.message })
    }
}



export async function PATCH(req: NextRequest) {
    try {
        const auth = await AuthUser(req);
        if (!auth) {
            return NextResponse.json({
                success: false,
                mesage: "Unauthorized Access",
            }, { status: 401 })
        }
        const { newPassword,oldPassword } = await req.json();
        if (!newPassword || !oldPassword) {
            return NextResponse.json({ success: false, message: "New Password and Old Password are required" }, { status: 404 })
        }
        const user = await User.findById(auth.id);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
        }
        const isMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: "Old Password is incorrect" }, { status: 404 })
        }
        const hashPassword = await bcryptjs.hash(newPassword, 12);
        const newHasedPassword = hashPassword;
        if (newHasedPassword === user.password) {
            return NextResponse.json({ success: false, message: "New Password cannot be the same as Old Password" }, { status: 404 })
        }
           
        const result = await User.findByIdAndUpdate(auth.id, { password: newHasedPassword }, { new: true });
        if (result) {
            return NextResponse.json({ success: true, message: "Password Updated Successfully" }, { status: 200 })
        } else {
            return NextResponse.json({ success: false, message: "Unable to update the password" }, { status: 404 })
        }

    } catch (e: any) {
        console.log(e);
        return NextResponse.json({ success: false, error: e.message, message: e.message },{status:500})
    }
}