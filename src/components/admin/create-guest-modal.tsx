"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  } = useForm<CreateGuestFormData>({
    resolver: zodResolver(createGuestSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
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
      description="Create a new guest entry for the party guest list."
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
          <Label htmlFor="notes">Note for this guest</Label>
          <Input
            id="notes"
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
