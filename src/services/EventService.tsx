/* eslint-disable @typescript-eslint/no-explicit-any */
import { base_url } from "@/utils";
import axios from "axios";
import Cookies from "js-cookie";

interface EventType {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  eventType: "PUBLIC" | "PRIVATE";
  maxParticipants: number;
}

export async function CreateEvent(formData: EventType) {
  try {
    const response = await axios.post(`${base_url}/admin/event`, formData, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (e: any) {
    return {success:false,message:"service Error",error:e.message}
  }
}


export async function GetAllEvent() {
    try {
      const response = await axios.get(`${base_url}/events`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    } catch (e: any) {
      return {success:false,message:"service Error",error:e.message}
    }
  }
  
export async function AssignAttendee(participantIds:string[],id:string){
  try {
    const response = await axios.post(`${base_url}/admin/event/${id}`, {participantIds}, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (e: any) {
    return {success:false,message:"service Error",error:e.message}
  }
}

export async function DeleteEvent(id:string) {
  try {
    const response = await axios.delete(`${base_url}/admin/event/${id}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (e: any) {
    return {success:false,message:"service Error",error:e.message}
  }
}

export async function UpdateEvent(formData:any,id:string){
  try {
    const response = await axios.put(`${base_url}/admin/event/${id}`,formData, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (e: any) {
    return {success:false,message:"service Error",error:e.message}
  }
}
