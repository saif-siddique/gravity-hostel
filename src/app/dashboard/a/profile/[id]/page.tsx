"use client";
import React, { use, useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  ShieldCheck,
  Home,
  Building,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { toast } from "sonner";

// 1. Helper functions defined OUTSIDE the component (Best Practice)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export interface StudentProfile {
  fullName: string;
  email: string;
  cnic: string;
  phone: string;
  address: string;
  enrollmentDate: string;
  isActive: boolean;
  guardian: {
    name: string;
    phone: string;
  };
  room: {
    number: string; 
    type: 'standard' | 'deluxe' | 'suite' | string;
    price?: number; 
    floor: number;
    status: 'available' | 'full' | string;
  };
}

export default function StudentProfile({ params }: any) {
  const [student, setStudent] = useState<StudentProfile>();
  const { id }: any = use(params);  

  const fetchUserProfile = async () => {
    try {
      const response = await axios.post("/api/a/profile-dataa", { _id: id });

      if (!response.data.success) {
        toast.error("Failed to fetch data");
      } else {
        toast.success("Data Fetched");
        setStudent(response.data.data);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (id) {
        fetchUserProfile();
    }
  }, [id]);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl space-y-6">
      <Card className="border-none shadow-md bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-2 border-border">
              <AvatarImage src="" alt={student?.fullName} />
              <AvatarFallback className="text-2xl font-bold bg-muted text-foreground">
                {student?.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-2">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {student?.fullName}
                  </h1>
                  <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                    <Mail className="h-4 w-4" /> {student?.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={student?.isActive ? "default" : "destructive"}
                    className="text-sm px-3 py-1"
                  >
                    {student?.isActive ? "Active Student" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(student?.enrollmentDate!)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>CNIC: {student?.cnic}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="h-full shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" /> Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Mobile Number
              </span>
              <div className="flex items-center gap-2 text-foreground">
                <Phone className="h-4 w-4" />
                {student?.phone}
              </div>
            </div>
            <Separator />
            <div className="grid gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Permanent Address
              </span>
              <div className="flex items-start gap-2 text-foreground">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <span className="leading-snug">{student?.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Home className="h-5 w-5 text-primary" /> Accommodation
            </CardTitle>
            <CardDescription>Current Room Assignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Room No
                </span>
                <p className="text-2xl font-bold">{student?.room.number}</p>
              </div>
              <Badge variant="secondary" className="uppercase">
                {student?.room.type}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Building className="h-3 w-3" /> Floor
                </span>
                <span className="font-semibold">{student?.room.floor}</span>
              </div>
              <div className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Monthly Rent
                </span>
                <span className="font-semibold">
                  {formatCurrency(student?.room.price!)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-primary" /> Guardian Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-lg leading-none">
                  {student?.guardian.name}
                </p>
                <p className="text-sm text-muted-foreground">Primary Guardian</p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Emergency Contact
              </span>
              <div className="flex items-center gap-2 text-foreground">
                <Phone className="h-4 w-4" />
                {student?.guardian.phone}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}