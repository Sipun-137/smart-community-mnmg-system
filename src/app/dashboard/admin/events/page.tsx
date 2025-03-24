/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Edit, Trash, Users } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventForm } from "./event-form";
import { ParticipantSelector } from "./participant-selector";
import { GetUsers } from "@/services/UserService";
import {
  AssignAttendee,
  CreateEvent,
  DeleteEvent,
  GetAllEvent,
  UpdateEvent,
} from "@/services/EventService";
import toast, { Toaster } from "react-hot-toast";

// Demo data based on the MongoDB structure
// const demoEvents = [
//   {
//     _id: "67e0068837c3c641fdb1243d",
//     title: "Community Meetup",
//     description:
//       "A networking event for all residents to discuss upcoming projects.",
//     dateTime: "2025-04-15T18:00:00.000Z",
//     location: "Community Hall, Block A",
//     createdBy: {
//       _id: "67a112d2700636fde6e6ded0",
//       name: "subhranshu",
//       email: "admin@mail.com",
//     },
//     maxParticipants: 50,
//     eventType: "PUBLIC",
//     participants: ["67a14ab3be2b36216eaec7f3", "67dace0e52b2b4b3b3ac3823"],
//     status: "UPCOMING",
//     createdAt: "2025-03-23T13:03:04.604Z",
//     updatedAt: "2025-03-23T13:12:19.698Z",
//     __v: 2,
//   },
//   {
//     _id: "67e0068837c3c641fdb1243e",
//     title: "Board Meeting",
//     description:
//       "Quarterly board meeting to discuss financial reports and future plans.",
//     dateTime: "2025-04-20T14:00:00.000Z",
//     location: "Conference Room, Block B",
//     createdBy: {
//       _id: "67a112d2700636fde6e6ded0",
//       name: "subhranshu",
//       email: "admin@mail.com",
//     },
//     maxParticipants: 15,
//     eventType: "PRIVATE",
//     participants: ["67a14ab3be2b36216eaec7f3"],
//     status: "UPCOMING",
//     createdAt: "2025-03-23T14:15:04.604Z",
//     updatedAt: "2025-03-23T14:20:19.698Z",
//     __v: 1,
//   },
//   {
//     _id: "67e0068837c3c641fdb1243f",
//     title: "Summer Festival",
//     description:
//       "Annual summer festival with food, games, and entertainment for all residents.",
//     dateTime: "2025-06-10T16:00:00.000Z",
//     location: "Community Park",
//     createdBy: {
//       _id: "67a112d2700636fde6e6ded0",
//       name: "subhranshu",
//       email: "admin@mail.com",
//     },
//     maxParticipants: 200,
//     eventType: "PUBLIC",
//     participants: [],
//     status: "UPCOMING",
//     createdAt: "2025-03-24T10:03:04.604Z",
//     updatedAt: "2025-03-24T10:05:19.698Z",
//     __v: 0,
//   },
// ];

// Demo users for participant selection
// const demoUsers = [
//   {
//     id: "67a14ab3be2b36216eaec7f3",
//     name: "John Doe",
//     email: "john@example.com",
//   },
//   {
//     id: "67dace0e52b2b4b3b3ac3823",
//     name: "Jane Smith",
//     email: "jane@example.com",
//   },
//   {
//     id: "67dace0e52b2b4b3b3ac3824",
//     name: "Robert Johnson",
//     email: "robert@example.com",
//   },
//   {
//     id: "67dace0e52b2b4b3b3ac3825",
//     name: "Emily Davis",
//     email: "emily@example.com",
//   },
//   {
//     id: "67dace0e52b2b4b3b3ac3826",
//     name: "Michael Wilson",
//     email: "michael@example.com",
//   },
// ];

