import { z } from "zod";

export const createGuestSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  guest_type: z.enum(["standard", "vip"]),
  number_of_plus_invited_guests: z
    .number()
    .int()
    .min(0, "Must be a positive number")
    .optional()
    .nullable(),
  notes: z.string().optional().or(z.literal("")),
});

export const updateGuestSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  guest_type: z.enum(["standard", "vip"]),
  number_of_plus_invited_guests: z
    .number()
    .int()
    .min(0, "Must be a positive number")
    .optional()
    .nullable(),
  notes: z.string().optional().or(z.literal("")),
});

export type CreateGuestFormData = z.infer<typeof createGuestSchema>;
export type UpdateGuestFormData = z.infer<typeof updateGuestSchema>;
