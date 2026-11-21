/** Parse a comma-separated ADMIN_EMAILS value into normalized addresses. */
export function parseAdminEmails(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

/** True only when `email` is on the allowlist (case-insensitive). An empty list admits nobody. */
export function isAdminEmail(
  email: string | null | undefined,
  allowlist: readonly string[]
): boolean {
  if (!email) return false;
  return allowlist.includes(email.trim().toLowerCase());
}

export type AdminCandidate = {
  email?: string | null;
  app_metadata?: Record<string, unknown> | null;
} | null | undefined;

/**
 * True only for a user on the allowlist who was marked as admin by
 * `npm run admin:create` (app_metadata.role = "admin"). The database's RLS policies
 * check the same mark, so a listed user without it would see an empty dashboard.
 */
export function isAdminUser(user: AdminCandidate, allowlist: readonly string[]): boolean {
  if (!user || user.app_metadata?.role !== "admin") return false;
  return isAdminEmail(user.email, allowlist);
}
