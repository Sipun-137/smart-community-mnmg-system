/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Tabs,
  Tab,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Pencil, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import {
  AddNotice,
  DeleteNotice,
  GetAllNotice,
  UpdateNotice,
} from "@/services/NoticeService";
import toast from "react-hot-toast";

interface Notice {
  _id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newNotice, setNewNotice] = useState({ title: "", description: "" });

  // const router = useRouter();

  async function loadNotices() {
    try {
      const data = await GetAllNotice();
      console.log(data);
      setNotices(data.data);
    } catch (error) {
      console.error("Error loading notices:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadNotices();
  }, []);

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setActiveTab(2);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const result = await DeleteNotice(deleteId);
      console.log(result);
      if (result.success) {
        setNotices(notices.filter((notice) => notice._id !== deleteId));
      }
    } catch (error: any) {
      toast.error("Error deleting notice!!!");
      console.log(error);
    } finally {
      setOpenDialog(false);
    }
  };
  const handleUpdate = async () => {
    if (!editingNotice) return;

    const res = await UpdateNotice(editingNotice._id, {
      title: editingNotice.title,
      description: editingNotice.description,
    });
    if (res.success) {
      toast.success(res.messgae);
      loadNotices();
    } else {
      toast.error(res.message);
    }
  };

  const resetForm = () => {
    setEditingNotice(null);
    setActiveTab(0);
  };

  const handlePublish = async () => {
    const res = await AddNotice(newNotice);
    if (res.success) {
      toast.success(res.messgae);
      loadNotices();
      setNewNotice({ title: "", description: "" });
      setActiveTab(0);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <div className="by-white">
        <Box sx={{ minWidth: "800px" }}>
          <Typography variant="h4" gutterBottom>
            Admin Notice Management
          </Typography>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ color: "white" }}
          >
            <Tab label="All Notices" sx={{ color: "white" }} />
            <Tab label="Create Notice" sx={{ color: "white" }} />
            <Tab
              label="Edit Notice"
              disabled={!editingNotice}
            />
          </Tabs>

          <Box mt={3}>
            {activeTab === 0 && (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography variant="h6">All Notices</Typography>
                  <Button
                    variant="contained"
                    onClick={() => setActiveTab(1)}
                    startIcon={<Plus />}
                  >
                    Create New Notice
                  </Button>
                </Box>
                {loading ? (
                  <Typography align="center">Loading notices...</Typography>
                ) : notices.length === 0 ? (
                  <Typography align="center" color="textSecondary">
                    No notices found. Create your first notice!
                  </Typography>
                ) : (
                  notices.map((notice) => (
                    <Card key={notice._id} sx={{ mb: 2 }}>
                      <CardHeader
                        title={notice.title}
                        subheader={format(new Date(notice.date), "PPP")}
                      />
                      <CardContent>
                        <Typography color="textSecondary">
                          {notice.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          onClick={() => handleEdit(notice)}
                          startIcon={<Pencil />}
                        >
                          Edit
                        </Button>
                        <Button
                          color="error"
                          onClick={() => {
                            setDeleteId(notice._id);
                            setOpenDialog(true);
                          }}
                          startIcon={<Trash2 />}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  ))
                )}
              </>
            )}

            {activeTab === 1 && (
              <Card>
                <CardHeader title="Create New Notice" />
                <CardContent>
                  <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    value={newNotice.title}
                    required
                    onChange={(e: any) => {
                      setNewNotice({ ...newNotice, title: e.target.value });
                    }}
                  />
                  <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    required
                    value={newNotice.description}
                    onChange={(e: any) => {
                      setNewNotice({
                        ...newNotice,
                        description: e.target.value,
                      });
                    }}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => {
                      setActiveTab(0);
                      setNewNotice({ title: "", description: "" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={handlePublish}
                  >
                    Publish Notice
                  </Button>
                </CardActions>
              </Card>
            )}

            {activeTab === 2 && editingNotice && (
              <Card>
                <CardHeader title="Edit Notice" />
                <CardContent>
                  <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    defaultValue={editingNotice.title}
                    required
                  />
                  <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    defaultValue={editingNotice.description}
                    required
                  />
                </CardContent>
                <CardActions>
                  <Button onClick={resetForm}>Cancel</Button>
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={handleUpdate}
                  >
                    Update Notice
                  </Button>
                </CardActions>
              </Card>
            )}
          </Box>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This action cannot be undone. This will permanently delete the
                notice.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button color="error" onClick={handleDelete}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>
    </>
  );
}
