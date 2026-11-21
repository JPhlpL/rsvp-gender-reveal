"use server";

import { revalidatePath } from "next/cache";
import { createGuestSchema, updateGuestSchema } from "@/schemas/guest";
import { guestRepository } from "@/repositories/guestRepository";
import type { Guest } from "@/types/guest";

export type GuestActionState = {
  error?: string;
  success?: boolean;
};

function readGuestFields(formData: FormData) {
  return {
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    notes: formData.get("notes") ?? "",
  };
}

function revalidateDashboard() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/guests");
}

export async function createGuestAction(
  _prevState: GuestActionState,
  formData: FormData
): Promise<GuestActionState> {
  const parsed = createGuestSchema.safeParse(readGuestFields(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await guestRepository.createGuest({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      notes: parsed.data.notes || null,
    });

    revalidateDashboard();
    return { success: true };
  } catch (error) {
    console.error("Error creating guest:", error);
    return { error: "Failed to create guest. Please try again." };
  }
}

export async function updateGuestAction(
  _prevState: GuestActionState,
  formData: FormData
): Promise<GuestActionState> {
  const parsed = updateGuestSchema.safeParse({
    id: formData.get("id"),
    ...readGuestFields(formData),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await guestRepository.updateGuest(parsed.data.id, {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      notes: parsed.data.notes || null,
    });

    revalidateDashboard();
    return { success: true };
  } catch (error) {
    console.error("Error updating guest:", error);
    return { error: "Failed to update guest. Please try again." };
  }
}

export async function deleteGuestAction(
  id: string
): Promise<GuestActionState> {
  try {
    await guestRepository.deleteGuest(id);
    revalidateDashboard();
    return { success: true };
  } catch (error) {
    console.error("Error deleting guest:", error);
    return { error: "Failed to delete guest. Please try again." };
  }
}

export async function deleteAllGuestsAction(): Promise<GuestActionState> {
  try {
    await guestRepository.deleteAllGuests();
    revalidateDashboard();
    return { success: true };
  } catch (error) {
    console.error("Error deleting all guests:", error);
    return { error: "Failed to delete all guests. Please try again." };
  }
}

export async function fetchGuestsAction(): Promise<Guest[]> {
  try {
    return await guestRepository.getAllGuests();
  } catch (error) {
    console.error("Error fetching guests:", error);
    return [];
  }
}
