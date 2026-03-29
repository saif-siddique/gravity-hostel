"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Calendar,
  Loader2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { getId } from "@/hooks/get-id";
import { formatUtcTime } from "../attendence/page";
import Loader from "@/helper/Loader";

interface IComplaints {
  title: string;
  description: string;
  _id: string | null;
}

interface IComplaintList {
  _id: string;
  title: string;
  description: string;
  status: string;
  updatedAt: Date;
}

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<IComplaints>({
    title: "",
    description: "",
    _id: null,
  });
  const [complaintList, setComplaintList] = useState<IComplaintList[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // For fetching complaints
  const _id = getId();

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/s/complaint?_id=${_id}`);

      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        toast.error(response.data.message);
        // ("data:", response.data.data);
        setComplaintList(response.data.data);
      }
    } catch (error) {
      toast.error("Internal server Error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);
  // For submitting the complaint ok
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const id = getId();

    if (!id) {
      toast.error('Cannot fetch ID please refresh the page');
      return;
    }

    setComplaints({ ...complaints, _id: id });

    if (complaints.title.length < 3 || complaints.description.length < 3) {
      toast.error("Please fill the complaint section properly");
      return;
    }

    try {
      const response = await axios.post("/api/s/complaint", complaints);
      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unexpecter Error Occured");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col w-full bg-background p-4 md:p-8 overflow-hidden">
      <div className="flex-none mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">My Complaints</h1>
            <p className="text-sm text-muted-foreground">
              Report issues and track their status in real-time.
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 h-10 px-5 shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4" />
                New Complaint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25 bg-[#020617] border-slate-800 text-slate-100">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Submit a Complaint
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Describe the issue you are facing. We will address it as soon
                  as possible.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-semibold">
                    Subject
                  </Label>
                  <Input
                    value={complaints.title}
                    onChange={(e) =>
                      setComplaints({ ...complaints, title: e.target.value })
                    }
                    id="subject"
                    placeholder="e.g., Fan not working"
                    className="bg-slate-950 border-slate-800 focus:ring-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-semibold"
                  >
                    Description
                  </Label>
                  <Textarea
                    value={complaints.description}
                    onChange={(e) =>
                      setComplaints({
                        ...complaints,
                        description: e.target.value,
                      })
                    }
                    id="description"
                    placeholder="Provide more details..."
                    className="min-h-30 bg-slate-950 border-slate-800 focus:ring-slate-700"
                  />
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-slate-200 font-bold h-11"
              >
                <Loader isLoading={isSubmitting} className="animate-spin" text="Submit Complaint" />
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* {} */}
      <div className="flex-1 flex flex-co bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <ScrollArea className="flex-1 max-h-[70vh] w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading complaints...</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-border">
                {complaintList.map((item) => (
                  <div
                    key={item._id}
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 transition-all hover:bg-secondary/10"
                  >
                    <div className="hidden sm:flex flex-none h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <MessageSquare size={18} />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-foreground leading-none">
                          {item.title}
                        </h3>
                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 bg-secondary/30 px-2 py-0.5 rounded">
                          <Calendar size={10} /> Submitted on{" "}
                          {formatUtcTime(item.updatedAt.toString())}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-1 group-hover:line-clamp-none transition-all">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center gap-3 sm:items-end flex-none w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-none border-border/50">
                      <StatusBadge status={item.status} />
                      {/* <ChevronRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" /> */}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { color: string; icon: React.ReactNode }> = {
    Pending: {
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      icon: <Clock size={12} />,
    },
    Resolved: {
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      icon: <CheckCircle2 size={12} />,
    },
    Rejected: {
      color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      icon: <XCircle size={12} />,
    },
  };
  status =
    status.toLocaleLowerCase()[0].toUpperCase() +
    status.substring(1, status.length).toLocaleLowerCase(); // What that hell I am doing this is not good approach but who cares

  const config = configs[status];
  return (
    <Badge
      variant="outline"
      className={`${config.color} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border-none shadow-none`}
    >
      {config.icon} {status}
    </Badge>
  );
}
