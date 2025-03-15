"use client";

import { useState, useEffect } from "react";
import { Car } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Badge,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { GetAllSlots, ReleaseASlot } from "@/services/ParkingService";

// Types
type ParkingSlot = {
  _id: string;
  slotNumber: string;
  status: "AVAILABLE" | "RESERVED" | "OCCUPIED";
  reservedBy:
    | {
        name: string;
      }
    | undefined;
  reservedAt?: string;
};

type StatusFilter = "all" | "AVAILABLE" | "RESERVED" | "OCCUPIED";

export default function SecurityParkingDashboard() {
  const [allSlots, setAllSlots] = useState<ParkingSlot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<ParkingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReleasing, setIsReleasing] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  useEffect(() => {
    loadAllSlots();
  }, []);

  useEffect(() => {
    filterSlots();
  }, [allSlots, statusFilter, searchQuery]);

  async function loadAllSlots() {
    setIsLoading(true);
    try {
      const data = await GetAllSlots();
      if (data.success) {
        setAllSlots(data.slots);
      } else {
        toast.error("Failed to load parking slots");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function filterSlots() {
    let slots = [...allSlots];
    if (statusFilter !== "all")
      slots = slots.filter((slot) => slot.status === statusFilter);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      slots = slots.filter((slot) =>
        slot.slotNumber.toLowerCase().includes(query)
      );
    }
    setFilteredSlots(slots);
  }

  async function handleForceRelease() {
    if (!selectedSlot) return;
    setIsReleasing(selectedSlot._id);
    try {
      const res = await ReleaseASlot({ slotId: selectedSlot._id! });
      if (!res.success) toast.error("Failed to release parking slot");
      else
        toast.success(
          `Reservation for parking slot ${selectedSlot.slotNumber} has been released`
        );
      await loadAllSlots();
    } finally {
      setIsReleasing(null);
      setOpenDialog(false);
    }
  }

  function getStatusColor(status: string) {
    return status === "available"
      ? "success"
      : status === "reserved"
        ? "primary"
        : "warning";
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="space-y-6">
        <Card>
          <CardHeader
            title="Parking Statistics"
            subheader="Overview of current parking facility usage"
          />

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {allSlots.filter((s) => s.status === "AVAILABLE").length}
                    </div>
                    <p className="text-muted-foreground">Available Spots</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {allSlots.filter((s) => s.status === "RESERVED").length}
                    </div>
                    <p className="text-muted-foreground">Reserved Spots</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">
                      {allSlots.filter((s) => s.status === "OCCUPIED").length}
                    </div>
                    <p className="text-muted-foreground">Occupied Spots</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            title="Parking Slots Overview"
            subheader="Monitor and manage all parking slots in the facility"
          />
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <TextField
                fullWidth
                label="Search by slot number or resident name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <TextField
                select
                label="Filter by status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                fullWidth
                sx={{ maxWidth: 200 }}
              >
                {(
                  ["all", "AVAILABLE", "RESERVED", "OCCUPIED"] as StatusFilter[]
                ).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="outlined"
                onClick={loadAllSlots}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={20} /> : "Refresh"}
              </Button>
            </div>

            {isLoading && filteredSlots.length === 0 ? (
              <div className="flex justify-center py-8">
                <CircularProgress />
              </div>
            ) : filteredSlots.length === 0 ? (
              <Typography align="center" color="textSecondary">
                No parking slots found matching your filters.
              </Typography>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSlots.map((slot) => (
                  <Card key={slot._id} sx={{ overflow: "hidden" }}>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Car
                            className={`h-5 w-5 mr-2 text-${getStatusColor(slot.status)}-600`}
                          />
                          <Typography fontWeight={600}>
                            {slot.slotNumber}
                          </Typography>
                        </div>
                        <Badge color={getStatusColor(slot.status)}>
                          {slot.status}
                        </Badge>
                      </div>
                      {slot.status !== "AVAILABLE" && (
                        <>
                          <Typography variant="body2">
                            Resident:{" "}
                            {slot?.reservedBy
                              ? slot?.reservedBy.name
                              : "Unknown"}
                          </Typography>
                          <Typography variant="body2">
                            Reserved at: {slot.reservedAt || "N/A"}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                    {slot.status === "RESERVED" && (
                      <CardActions>
                        <Button
                          color="error"
                          onClick={() => {
                            setSelectedSlot(slot);
                            setOpenDialog(true);
                          }}
                          disabled={isReleasing === slot._id}
                        >
                          {isReleasing === slot._id ? (
                            <CircularProgress size={20} />
                          ) : (
                            "Force Release"
                          )}
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Force Release Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Force Release Parking Spot</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to force release the reservation for parking
              spot {selectedSlot?.slotNumber}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              color="error"
              onClick={handleForceRelease}
              disabled={isReleasing !== null}
            >
              {isReleasing ? <CircularProgress size={20} /> : "Force Release"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
     
    </>
  );
}
