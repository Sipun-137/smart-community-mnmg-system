/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Search,
  Phone,
  Home,
  MessageSquare,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  QrCode,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast, { Toaster } from "react-hot-toast";
import { getAllVisitorsByUser, RemoveVisitor } from "@/services/VisitorService";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import VisitorCard from "./ui/VisitorCard";

interface VisitorI {
  _id: string;
  name: string;
  residentId: string;
  visitorId: string;
  phone: string;
  apartmentNo: string;
  visitReason: string;
  visitDate: string;
  status: string;
  qrCode: string;
}

export function VisitorsList() {
  const [visitors, setVisitors] = useState<VisitorI[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visitorCardOpen, setVisitorCardOpen] = useState(false);
  const [selectedvisitor, setSelectedVisitor] = useState<VisitorI | null>(null);

  const handleClose = () => {
    setVisitorCardOpen(false);
    setSelectedVisitor(null);
  };
  // Filter visitors based on search query and status
  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.phone.includes(searchQuery) ||
      visitor.visitReason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || visitor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteVisitor = async (id: string) => {
    // In a real app, this would call an API to delete the visitor
    const response = await RemoveVisitor(id);
    if (response.success) {
      toast.success(response.message);
      LoadMyVisitors();
    } else {
      toast.error(response.message);
    }
  };

  const handleViewQRCode = (visitor: any) => {
    // In a real app, this would show the QR code in a modal
    setSelectedVisitor(visitor);
    if (!visitor) return;
    setVisitorCardOpen(true);
    toast.success("QR code for " + visitor.name + " is ready to share.");
  };

  const LoadMyVisitors = async () => {
    // In a real app, this would call an API to fetch visitors based on the user's ID
    // For simplicity, we are using a sample visitors array
    const response = await getAllVisitorsByUser();
    setVisitors(response.visitors);
  };

  useEffect(() => {
    LoadMyVisitors();
  }, []);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="bottom-right" />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search visitors..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visitors</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-6">
          {filteredVisitors.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <div className="text-muted-foreground">No visitors found</div>
              <Button asChild className="mt-4 text-black" variant="outline">
                <Link href="visitor/new">Add your first visitor</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVisitors.map((visitor: VisitorI) => (
                <Card key={visitor._id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{visitor.name}</CardTitle>
                      {getStatusBadge(visitor.status)}
                    </div>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Phone className="h-3 w-3" /> {visitor.phone}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span>Apartment: {visitor.apartmentNo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(visitor.visitDate), "PPP")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(visitor.visitDate), "p")}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="line-clamp-2">
                          {visitor.visitReason}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                          Actions <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Manage Visitor</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewQRCode(visitor)}
                        >
                          <QrCode className="mr-2 h-4 w-4" />
                          View QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteVisitor(visitor._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          {filteredVisitors.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <div className="text-muted-foreground">No visitors found</div>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/visitors/new">Add your first visitor</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVisitors.map((visitor: VisitorI) => (
                <Card key={visitor._id}>
                  <div className="p-4 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {visitor.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" />
                              <span>{visitor.phone}</span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              visitor.status === "upcoming"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {visitor.status === "upcoming"
                              ? "Upcoming"
                              : "Completed"}
                          </Badge>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <span>Apartment: {visitor.apartmentNo}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {format(new Date(visitor.visitDate), "PPP")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {format(new Date(visitor.visitDate), "p")}
                            </span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span className="line-clamp-2">
                              {visitor.visitReason}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              Manage Visitor
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewQRCode(visitor)}
                            >
                              <QrCode className="mr-2 h-4 w-4" />
                              View QR Code
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteVisitor(visitor._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      <Dialog open={visitorCardOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogTitle>details</DialogTitle>
          <VisitorCard vid={selectedvisitor?._id || ""} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// This is needed for the TypeScript error in the component
const Link = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};
