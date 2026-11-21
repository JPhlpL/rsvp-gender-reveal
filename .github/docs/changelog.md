# Changelog

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
- RLS: authenticated admins only; the anon key has no table access at all. Guest pages use a server-only service-role client scoped to the guest's UUID.
- Tests: Vitest unit tests for the business rules and actions; pgTAP database tests (`npm run test:db`).
