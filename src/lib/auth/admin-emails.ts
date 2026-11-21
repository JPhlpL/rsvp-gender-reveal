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
