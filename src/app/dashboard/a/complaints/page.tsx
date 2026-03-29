"use client";
import React, { useEffect, useState } from "react";
import {
  Filter,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  MessageSquare,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { toast } from "sonner";
import { formatUtcTime } from "../../s/attendence/page";

export interface IRecord {
  id: string;
  title: string;
  number: string;
  date: string;
  description: string;
  status: "PENDING" | "REJECTED" | "RESOLVED";
}

export default function ComplaintsManagement() {
  const [filter, setFilter] = useState("all");
  const [complaintsData, setComplaintsData] = useState<IRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const complaints = async () => {
    try {
      const response = await axios.get(`/api/a/complaint`);

      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        setComplaintsData(response.data.data);
      }
    } catch (error) {
      toast.error("Internal server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    complaints();
  }, []);

  const filteredComplaints = complaintsData.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  return (
    <div className="flex flex-col w-full min-h-0 p-4 md:p-6">
      <div className="flex-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Complaints</h1>
          <p className="text-sm text-muted-foreground">
            Track and resolve student issues
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <Select defaultValue="all" onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-45 bg-card border-border h-10">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Complaints</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-[calc(100vh-200px)] w-full">
          <div className="space-y-3 pr-2">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-full h-32 rounded-xl bg-secondary/20 animate-pulse border border-border"
                  />
                ))}
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function ComplaintCard({ complaint }: { complaint: IRecord }) {
  const [status, setStatus] = useState(complaint.status);
  const [loading, setLoading] = useState(false);

  async function handleStatusUpdate(newStatus: string) {
    if (status === newStatus || loading) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/a/complaint", {
        _id: complaint.id,
        status: newStatus,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setStatus(newStatus as any);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Unexpected Error Occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-card border-border hover:border-muted-foreground/20 transition-all">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Content Section */}
          <div className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-bold text-base leading-tight truncate">
                  {complaint.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 shrink-0" />
                    <span className="truncate">{complaint.number}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 shrink-0" />
                    {formatUtcTime(complaint.date)}
                  </span>
                </div>
              </div>
              <StatusBadge status={status} />
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 italic">
              "{complaint.description}"
            </p>
          </div>

          {/* Actions Section */}
          <div className="bg-secondary/20 border-t border-border p-3">
            {status === "PENDING" ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loading}
                  className="flex-1 gap-1.5 border-destructive/50 text-destructive hover:bg-destructive/10 text-xs"
                  onClick={() => handleStatusUpdate("REJECTED")}
                >
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
                <Button
                  size="sm"
                  disabled={loading}
                  className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs"
                  onClick={() => handleStatusUpdate("RESOLVED")}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                disabled={loading}
                className="w-full gap-2 text-muted-foreground hover:text-foreground text-xs"
                onClick={() => handleStatusUpdate("PENDING")}
              >
                <RefreshCcw className="h-3.5 w-3.5" /> Reopen
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: any = {
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Badge
      variant="outline"
      className={`${variants[status]} border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider`}
    >
      {status}
    </Badge>
  );
}