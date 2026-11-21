"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { settingsRepository } from "@/repositories/settingsRepository";
import { parseSettingsFormData, settingsFormSchema, toSettingsUpdate } from "@/schemas/settings";

export type SettingsActionState = { error?: string; success?: boolean };

export async function updateRsvpSettingsAction(
  _prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  await requireAdmin();

  const parsed = settingsFormSchema.safeParse(parseSettingsFormData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await settingsRepository.updateRsvpSettings(toSettingsUpdate(parsed.data));
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error saving settings:", error);
    return { error: "Couldn't save the settings. Please try again." };
  }
}
