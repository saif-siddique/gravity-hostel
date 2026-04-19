"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { deleteStudentProfile } from "./profile-actions";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

export function DeleteStudentDialog({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsSubmitting(true);
    const result = await deleteStudentProfile(studentId);
    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      // Wait for toast then bounce backwards out of view.
      setTimeout(() => {
        router.push("/dashboard/a/students");
      }, 500);
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="h-4 w-4" /> Expel / Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" /> Destructive Action Warning
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-base">
            Are you absolutely sure you want to permanently delete the profile for{" "}
            <strong>{studentName}</strong>?
          </DialogDescription>
        </DialogHeader>
        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-md mx-auto text-center border border-destructive/20 mt-2 font-medium">
          This will revoke their portal access permanently and wipe their data from the bed tracking system.
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4 justify-center w-full">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Yes, Delete Completely"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
