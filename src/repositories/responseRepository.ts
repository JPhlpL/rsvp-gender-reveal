import { createClient } from "@/utils/supabase/server";
import type {
  GuestResponse,
  GuestResponseInsert,
  GuestResponseUpdate,
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

  async updatePlusOneDecision(
    guestId: string,
    fields: Pick<GuestResponseUpdate, "plus_one_status" | "plus_one_approved_count">
  ): Promise<GuestResponse> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("responses")
      .update(fields)
      .eq("guest_id", guestId)
      .select()
      .single();

    if (error) {
      console.error("Error saving plus-one decision:", error);
      throw new Error("Failed to save plus-one decision");
    }

    return data;
  },
};
