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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error);
        return false;
    }
}



export async function getUserId(){
    try {
        const token = Cookies.get('token') as string;
        const extractAuthUserinfo: decodedToken | null = jwt.decode(token) as decodedToken | null;
        if (extractAuthUserinfo) {
            // Return the decoded token if authentication is successful
            return extractAuthUserinfo.id;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error);
        return false;
    }
}