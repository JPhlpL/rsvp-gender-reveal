import { createClient } from "@/utils/supabase/server";
import type { Guest, GuestInsert, GuestUpdate } from "@/types/guest";

export const guestRepository = {
  async getAllGuests(): Promise<Guest[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching guests:", error);
      throw new Error("Failed to fetch guests");
    }

    return data || [];
  },

  async createGuest(guest: GuestInsert): Promise<Guest> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("guests")
      .insert(guest)
      .select()
      .single();

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
   * Remove every guest row. `responds` rows CASCADE-delete via FK (`ON DELETE CASCADE`).
   * Uses `.neq('id', …)` so PostgREST applies a filter (required for bulk delete).
   */
  async deleteAllGuests(): Promise<void> {
    const supabase = await createClient();
    const nilUuid = "00000000-0000-0000-0000-000000000000";

    const { error } = await supabase.from("guests").delete().neq("id", nilUuid);

    if (error) {
      console.error("Error deleting all guests:", error);
      throw new Error("Failed to delete all guests");
    }
  },

  async getGuestById(id: string): Promise<Guest | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching guest:", error);
      throw new Error("Failed to fetch guest");
    }

    return data;
  },

  async getGuestByUuid(uuid: string): Promise<Guest | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("uuid", uuid)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching guest by UUID:", error);
      throw new Error("Failed to fetch guest");
    }

    return data;
  },
};
