import type { RsvpSettings } from "@/types/settings";

/** Guests and the couple are in the Philippines (UTC+8, no DST). */
const MANILA_TIME_ZONE = "Asia/Manila";
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

export type RsvpClosedReason = "manual" | "deadline";

/** Why RSVPs are closed right now, or null while they are open. Manual close wins. */
export function rsvpClosedReason(
  settings: RsvpSettings,
  now: Date
): RsvpClosedReason | null {
  if (settings.rsvp_closed) return "manual";
  if (
    settings.rsvp_deadline &&
    now.getTime() > new Date(settings.rsvp_deadline).getTime()
  ) {
    return "deadline";
  }
  return null;
}

export function isRsvpOpen(settings: RsvpSettings, now: Date): boolean {
  return rsvpClosedReason(settings, now) === null;
}

/** "2026-12-01" → "2026-12-01T23:59:59+08:00" (the last second of that day in Manila). */
export function deadlineFromManilaDate(date: string): string {
  const match = DATE_ONLY.exec(date);
  if (!match) {
    throw new RangeError(`Expected a YYYY-MM-DD date, got "${date}"`);
  }

  const [, year, month, day] = match.map(Number);
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    throw new RangeError(`"${date}" is not a real calendar date`);
  }

  return `${date}T23:59:59+08:00`;
}

/** The Manila calendar date (YYYY-MM-DD) of a stored deadline instant. */
export function manilaDateFromDeadline(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MANILA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

/** "Tuesday, December 1" */
export function formatDeadlineDateManila(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: MANILA_TIME_ZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

/** "Tuesday, December 1, 11:59 PM" */
export function formatDeadlineManila(iso: string): string {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: MANILA_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  })
    .format(new Date(iso))
    // Newer ICU puts a narrow no-break space before AM/PM.
    .replace(/\u202f/g, " ");

  return `${formatDeadlineDateManila(iso)}, ${time}`;
}

/** One-line RSVP status for the admin Settings card. */
export function describeRsvpStatus(settings: RsvpSettings, now: Date): string {
  const reason = rsvpClosedReason(settings, now);
  if (reason === "manual") return "Closed manually";
  if (!settings.rsvp_deadline) return "Open — no deadline";

  const when = `${formatDeadlineManila(settings.rsvp_deadline)} (Manila)`;
  return reason === "deadline" ? `Closed — deadline passed ${when}` : `Open until ${when}`;
}
