"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  ChevronDown,
  DoorOpen,
  LogOut,
  QrCode,
  Search,
  UserCheck,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast, { Toaster } from "react-hot-toast";
import {
  GetAllVisitor,
  updateEntrytime,
  updateExitTime,
  UpdateStatus,
} from "@/services/VisitorService";

interface VisitorI {
  _id: string;
  name: string;
  vistorId: string;
  residentId: {
    name: string;
    email: string;
  };
  phone: string;
  apartmentNo: string;
  visitReason: string;
  visitDate: Date;
  status: string;
  entryTime: Date | null;
  exitTime: Date | null;
}

// Sample data - in a real app, this would come from your API/database
const sampleVisitors = [
  {
    id: "67d268fbdb384a4dda063dae",
    name: "Ashutosh Biswal",
    residentId: "67a14ab3be2b36216eaec7f3",
    residentName: "John Smith",
    residentApartment: "B-24",
    visitorId: "b45343bd-ffe4-4ac9-a8f8-f8ffa6438811",
    phone: "8547962385",
    apartmentNo: "B-24",
    visitReason: "for visiting the friend",
    visitDate: "2025-03-20T13:00:00.001Z",
    status: "approved",
    entryTime: null,
    exitTime: null,
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
  },
  {
    id: "67d268fbdb384a4dda063db0",
    name: "Rahul Sharma",
    residentId: "67a14ab3be2b36216eaec7f4",
    residentName: "Emily Johnson",
    residentApartment: "C-12",
    visitorId: "d45343bd-ffe4-4ac9-a8f8-f8ffa6438813",
    phone: "9876543210",
    apartmentNo: "C-12",
    visitReason: "for maintenance work",
    visitDate: "2025-03-25T10:30:00.000Z",
    status: "approved",
    entryTime: null,
    exitTime: null,
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
  },
  {
    id: "67d268fbdb384a4dda063db3",
    name: "Neha Gupta",
    residentId: "67a14ab3be2b36216eaec7f7",
    residentName: "David Lee",
    residentApartment: "B-10",
    visitorId: "g45343bd-ffe4-4ac9-a8f8-f8ffa6438816",
    phone: "8527419630",
    apartmentNo: "B-10",
    visitReason: "for business meeting",
    visitDate: "2025-03-22T09:00:00.000Z",
    status: "approved",
    entryTime: null,
    exitTime: null,
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
  },
  {
    id: "67d268fbdb384a4dda063daf",
    name: "Sipun Kumar",
    residentId: "67a14ab3be2b36216eaec7f3",
    residentName: "John Smith",
    residentApartment: "B-24",
    visitorId: "c45343bd-ffe4-4ac9-a8f8-f8ffa6438812",
    phone: "8547962345",
    apartmentNo: "B-24",
    visitReason: "for visiting the aunt",
    visitDate: "2025-03-13T05:11:23.339Z",
    status: "active",
    entryTime: "2025-03-13T05:30:00.000Z",
    exitTime: null,
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
  },
  {
    id: "67d268fbdb384a4dda063db4",
    name: "Vikram Malhotra",
    residentId: "67a14ab3be2b36216eaec7f8",
    residentName: "Jennifer Taylor",
    residentApartment: "E-07",
    visitorId: "h45343bd-ffe4-4ac9-a8f8-f8ffa6438817",
    phone: "7539514682",
    apartmentNo: "E-07",
    visitReason: "for plumbing repair",
    visitDate: "2025-03-15T11:30:00.000Z",
    status: "active",
    entryTime: "2025-03-15T11:35:00.000Z",
    exitTime: null,
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
  },
];

