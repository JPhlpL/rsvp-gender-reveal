/**
 * App-wide constant values (routes, wedding copy, entourage lists, assets, storage keys, pagination).
 * Prefer importing from here instead of scattering magic strings.
 */

// --- App / branding ---
export const APP_PAGE_TITLE = "John Philip & Vera | RSVP Invitation System";
export const APP_PAGE_DESCRIPTION =
  "You are cordially invited to celebrate the wedding of John Philip and Vera";
export const APP_ADMIN_DISPLAY_NAME = "JP & Vera RSVP Invitation System";
export const APP_COPYRIGHT_LINE =
  "© 2026 John Philip Lominoque · All rights reserved";

export const CONFIRMATION_METADATA_TITLE = "John Philip & Vera — Wedding Invitation";
export const CONFIRMATION_METADATA_DESCRIPTION =
  "You are cordially invited to celebrate the marriage of John Philip and Vera. Saturday, May 16, 2026.";

export const DETAILS_METADATA_TITLE = "Wedding Details | John Philip & Vera";
export const DETAILS_METADATA_DESCRIPTION =
  "View the wedding details, attire guide, entourage, and more for John Philip and Vera's wedding — May 16, 2026.";

/** Public showcase of the invitation UI (no guest, no RSVP). */
export const GENERAL_PAGE_METADATA_TITLE =
  "Wedding Invitation Design | John Philip & Vera";
export const GENERAL_PAGE_METADATA_DESCRIPTION =
  "Preview of our digital wedding invitation — design, details, and celebration info. May 16, 2026.";

export const LOGIN_METADATA_TITLE = "Admin Login | JP & Vera RSVP Invitation System";
export const LOGIN_METADATA_DESCRIPTION = "Sign in to manage your wedding guest list";

// --- Guest UUID (confirmation links) ---
export const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// --- Confirmation page sections (order matters for nav + scroll) ---
export const WEDDING_SECTION = {
  invitation: "invitation",
  entourage: "entourage",
  details: "details",
  prenup: "prenup",
  rsvp: "rsvp",
} as const;

export type WeddingConfirmationSectionId =
  (typeof WEDDING_SECTION)[keyof typeof WEDDING_SECTION];

/** Section order for scroll indicator and nav */
export const WEDDING_CONFIRMATION_SECTION_IDS: readonly WeddingConfirmationSectionId[] =
  [
    WEDDING_SECTION.invitation,
    WEDDING_SECTION.entourage,
    WEDDING_SECTION.details,
    WEDDING_SECTION.prenup,
    WEDDING_SECTION.rsvp,
  ];

/** Labels in the same order as WEDDING_CONFIRMATION_SECTION_IDS */
export const WEDDING_NAV_SECTION_LABELS = [
  "Invitation",
  "Entourage",
  "Details",
  "Prenup",
  "RSVP",
] as const;

/** Nav label per section id (used by `WeddingNav` / scroll when section list varies). */
export const WEDDING_NAV_LABEL_BY_SECTION: Record<
  WeddingConfirmationSectionId,
  string
> = {
  [WEDDING_SECTION.invitation]: "Invitation",
  [WEDDING_SECTION.entourage]: "Entourage",
  [WEDDING_SECTION.details]: "Details",
  [WEDDING_SECTION.prenup]: "Prenup",
  [WEDDING_SECTION.rsvp]: "RSVP",
};

/** Section order for `/general-invitation` (showcase): same flow as confirmation but no RSVP anchor. */
export const WEDDING_GENERAL_NAV_SECTION_IDS: readonly WeddingConfirmationSectionId[] =
  [
    WEDDING_SECTION.invitation,
    WEDDING_SECTION.entourage,
    WEDDING_SECTION.details,
    WEDDING_SECTION.prenup,
  ];

// --- Wedding copy (guest-facing) ---
export const WEDDING_COUPLE_NAMES_SHORT = "John Philip & Vera";
export const WEDDING_COUPLE_NAME_FIRST = "John Philip";
export const WEDDING_COUPLE_NAME_SECOND = "Vera";
export const WEDDING_ENVELOPE_INITIALS = "JV";
export const WEDDING_HASHTAG = "#LiveHaPHILIPeVERAfter";
export const WEDDING_DATE_DISPLAY_LONG = "May 16, 2026 · Saturday · 2:00 PM";
export const WEDDING_DATE_DISPLAY_FOOTER = "May 16, 2026";
/** Shared RSVP deadline date (Details section + main RSVP form policy). */
export const WEDDING_RSVP_DEADLINE_DATE_PHRASE = "April 30, 2026";
export const WEDDING_RSVP_DEADLINE_HEADING = `On or before ${WEDDING_RSVP_DEADLINE_DATE_PHRASE}`;
/** Shown under “Confirm Your Attendance” on the main confirmation RSVP section. */
export const WEDDING_RSVP_FORM_NON_ATTENDANCE_POLICY = `If you are unable to complete this form on or before ${WEDDING_RSVP_DEADLINE_DATE_PHRASE}, we will consider this as a non-attendance, and we sincerely understand.`;

