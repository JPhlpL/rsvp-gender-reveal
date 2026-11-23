import type { Database } from "./database";

export type Settings = Database["public"]["Tables"]["settings"]["Row"];

/** The two settings that decide whether guests may still RSVP. */
export type RsvpSettings = Pick<Settings, "rsvp_deadline" | "rsvp_closed">;

/** What the guest-facing pages need: the RSVP window plus the personalized-links switch. */
export type PublicSettings = Pick<Settings, "rsvp_deadline" | "rsvp_closed" | "personalized_links">;
