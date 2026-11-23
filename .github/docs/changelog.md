# Changelog

## [2026-11-23] Plus-one requests removed from the dashboard

- Removed the **Plus-one requests** card and the **Plus-one requests waiting** stat. Guests can't ask for plus-ones any more and plus-ones the couple set are approved straight away, so both would always be empty.
- The **Expected headcount** subtitle now shows the breakdown ("12 guests + 3 plus-ones") instead of "if all pending plus-ones are approved".
- Removed the unused approve/decline code behind the card (`decidePlusOneAction`, `plusOneDecision`, `updatePlusOneDecision`). The database is unchanged.

## [2026-11-23] Background music

- **Music player** on the invitation pages (guest links and `/invitation`): the party song (`public/party/bg_music.mp3`) starts when the guest taps the envelope and loops. A small bar at the bottom lets guests pause, play, mute and change the volume. iPhones only get mute, because they ignore volume set by a page (their side buttons still work). No album cover, title, skip or seek. Not shown on the thank-you page or the dashboard.

## [2026-11-23] RSVP heading and Gift Guide order

- Under the RSVP heading, "Please RSVP by Tuesday, December 1" is replaced by "Please answer carefully so we can prepare everything for you." No date is shown; the deadline still closes the form on time.
- The Gift Guide now comes before the RSVP section, on guest links and `/invitation`.
- Closing line back to the couple's wording: "We can't wait to see, celebrate, and guess with you!"
- After the deadline, the closed message no longer names the date: it says "RSVPs are closed. Message Philip & Vera if you'd still like to come.", the same as when RSVPs are closed by hand.

## [2026-11-23] Personalized links switch

- **More baby items:** the background now has 120 items (was 48) from 13 kinds, adding hearts, footprints, socks, teddy bears, sleepy moons and cribs. Each margin has two zig-zag lanes and the kinds are picked at random. Wide-screen items are placed against the invitation column, so they stay in the margins at any width. The items now fade in with the invitation; before, they showed bunched up at the screen edges for a moment while the envelope faded.

- **Baby items background:** faint onesies, bottles, pacifiers, rattles, stars, clouds and balloons scattered down the whole invitation (guest links and `/invitation`), equal pink and blue. Wide screens fill the side margins; phones show smaller items peeking in from the edges. Positions come from a fixed seed (`src/lib/baby-pattern.ts`), so they look random but render identically on server and browser.

- **New "Personalized links" switch** in the dashboard's RSVP Settings card (on by default, so nothing changes until it's flipped).
  - **On:** as before. Guests are added first and answer from their personal link; `/invitation` is a showcase without a form.
  - **Off:** `/invitation` shows the RSVP form and anyone can answer, like a Google Form. Each answer adds the person to the guest list with a "via general link" label, and they land on the normal thank-you page, which offers "Fill in the form again" so one phone can answer for several people.
  - Personal links keep working in both modes.
- **No limits on accepting guests:** no guest cap and no duplicate-name check. The RSVP deadline and "Close RSVPs now" still apply to both kinds of link.
- **Invisible bot trap** on the general form: a hidden field people never see; if it's filled in, nothing is stored.
- Settings card: an on/off **switch** (not a checkbox) with notes that follow it as it's flipped, explaining what `/invitation` does in that mode ("Showcase link" vs "General RSVP link"), a copy button labelled to match ("Copy showcase link" / "Copy general link"), a "Not saved yet" reminder until Save is pressed, and a badge showing the saved mode. Guest table and cards: a "via general link" label. Excel export: a new "Added via" column.
- Migration `20261123000002_personalized_links_switch.sql`: `settings.personalized_links` (default true), enum `guest_source`, column `guests.added_via` (default `admin`). Database types regenerated.

## [2026-11-23] Showcase invitation

- **Envelope on every visit, everywhere:** guest links no longer remember that the envelope was opened, so it shows each time a link is opened, like the showcase page. The session-storage flag (`src/lib/session-flag.ts`) was removed.

- **Real baby photos:** `public/party/mini-vera.jpg` (pink frame) and `public/party/mini-philip.jpg` (blue frame) replace the placeholder outlines on guest links and the showcase page.

- **New public page `/invitation`:** anyone can open it to see the invitation (envelope, photos, dress code, venue, prizes, Gift Guide, closing). The RSVP form is replaced by "Please RSVP using the personal link Philip & Vera sent you." It saves nothing and is hidden from search engines. The envelope shows on every visit.
- The list of pages that don't need a sign-in moved to `src/lib/public-routes.ts` (with tests) and now includes `/invitation`.

