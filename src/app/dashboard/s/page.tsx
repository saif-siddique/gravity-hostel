"use client";
import React, { useState, useEffect } from "react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { Card, CardContent } from "@/components/ui/card";
import GradentText from "@/components/GradientText";
import {
  Phone,
  Mail,
  MapPin,
  User,
  Users,
  CreditCard,
  Calendar,
  Bell,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getId } from "@/hooks/get-id";
import axios from "axios";
import { toast } from "sonner";

// const mockData = {
//   name: "Ahmad Siddique",
//   rollNo: "CS-2024-102",
//   phone: "+92 300 1234567",
//   cnic: "36302-1234567-1",
//   address: "House #12, Street 4, Multan, Punjab, Pakistan",
//   guardianName: "Siddique Akbar",
//   guardianPhone: "+92 321 7654321",
// };

export interface IProfileData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  cnic: string;
  address: string;
  fname: string;
  fphone: string;
}

export default function ProfilePage() {
  const [data, setData] = useState<IProfileData>();

  useEffect(() => {
    const dashBoard = async () => {
      try {
        const id = getId();
        const response = await axios.post("/api/s/get-dashboard", { _id: id });

        if (!response.data.success) {
          toast.error("Failed to fetch data");
        } else {
          toast.success("Data Fetched");
          setData(response.data.data);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    };

    dashBoard();
  }, []);
  const GradientColors = ["#5227FF", "#FF9FFC", "#B19EEF"];
  return (
    <div className="w-full space-y-8 pb-10">
      <div className="px-4 lg:px-6">
        <div className="sm:h-80 h-40 flex items-center justify-center">
          <GradentText 
            colors={["#eab308", "#ef4444", "#3b82f6", "#06b6d4", "#8b5cf6"]} 
            showBorder={false} 
            className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter"
          >
            Gravity
          </GradentText>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4">
        <Card className="overflow-hidden border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
          <div className="relative p-8 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-2xl font-semibold">
                {data?.name || "Loading..."}
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Student • Batch 2024
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-xs py-1 px-3 border-primary/20 bg-primary/5 text-primary"
              >
                {data?._id || "ID Loading"}
              </Badge>
            </div>
          </div>

          <Separator className="bg-border/60" />

          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-foreground/90">
                  <User className="w-5 h-5 text-indigo-400" />
                  Personal Details
                </h4>

                <div className="space-y-4 pl-1">
                  <InfoRow
                    label="Phone Number"
                    value={data?.phone!}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <InfoRow
                    label="CNIC / Identity"
                    value={data?.cnic!}
                    icon={<CreditCard className="w-4 h-4" />}
                  />
                  <InfoRow
                    label="Email Address"
                    value={data?.email!}
                    icon={<Mail className="w-4 h-4" />}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-foreground/90">
                  <Users className="w-5 h-5 text-pink-400" />
                  Parental Details
                </h4>

                <div className="space-y-4 pl-1">
                  <InfoRow
                    label="Guardian Name"
                    value={data?.fname!}
                    icon={<User className="w-4 h-4" />}
                  />
                  <InfoRow
                    label="Guardian Phone"
                    value={data?.fphone!}
                    icon={<Phone className="w-4 h-4" />}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                <MapPin className="w-4 h-4" />
                Permanent Address
              </h4>
              <p className="text-lg font-medium leading-relaxed max-w-2xl">
                {data?.address || "Address not provided"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="group flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-secondary/30">
      <div className="mt-1 p-2 rounded-md bg-secondary/50 text-muted-foreground group-hover:text-primary transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="text-base font-semibold text-foreground mt-0.5">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
