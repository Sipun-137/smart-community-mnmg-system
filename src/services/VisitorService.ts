/* eslint-disable @typescript-eslint/no-explicit-any */
import { base_url } from "@/utils";
import axios from "axios";
import Cookies from "js-cookie";

// implemented
export async function GetvisitorById(id: string) {
    try {
        const response = await axios.get(`${base_url}/visitors/${id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        console.log(response)
        return response.data;
    } catch (e: any) {
        console.log(e);
    }
}

// implemented
export async function GetAllVisitor() {
    try {
        const response = await axios.get(`${base_url}/visitors`, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        })
        return response.data
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}



// to be implemented
export async function UpdateTime(formData: { entryTime: Date | null, exitTime: Date }) {
    try {
        console.log(formData);
    } catch (e: any) {
        console.log(e);
    }
}




// implemented
export async function getAllVisitorsByUser() {
    try {
        const response = await axios.get(`${base_url}/visitors/get-my-visitor`, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        })
        return response.data
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}




// completed
export async function AddVisitor(formData: any) {
    try {
        const response = await axios.post(`${base_url}/visitors`, formData, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        })
        return response.data;
    } catch (e: any) {
        return { success: false, message: e.message }
    }
}


export async function RemoveVisitor(id: string) {
    try {
        const response = await axios.delete(`${base_url}/visitors/${id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        console.log(response)
        return response.data;
    } catch (e: any) {
        console.log(e);
        return { success: false, message: e.message }
    }
}

// admin service to update the status

export async function UpdateStatus(id: string, status: string) {
    try {
        const response = await axios.patch(`${base_url}/admin/visitor/${id}`, { status: status }, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        console.log(response)
        return response.data;
    } catch (e: any) {
        return { success: false, message: e.message }
    }
}



export async function updateEntrytime(id:string) {
    try {
        const response = await axios.patch(`${base_url}/visitors/time/${id}`,{status:"active"}, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        console.log(response)
        return response.data;
    } catch (e: any) {
        return { success: false, message: e.message }
    }
}


export async function updateExitTime(id:string){
    try {
        const response = await axios.put(`${base_url}/visitors/time/${id}`,{}, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        console.log(response)
        return response.data;
    } catch (e: any) {
        return { success: false, message: e.message }
    }
}