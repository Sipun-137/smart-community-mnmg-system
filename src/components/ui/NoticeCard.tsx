import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { Notifications, CalendarToday, AccessTime } from "@mui/icons-material";
import React from "react";

export default function NoticeCard(notice: {
  title: string;
  date: string;
  description: string;
}) {
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Format time from date string
  function formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  return (
    <Box sx={{ maxWidth: 700, mx: "auto", py: 4, px: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Notifications color="primary" />
        <Typography variant="h4" fontWeight="bold">
          Notice Details
        </Typography>
      </Box>

      <Card>
        <CardHeader
          title={
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5">{notice.title}</Typography>
            </Box>
          }
          subheader={
            <Box display="flex" gap={2} mt={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarToday fontSize="small" />
                <Typography variant="body2">
                  {formatDate(notice.date)}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTime fontSize="small" />
                <Typography variant="body2">
                  {formatTime(notice.date)}
                </Typography>
              </Box>
            </Box>
          }
        />
        <CardContent>
          <Typography variant="subtitle1" fontWeight="medium">
            Description
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {notice.description}
          </Typography>

          <Typography variant="subtitle1" fontWeight="medium">
            Details
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            whiteSpace="pre-line"
          >
            {notice.description}
          </Typography>

         
        </CardContent>
        
      </Card>
    </Box>
  );
}
