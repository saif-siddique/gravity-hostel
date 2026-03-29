"use client";
// done
import React, { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import {
  CalendarIcon,
  Calculator,
  CheckCircle2,
  Users,
  User,
  Loader2,
} from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { toast } from "sonner";

// --- CONFIGURATION ---
const ROOM_RATES: Record<string, number> = {
  standard: 15000,
  deluxe: 20000,
  suite: 25000,
};

// --- MOCK DATA ---

interface IAllStudentData {
  _id: string;
  name: string;
  roomType: string;
  room: string;
}

const AssignVoucher = () => {
  // --- STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [messFee, setMessFee] = useState<number>(5000);
  const [allStudentData, setAllStudentData] = useState<IAllStudentData[]>([]);
  // const [unpaidStudent, setUnpaidStudent] = useState<IAllStudentData[]>([])

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 10),
  });

  // Single Student State
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [singleStudentRent, setSingleStudentRent] = useState<number>(0);
  const [singleRoomType, setSingleRoomType] = useState<string>("");

  // --- LOGIC: Single Student ---
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    const student = allStudentData.find((s) => s._id === studentId);
    if (student) {
      setSingleStudentRent(ROOM_RATES[student.roomType] || 0);
      setSingleRoomType(student.roomType);
    }
  };

  const handleSingleSubmit = async () => {
    if (!selectedStudentId || !date?.from || !date?.to) return;

    setIsLoading(true);
    const payload = {
      student: selectedStudentId,
      month: date.from.getMonth() + 1,
      year: date.from.getFullYear(),
      roomRent: singleStudentRent,
      messFee: messFee,
      amount: singleStudentRent + messFee,
      dueDate: date.to,
      status: "unpaid",
    };

    try {
      const response = await axios.post("/api/a/one-voucher", payload);

      if (response.data.success) {
        setAllStudentData((prev) =>
          prev.filter((s) => s._id !== selectedStudentId),
        );
        setSelectedStudentId("");
      }
    } catch (error: any) {
      // Handle duplicate error specifically
      if (error.response?.status === 409) {
        toast.error("Voucher already exists for this student.");
      } else {
        toast.error("Failed to generate voucher.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkSubmit = async () => {
    if (!date?.from || !date?.to) return;

    setIsLoading(true);

    const bulkPayload = allStudentData.map((student) => {
      const rent = ROOM_RATES[student.roomType] || 0;
      return {
        student: student._id,
        month: date.from!.getMonth() + 1,
        year: date.from!.getFullYear(),
        roomRent: rent,
        messFee: messFee,
        amount: rent + messFee,
        dueDate: date.to,
        status: "unpaid",
      };
    });

    try {
      // Call the new Bulk Route
      const response = await axios.post("/api/a/bulk-vouchers", bulkPayload);

      if (response.data.success) {
        setAllStudentData([]);
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 409) {
        toast.warning("All these students already have vouchers.");
      } else {
        toast.error("Error while generating bulk vouchers");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // one seecond why would we include those student who had already assigned voucher

  // const getStudents = async () => {
  //   try {
  //       const response = await axios.get('/api/a/get-for-voucher')
  //       if (!response.data.success) {
  //           toast.error("No Students found");
  //       }
  //       else {
  //           setAllStudentData(response.data.data);
  //       }
  //   } catch (error) {
  //       toast.error("user not fetched")
  //   }
  // }

  const getUnpaidStudents = async () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    try {
      const response = await axios.get(
        `/api/a/unpaid-student?month=${month}&year=${year}`,
      );
      if (!response.data.success) {
        toast.error("No Students found");
      } else {
        setAllStudentData(response.data.data);
      }
    } catch (error) {
      toast.error("user not fetched");
    }
  };

  useEffect(() => {
    // getStudents();
    getUnpaidStudents();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Fee Management
              </CardTitle>
              <CardDescription>
                Assign monthly vouchers to students.
              </CardDescription>
            </div>
            {/* Date Range Picker (Global for both Tabs) */}
            <div className="grid mt-3 sm:mt-0 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-65 justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Label className="text-[10px] text-muted-foreground text-right px-1">
                From: Voucher Month | To: Due Date
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="single">Single Student</TabsTrigger>
              <TabsTrigger value="bulk">Assign to All</TabsTrigger>
            </TabsList>

            {/* --- TAB 1: Single Student --- */}
            <TabsContent value="single" className="space-y-4">
              <div className="grid gap-4 p-4 border rounded-lg bg-secondary/20">
                <div className="space-y-2">
                  <Label>Select Student</Label>
                  <Select
                    onValueChange={handleStudentSelect}
                    value={selectedStudentId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Search student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allStudentData.map((s) => (
                        <SelectItem key={s._id} value={s._id}>
                          {s.name}{" "}
                          <span className="text-xs text-muted-foreground">
                            ({s.roomType})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Room Rent (Auto)</Label>
                    <Input
                      readOnly
                      disabled
                      value={singleStudentRent ? `PKR ${singleStudentRent}` : "-"}
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mess Fee</Label>
                    <Input
                      type="number"
                      value={messFee}
                      onChange={(e) => setMessFee(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleSingleSubmit}
                disabled={isLoading || !selectedStudentId}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <User className="mr-2 h-4 w-4" />
                )}
                Generate Voucher (PKR{" "}
                {(singleStudentRent + messFee).toLocaleString()})
              </Button>
            </TabsContent>

            {/* --- TAB 2: Bulk Assign (Assign to All) --- */}
            <TabsContent value="bulk" className="space-y-6">
              <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4 border border-yellow-200 dark:border-yellow-900">
                <div className="flex">
                  <div className="shrink-0">
                    <CheckCircle2
                      className="h-5 w-5 text-yellow-600 dark:text-yellow-500"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      Bulk Voucher Generation
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                      <p>
                        This will generate vouchers for{" "}
                        <strong>{allStudentData.length} active students</strong>
                        . Room rents will be calculated automatically based on
                        their assigned room types.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Voucher Month</Label>
                    <Input
                      readOnly
                      value={
                        date?.from
                          ? format(date.from, "MMMM yyyy")
                          : "Select Date Range"
                      }
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Common Mess Fee</Label>
                    <Input
                      type="number"
                      value={messFee}
                      onChange={(e) => setMessFee(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-muted/50">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-muted-foreground">
                      Est. Total Collection
                    </span>
                    <span className="font-mono font-bold">
                      PKR{" "}
                      {allStudentData
                        .reduce(
                          (acc, curr) =>
                            acc + (ROOM_RATES[curr.roomType] || 0) + messFee,
                          0,
                        )
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Due Date</span>
                    <span className="font-medium">
                      {date?.to ? format(date.to, "PPP") : "Not selected"}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                variant="default"
                onClick={handleBulkSubmit}
                disabled={isLoading || !date?.from || !date?.to}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Users className="mr-2 h-4 w-4" />
                )}
                Assign to All {allStudentData.length} Students
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignVoucher;
