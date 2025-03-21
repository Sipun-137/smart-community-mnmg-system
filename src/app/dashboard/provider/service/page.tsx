"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  TextField,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Box,
  Chip,
} from "@mui/material";
import { AddCircle, Edit, Delete } from "@mui/icons-material";
import {
  AddAService,
  DeleteAService,
  GetMyAllServices,
  UpdateService,
} from "@/services/ProviderService";
import toast, { Toaster } from "react-hot-toast";
import { categories } from "@/utils";

// Define the Service type
interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  availability: {
    days: string[];
    timeSlots: string[];
  };
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const timeSlots = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

const emptyService: Service = {
  _id: "",
  name: "",
  description: "",
  category: "",
  price: 0,
  availability: {
    days: [],
    timeSlots: [],
  },
};

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Service>({
    _id: "",
    name: "",
    description: "",
    category: "",
    price: 0,
    availability: { days: [], timeSlots: [] },
  });

  const [currentService, setCurrentService] = useState<Service | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name!]: value });
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setFormData({ ...formData, category: event.target.value as string });
  };

  const handleToggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter((d) => d !== day)
          : [...prev.availability.days, day],
      },
    }));
  };

  const handleToggleTimeSlot = (slot: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: prev.availability.timeSlots.includes(slot)
          ? prev.availability.timeSlots.filter((t) => t !== slot)
          : [...prev.availability.timeSlots, slot],
      },
    }));
  };

  const getAllServices = async () => {
    const response = await GetMyAllServices();
    console.log(response);
    setServices(response.services);
  };

  const handleSaveService = async () => {
    setIsOpen(false);
    setFormData({
      _id: "",
      name: "",
      description: "",
      category: "",
      price: 0,
      availability: { days: [], timeSlots: [] },
    });
    const response = await AddAService(formData);
    if (response.success) {
      setFormData({
        _id: "",
        name: "",
        description: "",
        category: "",
        price: 0,
        availability: { days: [], timeSlots: [] },
      });
      toast.success(response.message);
      getAllServices();
    } else {
      toast.error(response.message);
    }
  };

  const handleUpdateService = async () => {
    if (!currentService?._id) {
      return;
    }
    const response = await UpdateService(formData, currentService?._id);
    console.log(response);
    if (response.success) {
      toast.success(response.message);
      getAllServices();
    } else {
      toast.error(response.message);
    }
    handleClose();
  };

  // delete service
  const handleDeleteService = async (id: string) => {
    if (!id) {
      toast.error("Id required to delete service");
      return;
    }
    const response = await DeleteAService(id);
    if (response.success) {
      toast.success(response.message);
      getAllServices();
    } else {
      toast.error(response.message);
    }
  };

  const handleClose = () => {
    setFormData({
      _id: "",
      name: "",
      description: "",
      category: "",
      price: 0,
      availability: { days: [], timeSlots: [] },
    });
    setIsOpen(false);
  };

  // to add a new service
  const handleAddService = () => {
    setCurrentService(null);
    setFormData(emptyService);
    setIsOpen(true);
  };

  // Open dialog for editing an existing service
  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setFormData(service);
    setIsOpen(true);
  };

  useEffect(() => {
    getAllServices();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Toaster position="bottom-right" />
      <Button
        variant="contained"
        startIcon={<AddCircle />}
        onClick={handleAddService}
      >
        Add Service
      </Button>
      <div className="flex justify-between items-center mt-5 gap-4 flex-wrap">
        {services.map((service) => (
          <Card
            key={service._id}
            sx={{ width: 320, p: 2, borderRadius: 2, boxShadow: 2 }}
          >
            {/* Service Name and Category */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.category}
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold">
                ₹{service.price}
              </Typography>
            </Box>

            {/* Description */}
            <Typography variant="body2" color="text.secondary" mt={1} mb={2}>
              {service.description}
            </Typography>

            {/* Available Days */}
            <Typography variant="body2" fontWeight="bold">
              Available Days:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mt={0.5} mb={1}>
              {service.availability.days.map((day) => (
                <Chip key={day} label={day} variant="outlined" size="small" />
              ))}
            </Box>

            {/* Time Slots */}
            <Typography variant="body2" fontWeight="bold">
              Time Slots:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mt={0.5} mb={2}>
              {service.availability.timeSlots.map((slot) => (
                <Chip key={slot} label={slot} variant="outlined" size="small" />
              ))}
            </Box>

            {/* Action Buttons */}
            <CardActions
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => handleEditService(service)}
                size="small"
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                size="small"
                onClick={() => {
                  handleDeleteService(service?._id);
                }}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>

      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {formData._id ? "Edit Service" : "Add Service"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {currentService
              ? "Update the details of your existing service"
              : "Fill in the details to add a new service offering"}
          </Typography>

          {/* Service Name & Description */}
          <TextField
            fullWidth
            label="Service Name *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Plumbing Service"
            margin="dense"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your service in detail"
            multiline
            rows={3}
            margin="dense"
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Category */}
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Category *"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Price */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price ($) *"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* Available Days */}
          <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
            Available Days *
          </Typography>
          <FormGroup row>
            {daysOfWeek.map((day) => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    checked={formData.availability.days.includes(day)}
                    onChange={() => handleToggleDay(day)}
                  />
                }
                label={day}
              />
            ))}
          </FormGroup>

          {/* Time Slots */}
          <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
            Time Slots *
          </Typography>
          <FormGroup row>
            {timeSlots.map((slot) => (
              <FormControlLabel
                key={slot}
                control={
                  <Checkbox
                    checked={formData.availability.timeSlots.includes(slot)}
                    onChange={() => handleToggleTimeSlot(slot)}
                  />
                }
                label={slot}
              />
            ))}
          </FormGroup>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={currentService ? handleUpdateService : handleSaveService}
          >
            {currentService ? "Update Service" : "Add Service"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
