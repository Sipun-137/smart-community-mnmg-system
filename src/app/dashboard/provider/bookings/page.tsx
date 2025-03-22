/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  ChevronDown,
  Search,
  User,
  Clock,
  MapPin,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import { GetMyAllBookings, UpdateStatus } from "@/services/ProviderService";

// Types
interface Resident {
  _id: string;
  name: string;
  email: string;
  phone: string;
  apartmentNo: string;
}

interface Availability {
  days: string[];
  timeSlots: string[];
}

interface Service {
  _id: string;
  providerId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  status: string;
  ratings: number;
  totalReviews: number;
  availability: Availability;
}

interface Booking {
  _id: string;
  residentId: Resident;
  providerId: string;
  serviceId: Service;
  date: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "canceled";
  paymentStatus: "pending" | "paid" | "refunded";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Sample data
// const sampleBookings: Booking[] = [
//   {
//     _id: "67dd70a1b92f5c2e6a0c918f",
//     residentId: {
//       _id: "67a14ab3be2b36216eaec7f3",
//       name: "Sanket Samantsinghar",
//       email: "user1@mail.com",
//       phone: "8018840927",
//       apartmentNo: "B-1",
//     },
//     providerId: "67db9856d741be17ea3a6745",
//     serviceId: {
//       availability: {
//         days: ["Monday", "Wednesday", "Friday"],
//         timeSlots: ["10:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"],
//       },
//       _id: "67dba21db951b318dac82ac9",
//       providerId: "67db9856d741be17ea3a6745",
//       name: "Plumber Service",
//       description: "Fast and affordable Plumber service",
//       category: "Home Services",
//       price: 100,
//       status: "active",
//       ratings: 0,
//       totalReviews: 0,
//     },
//     date: "2025-03-27T18:30:00.000Z",
//     timeSlot: "2:00 PM - 5:00 PM",
//     status: "pending",
//     paymentStatus: "pending",
//     createdAt: "2025-03-21T13:58:57.736Z",
//     updatedAt: "2025-03-21T13:58:57.736Z",
//     __v: 0,
//     notes: "Please bring tools for fixing the kitchen sink",
//   },
//   {
//     _id: "67dd70a1b92f5c2e6a0c918e",
//     residentId: {
//       _id: "67a14ab3be2b36216eaec7f4",
//       name: "John Smith",
//       email: "john@mail.com",
//       phone: "5551234567",
//       apartmentNo: "A-4",
//     },
//     providerId: "67db9856d741be17ea3a6745",
//     serviceId: {
//       availability: {
//         days: ["Monday", "Wednesday", "Friday"],
//         timeSlots: ["10:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"],
//       },
//       _id: "67dba21db951b318dac82ac9",
//       providerId: "67db9856d741be17ea3a6745",
//       name: "Plumber Service",
//       description: "Fast and affordable Plumber service",
//       category: "Home Services",
//       price: 100,
//       status: "active",
//       ratings: 0,
//       totalReviews: 0,
//     },
//     date: "2025-03-25T10:00:00.000Z",
//     timeSlot: "10:00 AM - 12:00 PM",
//     status: "confirmed",
//     paymentStatus: "paid",
//     createdAt: "2025-03-20T09:30:57.736Z",
//     updatedAt: "2025-03-20T14:15:57.736Z",
//     __v: 0,
//   },
//   {
//     _id: "67dd70a1b92f5c2e6a0c918d",
//     residentId: {
//       _id: "67a14ab3be2b36216eaec7f5",
//       name: "Emily Johnson",
//       email: "emily@mail.com",
//       phone: "5559876543",
//       apartmentNo: "C-2",
//     },
//     providerId: "67db9856d741be17ea3a6745",
//     serviceId: {
//       availability: {
//         days: ["Monday", "Wednesday", "Friday"],
//         timeSlots: ["10:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"],
//       },
//       _id: "67dba21db951b318dac82ac8",
//       providerId: "67db9856d741be17ea3a6745",
//       name: "Electrician Service",
//       description: "Professional electrical repairs and installations",
//       category: "Home Services",
//       price: 120,
//       status: "active",
//       ratings: 4.5,
//       totalReviews: 12,
//     },
//     date: "2025-03-22T14:00:00.000Z",
//     timeSlot: "2:00 PM - 5:00 PM",
//     status: "completed",
//     paymentStatus: "paid",
//     createdAt: "2025-03-18T16:45:57.736Z",
//     updatedAt: "2025-03-22T17:30:57.736Z",
//     __v: 0,
//     notes:
//       "Need to fix the circuit breaker and install new outlets in the living room",
//   },
//   {
//     _id: "67dd70a1b92f5c2e6a0c918c",
//     residentId: {
//       _id: "67a14ab3be2b36216eaec7f6",
//       name: "Michael Brown",
//       email: "michael@mail.com",
//       phone: "5552223333",
//       apartmentNo: "D-5",
//     },
//     providerId: "67db9856d741be17ea3a6745",
//     serviceId: {
//       availability: {
//         days: ["Monday", "Wednesday", "Friday"],
//         timeSlots: ["10:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"],
//       },
//       _id: "67dba21db951b318dac82ac7",
//       providerId: "67db9856d741be17ea3a6745",
//       name: "Cleaning Service",
//       description: "Thorough home cleaning service",
//       category: "Home Services",
//       price: 80,
//       status: "active",
//       ratings: 4.2,
//       totalReviews: 8,
//     },
//     date: "2025-03-29T10:00:00.000Z",
//     timeSlot: "10:00 AM - 12:00 PM",
//     status: "cancelled",
//     paymentStatus: "refunded",
//     createdAt: "2025-03-19T13:10:57.736Z",
//     updatedAt: "2025-03-20T08:45:57.736Z",
//     __v: 0,
//   },
//   {
//     _id: "67dd70a1b92f5c2e6a0c918b",
//     residentId: {
//       _id: "67a14ab3be2b36216eaec7f7",
//       name: "Sarah Wilson",
//       email: "sarah@mail.com",
//       phone: "5554445555",
//       apartmentNo: "E-3",
//     },
//     providerId: "67db9856d741be17ea3a6745",
//     serviceId: {
//       availability: {
//         days: ["Monday", "Wednesday", "Friday"],
//         timeSlots: ["10:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"],
//       },
//       _id: "67dba21db951b318dac82ac9",
//       providerId: "67db9856d741be17ea3a6745",
//       name: "Plumber Service",
//       description: "Fast and affordable Plumber service",
//       category: "Home Services",
//       price: 100,
//       status: "active",
//       ratings: 0,
//       totalReviews: 0,
//     },
//     date: "2025-04-01T14:00:00.000Z",
//     timeSlot: "2:00 PM - 5:00 PM",
//     status: "pending",
//     paymentStatus: "pending",
//     createdAt: "2025-03-21T10:25:57.736Z",
//     updatedAt: "2025-03-21T10:25:57.736Z",
//     __v: 0,
//     notes: "Bathroom sink is clogged and leaking",
//   },
// ];

export default function ProviderBookings() {
  // State for bookings
  const [bookings, setBookings] = useState<Booking[]>([]);

  // State for filtering
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State for booking details
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  // State for status update
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>("");

  // Get unique services for filter dropdown
  const uniqueServices = Array.from(
    new Set(bookings.map((booking) => booking.serviceId.name))
  );

  // Filter bookings based on status, service, and search query
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesService =
      serviceFilter === "all" || booking.serviceId.name === serviceFilter;
    const matchesSearch =
      booking.residentId.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.residentId.apartmentNo
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.serviceId.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesService && matchesSearch;
  });

  // Handle opening booking details
  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  // Handle opening status update dialog
  const handleOpenStatusUpdate = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setIsStatusUpdateOpen(true);
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) return;

    const response = await UpdateStatus(selectedBooking._id, {
      status: newStatus,
    });

    if (response.success) {
      toast(`Booking status has been updated to ${newStatus}.`);
      LoadAllBooking();
    } else {
      toast.error(response.message);
    }
    setIsStatusUpdateOpen(false);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline";
      case "confirmed":
        return "default";
      case "completed":
        return "default";
      case "canceled":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Get payment status badge variant
  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline";
      case "paid":
        return "success";
      case "refunded":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const LoadAllBooking = async () => {
    const response = await GetMyAllBookings();
    setBookings(response.bookings);
  };

  useEffect(() => {
    LoadAllBooking();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Bookings</h1>
          <p className="text-muted-foreground mt-1">
            View and manage service bookings from residents
          </p>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="grid gap-2 flex-1">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by resident, apartment, or service..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2 w-full md:w-[180px] text-black">
            <Label htmlFor="status">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 w-full md:w-[220px] text-black">
            <Label htmlFor="service">Service</Label>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger id="service">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {uniqueServices.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <h3 className="text-xl font-medium mb-2">No bookings found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resident</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>
                    <div className="font-medium">{booking.residentId.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Apt: {booking.residentId.apartmentNo}
                    </div>
                  </TableCell>
                  <TableCell>{booking.serviceId.name}</TableCell>
                  <TableCell>
                    <div>{formatDate(booking.date)}</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.timeSlot}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(booking.status)}
                      className="text-white"
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-white"
                      variant={
                        booking.paymentStatus === "paid"
                          ? "success"
                          : booking.paymentStatus === "refunded"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {booking.paymentStatus.charAt(0).toUpperCase() +
                        booking.paymentStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(booking)}
                        >
                          View Details
                        </DropdownMenuItem>
                        {booking.status !== "canceled" &&
                          booking.status !== "completed" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleOpenStatusUpdate(booking)}
                              >
                                Update Status
                              </DropdownMenuItem>
                            </>
                          )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about this booking
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <User className="h-4 w-4 mr-2" /> Resident Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="grid gap-1">
                      <div className="font-medium">
                        {selectedBooking.residentId.name}
                      </div>
                      <div className="text-muted-foreground">
                        {selectedBooking.residentId.email}
                      </div>
                      <div className="text-muted-foreground">
                        {selectedBooking.residentId.phone}
                      </div>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>
                          Apartment {selectedBooking.residentId.apartmentNo}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Calendar className="h-4 w-4 mr-2" /> Booking Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="grid gap-1">
                      <div className="font-medium">
                        {formatDate(selectedBooking.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{selectedBooking.timeSlot}</span>
                      </div>
                      <div className="flex items-center mt-1 justify-between">
                        <span>Status:</span>
                        <Badge
                          variant={getStatusBadgeVariant(
                            selectedBooking.status
                          )}
                        >
                          {selectedBooking.status.charAt(0).toUpperCase() +
                            selectedBooking.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-1 justify-between">
                        <span>Payment:</span>
                        <Badge
                          variant={getPaymentStatusBadgeVariant(
                            selectedBooking.paymentStatus
                          )}
                        >
                          {selectedBooking.paymentStatus
                            .charAt(0)
                            .toUpperCase() +
                            selectedBooking.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Service Information
                  </CardTitle>
                  <CardDescription>
                    {selectedBooking.serviceId.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="grid gap-3">
                    <div>
                      <div className="font-medium text-base">
                        {selectedBooking.serviceId.name}
                      </div>
                      <p className="text-muted-foreground mt-1">
                        {selectedBooking.serviceId.description}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="font-medium">
                        ${selectedBooking.serviceId.price}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedBooking.notes && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Additional Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedBooking.notes}</p>
                  </CardContent>
                </Card>
              )}

              <div className="text-xs text-muted-foreground">
                <div>Booking ID: {selectedBooking._id}</div>
                <div>
                  Created:{" "}
                  {format(
                    new Date(selectedBooking.createdAt),
                    "MMMM d, yyyy 'at' h:mm a"
                  )}
                </div>
                <div>
                  Last Updated:{" "}
                  {format(
                    new Date(selectedBooking.updatedAt),
                    "MMMM d, yyyy 'at' h:mm a"
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            {selectedBooking &&
              selectedBooking.status !== "canceled" &&
              selectedBooking.status !== "completed" && (
                <Button
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleOpenStatusUpdate(selectedBooking);
                  }}
                >
                  Update Status
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>
              Change the status of this booking
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="booking-service">Service</Label>
                <div className="p-2 border rounded-md bg-muted/50">
                  {selectedBooking.serviceId.name}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="booking-resident">Resident</Label>
                <div className="p-2 border rounded-md bg-muted/50">
                  {selectedBooking.residentId.name} (Apt:{" "}
                  {selectedBooking.residentId.apartmentNo})
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="booking-date">Date & Time</Label>
                <div className="p-2 border rounded-md bg-muted/50">
                  {formatDate(selectedBooking.date)} •{" "}
                  {selectedBooking.timeSlot}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="canceled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusUpdateOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
