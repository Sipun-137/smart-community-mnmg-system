/* eslint-disable @typescript-eslint/no-explicit-any */

import { base_url } from "@/utils/lib";
import axios from "axios";
import Cookies from "js-cookie";

export async function GetAvailableSlots() {
  try {
    const response = await axios.get(`${base_url}/parking/available`,{
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    return response.data;
  } catch (e: any) {
    console.log(e);
  }
}

export async function GetAllSlots() {
    try {
      const response = await axios.get(`${base_url}/parking`,{
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
  

export async function ReserveASlot(formData: {
  slotId: string;
  vehicleNumber: string|null;
}) {
  try {
    const response = await axios.post(`${base_url}/parking`, formData, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (e: any) {
    console.log(e);
  }
}


export async function ReleaseASlot(formData: {
    slotId: string;
  }) {
    try {
      const response = await axios.patch(`${base_url}/parking`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }


  export async function GetMyParkings() {
    try {
      const response = await axios.get(`${base_url}/parking/my-parking`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }


  export async function AddSlot(formData: {
    slotNumber: string;
  }) {
    try {
      const response = await axios.post(`${base_url}/admin/parking/add`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }


  export async function RemoveSlot( 
    slotId: string
  ) {
    try {
      const response = await axios.delete(`${base_url}/admin/parking/remove?id=${slotId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }



