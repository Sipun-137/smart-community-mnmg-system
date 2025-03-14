/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { AddSlot, GetAllSlots, RemoveSlot } from "@/services/ParkingService";
import toast, { Toaster } from "react-hot-toast";

interface SlotI {
  _id: string;
  slotNumber: string;
  status: string;
}

export default function Page() {
  const [slots, setSlots] = useState<SlotI[]>([]);
  const [newSlotNumber, setNewSlotNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    slot: null | SlotI;
  }>({ open: false, slot: null });

  useEffect(() => {
    loadParkingSlots();
  }, []);

  async function loadParkingSlots() {
    setIsLoading(true);
    try {
      const data = await GetAllSlots();
      if (data.success) {
        setSlots(data.slots);
      } else {
        toast.error("Failed to load parking slots");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddSlot(e: any) {
    e.preventDefault();
    if (!newSlotNumber.trim()) {
      toast.error("Slot number cannot be empty");
      return;
    }

    setIsAdding(true);
    try {
      const res = await AddSlot({ slotNumber: newSlotNumber });
      setNewSlotNumber("");
      loadParkingSlots();
      if (!res.success) {
        toast.error("Failed to add parking slot");
      } else {
        toast.success("Slot Added Successfully");
      }
    } finally {
      setIsAdding(false);
    }
  }

  async function handleDeleteSlot() {
    if (!deleteDialog.slot) return;
    setIsDeleting(deleteDialog.slot._id);
    try {
      await RemoveSlot(deleteDialog.slot._id);
      toast.success(
        `Parking slot ${deleteDialog.slot.slotNumber} has been deleted`
      );
      loadParkingSlots();
    } catch (e: any) {
      toast.error("Failed to delete parking slot");
      console.log(e);
    } finally {
      setIsDeleting(null);
      setDeleteDialog({ open: false, slot: null });
    }
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div style={{ display: "grid", gap: "24px" }}>
        <Card>
          <CardHeader
            title="Add New Parking Slot"
            subheader="Enter the slot number to add a new parking slot"
          />
          <CardContent>
            <form
              onSubmit={handleAddSlot}
              style={{ display: "flex", gap: "16px" }}
            >
              <TextField
                label="Slot Number"
                value={newSlotNumber}
                onChange={(e) => setNewSlotNumber(e.target.value)}
                placeholder="e.g. P11"
                disabled={isAdding}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isAdding}
                startIcon={<Add />}
              >
                {isAdding ? <CircularProgress size={24} /> : "Add Slot"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Manage Parking Slots"
            subheader="View and delete existing parking slots"
          />
          <CardContent>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "20px",
                }}
              >
                <CircularProgress />
              </div>
            ) : slots.length === 0 ? (
              <Typography
                align="center"
                color="textSecondary"
                style={{ padding: "20px" }}
              >
                No parking slots found. Add a new slot above.
              </Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Slot Number</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {slots.length > 0 &&
                      slots.map((slot) => (
                        <TableRow key={slot._id}>
                          <TableCell>{slot.slotNumber}</TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<Delete />}
                              onClick={() =>
                                setDeleteDialog({ open: true, slot })
                              }
                              disabled={isDeleting === slot._id}
                            >
                              {isDeleting === slot._id ? (
                                <CircularProgress size={24} />
                              ) : (
                                "Delete"
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, slot: null })}
        >
          <DialogTitle>Delete Parking Slot</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete parking slot{" "}
              {deleteDialog.slot?.slotNumber}? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialog({ open: false, slot: null })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSlot}
              color="error"
              disabled={isDeleting === deleteDialog.slot?._id}
            >
              {isDeleting === deleteDialog.slot?._id ? (
                <CircularProgress size={24} />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
