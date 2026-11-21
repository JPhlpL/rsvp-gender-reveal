import { UUID_V4_REGEX } from "@/utils/constants";

/** URL-safe segment from a guest name (the part before the UUID in `/rsvp/<slug>-<uuid>`). */
export function slugifyGuestNameForUrl(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "guest";
}

/** Single path segment `<slugified-name>-<uuid>`; the UUID is lowercased for stable URLs. */
export function rsvpPathSegment(name: string, uuid: string): string {
  return `${slugifyGuestNameForUrl(name)}-${uuid.trim().toLowerCase()}`;
}

/**
 * Reads the guest UUID from the `/rsvp/[guestSlug]` param.
 * Accepts a bare UUID or `name-uuid` (the UUID is the last five hyphen groups).
 */
export function parseGuestUuidFromRsvpParam(param: string): string | null {
  let value: string;
  try {
    value = decodeURIComponent(param.trim()).toLowerCase();
  } catch {
    return null;
  }

  if (UUID_V4_REGEX.test(value)) return value;

  const parts = value.split("-");
  if (parts.length < 6) return null;

  const uuid = parts.slice(-5).join("-");
  return UUID_V4_REGEX.test(uuid) ? uuid : null;
}

/** Compare an incoming URL segment to the canonical one, ignoring case. */
export function rsvpSlugsMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
