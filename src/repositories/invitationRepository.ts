import "server-only";

import { createServiceClient } from "@/utils/supabase/service";
import type { Guest } from "@/types/guest";
import type { GuestResponse, GuestResponseInsert } from "@/types/response";
import type { PublicSettings } from "@/types/settings";

export type InvitationGuest = Pick<Guest, "id" | "uuid" | "name" | "notes" | "added_via">;
export type NewGuest = Pick<Guest, "id" | "uuid" | "name">;

export type Invitation = {
  guest: InvitationGuest;
  response: GuestResponse | null;
};

/**
 * Guest-facing data access (service role). Every query is scoped to the one
 * UUID from the guest's link; nothing here lists or returns other guests.
 */
export async function getInvitationByUuid(uuid: string): Promise<Invitation | null> {
  const supabase = createServiceClient();

  const { data: guest, error } = await supabase
    .from("guests")
    .select("id, uuid, name, notes, added_via")
    .eq("uuid", uuid)
    .maybeSingle();

  if (error) {
    console.error("Error loading invitation:", error);
    throw new Error("Failed to load invitation");
  }
  if (!guest) return null;

  const { data: response, error: responseError } = await supabase
    .from("responses")
    .select("*")
    .eq("guest_id", guest.id)
    .maybeSingle();

  if (responseError) {
    console.error("Error loading invitation response:", responseError);
    throw new Error("Failed to load invitation");
  }

  return { guest, response };
}

export async function getRsvpSettings(): Promise<PublicSettings> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("settings")
    .select("rsvp_deadline, rsvp_closed, personalized_links")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error loading settings:", error);
    throw new Error("Failed to load settings");
  }

  return data;
}

/** Inserts a guest's answer. A second answer for the same guest is refused, never overwritten. */
export async function insertGuestResponse(
  row: GuestResponseInsert
): Promise<"inserted" | "duplicate"> {
  const supabase = createServiceClient();

  const { error } = await supabase.from("responses").insert(row);

  if (!error) return "inserted";
  if (error.code === "23505") return "duplicate";

  console.error("Error saving response:", error);
  throw new Error("Failed to save response");
}

/**
 * Adds someone who answered on the general /invitation link to the guest list.
 * Only called while personalized links are off (the action checks).
 */
export async function insertGeneralGuest(name: string): Promise<NewGuest> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("guests")
    .insert({ name, added_via: "general_link" })
    .select("id, uuid, name")
    .single();

  if (error) {
    console.error("Error adding general-link guest:", error);
    throw new Error("Failed to add guest");
  }

  return data;
}

/** Undoes `insertGeneralGuest` when the answer itself couldn't be saved. */
export async function removeGuest(id: string): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase.from("guests").delete().eq("id", id);

  if (error) console.error("Error removing guest after a failed answer:", error);
}
