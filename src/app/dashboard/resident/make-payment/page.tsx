/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button, TextField, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { MakeAPayment } from "@/services/PaymentService";

export default function MakePayment() {
  const [amount, setAmount] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState("UPI");
  const [proofFile, setProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setError("");
    setProofFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      } else {
        setPreviewUrl(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!proofFile) {
      toast.error("Please upload proof of payment");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("modeOfPayment", modeOfPayment);
    formData.append("proof", proofFile);
    try {
      const response = await MakeAPayment(formData);
      console.log(response);
      setAmount("");
      setModeOfPayment("UPI");
      setProofFile(null);
      setPreviewUrl(null);
    } catch (e: any) {
      console.log(e);
      toast.error("Failed to submit payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center text-black">
        <div className="bg-white p-3 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold">Make a Payment</h2>
          <p className="text-gray-500 text-sm mb-4">
            Submit your payment details and upload proof of payment
          </p>

          {error && (
            <div className="text-red-600 flex items-center gap-2 text-sm mb-3">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <div>
              <label className="block font-medium text-sm">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["UPI", "NetBanking", "BankTransfer", "Cash"].map((method) => (
                  <button
                    type="button"
                    key={method}
                    className={`border p-2 rounded-md text-sm font-medium transition ${
                      modeOfPayment === method
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    onClick={() => setModeOfPayment(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-sm">Payment Proof</label>
              <input
                type="file"
                accept="image/*"
                hidden
                id="proof-upload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="proof-upload"
                className="border border-dashed border-gray-300 flex flex-col items-center justify-center py-10 rounded-md cursor-pointer text-gray-500 hover:border-gray-400 transition"
              >
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-sm">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs">PNG, JPG or JPEG (max 5MB)</span>
              </label>
            </div>

            {previewUrl && (
              <div className="relative mt-2">
                <Image
                  src={previewUrl}
                  alt="Payment proof preview"
                  width={400}
                  height={300}
                  className="w-full rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                  onClick={() => {
                    setProofFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  Remove
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              className="bg-black hover:bg-gray-800 text-white w-full"
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Submit Payment"}
            </Button>
          </form>
        </div>
      </div>
      <div className="text-white text-center mt-4">
        <hr />
        <p className="m-2 font-bold font-sans uppercase">My Payments</p>
        <hr />
        <div></div>
      </div>
    </>
  );
}
