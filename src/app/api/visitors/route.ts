/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { AuthUser } from '../auth/route';
import Visitor from '@/models/Visitor';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const user = await AuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Unauthorizes access" }, { status: 401 })

        if (user?.role !== 'Resident') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        const { name, apartmentNo, visitDate, phone, visitReason } = await req.json();
        const visitorId = uuidv4();;

        const qrData = JSON.stringify({ visitorId, residentId: user.id, apartmentNo, phone, visitDate });
        const qrCode = await QRCode.toDataURL(qrData);

        const visitor = await Visitor.create({
            visitorId,
            residentId: user.id,
            name,
            phone,
            apartmentNo,
            visitReason,
            visitDate,
            qrCode
        });
        if (!visitor) {

            return NextResponse.json({ success: false, message: "unable to register visitor" }, { status: 400 });
        }
        return NextResponse.json({ success: true, qrCode, visitorId }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: 'Error generating QR code', error: error.message }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    try {
        const user = await AuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        console.log(user.role)
        if (user?.role === "Admin" || user?.role === "Security") {
            const visitors = await Visitor.find();
            return NextResponse.json({ success: true, visitors })
        }
        const visitors=await Visitor.find({residentId:user.id});
        return NextResponse.json({success:true,visitors})
    } catch (e: any) {
        return NextResponse.json({ sucess: false, message: "Service Error", error: e.message }, { status: 500 });
    }
}