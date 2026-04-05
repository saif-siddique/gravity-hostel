"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { updateMessDetail } from "./actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export type MessDay = {
    _id?: string;
    day: string;
    morning: string;
    afternoon: string;
    evening: string;
};

export default function MessClient({ initialData }: { initialData: MessDay[] }) {
    const [data, setData] = useState<MessDay[]>(initialData);
    // Use the unique "day" (e.g., "Mon") to track editing state instead of _id
    const [editingDay, setEditingDay] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleEditChange = (dayString: string, field: keyof MessDay, value: string) => {
        setData((prev) =>
            prev.map((item) => (item.day === dayString ? { ...item, [field]: value } : item))
        );
    };

    const handleSave = async (item: MessDay) => {
        setIsSaving(true);
        try {
            // Call Server Action
            const result = await updateMessDetail(item);
            if (result?.success) {
                toast.success(result.message);
                setEditingDay(null);
            } else {
                toast.error(result?.message || "Failed to update menu");
            }
        } catch (error) {
            toast.error("Internal server error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="my-10">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Day</TableHead>
                        <TableHead>Morning</TableHead>
                        <TableHead>Afternoon</TableHead>
                        <TableHead>Evening</TableHead>
                        <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((d) => (
                        <TableRow key={d.day}>
                            <TableCell className="font-bold">{d.day}</TableCell>
                            
                            {/* Morning */}
                            <TableCell>
                                {editingDay === d.day ? (
                                    <input 
                                        className="border rounded px-2 py-1 w-full bg-background text-foreground"
                                        value={d.morning}
                                        onChange={(e) => handleEditChange(d.day, "morning", e.target.value)}
                                    />
                                ) : (
                                    <span>{d.morning}</span>
                                )}
                            </TableCell>

                            {/* Afternoon */}
                            <TableCell>
                                {editingDay === d.day ? (
                                    <input 
                                        className="border rounded px-2 py-1 w-full bg-background text-foreground"
                                        value={d.afternoon}
                                        onChange={(e) => handleEditChange(d.day, "afternoon", e.target.value)}
                                    />
                                ) : (
                                    <span>{d.afternoon}</span>
                                )}
                            </TableCell>

                            {/* Evening */}
                            <TableCell>
                                {editingDay === d.day ? (
                                    <input 
                                        className="border rounded px-2 py-1 w-full bg-background text-foreground"
                                        value={d.evening}
                                        onChange={(e) => handleEditChange(d.day, "evening", e.target.value)}
                                    />
                                ) : (
                                    <span>{d.evening}</span>
                                )}
                            </TableCell>
                            
                            {/* Actions */}
                            <TableCell>
                                {editingDay === d.day ? (
                                    <Button 
                                        size="sm" 
                                        onClick={() => handleSave(d)} 
                                        disabled={isSaving}
                                    >
                                        {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : "Save"}
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setEditingDay(d.day)}
                                    >
                                        Edit
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
