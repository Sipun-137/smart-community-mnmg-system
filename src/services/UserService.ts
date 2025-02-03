/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const base_url = 'http://localhost:3000'

export async function AddUser() {
    try {
        const response = await axios.post(`${base_url}/api/user`);
        return response.data;
    } catch (e: any) {
        console.log(e);
    }
}

export async function UpdateUser() {
    try {
        const response=await axios.put(`${base_url}/api/user`)
        return response.data;
    } catch (e: any) {
        console.log(e)
    }
}

export async function DeleteUser() {
    try {
        const response=await axios.delete(`${base_url}/api/user`);
        return response.data;
    } catch (e:any) {
        console.log(e);
    }
}