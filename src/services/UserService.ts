/* eslint-disable @typescript-eslint/no-explicit-any */
import { base_url } from "@/utils/lib";
import axios from "axios";
import Cookies from "js-cookie";



export async function GetUsers(){
    try {
        const response = await axios.get(`${base_url}/user`,{
            headers:{
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        return response.data;
    } catch (e: any) {
        console.log(e);
    }
}

export async function AddUser(formData:any) {
    try {
        const response = await axios.post(`${base_url}/user`,formData,{
            headers:{
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        return response.data;
    } catch (e: any) {
        console.log(e);
    }
}

export async function UpdateUser(formData:any,id:string) {
    try {
        const response=await axios.put(`${base_url}/user?id=${id}`,formData,{
            headers:{
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        })
        return response.data;
    } catch (e: any) {
        console.log(e)
    }
}

export async function DeleteUser(id:string) {
    try {
        const response=await axios.delete(`${base_url}/user?id=${id}`,{
            headers:{
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        });
        return response.data;
    } catch (e:any) {
        console.log(e);
    }
}