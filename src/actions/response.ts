"use server";

import { revalidatePath } from "next/cache";
import { plusOneDecision, type PlusOneDecisionInput } from "@/lib/answer-rules";
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

/** Approve (possibly fewer) or decline a guest's plus-one request. */
export async function decidePlusOneAction(
  guestId: string,
  decision: PlusOneDecisionInput
): Promise<ResponseActionState> {
  await requireAdmin();

  try {
    const response = await responseRepository.getResponseByGuestId(guestId);
    if (!response || response.plus_one_count === 0) {
      return { error: "This guest has no plus-one request." };
    }

    let fields;
    try {
      fields = plusOneDecision(response.plus_one_count, decision);
    } catch (error) {
      if (error instanceof RangeError) return { error: error.message };
      throw error;
    }

    await responseRepository.updatePlusOneDecision(guestId, fields);
    revalidateDashboard();
    return { success: true };
  } catch (error) {
    console.error("Error deciding plus-one request:", error);
    return { error: "Couldn't save that decision. Please try again." };
  }
}
