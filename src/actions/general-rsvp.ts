"use server";

import { after } from "next/server";
import { toGuestResponseInsert } from "@/lib/answer-rules";
import { rsvpPathSegment } from "@/lib/rsvp-path";
import { isRsvpOpen } from "@/lib/rsvp-window";
import {
  getRsvpSettings,
  insertGeneralGuest,
  insertGuestResponse,
  removeGuest,
} from "@/repositories/invitationRepository";
import { parseRsvpFormData, rsvpAnswerSchema } from "@/schemas/rsvp";
import { sendAdminNotification } from "@/services/emailService";
import {
  COPY_SHOWCASE_RSVP_NOTE,
  MSG_RSVP_CLOSED,
  MSG_SOMETHING_WRONG,
  RSVP_BOT_TRAP_FIELD,
} from "@/utils/constants";
import type { RsvpActionState } from "./rsvp";

/**
 * An RSVP from the general /invitation link (personalized links off). Anyone may answer:
 * the person is added to the guest list with the name they typed, then their answer is
 * stored. No guest-count or duplicate-name limits; the deadline and close switch apply.
 */
export async function submitGeneralRsvpAction(
  _prevState: RsvpActionState,
  formData: FormData
): Promise<RsvpActionState> {
  // People never see this field; a value means a bot filled in the form.
  const trap = formData.get(RSVP_BOT_TRAP_FIELD);
  if (typeof trap === "string" && trap.trim() !== "") return { error: MSG_SOMETHING_WRONG };

  // The general form doesn't ask about companions either.
  const parsed = rsvpAnswerSchema.safeParse({
    ...parseRsvpFormData(formData),
    plus_one_count: 0,
    plus_one_names: null,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const settings = await getRsvpSettings();
    if (settings.personalized_links) return { error: COPY_SHOWCASE_RSVP_NOTE };
    if (!isRsvpOpen(settings, new Date())) return { error: MSG_RSVP_CLOSED };

    const guest = await insertGeneralGuest(parsed.data.name);
    const row = toGuestResponseInsert(guest.id, parsed.data);

    try {
      const result = await insertGuestResponse(row);
      if (result !== "inserted") throw new Error(`Unexpected response insert: ${result}`);
    } catch (error) {
      await removeGuest(guest.id);
      throw error;
    }

    after(() =>
      sendAdminNotification({
        guestName: guest.name,
        respondentName: row.name,
        isAttending: row.is_attending,
        guess: row.guess ?? null,
        plusOneCount: 0,
        plusOneNames: null,
        message: row.message ?? null,
        submittedAt: new Date().toISOString(),
      })
    );

    return { success: true, slug: rsvpPathSegment(guest.name, guest.uuid) };
  } catch (error) {
    console.error("Error submitting general RSVP:", error);
    return { error: MSG_SOMETHING_WRONG };
  }
}
