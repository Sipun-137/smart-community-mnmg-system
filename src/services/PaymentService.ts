/* eslint-disable @typescript-eslint/no-explicit-any */
import { base_url } from "@/utils";
import axios from "axios";
import Cookies from "js-cookie";


export async function GetAllPayments() {
  try {
    const response = await axios.get(`${base_url}/admin/payments`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (e: any) {
    console.log(e);
  }
}

export async function MakeAPayment(formData: any) {
  try {
    const response = await axios.post(`${base_url}/payments`, formData, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (e: any) {
    console.log(e);
  }
}

export async function getMyPayments() {
  try {
    const response = await axios.get(`${base_url}/payments`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (e: any) {
    console.log(e);
  }
}


export async function UpdatePayment(id: string, formdata: { status: string }) {
  try {
    const response = await axios.patch(`${base_url}/admin/payments?id=${id}`, formdata, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (e: any) {
    console.log(e);
  }
}

export async function GetPendingPayments() {
  try {
    const response = await axios.get(`${base_url}/payments/pending`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (e: any) {
    console.log(e);
  }
} 


export async function GenerateInvoice(id:string) {
  try {
    const response = await axios.get(`${base_url}/payments/invoice/${id}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (e: any) {
    console.log(e);
  }

}