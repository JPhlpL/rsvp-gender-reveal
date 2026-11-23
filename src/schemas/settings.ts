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

/**
 * The admin Settings card: a Manila date (or empty for no deadline), the manual close
 * switch, and the personalized-links switch (off = anyone can RSVP at /invitation).
 */
export const settingsFormSchema = z.object({
  deadline_date: z
    .string()
    .refine((value) => value === "" || isRealDate(value), "Pick a valid date"),
  rsvp_closed: z.boolean(),
  personalized_links: z.boolean(),
});

export type SettingsFormData = z.infer<typeof settingsFormSchema>;

export function parseSettingsFormData(fd: FormData): Record<string, unknown> {
  const date = fd.get("deadline_date");
  return {
    deadline_date: typeof date === "string" ? date.trim() : "",
    rsvp_closed: fd.get("rsvp_closed") === "on",
    personalized_links: fd.get("personalized_links") === "on",
  };
}

export type SettingsUpdate = {
  rsvp_deadline: string | null;
  rsvp_closed: boolean;
  personalized_links: boolean;
};

export function toSettingsUpdate(data: SettingsFormData): SettingsUpdate {
  return {
    rsvp_deadline: data.deadline_date ? deadlineFromManilaDate(data.deadline_date) : null,
    rsvp_closed: data.rsvp_closed,
    personalized_links: data.personalized_links,
  };
}
