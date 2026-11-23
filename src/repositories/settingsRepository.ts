import { createClient } from "@/utils/supabase/server";
import type { SettingsUpdate } from "@/schemas/settings";
import type { Settings } from "@/types/settings";

/** Admin-side access to the single `settings` row (session client; RLS: authenticated only). */
export const settingsRepository = {
  async getSettings(): Promise<Settings> {
    const supabase = await createClient();

    const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();

    if (error) {
      console.error("Error fetching settings:", error);
      throw new Error("Failed to fetch settings");
    }

    return data;
  },

  async updateRsvpSettings(fields: SettingsUpdate): Promise<Settings> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("settings")
      .update(fields)
      .eq("id", 1)
      .select()
      .single();

    if (error) {
      console.error("Error updating settings:", error);
      throw new Error("Failed to update settings");
    }

    return data;
  },
};
