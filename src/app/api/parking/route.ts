/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { AuthUser } from "../auth/route";
import ParkingSlot from "@/models/ParkingSlot";
import mongoose from "mongoose";

export  async function GET(req: NextRequest) {
  try {
    const user = await AuthUser(req);
    if (!user) return NextResponse.json({ message: "UnAuthorized", success: false }, { status: 401 });

    if (!['Admin', 'Security'].includes(user?.role)) {
      return NextResponse.json({ message: "Forbidden", success: false }, { status: 403 });
    }
    const slots = await ParkingSlot.find().populate("reservedBy","name");
    if (slots) {
      return NextResponse.json({ success: true, slots }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "No Data Found" }, { status: 404 })
    }
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Failed to fetch parking slots", error: error.message }, { status: 500 });
  }
}



export async function POST(req: NextRequest) {

  try {
      const user = await AuthUser(req);
      if (!user) return;
      const { slotId, vehicleNumber } = await req.json();
      if (!slotId ) return NextResponse.json({ success: false, message: "Missing fields" }, { status: 401 });

      const slot = await ParkingSlot.findById(slotId);
      if (!slot || slot.status !== "AVAILABLE") return NextResponse.json({ message: "Slot Not Found ", success: false }, { status: 403 })

      slot.status = "RESERVED";
      slot.reservedBy = new mongoose.Types.ObjectId(user?.id);
      slot.vehicleNumber = vehicleNumber;
      slot.reservedAt = new Date();
      const res = await slot.save();

      if (res) {
          return NextResponse.json({ success: true, message: "successfully reserved the place" }, { status: 201 });
      }

  } catch (error: any) {
      return NextResponse.json({ error: error.message, success: false, message: "Service Error" }, { status: 500 })
  }
}


export async function PATCH(req: NextRequest) {
  try {
      const { slotId } = await req.json();
      const user = await AuthUser(req);
      if (!user) return NextResponse.json({ success: false, mesage: "UnAuthorized" }, { status: 401 })

      if (!["Resident", "Security"].includes(user?.role)) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

      const slot = await ParkingSlot.findById(slotId);
      if (!slot) return NextResponse.json({ success: true })

    if(slot.status==="AVAILABLE") return NextResponse.json({success:false,message:"Already Free Space"},{status:404})

      slot.status = "AVAILABLE";
      slot.reservedBy = undefined;
      slot.vehicleNumber = undefined;
      slot.reservedAt = undefined;
      const res = await slot.save();
      if (!res) return NextResponse.json({ success: false, message: "Error Releasing The Slot" }, { status: 400 })
      return NextResponse.json({ success: false, message: "Succssfullyy released Slot" }, { status: 200 });
  } catch (e: any) {
      return NextResponse.json({ success: false, message: "Service Error", error: e.message }, { status: 500 })
  }
}
