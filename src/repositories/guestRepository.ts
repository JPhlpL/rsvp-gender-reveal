import { createClient } from "@/utils/supabase/server";
import type { Guest, GuestInsert, GuestUpdate, GuestWithResponse } from "@/types/guest";

/** Admin-side access to `guests` (session client; RLS allows authenticated admins only). */
export const guestRepository = {
  /** Every guest with their response (null when they have not answered), newest first. */
  async getAllGuestsWithResponses(): Promise<GuestWithResponse[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("guests")
      .select("*, response:responses(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching guests:", error);
      throw new Error("Failed to fetch guests");
    }

    return data ?? [];
  },

  async createGuest(guest: GuestInsert): Promise<Guest> {
    const supabase = await createClient();

    const { data, error } = await supabase.from("guests").insert(guest).select().single();

    if (error) {
      console.error("Error creating guest:", error);
      throw new Error("Failed to create guest");
    }

    return data;
  },

  async updateGuest(id: string, updates: GuestUpdate): Promise<Guest> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("guests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating guest:", error);
      throw new Error("Failed to update guest");
    }

    return data;
  },

  async deleteGuest(id: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from("guests").delete().eq("id", id);

    if (error) {
      console.error("Error deleting guest:", error);
      throw new Error("Failed to delete guest");
    }
  },

  /**
   * Remove every guest row; their responses cascade-delete via the foreign key.
   * PostgREST requires a filter for bulk deletes, hence `.neq` on an impossible id.
   */
  async deleteAllGuests(): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("guests")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      console.error("Error deleting all guests:", error);
      throw new Error("Failed to delete all guests");
    }
  },
};
