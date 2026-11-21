import { createClient } from "@/utils/supabase/server";
import type { RespondInsert } from "@/types/respond";

export const respondRepository = {
  /**
   * Get a respond by guest ID
   */
  async getRespondByGuestId(guestId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("responds")
      .select("*")
      .eq("guest_id", guestId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      throw error;
    }

    return data;
  },

  /**
   * Create a new respond
   */
  async createRespond(respond: RespondInsert) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("responds")
      .insert(respond)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  /**
   * Update an existing respond
   */
  async updateRespond(
    guestId: string,
    respond: Omit<RespondInsert, "guest_id">
  ) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("responds")
      .update(respond)
      .eq("guest_id", guestId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  /**
   * Upsert a respond (insert or update)
   */
  async upsertRespond(respond: RespondInsert) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("responds")
      .upsert(respond, { onConflict: "guest_id" })
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};
