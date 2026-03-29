"use client";
import React, { useEffect, useState } from "react";
import { Users, User, Send, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

const notificationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  studentId: z.string().optional(),
});

export interface Notification {
  title: string;
  message: string;
  studentId?: string;
}

interface ISudentDate{
  _id: string;
  fullName: string;
  roomNumber: string
}
export default function NotificationComposer() {
  const [target, setTarget] = useState<"all" | "specific">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [incommingStudents, setIncommingStudents] = useState<ISudentDate[] | []>([]);

  
  const [notification, setNotification] = useState<Notification>({
    title: "",
    message: "",
    studentId: "",
  });

  const handleSend = async () => {
    const payload = {
      ...notification,
      studentId: target === "all" ? undefined : notification.studentId,
    };

    if (target === "specific" && !payload.studentId) {
      toast.error("Please select a student to send the notification to.");
      return;
    }

    const validation = notificationSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/a/data/send-notification", payload);

      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        setNotification({ title: "", message: "", studentId: "" });
        setTarget("all"); 
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while sending notification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecific = async () => {
    try {
      const response = await axios.get('/api/a/data/get-student')
      if (!response.data.success) {
        toast.error(response.data.message)
      }
      else {
        setIncommingStudents(response.data.data)
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    handleSpecific();
  }, [])

  return (
    <div className="p-4 md:px-8 max-w-4xl mx-auto space-y-3">
      <Card className="bg-card border-border">
        <CardContent className="space-y-8 pt-2">
          
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Target Audience</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => setTarget("all")}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all space-y-2 ${
                  target === "all"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-transparent text-muted-foreground hover:border-muted-foreground/50"
                }`}
              >
                <Users className="h-6 w-6" />
                <span className="font-bold">All Students</span>
              </button>

              <button
                onClick={() => {setTarget("specific");}}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all space-y-2 ${
                  target === "specific"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-transparent text-muted-foreground hover:border-muted-foreground/50"
                }`}
              >
                <User className="h-6 w-6" />
                <span className="font-bold">Specific Student</span>
              </button>
            </div>  
          </div>

          {target === "specific" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-sm font-semibold">Select Student</Label>
              <Select
                value={notification.studentId}
                onValueChange={(value) =>
                  setNotification({ ...notification, studentId: value })
                }
              >
                <SelectTrigger className="w-full bg-secondary/50 border-border h-4">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  { incommingStudents.map((student) => (
                    <SelectItem key={`${student._id}`} value={`${student._id}`}>{`${student.fullName} (Room ${student.roomNumber})`}</SelectItem>
                  ))}
                  {/*<SelectItem value="2">Ahmed Raza (Room 209)</SelectItem>
                  <SelectItem value="3">Bilal Khan (Room 309)</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Title</Label>
            <Input
              value={notification.title}
              onChange={(e) =>
                setNotification({ ...notification, title: e.target.value })
              }
              placeholder="Announcement Title"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Message</Label>
            <Textarea
              value={notification.message}
              onChange={(e) =>
                setNotification({ ...notification, message: e.target.value })
              }
              placeholder="Type your announcement here..."
              className="min-h-17 break-all max-w-80 sm:max-w-90 bg-secondary/30 border-border resize-none focus-visible:ring-primary/20"
            />
          </div>

          <Button
            disabled={isLoading}
            onClick={handleSend}
            className="w-full h-12 text-lg font-semibold gap-2 shadow-lg"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Send Notification</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}