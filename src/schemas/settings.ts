import { z } from "zod";
import { deadlineFromManilaDate } from "@/lib/rsvp-window";

function isRealDate(value: string): boolean {
  try {
    deadlineFromManilaDate(value);
    return true;
  } catch {
    return false;
  }
}

/** The admin Settings card: a Manila date (or empty for no deadline) and the manual close switch. */
export const settingsFormSchema = z.object({
  deadline_date: z
    .string()
    .refine((value) => value === "" || isRealDate(value), "Pick a valid date"),
  rsvp_closed: z.boolean(),
});

export type SettingsFormData = z.infer<typeof settingsFormSchema>;

export function parseSettingsFormData(fd: FormData): Record<string, unknown> {
  const date = fd.get("deadline_date");
  return {
    deadline_date: typeof date === "string" ? date.trim() : "",
    rsvp_closed: fd.get("rsvp_closed") === "on",
  };
}

export function toSettingsUpdate(data: SettingsFormData): {
  rsvp_deadline: string | null;
  rsvp_closed: boolean;
} {
  return {
    rsvp_deadline: data.deadline_date ? deadlineFromManilaDate(data.deadline_date) : null,
    rsvp_closed: data.rsvp_closed,
  };
}
