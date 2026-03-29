"use client";

import ClientOnly from "@/components/client-only";
import { SectionCards } from "@/components/section-cards";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CreditCard,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";
import GradientText from "@/components/GradientText";
import { ScrollArea } from "@/components/ui/scroll-area";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface IIncomingData {
  _id: string;
  userDetails: {
    fullName: string;
  };
}

interface IVoucher {
  _id: string;
  student: string;
  month: number;
  year: number;
  amount: number;
  roomRent: number;
  messFee: number;
  status: string;
  dueDate: string;
}

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [findSearch, setFindSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const debounced = useDebounceCallback(setFindSearch, 500);

  const [incomingData, setincomingData] = useState<IIncomingData[]>([]);
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);

  const [isFetchingVouchers, setIsFetchingVouchers] = useState(false);
  const [payingVoucherId, setPayingVoucherId] = useState<string | null>(null);

  const isSearching = inputValue.length > 0;

  useEffect(() => {
    const handleSearch = async () => {
      if (!findSearch) {
        setincomingData([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post("/api/a/pay-voucher", {
          prompt: findSearch,
        });

        if (response.data.success) {
          setincomingData(response.data.data);
        }
      } catch (error) {
        toast.error("Student record not found");
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [findSearch]);

  const handleFetchVouchers = async (student: IIncomingData) => {
    setIsFetchingVouchers(true);
    setVouchers([]);
    try {
      const response = await axios.post("/api/a/pay", { _id: student._id });
      if (response.data.success) {
        setVouchers(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Unable to fetch vouchers");
    } finally {
      setIsFetchingVouchers(false);
    }
  };

  const handlePayment = async ({
    voucherId,
    amount,
  }: {
    voucherId: string;
    amount: number;
  }) => {
    setPayingVoucherId(voucherId); 
    try {
      const res = await axios.post("/api/a/process-payment", {
        voucherId,
        amount,
      });

      if (res.data.success) {
        toast.success("Payment successful!");
        setVouchers((prev) => prev.filter((v) => v._id !== voucherId));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Payment failed";
      toast.error(errorMessage);
    } finally {
      setPayingVoucherId(null);
    }
  };

  const GradientColors = ["#5227FF", "#FF9FFC", "#B19EEF"];

  return (
    <ClientOnly>
      <div className="min-h-screen flex flex-col pb-20">
        <AnimatePresence>
          {!isSearching && (
            <motion.div
              initial={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, overflow: "hidden" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
              </div>

              <h2 className="scroll-m-20 px-4 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                <GradientText
                  colors={GradientColors}
                  animationSpeed={8}
                  showBorder={false}
                  className="text-4xl md:text-5xl font-bold tracking-tight"
                >
                  Pay voucher now
                </GradientText>
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout className="p-6 max-w-4xl mx-auto w-full space-y-6">
          <div className="flex flex-wrap items-center gap-4 bg-secondary/30 p-4 rounded-xl border shadow-sm">
            <div className="relative flex-1 min-w-62.5">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="CNIC, Ph.no or ID"
                className="pl-9"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  debounced(e.target.value);
                }}
              />
              {loading && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-primary" />
              )}
            </div>
            {vouchers.length > 0 && (
              <Button variant="ghost" onClick={() => setVouchers([])}>
                Back to Search
              </Button>
            )}
          </div>

          <AnimatePresence>
            {isSearching &&
              incomingData.length > 0 &&
              vouchers.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <ScrollArea className="h-96 w-full rounded-md border p-4 bg-background/50">
                    <div className="flex flex-col gap-3">
                      {incomingData.map((item, index) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors cursor-pointer group">
                            <div className="flex flex-col">
                              <h3 className="font-medium text-sm md:text-base">
                                {item.userDetails?.fullName ||
                                  "Unknown Student"}
                              </h3>
                              <p className="text-xs text-muted-foreground font-mono">
                                ID: {item._id}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                              onClick={() => handleFetchVouchers(item)}
                              disabled={isFetchingVouchers}
                            >
                              {isFetchingVouchers ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "GO"
                              )}
                            </Button>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
          </AnimatePresence>

          <AnimatePresence>
            {vouchers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="border-b pb-2">
                  <h3 className="text-xl font-bold text-primary">
                    Pending Vouchers
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Select a voucher to mark as paid
                  </p>
                </div>

                <div className="grid gap-4">
                  {vouchers.map((voucher) => (
                    <Card
                      key={voucher._id}
                      className="overflow-hidden border-l-4 border-l-yellow-500 shadow-md"
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-secondary/10 gap-4">
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="bg-primary/10 p-3 rounded-full hidden sm:block">
                              <CalendarIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">
                                {months[voucher.month - 1]} {voucher.year}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Due Date:{" "}
                                {new Date(voucher.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="text-right w-full sm:w-auto">
                            <p className="text-2xl font-black text-primary">
                              PKR {voucher.amount.toLocaleString()}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${voucher.status === "paid" ? "bg-green-500" : "bg-red-500"} uppercase tracking-wider`}
                            >
                              {voucher.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="px-4 py-2 flex flex-wrap gap-x-6 gap-y-2 text-xs border-t bg-background/50 text-muted-foreground">
                          <span className="flex gap-1">
                            Room Rent:{" "}
                            <strong className="text-foreground">
                              PKR {voucher.roomRent}
                            </strong>
                          </span>
                          <span className="flex gap-1">
                            Mess Fee:{" "}
                            <strong className="text-foreground">
                              PKR {voucher.messFee}
                            </strong>
                          </span>
                        </div>

                        <Button
                          disabled={voucher.status === "paid"}
                          className="w-full rounded-none h-12 gap-2 text-md font-semibold transition-all active:scale-[0.98]"
                          onClick={() =>
                            handlePayment({
                              voucherId: voucher._id,
                              amount: voucher.amount,
                            })
                          }
                        >
                          {voucher.status === "paid" ? (
                            "Already Payed"
                          ) : payingVoucherId === voucher._id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <CreditCard className="h-5 w-5" />
                          )}
                          {voucher.status !== "paid" &&
                            "Confirm & Pay Voucher "}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </ClientOnly>
  );
};

export default Page;
