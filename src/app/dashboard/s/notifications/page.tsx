"use client";
import React, { useEffect, useState } from "react";
import { Bell, MoreHorizontal, Calendar, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getId } from "@/hooks/get-id";
import { toast } from "sonner";
import { formatUtcTime } from "../attendence/page";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  isNew?: boolean;
}

export default function NotificationPage() {
  const [notificationList, setNotificationList] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getNotification = async () => {
    try {
      const id = getId();
      const response = await axios.post("/api/s/getnotification", {
        _id: id,
      });

      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        setNotificationList(response.data.data);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getNotification();
  }, []);
  return (
    <div className="flex flex-col w-full bg-background p-4 md:p-8 overflow-hidden">
      <div className="flex-none mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Notifications
              </h1>
              <p className="text-sm text-muted-foreground">
                Stay updated with hostel announcements
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <ScrollArea className="max-h-[70vh] w-full">
          <div className="divide-y divide-border">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading notifications...</p>
              </div>
            ) : notificationList.length > 0 ? (
              notificationList.map((notif, index) => (
                <div
                  key={`${notif._id}-${index}`}
                  className={`group flex items-start gap-4 p-5 transition-colors hover:bg-secondary/20 cursor-pointer ${notif.isNew ? "bg-primary/2" : ""
                    }`}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3
                        className={`text-sm font-semibold tracking-tight ${notif.isNew
                          ? "text-foreground"
                          : "text-muted-foreground"
                          }`}
                      >
                        {notif.title}
                      </h3>
                      <div className="flex items-center gap-3 flex-none">
                        <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 font-medium whitespace-nowrap">
                          <Calendar className="h-3 w-3" />
                          {formatUtcTime(notif.createdAt)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <Bell className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            )}
          </div>
          <div className="h-6" />
        </ScrollArea>
      </div>
    </div>
  );
}
