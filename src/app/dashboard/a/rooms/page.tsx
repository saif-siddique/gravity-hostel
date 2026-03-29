"use client";
import React, { Activity, use, useEffect, useState } from "react";
import {
  Plus,
  User,
  Bed,
  Banknote,
  MapPin,
  Users,
  X,
  BadgePlus,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 1. Type for the individual occupant inside a room
export interface Occupant {
  name: string;
  cnic: string;
}

// 2. Type for the main Room object
export interface Room {
  id: number | string;
  type: string; // e.g., "Single", "Shared"
  current: number; // Calculated via $size
  total: number; // Mapped from "$capacity"
  price: string; // Important: It is a string because you formatted it with "PKR"
  floor: string; // Converted via $toString
  occupants: Occupant[]; // Array of the interface defined above
}

export interface NewRoom {
  floor: number;
  number: string;
  type: "standard" | "deluxe" | "suite";
  status: "available" | "occupied" | "maintenance"; // Extended for realism
  capacity: number;
  occupants: string[]; // Or an interface for Guest[] if applicable
  price: number;
}

interface Creating {
  number: string;
  floor: number;
  type: "standard" | "deluxe" | "suite";
}

export interface RoomsApiResponse {
  success: boolean;
  rooms: Room[];
  message?: string;
}

export default function RoomManagement() {
  const [roomsData, setRoomsDate] = useState<Room[]>([]);
  const [creating, setCreating] = useState<Creating>({
    floor: 0,
    number: "",
    type: "standard",
  });
  const [changed, setChanged] = React.useState(false);
  const [error, setError] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingRooms(true);
      try {
        const response = await axios.get<RoomsApiResponse>("/api/a/data/rooms");
        if (response.data.success) {
          const data = await response.data;
          setRoomsDate(data.rooms);
        } else {
          toast.error("Failed to fetch rooms data.");
        }
      } catch (error) {
        toast.error("Failed to fetch rooms data.");
      } finally {
        setIsLoadingRooms(false);
      }
    };

    fetchData();
  }, [changed]);

  const handleRoom = async () => {
    // 1. Validation check
    if (!creating.floor || !creating.number || !creating.type) {
      setError(true);
      return; // Stop execution if validation fails
    }
    setError(false);

    // 2. Logic maps
    const capacities: Record<Creating["type"], number> = {
      standard: 3,
      deluxe: 2,
      suite: 1,
    };

    const prices: Record<Creating["type"], number> = {
      standard: 15_000,
      deluxe: 20_000,
      suite: 25_000,
    };

    const settingData: NewRoom = {
      floor: creating.floor,
      number: creating.number,
      type: creating.type,
      status: "available",
      capacity: capacities[creating.type],
      occupants: [],
      price: prices[creating.type],
    };

    setIsLoading(true);

    try {
      const response = await axios.post("/api/a/create-room", settingData);

      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
        setChanged(!changed);
      }
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;

      if (serverMessage) {
        toast.error(serverMessage);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Rooms
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage hostel rooms and occupancy.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto gap-2">
              <Plus className="h-4 w-4" /> Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-100 bg-card border-border p-0 overflow-hidden">
            <div className="p-6 space-y-6">
              <DialogHeader className="flex flex-row justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-secondary rounded-lg">
                      <BadgePlus className="h-5 w-5" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">
                      Add Room
                    </DialogTitle>
                  </div>
                  <div className="flex gap-3.5 mt-3 justify-between w-full">
                    <Select
                      onValueChange={(e) => {
                        setCreating({ ...creating, floor: Number(e) });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="00" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Floors</SelectLabel>
                          <SelectItem value="1">01</SelectItem>
                          <SelectItem value="2">02</SelectItem>
                          <SelectItem value="3">03</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Input
                      value={creating.number}
                      placeholder="000"
                      className="max-w-40"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length <= 3) {
                          setCreating({ ...creating, number: val });
                        }
                      }}
                      readOnly={creating.number.length > 3}
                      type="text"
                    />
                    <Select
                      onValueChange={(e: "standard" | "deluxe" | "suite") => {
                        setCreating({ ...creating, type: e });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Room Types</SelectLabel>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="deluxe">Deluxe</SelectItem>
                          <SelectItem value="suite">Suite</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Activity mode={error ? "visible" : "hidden"}>
                    <p className="text-rose-500">Please fill all values</p>
                  </Activity>
                  <div className="rounded-md mt-5 bg-yellow-50 dark:bg-yellow-900/20 p-4 border border-yellow-200 dark:border-yellow-900">
                    <div className="flex ">
                      <div className="shrink-0">
                        <CheckCircle2
                          className="h-5 w-5 text-yellow-600 dark:text-yellow-500"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3 flex flex-col items-start">
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                          Note
                        </h3>
                        <div className="mt-2 text-start text-sm text-yellow-700 dark:text-yellow-400">
                          <p>Other values will be calculated automatically</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleRoom}
                    disabled={loading}
                    className="mt-5"
                  >
                    {loading && <Loader2 className="animate-spin" />}
                    Submit
                  </Button>
                </div>
              </DialogHeader>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="max-h-[70vh] w-full">
        {isLoadingRooms ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading rooms...</p>
          </div>
        ) : roomsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomsData.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-sm text-muted-foreground">No rooms found</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function RoomCard({ room }: { room: Room }) {
  const occupancyPercentage = (room.current / room.total) * 100;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Room {room.id}</CardTitle>
          <p className="text-sm text-muted-foreground">{room.type}</p>
        </div>
        <Badge
          variant="secondary"
          className="bg-emerald-500/10 text-emerald-500 border-none"
        >
          available
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Occupancy</span>
            <span>
              {room.current} / {room.total}
            </span>
          </div>
          <Progress value={occupancyPercentage} className="h-2" />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            {[...Array(room.current)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center"
              >
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="text-foreground font-semibold hover:no-underline p-0"
              >
                View Details
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-125 bg-card border-border p-0 overflow-hidden">
              <div className="p-6 space-y-6">
                <DialogHeader className="flex flex-row justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-secondary rounded-lg">
                        <Bed className="h-5 w-5" />
                      </div>
                      <DialogTitle className="text-2xl font-bold">
                        Room {room.id}
                      </DialogTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Detailed information about this room and its occupants
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-500 border-none"
                      >
                        Available
                      </Badge>
                      <Badge variant="outline">Standard</Badge>
                    </div>
                  </div>
                </DialogHeader>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <InfoBox
                    icon={<Bed className="h-4 w-4" />}
                    label="Capacity"
                    value={`${room.total} Beds`}
                  />
                  <InfoBox
                    icon={<Banknote className="h-4 w-4" />}
                    label="Price/Month"
                    value={room.price}
                  />
                  <InfoBox
                    icon={<Users className="h-4 w-4" />}
                    label="Occupied"
                    value={room.current.toString()}
                  />
                  <InfoBox
                    icon={<MapPin className="h-4 w-4" />}
                    label="Floor"
                    value={room.floor}
                  />
                </div>

                {/* Occupants List */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-semibold">
                    <User className="h-4 w-4" /> Occupants ({room.current}/
                    {room.total})
                  </h4>
                  <div className="space-y-3">
                    {room.occupants.map((occ, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{occ.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {occ.cnic}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] h-5">
                          Active
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card/50 space-y-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="p-1.5 bg-secondary rounded-md">{icon}</div>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold pl-1">{value}</p>
    </div>
  );
}
