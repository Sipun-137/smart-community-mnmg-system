/* eslint-disable @typescript-eslint/no-explicit-any */
import Booking from "@/models/Booking";
import Notice from "@/models/Notice";
import ParkingSlot from "@/models/ParkingSlot";
import { AuthUser } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        const user=await AuthUser(req);
        if(!user){
            return NextResponse.json({success:false,message:"Unauthorized"}, {status: 401});
        }
        const bookingsCompleted=await Booking.find({status:"completed"}).countDocuments();
        const bookingPending=await Booking.find({status:"pending"}).countDocuments();
        const parkingOccupied=await ParkingSlot.find({status:"RESERVED"}).countDocuments();
        const notices=await Notice.find().sort({ date: -1 });



        return NextResponse.json({success:true,message:"Dashboard data fetched successfully",data:{bookingsCompleted,bookingPending,parkingOccupied,notices}}, {status: 200});


    } catch (e:any) {
        console.log(e.message);
        return NextResponse.json({success:false,message:"Service Error",error: e.message}, {status: 500});
    }
}