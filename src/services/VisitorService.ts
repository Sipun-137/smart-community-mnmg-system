import { base_url } from "@/utils/lib";
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        console.log(e);
    }
}


export async function getAllVisitorsByUser(){
    const response=await axios.get(`${base_url}/visitors/`,{
        headers:{
             Authorization: `Bearer ${Cookies.get('token')}`
        }
    })
    return response.data
}