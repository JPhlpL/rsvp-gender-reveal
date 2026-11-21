import { createClient } from "@/utils/supabase/server";
import type { GuestResponse } from "@/types/response";

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
};
