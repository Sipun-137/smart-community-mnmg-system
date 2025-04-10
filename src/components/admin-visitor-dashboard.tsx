"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { format } from "date-fns";
import {
  Check,
  // Download,
  Filter,
  MoreHorizontal,
  QrCode,
  Search,
  Trash2,
  // UserPlus,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/date-range-picker";
import toast, { Toaster } from "react-hot-toast";
import {
  GetAllVisitor,
  RemoveVisitor,
  UpdateStatus,
} from "@/services/VisitorService";

// Sample data - in a real app, this would come from your API/database

interface VisitorI {
  _id: string;
  name: string;
  residentId: {
    name: string;
    email: string;
  };
  visitorId: string;
  phone: string;
  apartmentNo: string;
  visitReason: string;
  visitDate: Date;
  status: string;
  entryTime: Date | null;
  exitTime: Date | null;
  qrCode: string;
}

// Status badge variants
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

export function VisitorAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [apartmentFilter, setApartmentFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visitor, setVisitor] = useState<VisitorI[]>([]);

  // Filter visitors based on search query, status, apartment, and date range
  const filteredVisitors = visitor.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.phone.includes(searchQuery) ||
      visitor.visitReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.residentId.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      visitor.apartmentNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || visitor.status === statusFilter;
    const matchesApartment =
      apartmentFilter === "all" || visitor.apartmentNo === apartmentFilter;

    let matchesDateRange = true;
    if (dateRange?.from && dateRange?.to) {
      const visitDate = new Date(visitor.visitDate);
      const from = new Date(dateRange.from);
      const to = new Date(dateRange.to);
      to.setHours(23, 59, 59, 999); // Include the entire "to" day

      matchesDateRange = visitDate >= from && visitDate <= to;
    }

    return (
      matchesSearch && matchesStatus && matchesApartment && matchesDateRange
    );
  });

  const handleApproveVisitor = async (id: string) => {
    const response = await UpdateStatus(id, "approved");
    if (response.success) {
      toast.success("The visitor has been approved for entry.");
      loadVisitors();
    } else {
      toast.error(response.message);
    }
  };

  const handleRejectVisitor = async (id: string) => {
    const response = await UpdateStatus(id, "rejected");
    if (response.success) {
      toast.success("The visitor has been rejected.");
      loadVisitors();
    } else {
      toast.error(response.message);
    }
  };

  const handleDeleteVisitor = async (id: string) => {
    console.log(id);
    const response = await RemoveVisitor(id);
    if (response.success) {
      toast.error("The visitor has been removed from the system.");
      loadVisitors();
    } else {
      toast.error(response.message);
    }
  };

  // const handleExportData = () => {
  //   toast.success("Visitor data has been exported to CSV.");
  // };

  // Get unique apartment numbers for filter
  const apartments = Array.from(new Set(visitor.map((v) => v.apartmentNo)));

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
        <Toaster position="bottom-right"/>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search visitors, residents, apartments..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 text-black">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {(statusFilter !== "all" ||
                  apartmentFilter !== "all" ||
                  dateRange) && (
                  <Badge
                    variant="secondary"
                    className="ml-2 rounded-sm px-1 font-normal"
                  >
                    {(statusFilter !== "all" ? 1 : 0) +
                      (apartmentFilter !== "all" ? 1 : 0) +
                      (dateRange ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filters</h4>
                  <p className="text-sm text-muted-foreground">
                    Narrow down visitor results
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status
                    </label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="apartment" className="text-sm font-medium">
                      Apartment
                    </label>
                    <Select
                      value={apartmentFilter}
                      onValueChange={setApartmentFilter}
                    >
                      <SelectTrigger id="apartment">
                        <SelectValue placeholder="Select apartment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Apartments</SelectItem>
                        {apartments.map((apt) => (
                          <SelectItem key={apt} value={apt}>
                            {apt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1">
                    <label className="text-sm font-medium">
                      Visit Date Range
                    </label>
                    <DateRangePicker
                      date={dateRange}
                      onDateChange={setDateRange}
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter("all");
                    setApartmentFilter("all");
                    setDateRange(undefined);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* <Button
            variant="outline"
            className="text-black"
            onClick={handleExportData}
          >
            <Download className="mr-2 h-4 w-4 " />
            Export
          </Button> */}

          {/* <Button asChild>
            <NextLink href="/admin/visitors/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Visitor
            </NextLink>
          </Button> */}
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Resident</TableHead>
                    <TableHead>Apartment</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Entry/Exit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
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
                        <TableCell>{visitor.residentId.name}</TableCell>
                        <TableCell>{visitor.apartmentNo}</TableCell>
                        <TableCell>
                          <div>
                            {format(new Date(visitor.visitDate), "PPP")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(visitor.visitDate), "p")}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                        <TableCell>
                          {visitor.entryTime ? (
                            <div className="text-xs">
                              <div>
                                In: {format(new Date(visitor.entryTime), "p")}
                              </div>
                              {visitor.exitTime && (
                                <div>
                                  Out: {format(new Date(visitor.exitTime), "p")}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Not yet entered
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />

                              {visitor.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleApproveVisitor(visitor._id)
                                    }
                                  >
                                    <Check className="mr-2 h-4 w-4 text-green-500" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRejectVisitor(visitor._id)
                                    }
                                  >
                                    <X className="mr-2 h-4 w-4 text-red-500" />
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}

                              {/* <DropdownMenuItem>
                                <QrCode className="mr-2 h-4 w-4" />
                                View QR Code
                              </DropdownMenuItem> */}

                              {/* <DropdownMenuItem asChild>
                                <NextLink
                                  href={`/admin/visitors/edit/${visitor._id}`}
                                >
                                  Edit Details
                                </NextLink>
                              </DropdownMenuItem> */}

                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteVisitor(visitor._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
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
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          {filteredVisitors.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <div className="text-muted-foreground">No visitors found</div>
              <Button asChild className="mt-4" variant="outline">
                <NextLink href="/admin/visitors/new">Add a visitor</NextLink>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVisitors.map((visitor) => (
                <Card key={visitor._id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{visitor.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {visitor.phone}
                        </p>
                      </div>
                      {getStatusBadge(visitor.status)}
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Resident:</div>
                        <div>{visitor.residentId.name}</div>

                        <div className="text-muted-foreground">Apartment:</div>
                        <div>{visitor.apartmentNo}</div>

                        <div className="text-muted-foreground">Visit Date:</div>
                        <div>
                          {format(new Date(visitor.visitDate), "PPP p")}
                        </div>

                        <div className="text-muted-foreground">Reason:</div>
                        <div className="truncate">{visitor.visitReason}</div>

                        {visitor.entryTime && (
                          <>
                            <div className="text-muted-foreground">Entry:</div>
                            <div>
                              {format(new Date(visitor.entryTime), "p")}
                            </div>
                          </>
                        )}

                        {visitor.exitTime && (
                          <>
                            <div className="text-muted-foreground">Exit:</div>
                            <div>{format(new Date(visitor.exitTime), "p")}</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex border-t divide-x">
                    {visitor.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          className="flex-1 rounded-none h-10 text-green-500 hover:text-green-600"
                          onClick={() => handleApproveVisitor(visitor._id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex-1 rounded-none h-10 text-red-500 hover:text-red-600"
                          onClick={() => handleRejectVisitor(visitor._id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}

                    {visitor.status !== "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          className="flex-1 rounded-none h-10"
                        >
                          <QrCode className="mr-2 h-4 w-4" />
                          QR Code
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex-1 rounded-none h-10"
                          asChild
                        >
                          <NextLink
                            href={`/admin/visitors/edit/${visitor._id}`}
                          >
                            Edit
                          </NextLink>
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// This is needed for the TypeScript error in the component
// const Link = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
//   return (
//     <a href={href} className={className}>
//       {children}
//     </a>
//   );
// };
