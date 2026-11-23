/**
 * App-wide constants: event facts, guest-facing copy, assets, storage keys, admin settings.
 * Prefer importing from here instead of scattering strings.
 */

// --- App / branding ---
export const APP_PAGE_TITLE = "Gender Reveal & Baby Shower | Philip & Vera";
export const APP_PAGE_DESCRIPTION =
  "Join Philip & Vera for their Gender Reveal & Baby Shower — Saturday, December 5, 2026, 5:00 PM at Aquatico Royalle Private Resort.";
export const APP_ADMIN_DISPLAY_NAME = "Philip & Vera · Gender Reveal RSVP";
export const APP_COPYRIGHT_LINE = "© 2026 John Philip Lominoque · All rights reserved";

export const LOGIN_METADATA_TITLE = "Admin Login | Gender Reveal RSVP";
export const LOGIN_METADATA_DESCRIPTION = "Sign in to manage the party guest list";

// --- Event facts (verbatim from the couple's brief) ---
export const EVENT_TITLE = "Gender Reveal & Baby Shower";
export const EVENT_HOSTS = "Philip & Vera";
export const EVENT_HOSTS_LINE = `of ${EVENT_HOSTS}`;
export const EVENT_DATE_DISPLAY = "Saturday, December 5, 2026 · 5:00 PM";
export const EVENT_DATE_SHORT = "December 5, 2026";

export const MANILA_TIME_ZONE = "Asia/Manila";

export const VENUE_NAME = "Aquatico Royalle Private Resort";
export const VENUE_ADDRESS = "South Spring Villas, Brgy. Bucal, Calamba, Laguna 4027";
export const VENUE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Aquatico+Royalle+Private+Resort,+South+Spring+Villas,+Bucal,+Calamba,+Laguna&output=embed";
export const VENUE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Aquatico+Royalle+Private+Resort+Bucal+Calamba+Laguna";
export const VENUE_MAP_IFRAME_TITLE = `${VENUE_NAME} — party venue map`;

// --- Guest-facing copy (the couple's brief, grammar-corrected 2026-11-23) ---
export const COPY_WEAR_YOUR_GUESS_TITLE = "Wear your guess!";
export const COPY_WEAR_YOUR_GUESS_BODY =
  "Wear pink if you think it's a girl, or blue if you think it's a boy.";
export const COPY_MINI_QUESTION = "Mini Vera or Mini Philip?";
export const COPY_PRIZES = "A lot of gift and cash prizes are waiting for you!";
export const COPY_CLOSING = "We can't wait to see you, celebrate, and guess with you!";
export const COPY_CHANGE_SOMETHING = "Need to change something? Message Philip & Vera.";
export const COPY_GIFT_GUIDE_TITLE = "Gift Guide";
/** Verbatim from the couple. */
export const COPY_GIFT_GUIDE_BODY =
  "Having you celebrate with us is truly all we could ask for. However, if you’d like to give a gift, gender-neutral clothing, everyday baby essentials, or nursery items would mean the world to us. Thank you so much!";

// --- Assets (drop the couple's baby photos at these paths under /public) ---
export const PARTY_PHOTO_PATHS = {
  vera: "/party/mini-vera.jpg",
  philip: "/party/mini-philip.jpg",
} as const;

// --- Browser storage keys ---
export const STORAGE_PARTY_ENVELOPE_OPENED = "party-envelope-opened";

// --- Guest UUID (invitation links) ---
export const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// --- RSVP ---
/** Most companions a guest may ask to bring (matches the DB check). */
export const PLUS_ONE_MAX = 5;

// --- Admin UI ---
export const ADMIN_GUEST_CARD_LIST_PAGE_SIZE = 10;
export const ADMIN_GUEST_TABLE_PAGE_SIZE = 10;
export const ADMIN_DASHBOARD_FILTERED_TABLE_PAGE_SIZE = 5;

/** Type exactly this in the "delete all guests" dialog to confirm (case-sensitive). */
export const ADMIN_DELETE_ALL_GUESTS_CONFIRM_PHRASE = "DELETE ALL";

export const EXPORT_GUESTS_DEFAULT_BASENAME = "party-guests";

// --- Fallback when env is missing (dev) ---
export const DEFAULT_PUBLIC_APP_URL = "http://localhost:3005";
