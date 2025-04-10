/* eslint-disable @typescript-eslint/no-explicit-any */
import { base_url } from "@/utils";
import axios from "axios";
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'
import Cookies from "js-cookie";

interface decodedToken {
    id: string,
    email: string,
    role: string
}

export const LoginUser = async (formdata: { email: string, password: string }) => {
    try {
        const result = await axios.post(`${base_url}/auth`, formdata);
        return result.data;
    } catch (error: any) {
        console.log(error);
        return { success: false, message: "Service Error", error: error.message }
    }
}


export async function AuthUser(req: NextRequest) {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return false
    }
    try {
        const extractAuthUserinfo: decodedToken | null = jwt.decode(token) as decodedToken | null;
        if (extractAuthUserinfo) {
            // Return the decoded token if authentication is successful
            return extractAuthUserinfo;
        }
    } catch (error: any) {
        console.log(error);
        return false;
    }
}



export async function getUserId() {
    try {
        const token = Cookies.get('token') as string;
        const extractAuthUserinfo: decodedToken | null = jwt.decode(token) as decodedToken | null;
        if (extractAuthUserinfo) {
            // Return the decoded token if authentication is successful
            return {success:true,id:extractAuthUserinfo.id};
        }else {
            return {success:false,message:"Invalid Token"};
        }
    } catch (error: any) {
        console.log(error);
        return { success: false, message: "Service Error", error: error.message }
    }
}


export async function getProfileDetails() {
    const token = Cookies.get('token') as string;
    try {
        const result = await axios.get(`${base_url}/auth`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return result.data;
    } catch (error: any) {
        console.log(error);
        return { success: false, message: "Service Error", error: error.message }
    }
}



export async function UpdatePassword(newPassword:string,oldPassword:string){
    try {
        const token = Cookies.get('token') as string;
        const result = await axios.patch(`${base_url}/user`, { newPassword, oldPassword }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return result.data;
    } catch (error:any) {
        console.log(error);
        return { success: false, message: error.message, error: error.message }
    }
}