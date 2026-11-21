"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "@/schemas/auth";
import { isAdminUser, parseAdminEmails } from "@/lib/auth/admin-emails";

export type AuthState = {
  error?: string;
  success?: boolean;
};

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    console.error("Supabase auth error:", error);
    return { error: error.message || "Invalid email or password" };
  }

  if (!isAdminUser(data.user, parseAdminEmails(process.env.ADMIN_EMAILS))) {
    await supabase.auth.signOut();
    return { error: "This account isn't allowed to manage this event." };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
