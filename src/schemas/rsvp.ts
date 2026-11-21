import { z } from "zod";
import { PLUS_ONE_MAX } from "@/utils/constants";

/** One RSVP answer, as submitted by a guest or entered by an admin. */
export const rsvpAnswerSchema = z
  .object({
    is_attending: z.boolean({ error: "Please tell us if you can make it" }),
    name: z
      .string()
      .trim()
      .min(1, "Please enter your name")
      .max(255, "Name is too long"),
    guess: z.enum(["girl", "boy"]).nullable(),
    plus_one_count: z.number().int().min(0).max(PLUS_ONE_MAX),
    plus_one_names: z.string().trim().max(500, "Names are too long").nullable(),
    message: z.string().trim().max(1000, "Message is too long").nullable(),
  })
  .superRefine((answer, ctx) => {
    if (!answer.is_attending) return;

    if (answer.guess === null) {
      ctx.addIssue({
        code: "custom",
        path: ["guess"],
        message: "Pick your guess: girl or boy",
      });
    }

    if (answer.plus_one_count > 0 && !answer.plus_one_names) {
      ctx.addIssue({
        code: "custom",
        path: ["plus_one_names"],
        message: "Please tell us their names",
      });
    }
  });

export type RsvpAnswer = z.infer<typeof rsvpAnswerSchema>;

function textOrNull(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  return value;
}

/** Turn posted form fields into the raw shape `rsvpAnswerSchema` validates. */
export function parseRsvpFormData(fd: FormData): Record<string, unknown> {
  const attending = fd.get("is_attending");
  const count = fd.get("plus_one_count");
  const name = fd.get("name");

  return {
    is_attending:
      attending === "true" ? true : attending === "false" ? false : undefined,
    // Keep blank names as "" so the friendly "Please enter your name" message shows.
    name: typeof name === "string" ? name : "",
    guess: textOrNull(fd.get("guess")),
    plus_one_count:
      typeof count === "string" && count.trim() !== "" ? Number(count) : 0,
    plus_one_names: textOrNull(fd.get("plus_one_names")),
    message: textOrNull(fd.get("message")),
  };
}
