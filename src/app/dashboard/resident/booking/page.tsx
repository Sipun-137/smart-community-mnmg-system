"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, Clock, X } from "lucide-react";
import { format } from "date-fns";
import {
  Badge,
  Button,
  Card,
  CardActions,
  Input,
  Tab,
  Typography,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import TabList from "@mui/lab/TabList";
import CardContent from "@mui/material/CardContent";
import toast, { Toaster } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookService,
  CancelBooking,
  GetMyBookings,
} from "@/services/BookingService";
import { GetAllServices } from "@/services/ProviderService";

// Types
type TimeSlot = string;
type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

interface Availability {
  days: Day[];
  timeSlots: TimeSlot[];
}

interface Provider {
  _id: string;
  name: string;
  email: string;
}

interface Service {
  _id: string;
  providerId: Provider;
  name: string;
  description: string;
  category: string;
  price: number;
  status: "active" | "inactive";
  ratings: number;
  totalReviews: number;
  availability: Availability;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Booking {
  _id: string;
  serviceId: {
    name: string;
    description: string;
  };
  providerId: {
    name: string;
    phone: string;
  };
  date: Date;
  timeSlot: string;
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
}

// Categories for filtering

export default function ResidentServices() {
  // State for services and bookings
  const [services, setServices] = useState<Service[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  // State for filtering
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State for booking dialog
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // State for booking form
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>("");
  const [bookingNotes, setBookingNotes] = useState<string>("00-00");
  const [value, setValue] = useState("browse");

  // Filter services based on category and search query
  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === "All Categories" ||
      service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.providerId.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Handle opening the booking dialog
  const handleOpenBooking = (service: Service) => {
    setSelectedService(service);
    setBookingDate(undefined);
    setBookingTimeSlot("");
    setBookingNotes("");
    setIsBookingOpen(true);
  };

  // Handle booking submission
  const handleBookService = async () => {
    if (!selectedService || !bookingDate || !bookingTimeSlot) {
      toast.error("Please select a date and time slot for your booking.");
      return;
    }
    // Create new booking
    const newBooking = {
      serviceId: selectedService._id,
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      notes: bookingNotes,
    };
    const response = await BookService(newBooking);
    if (response.success) {
      toast.success(
        `Your booking for ${selectedService.name} has been submitted.`
      );
      loadMyBookings();
      setValue("bookings")
    } else {
      toast.error(response.message);
    }
    setIsBookingOpen(false);
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    const response = await CancelBooking(bookingId);
    if (response.success) {
      loadMyBookings();
      toast.success("Your booking has been cancelled successfully.");
    } else {
      toast.error(response.message);
    }
  };

  // Get available days for the selected service
  const getAvailableDays = (date: Date): boolean => {
    if (!selectedService) return false;

    const dayName = format(date, "EEEE") as Day;
    return selectedService.availability.days.includes(dayName);
  };

  const loadMyBookings = async () => {
    const response = await GetMyBookings();
    setMyBookings(response.bookings);
  };

  const loadAllServices = async () => {
    const response = await GetAllServices();
    setServices(response.services);
  };

  useEffect(() => {
    loadAllServices();
    loadMyBookings();
  }, []);
  return (
    <div className="container mx-auto py-8 px-4 ">
      <Toaster position="bottom-right" />
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          className="grid w-full grid-cols-2 mb-8 text-white"
        >
          <Tab
            value="browse"
            className="w-full"
            label="Browse Services"
            sx={{ color: "white" }}
          />
          <Tab
            value="bookings"
            className="w-full"
            label="My Bookings"
            sx={{ color: "white" }}
          />
        </TabList>

        <TabPanel value="browse" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Available Services</h1>
              <p className="text-muted-foreground mt-1">
                Browse and book services for your home
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto bg-white p-3 rounded-sm text-black">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative w-full sm:w-[220px] bg-white p-3 rounded-md  ">
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-8 "
                />
                {searchQuery && (
                  <Button
                    variant="outlined"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-xl font-medium mb-2">No services found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card
                  key={service._id}
                  className="overflow-hidden flex flex-col"
                >
                  <CardContent className="pb-3">
                    <div className="flex justify-between items-start">
                      <Typography
                        gutterBottom
                        sx={{ color: "black", fontSize: 24 }}
                      >
                        {service.name}
                      </Typography>
                      <Badge color="secondary" className="ml-2">
                        {service.category}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1">
                      <span>by {service.providerId.name}</span>
                    </div>
                  </CardContent>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1 flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" /> Available Days:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {service.availability.days.map((day) => (
                            <span
                              key={day}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">
                          Time Slots:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {service.availability.timeSlots.map((slot) => (
                            <span
                              key={slot}
                              className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded-full"
                            >
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardActions className="pt-2 flex items-center justify-between">
                    <div className="font-semibold text-lg">
                      ₹{service.price}
                    </div>
                    <Button onClick={() => handleOpenBooking(service)}>
                      Book Now
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </div>
          )}
        </TabPanel>

        <TabPanel value="bookings">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your service bookings
            </p>
          </div>

          {myBookings.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-xl font-medium mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-4">
                Browse services and make your first booking
              </p>
              <Button variant="outlined" onClick={() => setValue("browse")}>
                Browse Services
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((booking) => (
                <Card key={booking._id} className="overflow-hidden">
                  <CardContent className="pb-3">
                    <div className="flex justify-between items-start">
                      <Typography
                        gutterBottom
                        sx={{ color: "text.secondary", fontSize: 14 }}
                      >
                        {booking.serviceId.name}
                      </Typography>
                      <Badge
                        color={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "pending"
                              ? "primary"
                              : booking.status === "completed"
                                ? "secondary"
                                : "error"
                        }
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </Badge>
                    </div>
                    <div>Provider: {booking.providerId.name}</div>
                  </CardContent>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">
                          Date & Time:
                        </h4>
                        <p className="text-sm">
                          {format(booking.date, "MMMM d, yyyy")} •{" "}
                          {booking.timeSlot}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Booked on:</h4>
                        <p className="text-sm">
                          {format(booking.createdAt, "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Notes:</h4>
                        <p className="text-sm text-muted-foreground">
                          {booking.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardActions className="pt-2">
                    {booking.status !== "cancelled" &&
                      booking.status !== "completed" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button color="error" className="ml-auto">
                              Cancel Booking
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel this booking?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will cancel your booking for{" "}
                                {booking.serviceId.name} on{" "}
                                {format(booking.date, "MMMM d, yyyy")}. This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Keep Booking
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelBooking(booking._id)}
                              >
                                Yes, Cancel
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                  </CardActions>
                </Card>
              ))}
            </div>
          )}
        </TabPanel>
      </TabContext>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book Service</DialogTitle>
            <DialogDescription>
              {selectedService &&
                `Book ${selectedService.name} provided by ${selectedService.providerId.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outlined"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !bookingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDate ? format(bookingDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bookingDate}
                    onSelect={setBookingDate}
                    disabled={(date) =>
                      date < new Date() ||
                      date >
                        new Date(
                          new Date().setMonth(new Date().getMonth() + 3)
                        ) ||
                      !getAvailableDays(date)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Only days when the service provider is available are selectable
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Time Slot</Label>
              <Select
                value={bookingTimeSlot}
                onValueChange={setBookingTimeSlot}
                disabled={!bookingDate}
              >
                <SelectTrigger id="timeSlot">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {selectedService?.availability.timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions or details..."
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
              />
            </div>

            {selectedService && (
              <div className="bg-muted p-3 rounded-md mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Service Fee:</span>
                  <span className="font-semibold">
                    ${selectedService.price}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outlined" onClick={() => setIsBookingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookService}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