// Status badge variants
const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return (
        <Badge variant="outline" className="border-green-500 text-green-500">
          Ready for Entry
        </Badge>
      );
    case "active":
      return <Badge variant="success">Inside Premises</Badge>;
    case "completed":
      return <Badge variant="secondary">Visit Completed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export function SecurityDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [scannedVisitorId, setScannedVisitorId] = useState<string | null>(null);
  const [visitor, setVisitor] = useState<VisitorI[]>([]);

  // Filter visitors based on search query
  const filteredVisitors = visitor.filter((visitor) => {
    return (
      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.phone.includes(searchQuery) ||
      visitor.apartmentNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.residentId.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Separate visitors by status
  const approvedVisitors = filteredVisitors.filter(
    (v) => v.status === "approved"
  );
  const activeVisitors = filteredVisitors.filter((v) => v.status === "active");

  const handleRecordEntry = async (id: string) => {
    const response = await updateEntrytime(id);
    if (response.success) {
      toast.success("Visitor entry has been recorded successfully.");
      loadVisitors();
    } else {
      toast.error("Failed to record entry time.");
    }
  };

  const handleRecordExit = async (id: string) => {
    const response = await updateExitTime(id);
    if (response.success) {
      loadVisitors();
      toast.error("Visitor exit has been recorded successfully.");
    } else {
      toast.error("Failed to record exit time.");
    }
  };

  const handleScanQrCode = () => {
    setShowQrScanner(true);
    // In a real app, this would activate the camera for QR scanning

    // Simulate a successful scan after 2 seconds
    setTimeout(() => {
      setShowQrScanner(false);
      setScannedVisitorId(sampleVisitors[0].id);
      toast.error(`Qr Scanned\nVisitor identified: ${sampleVisitors[0].name}`);
    }, 2000);
  };

  const handleDenyEntry = async (id: string) => {
    const response = await UpdateStatus(id, "rejected");
    if (response.success) {
      loadVisitors();
      toast.success("Visitor entry has been denied.");
    } else {
      toast.error("Failed to Deny.");
    }
  };

  const loadVisitors = async () => {
    const response = await GetAllVisitor();
    if (response.success) {
      setVisitor(response.visitors);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

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
          <Dialog open={showQrScanner} onOpenChange={setShowQrScanner}>
            <DialogTrigger asChild>
              <Button onClick={handleScanQrCode}>
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Scanning QR Code</DialogTitle>
                <DialogDescription>
                  Please position the QR code in front of the camera.
                </DialogDescription>
              </DialogHeader>
              <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <div className="animate-pulse text-muted-foreground">
                    Scanning...
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {scannedVisitorId && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Scanned Visitor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Visitor Information</DialogTitle>
                  <DialogDescription>
                    Details of the scanned visitor.
                  </DialogDescription>
                </DialogHeader>

                {(() => {
                  const visitor = sampleVisitors.find(
                    (v) => v.id === scannedVisitorId
                  );
                  if (!visitor) return <div>Visitor not found</div>;

                  return (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <div className="font-semibold text-lg">
                          {visitor.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {visitor.phone}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Resident:</div>
                        <div>{visitor.residentName}</div>

                        <div className="text-muted-foreground">Apartment:</div>
                        <div>{visitor.apartmentNo}</div>

                        <div className="text-muted-foreground">Visit Date:</div>
                        <div>
                          {format(new Date(visitor.visitDate), "PPP p")}
                        </div>

                        <div className="text-muted-foreground">Reason:</div>
                        <div>{visitor.visitReason}</div>

                        <div className="text-muted-foreground">Status:</div>
                        <div>{getStatusBadge(visitor.status)}</div>
                      </div>

                      <DialogFooter className="gap-2 sm:gap-0">
                        {visitor.status === "approved" && (
                          <>
                            <Button
                              variant="outline"
                              className="text-red-500 border-red-500 hover:bg-red-50"
                              onClick={() => handleDenyEntry(visitor.id)}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Deny Entry
                            </Button>
                            <Button
                              onClick={() => handleRecordEntry(visitor.id)}
                            >
                              <DoorOpen className="mr-2 h-4 w-4" />
                              Record Entry
                            </Button>
                          </>
                        )}

                        {visitor.status === "active" && (
                          <Button onClick={() => handleRecordExit(visitor.id)}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Record Exit
                          </Button>
                        )}
                      </DialogFooter>
                    </div>
                  );
                })()}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <DoorOpen className="mr-2 h-5 w-5 text-green-500" />
              Pending Entry ({approvedVisitors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {approvedVisitors.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <div className="text-muted-foreground">
                  No visitors waiting for entry
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedVisitors.map((visitor) => (
                  <div
                    key={visitor._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{visitor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {visitor.apartmentNo} •{" "}
                        {format(new Date(visitor.visitDate), "p")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => handleDenyEntry(visitor._id)}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={() => handleRecordEntry(visitor._id)}
                      >
                        <DoorOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <UserCheck className="mr-2 h-5 w-5 text-blue-500" />
              Currently Inside ({activeVisitors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeVisitors.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <div className="text-muted-foreground">
                  No visitors currently inside
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {activeVisitors.map((visitor) => (
                  <div
                    key={visitor._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{visitor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {visitor.apartmentNo} • Entered:{" "}
                        {format(new Date(visitor.entryTime!), "p")}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="h-8"
                      onClick={() => handleRecordExit(visitor._id)}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Today&apos;s Visitor Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitor</TableHead>
                <TableHead>Apartment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Exit Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisitors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No visitors found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVisitors.map((visitor) => (
                  <TableRow key={visitor._id}>
                    <TableCell>
                      <div className="font-medium">{visitor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {visitor.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{visitor.apartmentNo}</div>
                      <div className="text-sm text-muted-foreground">
                        {visitor.residentId.name}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                    <TableCell>
                      {visitor.entryTime ? (
                        format(new Date(visitor.entryTime), "p")
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {visitor.exitTime ? (
                        format(new Date(visitor.exitTime), "p")
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {visitor.status === "approved" && (
                            <DropdownMenuItem
                              onClick={() => handleRecordEntry(visitor._id)}
                            >
                              <DoorOpen className="mr-2 h-4 w-4" />
                              Record Entry
                            </DropdownMenuItem>
                          )}

                          {visitor.status === "active" && (
                            <DropdownMenuItem
                              onClick={() => handleRecordExit(visitor._id)}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Record Exit
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem>
                            <QrCode className="mr-2 h-4 w-4" />
                            View QR Code
                          </DropdownMenuItem>

                          {visitor.status === "approved" && (
                            <DropdownMenuItem
                              onClick={() => handleDenyEntry(visitor._id)}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Deny Entry
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// This is needed for the TypeScript error in the component
// const Link = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
//   return (
//     <a href={href} className={className}>
//       {children}
//     </a>
//   )
// }
