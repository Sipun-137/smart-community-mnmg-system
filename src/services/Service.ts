/* eslint-disable @typescript-eslint/no-explicit-any */
import { base_url } from "@/utils";
import axios from "axios";
import Cookies from "js-cookie";



export async function GetDashboardData(){
    try {
        const response = await axios.get(`${base_url}/dashboard`,{
            headers:{
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        return response.data;
    } catch (e: any) {
        console.log(e);
        return {success:false,message:"Service Error",error: e.message};
    }
 
}