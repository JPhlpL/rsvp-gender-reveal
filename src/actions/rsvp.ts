"use server";

import { after } from "next/server";
import { toGuestResponseInsert } from "@/lib/answer-rules";
import { isRsvpOpen } from "@/lib/rsvp-window";
import { parseGuestUuidFromRsvpParam } from "@/lib/rsvp-path";
import {
  getInvitationByUuid,
  getRsvpSettings,
  insertGuestResponse,
} from "@/repositories/invitationRepository";
import { parseRsvpFormData, rsvpAnswerSchema } from "@/schemas/rsvp";
import { sendAdminNotification } from "@/services/emailService";

export type RsvpActionState = { error?: string; success?: boolean };

const INVALID_LINK = "This invitation link isn't valid.";
const ALREADY_ANSWERED =
  "You've already sent your RSVP. Message Philip & Vera if something changed.";
const RSVP_CLOSED = "RSVPs are closed. Message Philip & Vera if you'd still like to come.";

/** A guest's own RSVP. Validates, re-checks the guest and the deadline on the server, then inserts once. */
export async function submitRsvpAction(
  uuid: string,
  _prevState: RsvpActionState,
  formData: FormData
): Promise<RsvpActionState> {
  // The invitation doesn't ask about companions; ignore any an older open page still sends.
  const parsed = rsvpAnswerSchema.safeParse({
    ...parseRsvpFormData(formData),
    plus_one_count: 0,
    plus_one_names: null,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const guestUuid = parseGuestUuidFromRsvpParam(uuid);
  if (!guestUuid) return { error: INVALID_LINK };

  try {
    const invitation = await getInvitationByUuid(guestUuid);
    if (!invitation) return { error: INVALID_LINK };
    if (invitation.response) return { error: ALREADY_ANSWERED };

    const settings = await getRsvpSettings();
    if (!isRsvpOpen(settings, new Date())) return { error: RSVP_CLOSED };

    const { guest } = invitation;
    const row = toGuestResponseInsert(guest.id, parsed.data);

    const result = await insertGuestResponse(row);
    if (result === "duplicate") return { error: ALREADY_ANSWERED };

    after(() =>
      sendAdminNotification({
        guestName: guest.name,
        respondentName: row.name,
        isAttending: row.is_attending,
        guess: row.guess ?? null,
        plusOneCount: row.plus_one_count ?? 0,
        plusOneNames: row.plus_one_names ?? null,
        message: row.message ?? null,
        submittedAt: new Date().toISOString(),
      })
    );

    // No revalidatePath: the page is dynamic, and refreshing it here would unmount
    // the form before it can move the guest to the thank-you page.
    return { success: true };
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
