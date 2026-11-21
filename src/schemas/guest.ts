import { z } from "zod";

const guestFields = {
  name: z.string().trim().min(1, "Name is required").max(255, "Name is too long"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().max(50, "Phone is too long").optional().or(z.literal("")),
  notes: z.string().trim().max(1000, "Notes are too long").optional().or(z.literal("")),
};

export const createGuestSchema = z.object(guestFields);

export const updateGuestSchema = z.object({
  id: z.string().uuid(),
  ...guestFields,
});

export type CreateGuestFormData = z.infer<typeof createGuestSchema>;
export type UpdateGuestFormData = z.infer<typeof updateGuestSchema>;