## [2026-11-23] Invitation updates

- **No more "Bringing anyone?":** the plus-one question is gone from the invitation, and the server ignores plus-ones sent by a guest (e.g. from a page opened before this change). The couple can still record companions from the dashboard with "Edit answer".
- **Reset answer:** a new dashboard action (↺ on each guest row and card) deletes a guest's answer, so their link shows the RSVP form again. It asks for confirmation; the guest can only answer again while RSVPs are open. New migration `20261123000001_reset_answer_resets_guest.sql` puts the guest back to "no answer yet" (status `pending`, no answered time) when their answer is deleted, so the status and dashboard counts stay right.
- **"Wear pink!" / "Wear blue!" right away:** picking a guess in the form shows the matching reminder. The status card after answering still shows it.
- **Gift Guide** section added after the RSVP section, in the couple's words.
- **Grammar fixes:** "You're invited to the" (was "our"), "Wear pink if you think it's a girl, or blue if you think it's a boy.", "A lot of gift and cash prizes are waiting for you!", "We can't wait to see you, celebrate, and guess with you!".

## [2026-11-21] Review fixes

- **Edit answer keeps your decisions:** saving an answer without changing attendance or the plus-one count keeps a pending request, a partial approval or a decline. Before, any save (even a message fix) approved the full count.
- **Readable colors (WCAG AA):** new text shades `party-pink-ink` (#9E3A66) and `party-blue-ink` (#2B649A); `party-ink-soft` darkened to #5C6680; form errors use a neutral red instead of pink.
- **Blocked browser storage no longer breaks the invitation:** the "envelope opened" flag falls back to memory when sessionStorage is blocked or full.
- **Database admin check:** RLS now requires `app_metadata.role = 'admin'` (set by `npm run admin:create`), so an account someone makes for themselves sees nothing even if sign-ups are left on. The app's login and admin pages check the same mark plus `ADMIN_EMAILS`.
- README: a real-phone check before sending, and the updated admin setup.

## [2026-11-21] Initial build

Built from the `rsvp-wedding` codebase for Philip & Vera's Gender Reveal & Baby Shower (Saturday, December 5, 2026, 5:00 PM, Aquatico Royalle Private Resort). Design: `docs/superpowers/specs/2026-11-21-gender-reveal-rsvp-design.md`.

### Guest side
- Personal invitation links: `/rsvp/<name>-<uuid>`; a wrong or outdated name redirects to the current one.
- Pink-and-blue baby theme with hand-drawn SVG illustrations (crib, baby bottle, onesies, rattle, pacifier, balloons, clouds, stars), tap-to-open envelope, Fredoka + Nunito fonts.
- Sections: header, "Mini Vera or Mini Philip?" photo frames (placeholders until `public/party/mini-vera.jpg` / `mini-philip.jpg` exist), "Wear your guess!", venue with map / copy address / Google Maps link, prizes teaser, RSVP, closing.
- RSVP form: attending, name, guess (girl/boy), plus-one request (0–5 with names), message. Same validation on client and server.
- After answering: thank-you page; reopening the link shows a status card (coming / waiting for plus-one approval / confirmed / declined / we'll miss you).
- RSVP deadline (default Dec 1, 11:59 PM Manila) and a manual close switch, enforced on the server; a closed card replaces the form.
- Link-preview card for Messenger (`/opengraph-image`); guest pages are `noindex`.

### Admin side
- Email allowlist (`ADMIN_EMAILS`) on login and every admin page/action; Supabase sign-ups disabled.
- Guest list: add / edit / delete / delete all, copy link, view answer, record or edit an answer (works after the deadline), Excel export.
- Dashboard: RSVP settings card (date in Manila time + close now), plus-one requests (approve some or all, or decline), stats (invited, attending, not attending, no answer, expected headcount, requests waiting) and Team Pink vs Team Blue.

### Data & security
- Tables `guests`, `responses`, `settings` with SQL migrations in `supabase/migrations/`; a trigger keeps guest status in sync with responses.
- RLS: admins only (`app_metadata.role = 'admin'`); the anon key has no table access at all. Guest pages use a server-only service-role client scoped to the guest's UUID.
- Tests: Vitest unit tests for the business rules and actions; pgTAP database tests (`npm run test:db`).
