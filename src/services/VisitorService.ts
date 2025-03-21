/* eslint-disable @typescript-eslint/no-explicit-any */
import { base_url } from "@/utils";
import axios from "axios";
import Cookies from "js-cookie";

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

// get all visitor

export async function GetAllVisitor() {
    try {

    } catch (error: any) {
        console.log(error);
    }
}


export async function UpdateTime(formData:{entryTime:Date|null,exitTime:Date}){
    try {
        console.log(formData);
    } catch (e:any) {
        console.log(e);
    }
}
// visitor update the entry time and update the exit time


export async function getAllVisitorsByUser() {
    const response = await axios.get(`${base_url}/visitors/`, {
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
        }
    })
    return response.data
}