/** IANA zone for all Photo Circle QR countdown / copy (Philippines). */
export const WEDDING_PHOTO_CIRCLE_TIMEZONE = "Asia/Manila";
/**
 * Exact instant the Photo Circle QR goes live: Saturday May 16, 2026 at 8:00 AM Philippine Time.
 * ISO-8601 with +08:00 so SSR and clients agree without guessing DST (PH has none).
 */
export const WEDDING_PHOTO_CIRCLE_QR_OPENS_AT_ISO = "2026-05-16T08:00:00+08:00";

export const WEDDING_VENUE_NAME = "Alka Resorts and Events Place";
export const WEDDING_VENUE_LOCATION_SHORT = "Alka Resorts and Events Place, Calamba, Laguna";
export const WEDDING_VENUE_ADDRESS_LINE_1 = "55JG+XH6 Alka Resorts & Events Place,";
export const WEDDING_VENUE_ADDRESS_LINE_2 = "National Highway, Calamba, 4027 Laguna";
export const WEDDING_VENUE_COPY_TEXT = `${WEDDING_VENUE_ADDRESS_LINE_1} ${WEDDING_VENUE_ADDRESS_LINE_2}`;

export const WEDDING_VENUE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3868.2102155392236!2d121.17381597533729!3d14.182462387176566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd612fa28e8983%3A0x23a90b4da40a15b7!2sAlka%20Resorts%20%26%20Events%20Place!5e0!3m2!1sen!2sus!4v1775914833996!5m2!1sen!2sus";

export const WEDDING_VENUE_MAPS_SHORT_URL =
  "https://maps.app.goo.gl/4WSAa6oYwzQgwfZK9";

export const WEDDING_VENUE_MAP_IFRAME_TITLE = `${WEDDING_VENUE_NAME} - Wedding Venue`;

/**
 * Entourage names and groupings for `WeddingEntourage` (`src/components/guest/wedding-entourage.tsx`).
 * Single source of truth — update lists here and in `.github/docs/wedding-invitation-design.md` when they change.
 */
export const WEDDING_ENTOURAGE = {
  parents: {
    leftNames: [
      "Parents of the Groom",
      "Denmark Lominoque",
      "Leticia Lominoque",
    ],
    rightNames: [
      "Parents of the Bride",
      "Ner Elec",
      "Gina Elec",
    ],
  },
  principalSponsors: {
    leftNames: [
      "Kap. Darwin Retusto",
      "Engr. Edwin Belarmino",
      "Reynaldo Atienza",
      "Rio Elec",
      "Rolly Viray",
      "Armand Gercayo",
      "Felicisimo Mayor",
      "Rodel Opeña",
      "Romeo Omamalin",
      "Clarence Lucas",
    ],
    rightNames: [
      "Corazon Mandigma",
      "Rizalita Belarmino",
      "Lolita Atienza",
      "Maricel Elec",
      "Marjorie Guintu",
      "Maricel Fernandez",
      "Daphnie Perez",
      "Vivian Opeña",
      "Imelda Omamalin",
      "Ma. Rose Berayo",
    ],
  },
  bestMan: ["Ammiel Elec"],
  maidOfHonor: ["Dannica Liquido"],
  secondarySponsors: {
    candle: ["Ren Adolf Elec", "Jesmerald Labrador"],
    veil: ["Aldwin Dimaguila", "Carla Evangelista"],
    cord: ["Aldwin Guevarra", "Jaizel Balot"],
  },
  groomsmenBridesmaids: {
    leftNames: [
      "Ren Adolf Elec",
      "Aldwin Dimaguila",
      "Aldwin Guevarra",
      "Baby Glenn Tapong",
      "Kim Fruelda",
      "John Adrian Solis",
      "John Mark Buag",
      "Aldous Quito",
      "Ronald Atienza",
    ],
    rightNames: [
      "Jesmerald Labrador",
      "Carla Evangelista",
      "Jaizel Balot",
      "Rhina Salve Nillo",
      "Chrys Jane Nazareno",
      "Armie Larwa",
      "Arianne Elec",
      "Maricar Tumala",
      "Maria Elizabeth Hije",
    ],
  },
  bearers: {
    coin: ["Daniella Elec"],
    ring: ["Cael Quinto"],
    bible: ["Ezekiel Austria"],
  },
  bannerBearer: ["Mary Elise Austria"],
  flowerGirls: [
    "Rionah Marizz Elec",
    "Ivana Chloe Gonzales",
    "Chloe Louise Quinto",
    "Heart Eden Elec",
  ],
  escorts: [
    "Earl Syd Quinto",
    "Zyrhone Andrei Nocos",
    "Zohn Rio Elec",
    "King David Siosa",
  ],
} as const;

// --- Public static assets (/public/wedding/...) ---
export const WEDDING_PUBLIC_BASE = "/wedding";

