"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateStudentProfile } from "./profile-actions";
import { toast } from "sonner";
import { Pen, Loader2 } from "lucide-react";

export function EditStudentDialog({
  studentId,
  initialData,
  onUpdated,
}: {
  studentId: string;
  initialData: any;
  onUpdated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    cnic: initialData?.cnic || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    guardianName: initialData?.guardian?.name || "",
    guardianPhone: initialData?.guardian?.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please ensure vital fields are not left completely empty");
      return;
    }
    setIsSubmitting(true);
    const result = await updateStudentProfile(studentId, formData);
    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      if (onUpdated) onUpdated();
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pen className="h-4 w-4" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student Information</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input name="fullName" value={formData.fullName} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>CNIC</Label>
            <Input name="cnic" value={formData.cnic} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Mobile Number</Label>
            <Input name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Permanent Address</Label>
            <Input name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Guardian Name</Label>
            <Input name="guardianName" value={formData.guardianName} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Guardian Phone</Label>
            <Input name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} />
          </div>
        </div>
        <Button onClick={handleUpdate} disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
