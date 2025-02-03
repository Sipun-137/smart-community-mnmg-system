/* eslint-disable @typescript-eslint/no-explicit-any */
import Visitor from "@/models/Visitor";
import connect from "@/services/Config";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

connect();

export interface VisitorInput {
    name: string;
    phone: string;
    apartmentNo: string;
    visitReason: string;
}


const generateQRCode = async (visitor: VisitorInput) => {
    const qrData = JSON.stringify(visitor);
    return await QRCode.toDataURL(qrData);
};

/**
 * POST: Register a new visitor 
 * the data should be {
 * name:"visitor name
 * phone number
 * appartment to visit
 * visitReason
 * entryTime
 * exitTIme
 * "
 * }
 */
export async function POST(req: Request) {
    try {
        const data = await req.json();
        const qrCode = await generateQRCode(data);
        const newVisitor = new Visitor({
            ...data,
            qrCode,
            entryTime: new Date(),
        });
        return NextResponse.json({ sucess: true, newVisitor }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

/**
 * Marks visitor check-out by setting the exit time
 * @param visitorId - Visitor's unique ID
 * @returns Checkout confirmation
 */
/**
 * PATCH: Mark visitor check-out
 */
export async function PATCH(req: Request) {
    try {
        const { visitorId } = await req.json();
        const visitor = await Visitor.findById(visitorId);
        if (!visitor || visitor.exitTime) throw new Error("Visitor not found or already checked out");

        visitor.exitTime = new Date();
        const res = await visitor.save();
        if (!res) {
            return NextResponse.json({ error: "Failed to update visitor" }, { status: 500 });
        } else {
            return NextResponse.json({ message: "Visitor checked out successfully", visitor });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}