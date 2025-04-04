"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import Webcam from "react-webcam";
import jsQR from "jsqr";
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
  visitorId: string;
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
  const [scanResult, setScanResult] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamRef.current && canvasRef.current) {
        const video = webcamRef.current.video as HTMLVideoElement;
        if (!video || video.readyState !== 4) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          setScanResult(code.data);
          const id = JSON.parse(code.data).visitorId;
          setScannedVisitorId(id); // QR code text
          clearInterval(interval); // Stop scanning after success
          setShowQrScanner(false);
        }
      }
    }, 500); // Scan every 500ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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

  const handleShowQr = (id: string) => {
    const visitor = filteredVisitors.find((v) => v._id === id);
    if (visitor) {
      const qrData = JSON.stringify({ visitorId: visitor.visitorId });
      setScanResult(qrData);
      setScannedVisitorId(visitor.visitorId);
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

              <div className="flex h-auto items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <div className="animate-pulse text-muted-foreground">
                    <div className="flex flex-col items-center gap-4 p-4">
                      <h2 className="text-lg font-semibold">
                        QR Scanner
                      </h2>

                      {/* Camera QR Scanner */}
                      {!scanResult && (
                        <div className="">
                          <Webcam
                            ref={webcamRef}
                            className="rounded-md shadow-md"
                            screenshotFormat="image/png"
                            videoConstraints={{ facingMode: "environment" }} // Use back camera
                          />
                          <canvas ref={canvasRef} className="hidden" />
                        </div>
                      )}

                      {/* Upload Image to Scan */}

                      {/* Display Scan Result */}
                      {scanResult && (
                        <p className="text-green-600 text-center">
                          Scanned QR Data: {scanResult}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {scannedVisitorId && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-black">
                  <UserCheck className="mr-2 h-4 w-4 text-black" />
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
                  const scanvisitor = visitor.find(
                    (v) => v.visitorId === scannedVisitorId
                  );
                  if (!scanvisitor) return <div>Visitor not found</div>;

                  return (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <div className="font-semibold text-lg">
                          {scanvisitor.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {scanvisitor.phone}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Resident:</div>
                        <div>{scanvisitor.residentId.name}</div>

                        <div className="text-muted-foreground">Apartment:</div>
                        <div>{scanvisitor.apartmentNo}</div>

                        <div className="text-muted-foreground">Visit Date:</div>
                        <div>
                          {format(new Date(scanvisitor.visitDate), "PPP p")}
                        </div>

                        <div className="text-muted-foreground">Reason:</div>
                        <div>{scanvisitor.visitReason}</div>

                        <div className="text-muted-foreground">Status:</div>
                        <div>{getStatusBadge(scanvisitor.status)}</div>
                      </div>

                      <DialogFooter className="gap-2 sm:gap-0">
                        {scanvisitor.status === "approved" && (
                          <>
                            <Button
                              variant="outline"
                              className="text-red-500 border-red-500 hover:bg-red-50"
                              onClick={() => {
                                handleDenyEntry(scanvisitor._id);
                                setScannedVisitorId(null);
                              }}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Deny Entry
                            </Button>
                            <Button
                              onClick={() => {
                                handleRecordEntry(scanvisitor._id);
                                setScannedVisitorId(null);
                              }}
                            >
                              <DoorOpen className="mr-2 h-4 w-4" />
                              Record Entry
                            </Button>
                          </>
                        )}

                        {scanvisitor.status === "active" && (
                          <Button
                            onClick={() => {
                              handleRecordExit(scanvisitor._id);
                              setScannedVisitorId(null);
                            }}
                          >
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

                          <DropdownMenuItem
                            onClick={() => handleShowQr(visitor._id)}
                          >
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
      <Dialog open={!!scannedVisitorId} onOpenChange={() => {setScannedVisitorId(null);setScanResult(null);}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visitor Information</DialogTitle>
            <DialogDescription>
              Details of the scanned visitor.
            </DialogDescription>
          </DialogHeader>

          {(() => {
            const scanvisitor = visitor.find(
              (v) => v.visitorId === scannedVisitorId
            );
            if (!scanvisitor) return <div>Visitor not found</div>;

            return (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="font-semibold text-lg">
                    {scanvisitor.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {scanvisitor.phone}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Resident:</div>
                  <div>{scanvisitor.residentId.name}</div>

                  <div className="text-muted-foreground">Apartment:</div>
                  <div>{scanvisitor.apartmentNo}</div>

                  <div className="text-muted-foreground">Visit Date:</div>
                  <div>{format(new Date(scanvisitor.visitDate), "PPP p")}</div>

                  <div className="text-muted-foreground">Reason:</div>
                  <div>{scanvisitor.visitReason}</div>

                  <div className="text-muted-foreground">Status:</div>
                  <div>{getStatusBadge(scanvisitor.status)}</div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  {scanvisitor.status === "approved" && (
                    <>
                      <Button
                        variant="outline"
                        className="text-red-500 border-red-500 hover:bg-red-50"
                        onClick={() => {
                          handleDenyEntry(scanvisitor._id);
                          setScannedVisitorId(null);
                        }}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Deny Entry
                      </Button>
                      <Button
                        onClick={() => {
                          handleRecordEntry(scanvisitor._id);
                          setScannedVisitorId(null);
                        }}
                      >
                        <DoorOpen className="mr-2 h-4 w-4" />
                        Record Entry
                      </Button>
                    </>
                  )}

                  {scanvisitor.status === "active" && (
                    <Button
                      onClick={() => {
                        handleRecordExit(scanvisitor._id);
                        setScannedVisitorId(null);
                      }}
                    >
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
