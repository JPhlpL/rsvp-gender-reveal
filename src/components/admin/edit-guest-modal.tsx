"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    watch,
    setValue,
  } = useForm<UpdateGuestFormData>({
    resolver: zodResolver(updateGuestSchema),
    mode: "onBlur",
    defaultValues: {
      id: guest.id,
      name: guest.name,
      email: guest.email || "",
      phone: guest.phone || "",
      guest_type: guest.guest_type || "standard",
      number_of_plus_invited_guests: guest.number_of_plus_invited_guests,
      notes: guest.notes || "",
    },
  });

  const guestType = watch("guest_type");

  // Reset form when modal opens with fresh guest data
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      reset({
        id: guest.id,
        name: guest.name,
        email: guest.email || "",
        phone: guest.phone || "",
        guest_type: guest.guest_type || "standard",
        number_of_plus_invited_guests: guest.number_of_plus_invited_guests,
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
          <Label htmlFor="edit-guest_type">Guest Type</Label>
          <Select
            key={`guest-type-${guest.id}-${open}`}
            value={guestType}
            onValueChange={(value) =>
              setValue("guest_type", value as "standard" | "vip")
            }
          >
            <SelectTrigger id="edit-guest_type" className="w-full">
              <SelectValue placeholder="Select guest type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" {...register("guest_type")} />
        </div>

        {/* Number of Plus Invited Guests - Show for both Standard and VIP */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-number_of_plus_invited_guests">
            Number of Plus Guests (Optional)
          </Label>
          <Input
            id="edit-number_of_plus_invited_guests"
            type="number"
            min="0"
            placeholder="0"
            {...register("number_of_plus_invited_guests", {
              valueAsNumber: true,
            })}
          />
          <p className="text-xs text-muted-foreground">
            How many additional guests can this person bring? Leave as 0 if none.
          </p>
          {errors.number_of_plus_invited_guests && (
            <p className="text-xs text-destructive">
              {errors.number_of_plus_invited_guests.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-notes">Notes</Label>
          <Input
            id="edit-notes"
            placeholder="Admin notes (optional)"
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
