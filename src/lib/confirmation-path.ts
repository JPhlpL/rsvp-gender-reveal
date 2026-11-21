import { UUID_V4_REGEX } from "@/utils/constants";

/** URL-safe segment from guest name (before the UUID in `/confirmation/<slug>-<uuid>`). */
export function slugifyGuestNameForUrl(name: string): string {
  const s = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "guest";
}

/** Single path segment: `<slugified-name>-<uuid>` (UUID is always lowercased for stable URLs). */
export function confirmationPathSegment(name: string, uuid: string): string {
  return `${slugifyGuestNameForUrl(name)}-${uuid.trim().toLowerCase()}`;
}

/**
 * Resolves guest UUID from a confirmation dynamic param.
 * Accepts legacy `uuid` only or `name-uuid` (UUID = last 5 hyphen groups).
 * Returns lowercase so DB lookups match how UUIDs are usually stored.
 */
export function parseGuestUuidFromConfirmationParam(param: string): string | null {
  let s: string;
  try {
    s = decodeURIComponent(param.trim()).toLowerCase();
  } catch {
    return null;
  }
  if (UUID_V4_REGEX.test(s)) return s;
  const parts = s.split("-");
  if (parts.length < 6) return null;
  const uuid = parts.slice(-5).join("-");
  if (!UUID_V4_REGEX.test(uuid)) return null;
  return uuid;
}

/** Compare incoming URL segment to canonical slug (case-insensitive on UUID half). */
export function confirmationSlugsMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
