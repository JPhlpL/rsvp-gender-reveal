import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdminEmail, parseAdminEmails } from "./admin-emails";

export type AdminUser = { id: string; email: string };

/**
 * Server-side gate for every admin page and action.
 * Redirects to /login unless the session user is on the ADMIN_EMAILS allowlist.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email, parseAdminEmails(process.env.ADMIN_EMAILS))) {
    redirect("/login");
  }

  return { id: user.id, email: user.email! };
}
