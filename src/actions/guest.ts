"use server";

import { revalidatePath } from "next/cache";
import { createGuestSchema, updateGuestSchema } from "@/schemas/guest";
import { guestRepository } from "@/repositories/guestRepository";
import type { Guest } from "@/types/guest";

export type GuestActionState = {
  error?: string;
  success?: boolean;
};

export async function createGuestAction(
  _prevState: GuestActionState,
  formData: FormData
): Promise<GuestActionState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    guest_type: formData.get("guest_type") || "standard",
    number_of_plus_invited_guests: formData.get("number_of_plus_invited_guests")
      ? parseInt(formData.get("number_of_plus_invited_guests") as string, 10)
      : null,
    notes: formData.get("notes"),
  };

  const parsed = createGuestSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await guestRepository.createGuest({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      guest_type: parsed.data.guest_type,
      number_of_plus_invited_guests: parsed.data.number_of_plus_invited_guests,
      notes: parsed.data.notes || null,
    });

    revalidatePath("/dashboard");
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
  const rawData = {
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    guest_type: formData.get("guest_type") || "standard",
    number_of_plus_invited_guests: formData.get("number_of_plus_invited_guests")
      ? parseInt(formData.get("number_of_plus_invited_guests") as string, 10)
      : null,
    notes: formData.get("notes"),
  };

  const parsed = updateGuestSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await guestRepository.updateGuest(parsed.data.id, {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      guest_type: parsed.data.guest_type,
      number_of_plus_invited_guests: parsed.data.number_of_plus_invited_guests,
      notes: parsed.data.notes || null,
    });

    revalidatePath("/dashboard");
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
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/guests");
    return { success: true };
  } catch (error) {
    console.error("Error deleting guest:", error);
    return { error: "Failed to delete guest. Please try again." };
  }
}

export async function deleteAllGuestsAction(): Promise<GuestActionState> {
  try {
    await guestRepository.deleteAllGuests();
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/guests");
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
