/* eslint-disable @typescript-eslint/no-explicit-any */

import { base_url } from "@/utils"
import axios from "axios"
import Cookies from "js-cookie"


interface Service {
    name: string;
    description: string;
    category: string;
    price: number;
    availability: {
        days: string[];
        timeSlots: string[];
    };
}


export async function GetAllServices() {
    try {
        const response = await axios.get(`${base_url}/service`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        })
        return response.data;
    } catch (error: any) {
        return { success: false, message: "service Error", error: error.message }
    }
}

export async function AddAService(service: Service) {
    try {
        const response = await axios.post(`${base_url}/provider`, service, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        })
        return response.data;
    } catch (error: any) {
        console.log(error);
        return { success: false, message: "service Error", error: error.message }
    }
}

export async function GetMyAllServices() {
    try {
        const response = await axios.get(`${base_url}/provider`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        })
        return response.data;
    } catch (error: any) {
        return { success: false, message: "service Error", error: error.message }
    }
}



export async function UpdateService(formdata: Service, id: string) {
    try {
        const response = await axios.put(`${base_url}/provider/${id}`, formdata, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        })
        return response.data;
    } catch (error: any) {
        return { success: false, message: "service Error", error: error.message }
    }
}


export async function DeleteAService(id: string) {
    try {
        const response = await axios.delete(`${base_url}/provider/${id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        })
        return response.data;
    } catch (error: any) {
        return { success: false, message: "service Error", error: error.message }
    }
}