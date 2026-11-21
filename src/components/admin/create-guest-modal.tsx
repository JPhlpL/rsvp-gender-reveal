"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import { createGuestSchema, type CreateGuestFormData } from "@/schemas/guest";
import { createGuestAction } from "@/actions/guest";

export function CreateGuestModal() {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);

  const {
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateGuestFormData>({
    resolver: zodResolver(createGuestSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      guest_type: "standard",
      number_of_plus_invited_guests: null,
      notes: "",
    },
  });

  const handleSuccess = () => {
    toast.success("Guest created successfully!");
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
        <Button className="w-full sm:w-auto">
          <Plus />
          Add Guest
        </Button>
      }
      title="Add New Guest"
      description="Create a new guest entry for your wedding RSVP list."
      open={open}
      onOpenChange={setOpen}
      formAction={createGuestAction}
      onSuccess={handleSuccess}
      onError={handleError}
      submitLabel="Create Guest"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input id="name" placeholder="John Doe" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="09555298031"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="guest_type">Guest Type</Label>
          <Select
            defaultValue="standard"
            onValueChange={(value) =>
              setValue("guest_type", value as "standard" | "vip")
            }
          >
            <SelectTrigger id="guest_type" className="w-full">
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
          <Label htmlFor="number_of_plus_invited_guests">
            Number of Plus Guests (Optional)
          </Label>
          <Input
            id="number_of_plus_invited_guests"
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
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
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
