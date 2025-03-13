"use client";

import { useEffect, useState,useRef } from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Print,
  Download,
  Home,
  Phone,
  Person,
  Description,
  AccessTime,
} from "@mui/icons-material";
import { GetvisitorById } from "@/services/VisitorService";
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface VisitorData {
  name: string;
  visitorId: string;
  residentId: string;
  phone: string;
  apartmentNo: string;
  visitReason: string;
  visitDate: string;
  qrCode: string;
}

interface visitorI {
  vid: string;
}

export default function VisitorCard({ vid }: visitorI) {
  const cardRef = useRef(null)
  // Sample visitor data
  const [visitorData, setVisitor] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vid) return;

    const fetchVisitorData = async () => {
      try {
        const response = await GetvisitorById(vid);
        const data = await response.visitor;

        setVisitor(data);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, [vid]);

  if (loading) return <p>Loading...</p>;
  if (!visitorData) return <p>No visitor found.</p>;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

    // Handle download functionality
    const handleDownload = async () => {
      if (!cardRef.current) return
      
      const canvas = await html2canvas(cardRef.current)
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height], // Use canvas dimensions for proper fit
      })
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
      pdf.save("Visitor_Pass.pdf")
    }

  return (
    <div className="flex justify-center p-4 print:p-0">
      <Card ref={cardRef} sx={{ maxWidth: 400, boxShadow: 3 }}>
        <CardHeader
          title="Visitor Pass"
          subheader={formatDate(visitorData.visitDate)}
          sx={{ backgroundColor: "primary.main", color: "white" }}
        />
        <CardContent>
          <div className="flex justify-center mb-4">
            <img
              src={visitorData.qrCode || "/placeholder.svg"}
              alt="Visitor QR Code"
              style={{
                width: 160,
                height: 160,
                border: "1px solid #ddd",
                borderRadius: 8,
              }}
            />
          </div>

          <Divider sx={{ mb: 2 }} />

          {[
            {
              label: "Visitor Name",
              value: visitorData.name,
              icon: <Person />,
            },
            {
              label: "Phone Number",
              value: visitorData.phone,
              icon: <Phone />,
            },
            {
              label: "Apartment",
              value: visitorData.apartmentNo,
              icon: <Home />,
            },
            {
              label: "Visit Reason",
              value: visitorData.visitReason,
              icon: <Description />,
            },
            {
              label: "Visit Time",
              value: formatTime(visitorData.visitDate),
              icon: <AccessTime />,
            },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              <Avatar sx={{ backgroundColor: "primary.main" }}>
                {item.icon}
              </Avatar>
              <div>
                <Typography variant="body2" color="textSecondary">
                  {item.label}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {item.value}
                </Typography>
              </div>
            </div>
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" color="textSecondary">
            Visitor ID: {visitorData.visitorId}
          </Typography>
          <br />
          <Typography variant="caption" color="textSecondary">
            Resident ID: {visitorData.residentId}
          </Typography>
        </CardContent>

        <CardActions
          sx={{ justifyContent: "space-between", p: 2 }}
          className="print:hidden"
        >
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrint}
          >
            Print Pass
          </Button>
          <Button variant="contained" startIcon={<Download />} onClick={handleDownload}>
            Download
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
