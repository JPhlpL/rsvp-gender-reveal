"use server";

import { revalidatePath } from "next/cache";
import { toAdminResponseFields } from "@/lib/answer-rules";
import { parseRsvpFormData, rsvpAnswerSchema } from "@/schemas/rsvp";
import { requireAdmin } from "@/lib/auth/require-admin";
import { responseRepository } from "@/repositories/responseRepository";
import type { GuestResponse } from "@/types/response";

export type ResponseActionState = { error?: string; success?: boolean };

function revalidateDashboard() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/guests");
}

export async function fetchResponseAction(
  guestId: string
): Promise<GuestResponse | null> {
  await requireAdmin();
  try {
    return await responseRepository.getResponseByGuestId(guestId);
  } catch (error) {
    console.error("Error fetching response:", error);
    return null;
  }
}

/**
 * Record or edit a guest's answer from the dashboard (e.g. they replied on Messenger).
 * Ignores the RSVP deadline and the close switch. A plus-one count set or changed here
 * counts as approved; an unchanged count keeps the couple's earlier decision.
 */
export async function saveAdminAnswerAction(
  guestId: string,
  _prevState: ResponseActionState,
  formData: FormData
): Promise<ResponseActionState> {
  await requireAdmin();

  const parsed = rsvpAnswerSchema.safeParse(parseRsvpFormData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const existing = await responseRepository.getResponseByGuestId(guestId);
    await responseRepository.upsertAdminResponse(
      guestId,
      toAdminResponseFields(parsed.data, existing)
    );
    revalidateDashboard();
    return { success: true };
  } catch (error) {
    console.error("Error saving admin answer:", error);
    return { error: "Couldn't save the answer. Please try again." };
  }
}

/**
 * Clear a guest's answer so they can answer again from their link. The link only shows
 * the form while RSVPs are open (before the deadline and not closed).
 */
export async function resetAnswerAction(guestId: string): Promise<ResponseActionState> {
  await requireAdmin();

  try {
    await responseRepository.deleteResponse(guestId);
    revalidateDashboard();
    return { success: true };
  } catch (error) {
    console.error("Error resetting answer:", error);
    return { error: "Couldn't reset the answer. Please try again." };
  }
}
