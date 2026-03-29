"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  Save,
  X,
  Loader2,
  Dot,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconUserFilled } from "@tabler/icons-react";
import { Calendar as Calendaar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { toast } from "sonner";

export type Student = {
  _id: string;
  user: { fullName: string };
  room: { number: string };
  present: boolean | null;
  date: string;
};

export default function AttendanceManager() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const getFormattedDate = (input: string | Date = new Date()): string => {
    const d = new Date(input);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    async function fetchStudents() {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/a/data/attendence?date=${getFormattedDate(date)}`);
        if (response.data.success) {
          const fetchedData = response.data.data || [];
          
          const hasAttendance = fetchedData.some((s: any) => s.attendance !== null);
          setAttendanceStatus(hasAttendance);

          const studentsWithDefault = fetchedData.map((student: any) => ({
            ...student,
            present: student.attendance,
            date: getFormattedDate(date),
          }));
          setStudents(studentsWithDefault);
        }
      } catch (error) {
        toast.error("Failed to fetch students");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudents();
  }, [date]);

  const handleSubmit = async (data: Student[]) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/a/data/attendence", data);
      if (response.data.success) {
        toast.success(attendanceStatus ? "Attendance Updated" : "Attendance Saved");
        setAttendanceStatus(true);
      }
    } catch (error) {
      toast.error("Unexpected Error Occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAll = () => {
    setStudents(students.map((s) => ({
      ...s,
      present: true,
      date: getFormattedDate(date),
    })));
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-5xl mx-auto p-4 md:p-6 overflow-hidden">
      <div className="flex-none space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg border border-border w-full sm:w-auto justify-between sm:justify-start">
            <Dot className={`${attendanceStatus ? "text-green-500" : "text-amber-400"}`} size={40} />
            <div className="flex items-center gap-2 px-3 font-medium text-sm">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-38 justify-between font-normal">
                    <Calendar className="h-4 w-4 mr-2" />
                    {date ? date.toLocaleDateString() : getFormattedDate()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendaar
                    mode="single"
                    selected={date}
                    onSelect={(d) => { setDate(d); setOpen(false); }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={handleMarkAll} className="flex-1 sm:flex-none gap-2 h-9 border-dashed">
              <CheckCircle2 className="h-4 w-4" /> Mark All
            </Button>
            <Button
              disabled={isSubmitting}
              size="sm"
              onClick={() => handleSubmit(students)}
              className="flex-1 sm:flex-none gap-2 h-9"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
              {attendanceStatus ? "Update Attendance" : "Save Attendance"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-1 mb-3">
          <h3 className="font-semibold text-lg">Student List</h3>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">{students.length} Total</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>
        ) : students.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xl text-gray-400">No Data Found</div>
        ) : (
          <ScrollArea className="h-full w-full pr-4">
            <div className="grid gap-3 pb-8">
              {students.map((student) => (
                <Card key={student._id} className="bg-card border-border hover:border-muted-foreground/20 transition-all">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarFallback className="bg-secondary/50"><IconUserFilled size={20} className="text-muted-foreground" /></AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <p className="font-semibold leading-none">{student.user.fullName}</p>
                        <p className="text-sm text-muted-foreground font-medium">Room: {student.room.number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setStudents(students.map((s) => s._id === student._id ? { ...s, present: true, date: getFormattedDate(date) } : s))}
                        variant="outline" size="sm"
                        className={`h-9 ${student.present === true && "text-emerald-500 border-emerald-500/50"}`}
                      >
                        <Check className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Present</span>
                      </Button>
                      <Button
                        onClick={() => setStudents(students.map((s) => s._id === student._id ? { ...s, present: false, date: getFormattedDate(date) } : s))}
                        variant="outline" size="sm"
                        className={`h-9 ${student.present === false && "text-destructive border-destructive/50"}`}
                      >
                        <X className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Absent</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}