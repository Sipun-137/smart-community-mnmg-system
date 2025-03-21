/* eslint-disable @typescript-eslint/no-explicit-any */
import { base_url } from "@/utils";
import axios from "axios";

export const LoginUser= async (formdata: {email:string,password:string}) =>{
    try {
        const result=await axios.post(`${base_url}/auth`,formdata);
        return result.data;
    } catch (error:any) {
        console.log(error);
    }
}