"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { responseRepository } from "@/repositories/responseRepository";
import type { GuestResponse } from "@/types/response";

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
