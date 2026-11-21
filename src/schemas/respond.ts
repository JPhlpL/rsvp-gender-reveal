import { z } from "zod";

export const rsvpSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255, "Name is too long"),
    is_accept_rsvp: z.boolean(),
    decline_reason: z.string().optional().nullable(),
    remarks: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      // If decline_reason is provided, is_accept_rsvp must be false
      if (data.decline_reason && data.decline_reason.trim().length > 0) {
        return data.is_accept_rsvp === false;
      }
      return true;
    },
    {
      message: "Decline reason can only be provided when declining",
      path: ["decline_reason"],
    }
  );

export type RSVPFormData = z.infer<typeof rsvpSchema>;