export default function EventsAdminPage() {
  const [events, setEvents] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isParticipantsDialogOpen, setIsParticipantsDialogOpen] =
    useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [users, setUsers] = useState([]);

  const handleCreateEvent = async (eventData: any) => {
    const response = await CreateEvent(eventData);
    if (response.success) {
      toast.success("Event created successfully!");
      LoadEvents();
    } else {
      toast.error(response.message);
    }
    setIsCreateDialogOpen(false);
  };

  const handleUpdateEvent = async (eventData: any) => {
    console.log(eventData);
    const response = await UpdateEvent(eventData, currentEvent._id);
    if (response.success) {
      toast.success(response.message);
      LoadEvents();
    } else {
      toast.error(response.message);
    }
    setIsEditDialogOpen(false);
  };

  const handleDeleteEvent = async (eventId: string) => {
    const response = await DeleteEvent(eventId);
    if (response.success) {
      toast.success("Event deleted successfully!");
      LoadEvents();
    } else {
      toast.error(response.message);
    }
    LoadEvents();
  };

  const handleEditEvent = (event: any) => {
    setCurrentEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleManageParticipants = (event: any) => {
    setCurrentEvent(event);
    setIsParticipantsDialogOpen(true);
  };

  const handleUpdateParticipants = async (participantIds: string[]) => {
    console.log(participantIds);
    const response = await AssignAttendee(participantIds, currentEvent._id);
    if (response.success) {
      toast.success("Attendees assigned successfully!");
      LoadEvents();
    } else {
      toast.error(response.message);
    }
    // setEvents([]);
    setIsParticipantsDialogOpen(false);
  };

  // load user list
  async function LoadUser() {
    const response = await GetUsers();
    setUsers(response.users);
  }

  // load all events
  async function LoadEvents() {
    const response = await GetAllEvent();
    setEvents(response.events);
  }
  // load at the time of loading the page

  useEffect(() => {
    LoadEvents();
    LoadUser();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case "ONGOING":
        return <Badge className="bg-green-500">Ongoing</Badge>;
      case "COMPLETED":
        return <Badge className="bg-gray-500">Completed</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getEventTypeBadge = (type: string) => {
    return type === "PUBLIC" ? (
      <Badge variant="outline" className="border-green-500 text-green-700">
        Public
      </Badge>
    ) : (
      <Badge variant="outline" className="border-purple-500 text-purple-700">
        Private
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <Toaster position="bottom-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Event Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 border-white border ">
              <PlusCircle className="h-4 w-4" />
              Add New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new event.
              </DialogDescription>
            </DialogHeader>
            <EventForm
              onSubmit={handleCreateEvent}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            Manage all community events from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="public">Public</TabsTrigger>
              <TabsTrigger value="private">Private</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="w-full">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          Date & Time
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          Location
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          Participants
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event: any) => (
                        <tr key={event._id} className="border-b">
                          <td className="px-4 py-3 font-medium">
                            {event.title}
                          </td>
                          <td className="px-4 py-3">
                            {format(
                              new Date(event.dateTime),
                              "MMM dd, yyyy - h:mm a"
                            )}
                          </td>
                          <td className="px-4 py-3">{event.location}</td>
                          <td className="px-4 py-3">
                            {getEventTypeBadge(event.eventType)}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(event.status)}
                          </td>
                          <td className="px-4 py-3">
                            {event.participants.length} /{" "}
                            {event.maxParticipants}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditEvent(event)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteEvent(event._id)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleManageParticipants(event)}
                              >
                                <Users className="h-4 w-4" />
                                <span className="sr-only">
                                  Manage Participants
                                </span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="upcoming">
              {/* Similar table but filtered for upcoming events */}
            </TabsContent>
            <TabsContent value="public">
              {/* Similar table but filtered for public events */}
            </TabsContent>
            <TabsContent value="private">
              {/* Similar table but filtered for private events */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update the event details.</DialogDescription>
          </DialogHeader>
          {currentEvent && (
            <EventForm
              initialData={currentEvent}
              onSubmit={handleUpdateEvent}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Participants Dialog */}
      <Dialog
        open={isParticipantsDialogOpen}
        onOpenChange={setIsParticipantsDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Participants</DialogTitle>
            <DialogDescription>
              {currentEvent?.eventType === "PRIVATE"
                ? "Select participants for this private event."
                : "View and manage participants for this event."}
            </DialogDescription>
          </DialogHeader>
          {currentEvent && (
            <ParticipantSelector
              users={users}
              selectedUserIds={currentEvent.participants}
              maxParticipants={currentEvent.maxParticipants}
              isPrivate={currentEvent.eventType === "PRIVATE"}
              onSave={handleUpdateParticipants}
              onCancel={() => setIsParticipantsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
