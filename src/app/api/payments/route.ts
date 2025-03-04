/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import connect from "@/services/Config";
import Payment from "@/models/Payment";
import { AuthUser } from "../auth/route";
import User from "@/models/User";


connect();

export async function GET(req: NextRequest) {
    try {
        const authuser = await AuthUser(req);
        if (!authuser) {
            return NextResponse.json({ success: false, message: "Unauthorized..!!!" })
        }
        const payments = await Payment.find({});
        return NextResponse.json({ success: true, payments })
    } catch (e: any) {
        console.log(e);
    }
}


export async function POST(req: NextRequest) {
    const { amount, paymentDate, modeOfPayment, invoiceUrl } = await req.json();
    try {
        const authuser = await AuthUser(req);
        if (!authuser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "unauthorized access...!!!"
                }
            )
        }
        const user = await User.findOne({ email: authuser?.email });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" })
        }
        const newpayment = await Payment.create({
            userId: user._id,
            amount: amount,
            paymentDate,
            modeOfPayment,
            invoiceUrl
        })
        if (newpayment) {
            return NextResponse.json({ success: true, message: "New payment added" })
        } else {
            return NextResponse.json({ success: false, message: "unable to add payment" })
        }


    } catch (e: any) {
        console.log(e.message)
        return NextResponse.json({ success: false, message: e.message })
    }

}


export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const status = searchParams.get("status")

        const authuser = await AuthUser(req);
        if (!authuser) {
            return NextResponse.json({
                success: false,
                message: "unauthorized access...!!!"
            })

        }
        const user = await User.findOne({ email: authuser?.email });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" })
        }

        if (!id || !status) {
            return NextResponse.json({ success: false, message: "id and status are required" })
        }
        const payment = await Payment.findOne({ _id: id });
        if (!payment) {
            return NextResponse.json({ success: false, message: "Payment not found" })
        }
        const res = await Payment.updateOne({ _id: id }, { $set: { status: status } }, { new: true })
        if (!res) {
            return NextResponse.json({ success: false, message: "" })
        }
        else {
            return NextResponse.json({ success: true, message: "successfully updated" });
        }

    } catch (e: any) {
        console.log(e.message);
        return NextResponse.json({ success: false, message: e.message });
    }
}





