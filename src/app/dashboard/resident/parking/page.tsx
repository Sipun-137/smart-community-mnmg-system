"use client";

import { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  GetAvailableSlots,
  GetMyParkings,
  ReleaseASlot,
  ReserveASlot,
} from "@/services/ParkingService";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

// Types
type ParkingSlot = {
  _id: string;
  slotNumber: string;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
};

type Reservation = {
  _id: string;
  slotId: string;
  slotNumber: string;
  reservedBy: string;
  reservedAt: string;
};

export default function Page() {
  const [availableSlots, setAvailableSlots] = useState<ParkingSlot[]>([]);
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [isReserving, setIsReserving] = useState<string | null>(null);
  const [isReleasing, setIsReleasing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await Promise.all([loadAvailableSlots(), loadMyReservations()]);
  }

  async function loadAvailableSlots() {
    setIsLoadingAvailable(true);
    try {
      const data = await GetAvailableSlots();
      setAvailableSlots(data.availableSlots);
    } finally {
      setIsLoadingAvailable(false);
    }
  }

  async function loadMyReservations() {
    setIsLoadingReservations(true);
    try {
      const data = await GetMyParkings();
      setMyReservations(data.slots);
    } finally {
      setIsLoadingReservations(false);
    }
  }

  async function handleReserveSlot(slot: ParkingSlot) {
    setIsReserving(slot._id);
    try {
      const res=await ReserveASlot({
        slotId: slot._id,
        vehicleNumber: null,
      });
      console.log(res)
      await loadData();
      setActiveTab("myReservations");
    } finally {
      setIsReserving(null);
    }
  }

  async function handleReleaseSlot(reservation: Reservation) {
    setIsReleasing(reservation._id);
    try {
      await ReleaseASlot({ slotId: reservation._id });
      await loadData();
    } finally {
      setIsReleasing(null);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
  }

  return (
    <div>
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
      >
        <Tab label="Available Spots" value="available" sx={{color:"white"}} />
        <Tab
          label={`My Reservations (${myReservations.length})`}
          value="myReservations"
          sx={{color:"white"}}
        />
      </Tabs>
      {activeTab === "available" && (
        <Card>
          <CardHeader title="Available Parking Spots" />
          <CardContent>
            {isLoadingAvailable ? (
              <CircularProgress />
            ) : (
              <div className="grid grid-cols-2 grid-rows-5 gap-4">
                {availableSlots.length > 0 &&
                  availableSlots.map((slot) => (
                    <Card key={slot._id} sx={{ marginBottom: 2 }}>
                      <CardContent>
                        <Typography>
                        <DirectionsCarIcon /> {slot.slotNumber} 
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          disabled={isReserving === slot._id}
                          onClick={() => handleReserveSlot(slot)}
                        >
                          {isReserving === slot._id
                            ? "Reserving..."
                            : "Reserve Spot"}
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "myReservations" && (
        <Card>
          <CardHeader title="My Reservations" />
          <CardContent>
            {isLoadingReservations ? (
              <CircularProgress />
            ) : (
              <div className="grid grid-cols-2 grid-rows-5 gap-4">
                {myReservations.length > 0 &&
                  myReservations.map((reservation) => (
                    <Card key={reservation._id} sx={{ marginBottom: 2 }}>
                      <CardContent>
                        <Typography><DirectionsCarIcon /> {reservation.slotNumber}</Typography>
                        <Typography variant="body2">
                          Reserved at: {formatDate(reservation.reservedAt)}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="outlined"
                          color="error"
                          disabled={isReleasing === reservation._id}
                          onClick={() => handleReleaseSlot(reservation)}
                        >
                          {isReleasing === reservation._id
                            ? "Releasing..."
                            : "Release Spot"}
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
