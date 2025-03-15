/* eslint-disable @typescript-eslint/no-explicit-any */
import { base_url } from "@/utils/lib";
import axios from "axios";
import Cookies from "js-cookie";

interface FormDataType {
    title: string,
    description: string
}

export const GetAllNotice = async () => {
    try {
        const response = await axios.get(`${base_url}/notice`, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        })
        return response.data;

    } catch (e: any) {
        console.log(e);
    }
}

export const AddNotice = async (formData: FormDataType) => {
    try {
        const response = await axios.post(`${base_url}/notice`, formData, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        return response.data;
    } catch (e: any) {
        console.log(e)
    }
}

export const UpdateNotice = async (id: string, formData: FormDataType) => {
    try {
        const response = await axios.put(`${base_url}/notice?id=${id}`, formData, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        return response.data;
    } catch (e: any) {
        console.log(e)
    }
}


export const DeleteNotice = async (id: string) => {
    try {
        const response = await axios.delete(`${base_url}/notice?id=${id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        return response.data;
    } catch (e: any) {
        console.log(e)
    }
}

