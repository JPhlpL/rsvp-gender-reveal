# Changelog

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
