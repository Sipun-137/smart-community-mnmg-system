/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Payment from "@/models/Payment";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { AuthUser } from "@/services/AuthService";
export async function POST(req: NextRequest) {
    try {
        const user = await AuthUser(req);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized Access" }, { status: 401 });
        }

        const formData = await req.formData();
        const amount = Number(formData.get("amount"));
        const modeOfPayment = formData.get("modeOfPayment") as string;
        const file = formData.get("proof") as File;
        const bookingRef= formData.get("bookingRef") as string;

        if (!amount || !modeOfPayment || !file) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Validate amount
        if (isNaN(amount) || amount <= 0) {
            return NextResponse.json({ success: false, message: "Invalid amount" }, { status: 400 });
        }

        // Validate mode of payment
        const validModes = ["UPI", "NetBanking", "BankTransfer", "Cash"];
        if (!validModes.includes(modeOfPayment)) {
            return NextResponse.json({ success: false, message: "Invalid mode of payment" }, { status: 400 });
        }

        // Store the proof image locally
        const uploadsDir = path.join(process.cwd(), "public/uploads/payments");
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

        const fileName = `${uuidv4()}-${file.name}`;
        const filePath = path.join(uploadsDir, fileName);
        const fileUrl = `/uploads/payments/${fileName}`;

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, fileBuffer);

        // Create a new payment record
        const newPayment = new Payment({
            userId: new mongoose.Types.ObjectId(user.id),
            amount,
            bookingRef,
            modeOfPayment,
            proofUrl: fileUrl,
            status: "Pending",
        });

        await newPayment.save();

        return NextResponse.json({ success: true, payment: newPayment });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const user = await AuthUser(req);

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const payments = await Payment.find({ userId: user.id });
        return NextResponse.json({ payments });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
