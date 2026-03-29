"use client";
import React, { useEffect, useState } from "react";
import {
  Download,
  Wallet,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getId } from "@/hooks/get-id";
import { toast } from "sonner";
import axios from "axios";

// 1. Updated Interface to include 'status'
export interface IFeeVoucher {
  _id: string;
  amount: number;
  roomRent: number;
  messFee: number;
  dueDate: string;
  createdAt: string;
  month: number;
  year: number;
  status: string;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function ResponsiveFinancialDashboard() {
  const [feeRecords, setFeeRecords] = useState<IFeeVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ currentDue: 0, totalPaid: 0 });

  useEffect(() => {
    let calculatedDue = 0;
    let calculatedPaid = 0;
    feeRecords.forEach((record) => {
      const status = record.status?.toLowerCase();

      if (status !== "paid") {
        calculatedDue += record.amount;
      } else {
        calculatedPaid += record.amount;
      }
    });
    setStats({
      currentDue: calculatedDue,
      totalPaid: calculatedPaid,
    });
  }, [feeRecords]);

  const fetchRecords = async () => {
    try {
      const _id = getId();
      if (!_id) {
        toast.error("Failed to get User Id");
        return;
      }
      const response = await axios.post("/api/s/getfees", { _id });

      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        setFeeRecords(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching fees:", error);
      toast.error("Could not load fee records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="w-full bg-background p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="CURRENT DUE"
          amount={stats.currentDue}
          icon={<Wallet className="h-4 w-4 text-blue-400" />}
        />
        <StatCard
          title="TOTAL PAID (2025)"
          amount={stats.totalPaid}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
          trend={<ArrowUpRight className="h-3 w-3 inline ml-1 opacity-50" />}
        />
        <StatCard
          title="LATE CHARGES"
          amount="0"
          icon={<Clock className="h-4 w-4 text-amber-400" />}
          className="sm:col-span-2 lg:col-span-1"
        />
      </div>

      {/* --- TABLE SECTION --- */}
      <Card className="bg-card border-border rounded-2xl overflow-hidden shadow-sm">
        <ScrollArea className="w-full">
          <div className="min-w-150">
            <ScrollArea className="max-h-[50vh] w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center p-10">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-secondary/20">
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="pl-6 h-10 text-[11px] uppercase font-bold text-muted-foreground">
                        Billing Month
                      </TableHead>
                      <TableHead className="h-10 text-[11px] uppercase font-bold text-muted-foreground text-center">
                        Status
                      </TableHead>
                      <TableHead className="h-10 text-[11px] uppercase font-bold text-muted-foreground text-right">
                        Rent / Mess
                      </TableHead>
                      <TableHead className="h-10 text-[11px] uppercase font-bold text-muted-foreground text-right pr-6">
                        Total Amount
                      </TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeRecords.map((fee) => (
                      <TableRow
                        key={fee._id}
                        className="border-border hover:bg-secondary/10 transition-colors group"
                      >
                        {/* 1. Month & Due Date */}
                        <TableCell className="pl-6 py-4">
                          <div className="font-bold text-sm">
                            {months[fee.month - 1]} {fee.year}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Due: {format(new Date(fee.dueDate), "MMM dd, yyyy")}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex justify-center">
                            {fee.status == "paid" ? (
                              <div className="flex items-center justify-center gap-2 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px] border border-emerald-500/20">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                PAID
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2 px-2 py-1 rounded-full bg-red-500/10 text-red-500 font-bold text-[10px] border border-red-500/20">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                UNPAID
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* 3. Breakdown */}
                        <TableCell className="text-right text-muted-foreground text-xs font-medium">
                          {fee.roomRent.toLocaleString()} /{" "}
                          {fee.messFee.toLocaleString()}
                        </TableCell>

                        {/* 4. Total Amount */}
                        <TableCell className="text-right pr-6">
                          <div className="font-black text-sm">
                            PKR {fee.amount.toLocaleString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>
    </div>
  );
}

// COMPACT STAT CARD COMPONENT
function StatCard({
  title,
  amount,
  subtitle,
  icon,
  action,
  trend,
  className,
}: any) {
  return (
    <Card className={`border-border bg-card/40 overflow-hidden ${className}`}>
      <CardContent className="p-4 flex flex-col justify-between h-full min-h-35">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-secondary/50 rounded-xl border border-border">
            {icon}
          </div>
          {action}
        </div>
        <div className="space-y-0.5 mt-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-xl md:text-2xl font-black tracking-tighter">
              PKR {amount}
            </h3>
            {trend}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium italic">
            {subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
