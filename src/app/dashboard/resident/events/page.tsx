/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Users, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  GetAssignedEvents,
  GetPublicUpcomingEvents,
  RegisterEvent,
  UnregisterEvent,
} from "@/services/EventService";
import toast, { Toaster } from "react-hot-toast";
import { getUserId } from "@/services/AuthService";

// Current user ID (simulating logged-in user)

export default function ResidentEventsPage() {
  const [myEvents, setMyEvents] = useState([]);
  const [publicEvents, setPublicEvents] = useState([]);
  const [CURRENT_USER_ID,setCurrentUserId]=useState<string|null>(null);

  const LoadPublicUpcomingEvents = async () => {
    const response = await GetPublicUpcomingEvents();
    if (response.success) {
      setPublicEvents(response.events);
    }
  };

  // load all Assigned Events
  const loadAssignedEvents = async () => {
    // TODO: Implement logic to fetch assigned events based on the current user
    const response = await GetAssignedEvents();
    if (response.success) {
      setMyEvents(response.events);
    } else {
      toast.error(response.message);
    }
  };

  const handleRegister = async (eventId: string) => {
    const response = await RegisterEvent(eventId);
    if (response.success) {
      toast.success(response.message);
      LoadPublicUpcomingEvents();
      loadAssignedEvents();
    } else {
      toast.error(response.message);
    }
  };

  const handleUnregister = async (eventId: string) => {
    const response = await UnregisterEvent(eventId);
    if (response.success) {
      toast.success(response.message);
      LoadPublicUpcomingEvents();
      loadAssignedEvents();
    } else {
      toast.error(response.message);
    }
  };


  const getMyId=async()=>{
    // TODO: Implement logic to fetch current user's ID
    const response = await getUserId();
    if (response) {
      setCurrentUserId(response);
    }
  }
  
  useEffect(() => {
    getMyId();
    LoadPublicUpcomingEvents();
    loadAssignedEvents();
  }, []);

  const isRegistered = (event: any) => {
    return event.participants.includes(CURRENT_USER_ID);
  };

  const isFull = (event: any) => {
    return event.participants.length >= event.maxParticipants;
  };

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

  const renderEventCard = (event: any) => {
    const registered = isRegistered(event);
    const full = isFull(event);

    return (
      <Card key={event._id} className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <CardDescription className="mt-1">
                {event.description}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {getEventTypeBadge(event.eventType)}
              {getStatusBadge(event.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {format(new Date(event.dateTime), "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(event.dateTime), "h:mm a")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {event.participants.length} / {event.maxParticipants}{" "}
                participants
              </span>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`/placeholder.svg?height=32&width=32`}
                  alt={event.createdBy.name}
                />
                <AvatarFallback>
                  {event?.createdBy?.name?.substring(0, 2).toUpperCase() ||
                    "NA"}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">
                  Organized by {event.createdBy.name}
                </p>
                <p className="text-muted-foreground">{event.createdBy.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {event.eventType === "PUBLIC" ? (
            <div className="w-full">
              {registered ? (
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">You are registered</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleUnregister(event._id)}
                  >
                    Cancel Registration
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleRegister(event._id)}
                  disabled={full}
                >
                  {full ? "Event Full" : "Register Now"}
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-purple-600 w-full">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                You&apos;re invited to this private event
              </span>
            </div>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <Toaster position="bottom-right" />
      <h1 className="text-3xl font-bold mb-6">Community Events</h1>

      <Tabs defaultValue="my-events" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="my-events">My Events</TabsTrigger>
          <TabsTrigger value="public-events">Public Events</TabsTrigger>
        </TabsList>

        <TabsContent value="my-events">
          {myEvents.length === 0 ? (
            <Alert>
              <AlertTitle>No events found</AlertTitle>
              <AlertDescription>
                You haven&apos;t registered for any events yet. Check out the
                public events tab to find events to join.
              </AlertDescription>
            </Alert>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Your Upcoming Events
              </h2>
              {myEvents.map(renderEventCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="public-events">
          {publicEvents.length === 0 ? (
            <Alert>
              <AlertTitle>No public events</AlertTitle>
              <AlertDescription>
                There are no public events scheduled at the moment. Check back
                later.
              </AlertDescription>
            </Alert>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Available Public Events
              </h2>
              {publicEvents.map(renderEventCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
