"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseModal } from "@/components/application/modals/base-modal";
import { updateGuestSchema, type UpdateGuestFormData } from "@/schemas/guest";
import { updateGuestAction } from "@/actions/guest";
import type { Guest } from "@/types/guest";

interface EditGuestModalProps {
  guest: Guest;
}

export function EditGuestModal({ guest }: EditGuestModalProps) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);

  const {
    register,
    formState: { errors },
    reset,
  } = useForm<UpdateGuestFormData>({
    resolver: zodResolver(updateGuestSchema),
    mode: "onBlur",
    defaultValues: {
      id: guest.id,
      name: guest.name,
      email: guest.email || "",
      phone: guest.phone || "",
      notes: guest.notes || "",
    },
  });

  // Reset form when modal opens with fresh guest data
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      reset({
        id: guest.id,
        name: guest.name,
        email: guest.email || "",
        phone: guest.phone || "",
        notes: guest.notes || "",
      });
    }
    setOpen(newOpen);
  };

  const handleSuccess = () => {
    toast.success("Guest updated successfully!");
    setOpen(false);
    reset();
    setTimeout(() => setKey((k) => k + 1), 100);
  };

  const handleError = (error: string) => {
    toast.error(error);
  };

  return (
    <BaseModal
      key={key}
      trigger={
        <Button variant="ghost" size="icon-sm">
          <Pencil />
        </Button>
      }
      title="Edit Guest"
      description="Update guest information."
      open={open}
      onOpenChange={handleOpenChange}
      formAction={updateGuestAction}
      onSuccess={handleSuccess}
      onError={handleError}
      submitLabel="Save Changes"
    >
      <input type="hidden" {...register("id")} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input id="edit-name" placeholder="John Doe" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-email">Email</Label>
          <Input
            id="edit-email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-phone">Phone</Label>
          <Input
            id="edit-phone"
            type="tel"
            placeholder="09555298031"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-notes">Note for this guest</Label>
          <Input
            id="edit-notes"
            placeholder="Shown on their invitation (optional)"
            {...register("notes")}
          />
          {errors.notes && (
            <p className="text-xs text-destructive">{errors.notes.message}</p>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
