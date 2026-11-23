import { rsvpClosedReason, type RsvpClosedReason } from "@/lib/rsvp-window";
import type { GuestResponse } from "@/types/response";
import type { PublicSettings, RsvpSettings } from "@/types/settings";

/** What the RSVP part of a guest's invitation shows. */
export type InvitationView =
  | { kind: "form" }
  | { kind: "answered"; response: GuestResponse }
  | { kind: "closed"; reason: RsvpClosedReason };

/** An existing answer always wins, so guests can see it after the deadline too. */
export function resolveInvitationView(
  response: GuestResponse | null,
  settings: RsvpSettings,
  now: Date
): InvitationView {
  if (response) return { kind: "answered", response };

  const reason = rsvpClosedReason(settings, now);
  if (reason) return { kind: "closed", reason };

  return { kind: "form" };
}

/** What the RSVP part of the public /invitation page shows. */
export type ShowcaseView =
  | { kind: "showcase" }
  | { kind: "form" }
  | { kind: "closed"; reason: RsvpClosedReason };

/**
 * Personalized links on: a showcase that points to personal links. Off: the general
 * RSVP form for anyone, within the same deadline and close switch as personal links.
 */
export function resolveShowcaseView(settings: PublicSettings, now: Date): ShowcaseView {
  if (settings.personalized_links) return { kind: "showcase" };

  const reason = rsvpClosedReason(settings, now);
  if (reason) return { kind: "closed", reason };

  return { kind: "form" };
}

export type AnswerStatus =
  | "attending"
  | "plus_pending"
  | "plus_approved"
  | "plus_declined"
  | "not_attending";

/** Which status card variant a saved answer gets. */
export function answerStatus(response: GuestResponse): AnswerStatus {
  if (!response.is_attending) return "not_attending";
  if (response.plus_one_count > 0) {
    if (response.plus_one_status === "pending") return "plus_pending";
    if (response.plus_one_status === "approved") return "plus_approved";
    if (response.plus_one_status === "declined") return "plus_declined";
  }
  return "attending";
}