export const WEDDING_ASSET_PATHS = {
  logo: `${WEDDING_PUBLIC_BASE}/logo.jpeg`,
  /** Full-page backdrop for `/confirmation/[guestSlug]` (photo + beige overlays in layout). */
  confirmationBg: `${WEDDING_PUBLIC_BASE}/bg.jpg`,
  song: `${WEDDING_PUBLIC_BASE}/song.mp3`,
  songCover: `${WEDDING_PUBLIC_BASE}/song-cover.jpg`,
  invitationPng: `${WEDDING_PUBLIC_BASE}/invitation-page.png`,
  entouragePng: `${WEDDING_PUBLIC_BASE}/entourage-page.png`,
  detailsPng: `${WEDDING_PUBLIC_BASE}/details-page.png`,
  detailsPdf: `${WEDDING_PUBLIC_BASE}/philip-vera-wedding-details.pdf`,
  /** Photo Circle QR code — shown in `/details` and `PhotoCircleQrCountdown`. */
  photoCircleQr: "/photo-circle-qr.png",
} as const;

export const WEDDING_DETAILS_DOWNLOAD_IMAGES = [
  { name: "invitation-page.png", path: WEDDING_ASSET_PATHS.invitationPng },
  { name: "entourage-page.png", path: WEDDING_ASSET_PATHS.entouragePng },
  { name: "details-page.png", path: WEDDING_ASSET_PATHS.detailsPng },
] as const;

export const WEDDING_DETAILS_DOWNLOAD_PDF = {
  name: "philip-vera-wedding-details.pdf",
  path: WEDDING_ASSET_PATHS.detailsPdf,
} as const;

/** Matches common in-app WebViews (Messenger, Instagram, Facebook IAB, LINE, etc.). Used by `wedding-downloads.ts`. */
export const WEDDING_IN_APP_UA_PATTERN =
  /FBAN|FBAV|FB_IAB|FB4A|FBIOS|Instagram|Line\/|Snapchat|TikTok|Messenger|MicroMessenger/i;

/** Delay between chained PNG downloads in in-app browsers (ms). */
export const WEDDING_IN_APP_IMAGE_CHAIN_MS = 450;

/** Bold lead line in `WeddingSaveDetails` callout (in-app WebView; client-hydrated). */
export const WEDDING_SAVE_DETAILS_HELPER_IN_APP_LEAD =
  "Opened in Messenger or another in-app browser?";

/** Supporting line under `WEDDING_SAVE_DETAILS_HELPER_IN_APP_LEAD`. */
export const WEDDING_SAVE_DETAILS_HELPER_IN_APP_BODY =
  "Use the menu (⋯) → Open in Safari or Chrome, then download again if needed. In this browser, PDF opens in this tab — use the back button to return.";

/** Bold lead for full browsers (`WeddingSaveDetails`). */
export const WEDDING_SAVE_DETAILS_HELPER_DEFAULT_LEAD = "Tip — saving images";

/** Supporting line for full browsers. */
export const WEDDING_SAVE_DETAILS_HELPER_DEFAULT_BODY =
  "Your browser may ask to allow multiple downloads. Tap Allow if you see a prompt.";

// --- Sticky music player ---
export const WEDDING_SONG_TITLE = "Dal'wang Patinig";
export const WEDDING_SONG_ARTIST = "SunKissed Lola";
export const WEDDING_SONG_SKIP_SECONDS = 15;

export const STORAGE_WEDDING_ENVELOPE_OPENED = "wedding-envelope-opened";
/**
 * Key passed to **`WeddingIntro`** on **`/general-invitation`** for API consistency.
 * With **`persistEnvelopeOpen: false`**, this flag is **not** read or written.
 */
export const STORAGE_GENERAL_ENVELOPE_OPENED = "wedding-general-envelope-opened";
export const STORAGE_WEDDING_MUSIC_MINIMIZED = "wedding-music-player-minimized";
export const EVENT_WEDDING_MUSIC_MINIMIZED_CHANGE =
  "wedding-music-player-minimized-change";

/** Fired when invitation content is shown (envelope finished or skipped). */
export const EVENT_WEDDING_CONFIRMATION_REVEALED = "wedding-confirmation-revealed";

/**
 * Fired synchronously on the guest’s first tap on the envelope (user gesture).
 * Used to unlock mobile Safari audio so playback can start after the intro.
 */
export const EVENT_WEDDING_AUDIO_USER_GESTURE = "wedding-audio-user-gesture";

// --- Exclusive audio vs video (confirmation page) ---
export const WEDDING_EXCLUSIVE_MEDIA_EVENT = "wedding-exclusive-media";

export type WeddingExclusiveMediaSource = "music" | "video";

// --- Admin UI ---
export const ADMIN_GUEST_CARD_LIST_PAGE_SIZE = 10;
export const ADMIN_GUEST_TABLE_PAGE_SIZE = 10;
export const ADMIN_DASHBOARD_FILTERED_TABLE_PAGE_SIZE = 5;

/** Type exactly this in the “delete all guests” dialog to confirm (case-sensitive). */
export const ADMIN_DELETE_ALL_GUESTS_CONFIRM_PHRASE = "DELETE ALL";

export const EXPORT_GUESTS_DEFAULT_BASENAME = "wedding-guests";

// --- Fallback when env is missing (dev) ---
export const DEFAULT_PUBLIC_APP_URL = "http://localhost:3005";
