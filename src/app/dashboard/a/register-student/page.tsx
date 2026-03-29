"use client";

import React, { use, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { ArrowLeftIcon, ArrowRightIcon, Loader2 } from "lucide-react";

import { StudentSignupSchema } from "@/schemas/StudentSignupSchema";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

const STEP_FIELDS = {
  1: [
    "studentDetail.studentName",
    "studentDetail.studentcnic",
    "studentDetail.studentPhoneNO",
    "studentDetail.studentEmail",
  ],
  2: [
    "guardianDetail.guardianName",
    "guardianDetail.guardianPhoneNO",
    "guardianDetail.address",
  ],
  3: [
    "loginCredientials.password",
    "confirmPassword",
    "loginCredientials.type",
    "loginCredientials.roomNumber",
    "loginCredientials.floor",
  ],
} as const;

export default function Page() {
  const [stepper, setStepper] = React.useState({
    progressValue: 33,
    currentStep: 1,
  });
  const [rooms, setRooms] = React.useState<{ number: number; _id: string }[]>(
    [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof StudentSignupSchema>>({
    resolver: zodResolver(StudentSignupSchema),
    mode: "onTouched",
    defaultValues: {
      studentDetail: {
        studentName: "",
        studentcnic: "",
        studentPhoneNO: "",
        studentEmail: "",
      },
      guardianDetail: { guardianName: "", guardianPhoneNO: "", address: "" },
      loginCredientials: {
        password: "",
        capacity: 1,
        type: "standard",
        roomNumber: "",
        price: 15000,
        roomid: "",
      },
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("student-registration-data");
    if (saved) {
      try {
        form.reset(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((v) =>
      localStorage.setItem("student-registration-data", JSON.stringify(v)),
    );
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const handleNext = async () => {
    const fields = STEP_FIELDS[stepper.currentStep as keyof typeof STEP_FIELDS]; // Unable to understand this one
    if (await form.trigger(fields as any)) {
      setStepper((prev) => ({
        currentStep: Math.min(3, prev.currentStep + 1),
        progressValue: (Math.min(3, prev.currentStep + 1) / 3) * 100,
      }));
    } else {
      toast.error("Please fix errors.");
    }
  };

  const watchedRoomType = form.watch("loginCredientials.type");

  useEffect(() => {
    handleRooms();
  }, [watchedRoomType]);

  const handlePrevious = () => {
    setStepper((prev) => ({
      currentStep: Math.max(1, prev.currentStep - 1),
      progressValue: (Math.max(1, prev.currentStep - 1) / 3) * 100,
    }));
  };

  const handleRooms = async () => {
    const type = watchedRoomType;

    if (!type) return;

    try {
      const res = await axios.post("/api/a/register-student/getrooms", {
        type,
      });
      setRooms(res.data.rooms);
      return res.data.rooms as { number: number }[];
    } catch (e) {
      toast.error("Failed to fetch rooms.");
      return [];
    }
  };

  const handleSubmit = async (data: z.infer<typeof StudentSignupSchema>) => {
    setIsSubmitting(true)
    try {
      const res = await axios.post("/api/auth/student-signup", data);
      if (!res.data.success) {
        toast.error(res.data.message || "Failed to register student.");
        return;
      }
      form.reset();
      localStorage.removeItem("student-registration-data");
      setStepper({ currentStep: 1, progressValue: 33 });
    } catch (e) {
      toast.error("Failed to register student.");
      return;
    } finally {
      setIsSubmitting(false)
    }
  };
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-8">
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errors) =>
          console.log("VALIDATION FAILED:", errors),
        )}
        className="w-full max-w-lg space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Register Student
          </h1>
          <p className="text-sm text-muted-foreground">
            Step {stepper.currentStep} of 3 — {stepper.currentStep === 1 ? "Personal Details" : stepper.currentStep === 2 ? "Guardian Info" : "Room & Password"}
          </p>
        </div>

        {/* Progress */}
        <Progress className="h-2 rounded-full" value={stepper.progressValue} />

        {/* Form Card */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
          {stepper.currentStep === 1 && (
            <div className="space-y-4">
              <FormField
                name="studentDetail.studentName"
                label="Full Name"
                control={form.control}
                placeholder="e.g. Ali Khan"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  name="studentDetail.studentcnic"
                  label="CNIC"
                  control={form.control}
                  placeholder="32301-1122333-9"
                  formatter={(value: string) => {
                    const raw = value.replace(/\D/g, "");
                    let formatted = raw;
                    if (raw.length > 5) {
                      formatted = raw.slice(0, 5) + "-" + raw.slice(5);
                    }
                    if (raw.length > 12) {
                      formatted = formatted.slice(0, 13) + "-" + formatted.slice(13);
                    }
                    return formatted.slice(0, 15);
                  }}
                />
                <FormField
                  name="studentDetail.studentPhoneNO"
                  label="Phone"
                  control={form.control}
                  placeholder="0322 4343333"
                  formatter={(value: string) => {
                    const raw = value.replace(/\D/g, "");
                    let formatted = raw;
                    if (raw.length > 4) {
                      formatted = raw.slice(0, 4) + " " + raw.slice(4);
                    }
                    return formatted.slice(0, 12);
                  }}
                />
              </div>
              <FormField
                name="studentDetail.studentEmail"
                label="Email"
                type="email"
                control={form.control}
                suffix=".com"
                placeholder="e.g ali@gmail"
                formatter={(value: string) => {
                  return value.replace(/\.com$/i, "");
                }}
              />
            </div>
          )}

          {stepper.currentStep === 2 && (
            <div className="space-y-4">
              <FormField
                name="guardianDetail.guardianName"
                label="Guardian Name"
                control={form.control}
                placeholder="e.g. Ahmad Khan"
              />
              <FormField
                name="guardianDetail.guardianPhoneNO"
                label="Guardian Phone"
                control={form.control}
                placeholder="0300 1234567"
                formatter={(value: string) => {
                  const raw = value.replace(/\D/g, "");
                  let formatted = raw;
                  if (raw.length > 4) {
                    formatted = raw.slice(0, 4) + " " + raw.slice(4);
                  }
                  return formatted.slice(0, 12);
                }}
              />
              <FormField
                name="guardianDetail.address"
                label="Address"
                control={form.control}
                placeholder="e.g. House 123, Street 4, City"
              />
            </div>
          )}

          {stepper.currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Room Type</Label>
                  <Controller
                    name="loginCredientials.type"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="deluxe">Deluxe</SelectItem>
                          <SelectItem value="suite">Suite</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Room Number</Label>
                  <Controller
                    name="loginCredientials.roomNumber"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selectedRoom = rooms.find(
                            (r) => r.number.toString() === value,
                          );
                          if (selectedRoom) {
                            form.setValue(
                              "loginCredientials.roomid",
                              selectedRoom._id,
                            );
                          }
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms.map((room) => (
                            <SelectItem
                              onClick={() =>
                                form.setValue(
                                  "loginCredientials.roomid",
                                  room._id,
                                )
                              }
                              key={room.number}
                              value={room.number.toString()}
                            >
                              {room.number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  name="loginCredientials.password"
                  label="Password"
                  type="password"
                  control={form.control}
                  placeholder="••••••••"
                />
                <FormField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  control={form.control}
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={stepper.currentStep === 1}
            className="flex-1 sm:flex-none"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
          </Button>
          {stepper.currentStep < 3 ? (
            <Button type="button" key={'next-button'} onClick={handleNext} className="flex-1 sm:flex-none">
              Next <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button key={'submit-button'} type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none">
              {isSubmitting ? <><Loader2 className="animate-spin mr-2" /><span>Submitting...</span></> : "Submit"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function FormField({ name, label, control, type = "text", suffix, placeholder, formatter }: any) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1.5">
          <Label className={fieldState.error ? "text-destructive" : ""}>
            {label}
          </Label>
          <div className="flex items-center">
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              onChange={(e) => {
                const value = formatter ? formatter(e.target.value) : e.target.value;
                field.onChange(value);
              }}
              className={`${fieldState.error ? "border-destructive" : ""} ${suffix ? "rounded-r-none border-r-0" : ""}`}
            />
            {suffix && (
              <span className="flex h-9 items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                {suffix}
              </span>
            )}
          </div>
          {fieldState.error && (
            <p className="text-[10px] text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
