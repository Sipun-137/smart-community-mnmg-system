/* eslint-disable @typescript-eslint/no-explicit-any */

import { base_url } from "@/utils";
import axios from "axios";
import Cookies from "js-cookie";



export async function BookService(formData: { serviceId: string, date: Date, timeSlot: string, notes: string }) {
    try {
        const response = await axios.post(`${base_url}/service/booking`, formData, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        return response.data;
    } catch (e: any) {
        console.log(e);
        return { success: false, message: e.message }
    }
}


export async function GetMyBookings() {
    try {
        const response = await axios.get(`${base_url}/service/booking`, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        return response.data;
    } catch (e: any) {
        console.log(e);
        return { success: false, message: e.message }
    }
}


export async function CancelBooking(id:string) {
    try {
        const response = await axios.delete(`${base_url}/service/booking/${id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        return response.data;
    } catch (e: any) {
        console.log(e);
        return { success: false, message: e.message }
    }
}