import { createClient } from "@/utils/supabase/server";
import type {
  GuestResponse,
  GuestResponseInsert,
} from "@/types/response";

/** Admin-side access to `responses` (session client; RLS allows authenticated admins only). */
export const responseRepository = {
  async getResponseByGuestId(guestId: string): Promise<GuestResponse | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("responses")
      .select("*")
      .eq("guest_id", guestId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching response:", error);
      throw new Error("Failed to fetch response");
    }

    return data;
  },

  /** Admin-entered answer: creates or replaces the response. The RSVP deadline does not apply. */
  async upsertAdminResponse(
    guestId: string,
    fields: Omit<GuestResponseInsert, "guest_id">
  ): Promise<GuestResponse> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("responses")
      .upsert({ guest_id: guestId, ...fields }, { onConflict: "guest_id" })
      .select()
      .single();

    if (error) {
      console.error("Error saving admin answer:", error);
      throw new Error("Failed to save answer");
    }

    return data;
  },

  /** Removes a guest's answer, so their invitation link shows the RSVP form again. */
  async deleteResponse(guestId: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from("responses").delete().eq("guest_id", guestId);

    if (error) {
      console.error("Error resetting answer:", error);
      throw new Error("Failed to reset answer");
    }
  },
};
