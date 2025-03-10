"use client";
import NoticeCard from "@/components/ui/NoticeCard";
import { GetAllNotice } from "@/services/NoticeService";
import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface NoticeI {
  _id: string;
  title: string;
  description: string;
  date: string;
}

export default function Page() {
  const [notices, setNotices] = useState<NoticeI[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<NoticeI>({
    _id: "",
    title: "",
    date: "",
    description: "",
  });
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    async function getNotice() {
      const response = await GetAllNotice();
      setNotices(response.data);
    }

    getNotice();
  }, []);

  return (
    <>
      <div className="font-sans">Notices</div>
      <div className="m-3 p-2 flex flex-col gap-4 ">
        {/* {
          notices.length&&notices.map((notice:NoticeI)=><NoticeCard key={notice._id} title={notice.title} date={notice.date} description={notice.description}/>)
        } */}
        {notices.length &&
          notices.map((notice: NoticeI) => (
            <div
              key={notice._id}
              className="w-full border border-white p-4 rounded-md flex flex-row justify-between"
            >
              <div>
                <Typography variant="h6">{notice.title}</Typography>
                <p>{notice.description.slice(0, 100) + "  \t\nRead More..."}</p>
              </div>
              <div>
                <Button
                variant="outlined"
                color="success"
                  onClick={() => {
                    setSelectedNotice(notice);
                    handleOpen();
                  }}
                >
                  Read
                </Button>
              </div>
            </div>
          ))}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
          <NoticeCard
            title={selectedNotice.title}
            date={selectedNotice.date}
            description={selectedNotice.description}
          />
          <Divider />
          <Button variant="outlined" onClick={handleClose}>
            Back To All Notice
          </Button>
        </Box>
      </Modal>
    </>
  );
}
