"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, ArrowRight, Loader2, BedDouble, User } from "lucide-react";
import { getChangeRoomData, executeRoomChange } from "./change-room-actions";
import { toast } from "sonner";

export function ChangeRoomDialog({ onSetupCompleted }: { onSetupCompleted?: () => void }) {
    const [open, setOpen] = useState(false);
    
    // Data States
    const [students, setStudents] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Form States
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");
    const [selectedNewRoomId, setSelectedNewRoomId] = useState<string>("");
    const [applyCharge, setApplyCharge] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch required data when dialog opens
    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setIsLoadingData(true);
            const response = await getChangeRoomData();
            if (response.success) {
                // Ensure we only show students that actually have a room
                setStudents(response.students?.filter((s:any) => s.currentRoomId) || []); 
                setRooms(response.rooms || []);
            } else {
                toast.error(response.message || "Failed to load requirements data");
            }
            setIsLoadingData(false);
        } else {
            // Reset state on close
            setSelectedStudentId("");
            setSelectedNewRoomId("");
            setApplyCharge(true);
        }
    };

    const handleExecuteChange = async () => {
        if (!selectedStudentId || !selectedNewRoomId) {
            toast.error("Please select both a student and a new room");
            return;
        }
        
        const st = students.find(s => s.id === selectedStudentId);
        if (!st) return;

        setIsSubmitting(true);
        const result = await executeRoomChange({
            studentId: selectedStudentId,
            oldRoomId: st.currentRoomId,
            newRoomId: selectedNewRoomId,
            applyCharge
        });

        if (result?.success) {
            toast.success(result.message);
            setOpen(false);
            if(onSetupCompleted) onSetupCompleted();
        } else {
            toast.error(result?.message || "Failed to process change");
        }
        setIsSubmitting(false);
    };

    const selectedStudent = students.find(s => s.id === selectedStudentId);
    const selectedNewRoom = rooms.find(r => r.id === selectedNewRoomId);
    
    let priceDiff = 0;
    if (selectedStudent && selectedNewRoom) {
        priceDiff = Number(selectedNewRoom.price || 0) - Number(selectedStudent.currentRoomPrice || 0);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto gap-2 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">
                    <ArrowRightLeft className="h-4 w-4" /> Change Room
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-card border-border p-0 overflow-hidden">
                <div className="p-6 space-y-6">
                    <DialogHeader className="flex flex-row justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <ArrowRightLeft className="h-5 w-5 text-emerald-500" />
                                </div>
                                <DialogTitle className="text-2xl font-bold">Change Room Assignment</DialogTitle>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Select an active student and move them to an available room.
                            </p>
                        </div>
                    </DialogHeader>

                    {isLoadingData ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mt-2">Fetching residents & rooms...</p>
                        </div>
                    ) : (
                        <div className="space-y-5 mt-2">
                            {/* Step 1: Specific Student */}
                            <div className="space-y-3">
                                <Label>1. Select Resident</Label>
                                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a student..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.length > 0 ? students.map(s => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.name} ({s.cnic})
                                            </SelectItem>
                                        )) : (
                                            <SelectItem value="none" disabled>No active students in rooms</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>

                                {selectedStudent && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-md border border-border">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Currently assigned to <strong>Room {selectedStudent.currentRoomNumber}</strong> ({selectedStudent.currentRoomType})</span>
                                    </div>
                                )}
                            </div>

                            {/* Step 2: New Room */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 opacity-90"><ArrowRight className="h-3 w-3" /> 2. Select New Room</Label>
                                <Select value={selectedNewRoomId} onValueChange={setSelectedNewRoomId} disabled={!selectedStudentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose target room..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms.filter(r => r.id !== selectedStudent?.currentRoomId).length > 0 ? (
                                            rooms.filter(r => r.id !== selectedStudent?.currentRoomId).map(r => (
                                            <SelectItem key={r.id} value={r.id}>
                                                Room {r.number} - {r.type} (Available Beds: {r.capacity - r.occupied})
                                            </SelectItem>
                                        ))) : (
                                            <SelectItem value="none" disabled>No valid rooms available</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Step 3: Billing Modifier */}
                            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                                <div className="space-y-0.5 max-w-[80%]">
                                    <Label className="text-base text-yellow-800 dark:text-yellow-500">Apply Dynamic Rent Adjustment</Label>
                                    <p className="text-xs text-yellow-700/70 dark:text-yellow-400/70">
                                        Calculates the difference between the new room rent and old room rent structure directly into the billing.
                                    </p>
                                    {selectedStudentId && selectedNewRoomId && (
                                        <div className={`pt-2 text-sm font-bold ${priceDiff > 0 ? "text-rose-600 dark:text-rose-500" : priceDiff < 0 ? "text-emerald-600 dark:text-emerald-500" : "text-yellow-700 dark:text-yellow-500"}`}>
                                            {priceDiff > 0 
                                                ? `Rent Increase: +${priceDiff.toLocaleString()} PKR` 
                                                : priceDiff < 0 
                                                ? `Rent Decrease (Credit): -${Math.abs(priceDiff).toLocaleString()} PKR` 
                                                : "No rent difference (0 PKR)"}
                                        </div>
                                    )}
                                </div>
                                <Switch
                                    checked={applyCharge}
                                    onCheckedChange={setApplyCharge}
                                    className="data-[state=checked]:bg-yellow-500"
                                />
                            </div>

                            {/* Submit */}
                            <Button 
                                onClick={handleExecuteChange}
                                disabled={isSubmitting || !selectedStudentId || !selectedNewRoomId} 
                                className="w-full mt-4"
                            >
                                {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                                Finalize Room Change
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
