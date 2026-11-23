# Gender Reveal & Baby Shower RSVP: Design

- **Date:** 2026-11-21
- **Status:** Approved 2026-11-21; implemented on branch `feat/initial-build`. Amended 2026-11-23 after launch (see §11).
- **Base code:** `d:\Developments\Projects\nextjs\rsvp-wedding` (the couple's wedding RSVP site)
- **New repo (to be created):** `d:\Developments\Projects\nextjs\rsvp-gender-reveal`. This file moves to `docs/superpowers/specs/` there.

---

## 1. Intent

Philip and Vera are hosting a **Gender Reveal & Baby Shower** and want a digital invitation and RSVP site like the one they built for their wedding. Each guest gets a **personal link**, mostly sent through Messenger. Opening it shows a playful pink-and-blue baby-themed invitation where the guest RSVPs. The couple use an admin dashboard to manage guests, see the headcount, approve plus-one requests and see guesses.

The reveal happens **at the party**. The site plays no part in the reveal.

### Event facts

| | |
|---|---|
| What | Gender Reveal & Baby Shower of Philip & Vera |
| When | Saturday, December 5, 2026, 5:00 PM (Manila time) |
| Where | Aquatico Royalle Private Resort: map embed, address, "Open in Google Maps" (like the wedding's venue map) |
| RSVP deadline | December 1, 2026, through 11:59 PM Manila time. Stored in the database and editable from the dashboard. |

Copy from the couple's brief, to use as written or lightly edited:

- "Wear your guess! Wear pink if girl, blue if boy"
- "Mini Vera or Mini Philip?"
- "A lot of gift and cash prizes are waiting"
- "We can't wait to see, celebrate, and guess with you"
- Plus-one note under the form field: "Philip & Vera will confirm with you if it's okay to bring them."

### Why speed matters

Today is 2026-11-21. Links must go out within days so guests can answer before December 1. Ship a working, good-looking version first and polish second.

---

## 2. Goals

1. A personal invitation link per guest: `/rsvp/<name-slug>-<uuid>`, using the same slug scheme as the wedding's `src/lib/confirmation-path.ts`.
2. A pink-and-blue baby-themed invitation page. Mobile-first, and it must work in Messenger's in-app browser.
3. An RSVP form with attending yes/no, name, guess (girl/boy), a plus-one request (count and names) and an optional message.
4. **Plus-one approval:** the guest requests, the couple approves (possibly fewer) or declines in the dashboard, and the guest sees the status when they reopen their link.
5. **The RSVP deadline lives in the database.** It's edited from a dashboard Settings card in Manila time, has a "close RSVPs now" switch, and is enforced on the server.
6. **The admin dashboard** has stats including the expected headcount and Team Pink vs Team Blue, guest management (reused), a plus-one request list, the Settings card and Excel export.
7. **"Mini Vera or Mini Philip?" photo frames** show placeholders until the couple adds two image files.
8. **A link-preview (Open Graph) image,** so Messenger shows a pink-and-blue card instead of a blank box.
9. **A locked-down database:** no guest data can be read or written with the public anon key.

## 3. Non-goals

- Revealing the gender on the site.
- Guests editing their answer after submitting. They message the couple, who can enter or change it from the dashboard (§7.14).
- A shared or public RSVP link.
- Multi-event support, or any change to the wedding repo.
- Wedding features not carried over: entourage, prenup video, attire guide, Photo Circle (teaser, countdown, QR), "Save the Details" downloads, `/general-invitation`, `/details`, guest types (VIP), and admin-assigned plus-one seats.
- AI-generated photos of the couple or of babies.

## 4. Anti-goals: failure even if it technically works

- **Anything that hints at the baby's gender.** Pink and blue get equal weight everywhere: equal sizes and equal prominence. The primary buttons use the neutral ink color, not pink or blue.
- **Not ready in time** for invitations to go out.
- **Guest names, phones, notes or answers readable or writable by anyone holding the anon key.** The wedding's open RLS policies (`using (true)`) must not be copied.
- **Late RSVPs getting through** after the deadline.
- **Broken in Messenger's in-app browser**, which is where most guests will open the link.

## 5. Constraints

- **Stack:** the same as the wedding, so reuse is direct:
  - Next.js 16.2.1 App Router, React 19.2, TypeScript, Tailwind CSS 4
  - shadcn/ui (Radix)
  - Supabase Postgres and Auth via `@supabase/ssr`
  - react-hook-form with zod
  - TanStack Table, sonner, xlsx, `@emailjs/nodejs`
- **Next.js 16 differs from older versions.** Read the local docs in `node_modules/next/dist/docs/` before writing framework code. For example, check whether `middleware.ts` should now be `proxy.ts`.
- **Free tiers:** Vercel Hobby and Supabase Free. Supabase allows 2 active free projects per organization, so the wedding project may need pausing.
- **Scale:** a small guest list, under 150.
- **Time zone:** Asia/Manila (UTC+8, no daylight saving) for every time a person sees or enters.
- **Repo:** a new repo with **fresh git history**. The wedding history contains wedding guest and entourage personal data that doesn't belong here.

## 6. Approaches considered

| | Approach | Trade-off | Outcome |
|---|---|---|---|
| **A** | Copy the wedding code into a new repo with its own Supabase project and Vercel deployment; strip the wedding parts, restyle, add the new features | Fastest. The wedding site is untouched. Two codebases drift apart over time (acceptable). | **Picked by the couple** |
| B | Make the wedding repo multi-event, with one app driven by event config | One codebase, but slower, every change risks the wedding site, and the wedding is over | Rejected |
| C | Something lighter, such as a Google Form plus a static page | Loses personal links, the dashboard and plus-one approval, most of what was asked for | Rejected |

---

## 7. Design

### 7.1 What to keep, change and remove from `rsvp-wedding`

**Keep, renamed and recolored:**
- **Infrastructure:**
  - Supabase utilities: the server client and the middleware session refresh
  - The login action and page
  - The dashboard layout and admin navigation
- **Patterns:**
  - Layering of repository → server action → zod schema
  - The slug helpers in `lib/confirmation-path.ts`, under the new route
- **Admin guest management:**
  - Create, edit, delete and delete-all dialogs
  - Copy-link modal and view-response modal
  - Desktop guest table and mobile guest card list
  - `BaseTable`, `BaseModal`, `BaseCard`
  - Export button
- **Dashboard:** the stat cards and their expand-into-filtered-table pattern.
- **Guest page pieces:**
  - The envelope intro (`wedding-intro.tsx`, `wedding-envelope.tsx`), restyled
  - The venue map (`wedding-venue-map.tsx`)
  - The guest notes callout ("A note for you")
- **Music player:** only if the couple supplies a song (see §8). Otherwise remove it. (Song supplied 2026-11-23; see §14.)
- **Email notification** (`services/emailService.ts`): it already skips itself when not configured, so keep it, with the template fields updated.
- **CI:** the workflow (lint and type-check). Add tests (see §7.13).

**Remove:**
- **Wedding-only sections:**
  - Entourage, video and the details section (attire, gift guide, hashtag)
  - Photo Circle: teaser, countdown, `lib/photo-circle-qr.ts`
  - Save-details, `lib/wedding-downloads.ts`, `utils/wedding-media-exclusion.ts`
- **Routes:** `/general-invitation`, `/details` and the `/general` redirect in `next.config.ts`.
- **Database fields:** `guest_type`, `number_of_plus_invited_guests`.
- **Assets and docs:**
  - All wedding constants and wedding assets (`public/wedding/*`, `public/photo-circle-qr.png`)
  - `structure.pdf`
  - The wedding docs in `.github/docs/`. Replace them with this design and a fresh changelog.

**Rename:** `wedding-*` components and color tokens become `party-*`, and `utils/constants.ts` is rewritten for this event.

### 7.2 Routes

| Route | Who | Purpose |
|---|---|---|
| `/` | n/a | Redirect to `/login` or `/dashboard`, as in the wedding repo |
| `/rsvp/[guestSlug]` | Guest | Invitation plus one of three states: RSVP form, "your answer" status view, or closed view |
| `/rsvp/[guestSlug]/thank-you` | Guest | Shown after submitting |
| `/rsvp/error` | Guest | Invalid link |
| `/invitation` | Anyone | Public showcase of the invitation, with a note in place of the RSVP form (added 2026-11-23, §11) |
| `/login` | Admin | Email and password sign-in |
| `/dashboard` | Admin | Stats, plus-one requests card, Settings card |
| `/dashboard/guests` | Admin | Guest list (table on desktop, cards on mobile) |

A wrong or outdated name in the slug redirects to the canonical slug, as in the wedding repo.

### 7.3 Guest page, top to bottom

1. **Envelope intro.** A pink-and-blue envelope with a cartoon seal (a "?" or a baby bottle). The guest taps to open. Since 2026-11-23 it shows on every visit (it used to be remembered in sessionStorage, as in the wedding).
2. **Header.** A cluster of cartoon illustrations (crib, baby bottle, onesie, balloons), then "You're invited to the", "Gender Reveal & Baby Shower", "of Philip & Vera", and "Saturday, December 5, 2026 · 5:00 PM".
3. **"Mini Vera or Mini Philip?"**
   - Two slightly tilted photo-print frames, each with a cartoon clothespin.
   - **Left, pink frame:** Vera's baby photo. **Right, blue frame:** Philip's baby photo. An "or" badge sits between them.
   - Both stay side by side on phones.
   - If a file is missing, its frame shows a cartoon baby outline in the frame's color.
   - Files: `public/party/mini-vera.jpg` and `public/party/mini-philip.jpg`. Adding them must need no code change.
4. **"Wear your guess!"** "Wear pink if you think it's a girl, or blue if you think it's a boy.", with two equal swatches.
5. **Where.** Aquatico Royalle Private Resort: map embed, address with a copy button, and "Open in Google Maps".
6. **Prizes teaser.** "A lot of gift and cash prizes are waiting for you!"
7. **Gift Guide** (added 2026-11-23, moved above the RSVP section the same day). The couple's text, word for word, in a card with a pink and a blue onesie.
8. **RSVP section.**
   - Above the form: "Please answer carefully so we can prepare everything for you." No date: the couple asked on 2026-11-23 not to show one. The deadline still closes the form; the closed view (§7.6) names no date either.
   - The admin note callout, if the guest has notes.
   - Then the form, the status view (§7.5) or the closed view (§7.6).
9. **Closing.** "We can't wait to see, celebrate, and guess with you!" (the couple's wording, restored on 2026-11-23), then the footer.

The event details (when, where, map) are visible in every state: open, answered and closed.

### 7.4 RSVP form

| Field | Rule |
|---|---|
| Attending | Required, yes or no |
| Name | Required, 1–255 characters |
| Guess | `girl` or `boy`. Required if attending; hidden and not stored if not. Picking one shows "Wear pink!" or "Wear blue!" right away. |
| Message | Optional, up to 1000 characters |

The "Bringing anyone?" question was removed on 2026-11-23. The server ignores any plus-ones a guest's form sends, so a guest answer is always stored with `plus_one_count` 0. Plus-ones can still be recorded by the couple from the dashboard (§7.14).

- One zod schema validates both the client and the server.
- **On submit, the server re-checks** that the guest exists, hasn't answered yet, and that RSVPs are open (§7.6).
- **A second submission must fail, not overwrite.** Use insert, not upsert. The primary key on `guest_id` guarantees it.

Sketch:

```
Dear Maria,
Will you be there?   ( ) Yes, I'll be there!  ( ) Sorry, I can't make it
Your name            [____________________]
Your guess           ( ) Girl (pink)   ( ) Boy (blue)
                     (Wear pink!)          <- appears once a guess is picked
Message (optional)   [____________________]
                     [ Send RSVP ]
```

### 7.5 After submitting, and when a guest reopens their link

After submitting, the guest goes to `/thank-you`.

Reopening the link after answering shows the invitation with a **status card in place of the form**:

| State | What the card says (tone: warm, short; exact words left to the builder) |
|---|---|
| Attending, no plus-ones | They're coming, see you December 5, plus their guess ("Your guess: Girl. Wear pink!") |
| Plus-ones pending | "Waiting for Philip & Vera to confirm your +N (names)" |
| Plus-ones approved | "Confirmed: you + N" |
| Plus-ones declined | Gentle: just them this time; Philip & Vera will message them |
| Not attending | "We'll miss you" |

Every state ends with: "Need to change something? Message Philip & Vera."

### 7.6 RSVP deadline and the Settings card

**The `settings` table** is a single row, enforced with `id = 1` and a check constraint:

| Column | Type | Notes |
|---|---|---|
| `id` | smallint PK | Always 1 |
| `rsvp_deadline` | timestamptz, nullable | Stored as 23:59:59 Asia/Manila of the chosen date. Seed: `2026-12-01T23:59:59+08:00`. Null means no deadline. |
| `rsvp_closed` | boolean, not null, default false | Manual "close now" |
| `updated_at` | timestamptz | |

- **The "open" rule:** RSVPs are open when `rsvp_closed` is false **and** (`rsvp_deadline` is null **or** now ≤ `rsvp_deadline`).
  - It's one pure function, used by both the guest page and the submit action, and always evaluated with server time.
- **Converting the picked date:** `YYYY-MM-DD` becomes `YYYY-MM-DDT23:59:59+08:00`. Displays use `Intl` with `timeZone: "Asia/Manila"`.
- **Closed view:** the event details stay visible, and the form is replaced by "RSVPs are closed. Message Philip & Vera if you'd still like to come." It names no date, whether the deadline passed or an admin closed RSVPs by hand (the couple asked on 2026-11-23 for no dates; it used to say "RSVPs closed on December 1").
  - Guests who already answered still see their status card after the deadline.
- **The dashboard Settings card has:**
  - A date-only picker, interpreted and displayed in Manila time. A native `<input type="date">` is fine.
  - A "Close RSVPs now" switch.
  - A status line: "Open until Tuesday, Dec 1, 11:59 PM (Manila)" or "Closed".
  - Clearing the date removes the deadline.

### 7.7 Plus-one approval

- **A response with count > 0** is stored with `plus_one_status = 'pending'`. Otherwise the status is `'none'`.
- **The dashboard "Plus-one requests" card** lists pending requests with the guest's name, count, names and message. Each one has:
  - **Approve:** a number from 1 up to the requested count, defaulting to the requested count, saved to `plus_one_approved_count`.
  - **Decline:** approved count set to 0, status `'declined'`.
- **The admin can change a decision later.**
- **The couple message guests themselves.** The site never contacts guests.
- **The guest table and cards** show a plus-one column: requested, status and approved.

### 7.8 Dashboard stats

- **Response counts:** Invited (rows), Attending, Not attending, No answer yet.
- **Expected headcount:** attending guests plus approved plus-ones. Also show "if all pending requests are approved."
- **Pending plus-one requests:** the count.
- **Team Pink vs Team Blue:** guesses from attending guests, shown with equal visual weight.
- **Expanding cards:** each card opens a filtered table, as in the wedding.
- **Excel export columns:** Name, Phone, Email, Status, Guess, Plus-ones requested, Plus-one names, Plus-one status, Plus-ones approved, Message, Admin notes, Answered at.

### 7.9 Data model

**`guests`:**
- `id` uuid PK
- `uuid` uuid, unique (the link code)
- `name`, `email`, `phone`
- `notes`: the admin note, shown to that guest only
- `attendance_status`: enum of `pending`, `attending`, `not_attending`
- `submitted_at`, `created_at`, `updated_at`
- Unlike the wedding table, it has no `guest_type` and no `number_of_plus_invited_guests`.

**`responses`** (renamed from the wedding's `responds`):
- `guest_id`: uuid PK, FK to `guests.id`, on delete cascade
- `name` text, not null
- `is_attending` boolean, not null
- `guess`: enum of `girl`, `boy`, nullable
- `plus_one_count`: int, not null, default 0, check 0–5
- `plus_one_names` text, nullable
- `plus_one_status`: enum of `none`, `pending`, `approved`, `declined`, default `none`
- `plus_one_approved_count`: int, nullable
- `message` text, nullable
- `created_at`, `updated_at`

**`settings`:** see §7.6.

**Keeping `guests` in sync:** `attendance_status` and `submitted_at` must stay in step with `responses` on **insert and update**, the latter needed by the admin "Edit answer" form (§7.14). Do it atomically, either through the wedding's trigger extended to updates (`SECURITY DEFINER`, `SET search_path = public`) or through a single database function. Either works. The two tables must never disagree.

**Migrations:** commit them as SQL files in `supabase/migrations/`, not only in markdown. The wedding repo's markdown migrations drifted out of date. Generate types with `supabase gen types`.

### 7.10 Security

- **RLS on every table:** only authenticated admins can read or write. **No `anon` policies at all.**
- **The guest page and RSVP submission use the service-role key on the server only.**
  - The key is `SUPABASE_SERVICE_ROLE_KEY`, never `NEXT_PUBLIC_`.
  - The code lives in a `server-only` module.
  - Every guest-facing query is scoped to the one UUID from the link.
  - The only data returned to a guest is their own: name, their notes, their response, and the settings needed to decide open or closed.
- **Admin server actions check the signed-in user first,** through a shared `requireAdmin()` that also checks an `ADMIN_EMAILS` allowlist environment variable. Don't rely on middleware or RLS alone.
- **Supabase Auth:** public sign-ups disabled. Admin users (Philip and Vera) are created manually in the Supabase dashboard.

### 7.11 Visual design

**Palette tokens `party-*`:**

| Token role | Approximate value |
|---|---|
| Baby pink | #F7C6D9 |
| Baby blue | #BFDDF5 |
| Deeper pink (accent) | #D9719B |
| Deeper blue (accent) | #4F8FC9 |
| Cream background | #FFF9F3 |
| White | — |
| Ink for text and primary buttons | navy-gray, #3A4560 |

- Exact values are the builder's call, but text must pass WCAG AA contrast.
- **The equal-weight rule (§4) applies everywhere,** including the admin UI's accents.
- **Fonts:** a rounded, friendly display font (for example Fredoka) and a readable body font (for example Nunito), loaded with `next/font/google`. Builder's call.
- **Illustrations:** hand-drawn as inline SVG React components, flat cartoon style, using only the palette tokens:
  - crib, baby bottle, onesie or baby clothes on a clothesline, rattle, pacifier, balloons, clouds, stars
  - used in the header, the section dividers, the frame placeholders and the envelope seal
- **No AI image generation by default.** One special banner through Figma's image generation can be added later if the couple wants, at a cost in Figma AI credits.
- **Background:** a soft gradient or pattern, no photo.
- **Admin UI:** the same shadcn components, recolored.

### 7.12 Link preview

- **Next.js `opengraph-image`** for the site and `/rsvp/*`: a pink-and-blue card reading "Gender Reveal & Baby Shower · Philip & Vera · Saturday, Dec 5, 2026 · 5:00 PM · Aquatico Royalle Private Resort".
- **The same card for every guest,** with no guest name. This avoids a database lookup on every crawler fetch.
- **Page title and description** set to match.

### 7.13 Testing

- **Add a unit test runner,** for example Vitest, for the pure logic:
  - **The "open" rule:** open at Dec 1 23:59:59 Manila, closed at Dec 2 00:00:00, closed when `rsvp_closed` is set, open when the deadline is null.
  - **Date conversion:** picked date to deadline, and back for display.
  - **Slug parsing.**
  - **Stats:** headcount, pending-approved headcount, the guess tally.
  - **The RSVP schema's conditional rules.**
- **CI:** lint, type-check and tests.
- **Manual check before links go out:** a real phone, including opening a link inside Messenger.

### 7.14 Admin: enter or edit a guest's answer

Some guests will answer the couple on Messenger instead of through their link, including late guests sent there by the closed view. So the dashboard needs one **"Edit answer" form** per guest, opened from the guest row and the view-response modal.

- **The fields** are the same as the RSVP form (§7.4).
- **It works whether or not the guest has answered, and ignores the deadline and the "close now" switch.** Only guest submissions are blocked by those.
- **Recording an answer** for someone who hasn't answered creates their response. Editing updates it. Either way `guests` stays in sync (§7.9).
- **Rules:**
  - Setting "not attending" clears the guess and plus-ones (`plus_one_count` 0, names null, status `none`, approved count null).
  - A plus-one count entered by the admin counts as decided: status `approved`, approved count equal to the count. A count of 0 sets status `none`.
- **No "clear answer so the guest can resubmit."** The admin edits instead.
- **The guest's status card** reflects whatever the admin saved.
- **Tests:** add the rules above to the unit tests (§7.13).

### 7.15 Build order

No send date is fixed yet, so build in this order. Whenever the couple decide to deploy, the essentials are already done.

1. **Needed before any link is sent:**
   - The invitation page with the form, status view and closed view
   - Guest management and copy-link
   - The Settings card and deadline enforcement
   - The security model (§7.10)
   - Tests for the pure logic, written alongside it
2. **Can follow after links go out, since nothing is lost meanwhile:**
   - **Plus-one requests card:** requests wait as `pending` until it exists.
   - **Dashboard stats:** headcount and Team Pink vs Team Blue.
   - **Excel export.**
   - **The admin "Edit answer" form (§7.14).**

---

## 8. Needed from the couple (doesn't block building)

- **The two baby photos.** Placeholders until then.
- **The resort's map pin and address.** The builder can look it up on Google Maps first, then confirm with the couple.
- **A song for the music player,** or a decision to drop the player.
- **Deployment and domain: deferred by the couple.** Build and run on localhost first, with `NEXT_PUBLIC_APP_URL=http://localhost:3000`. Vercel and the domain come later; the wedding used a Hostinger domain on Vercel, see `rsvp-wedding/.github/docs/domain-hostinger-vercel.md`.
  - Links copied while on localhost must not be sent to guests.
  - After deploying with the real `NEXT_PUBLIC_APP_URL` against the same Supabase project, the copy-link button gives the real address for the same guests, with no re-entry.
- **Supabase: local for now, decided by the couple.** Development uses the Supabase CLI running in Docker. Docker 29.5.3 and Supabase CLI 2.109.0 are already installed on the couple's machine.
  - `supabase init` and `supabase start` in the new repo, with migrations applied by `supabase db reset`.
  - Admin users are created in local Studio.
  - A cloud Supabase project is needed only when deploying. It may require pausing the wedding project (2 free active projects).
  - Still needed from the couple: the admin email addresses for `ADMIN_EMAILS`.
- **EmailJS:** reuse the wedding account and template, or skip notifications.

## 9. Left to the builder

- Component structure and any file names not named here.
- Exact wording of status, thank-you and closed messages, within the tone guidance.
- Exact palette values and fonts, within the rules in §7.11.
- Whether the status view, thank-you and closed states are separate routes or states of one page.
- Whether to keep the section nav and scroll indicator. The page is shorter than the wedding's.
- How the date picker is built.

## 10. Decision log

**Decided by the couple:**
- One personal link per guest.
- Approach A: a new repo copied from the wedding code.
- RSVP deadline of December 1, stored in the database and edited from a dashboard Settings card in Manila time.
- Pink-and-blue baby theme with cartoons (crib, bottle, baby clothes), with the design delegated.
- Baby-photo frames with placeholders. Vera pink and Philip blue was proposed and not objected to.
- Localhost first. Vercel deployment and the domain come later.
- Supabase runs locally, through the CLI in Docker, for now.

**Proposed earlier in the conversation and not objected to:**
- The "Your guess" field and the Team Pink vs Team Blue count.
- Plus-one status shown when the guest reopens their link.
- No "reason for declining" box.
- No editing after submitting.
- Only the deadline goes in the database.
- The link-preview image.
- Illustrations drawn as SVG, not AI-generated.

**Made while writing this document (please check):**
- The couple can approve fewer plus-ones than requested.
- Plus-one count capped at 5.
- Route `/rsvp/...`, and the table renamed to `responses`.
- Service-role server access, no anon policies, and an admin email allowlist.
- SQL migrations committed in the repo.
- Unit tests added.
- One link-preview card for every guest.
- EmailJS kept, skipped when not configured.
- Music player only if a song is supplied.
- Build order (§7.15).
- The admin "Edit answer" form and its rules (§7.14). Recommended in conversation; the couple didn't answer, so it's included as Claude's call.

## 11. Changes after launch (2026-11-23)

Requested by the couple after the site went live:

1. **No plus-one question on the invitation.** Guests no longer see "Bringing anyone?". The server forces `plus_one_count` 0 for guest answers, including from a page opened before the change. The dashboard's plus-one tools stay, for companions the couple record themselves.
2. **Reset answer (dashboard).** A new action on each guest row and card deletes the guest's answer, so their link shows the RSVP form again. It needs a confirmation, and the guest can only answer again while RSVPs are open. It's disabled for guests who haven't answered. A database trigger (`responses_reset_guest`, migration `20261123000001`) sets the guest's `attendance_status` back to `pending` and `submitted_at` to null when a response is deleted.
3. **Live dress-code reminder.** Picking a guess in the form shows "Wear pink!" or "Wear blue!" at once. The status card after answering keeps "Your guess: Girl. Wear pink!" / "Your guess: Boy. Wear blue!".
4. **Gift Guide section** after the RSVP section (§7.3); later the same day moved above it.
5. **Grammar fixes** to guest-facing text: "You're invited to the" (was "our", which clashed with "of Philip & Vera"); the "Wear your guess!" line; "…waiting for you!" on the prizes teaser; "We can't wait to see you, celebrate, and guess with you!".
6. **Public showcase page, `/invitation`.** The couple asked for a link anyone can open to show off the invitation. It's the guest page without a guest: envelope, header, photo frames, "Wear your guess!", venue, prizes, Gift Guide and closing. The RSVP section shows "Please RSVP using the personal link Philip & Vera sent you. Don't have one yet? Message Philip & Vera." Its envelope shows on every visit. It reads and writes no guest data, is hidden from search engines (`noindex`), and is on the auth middleware's public-route list (`src/lib/public-routes.ts`). This reverses the earlier non-goal of not carrying over the wedding's `/general-invitation`.
7. **Baby photos added.** The couple supplied both photos: `public/party/mini-vera.jpg` and `public/party/mini-philip.jpg`. The page build's file trace includes them, so the server-side "does the photo exist" check also works on Vercel.

## 12. Personalized links switch (2026-11-23)

The couple want to choose between two ways of collecting RSVPs: personal links for guests they add (as in the wedding), or one general link anyone can answer, like a Google Form.

**Decisions (the couple's, 2026-11-23):**
- A **Personalized links** on/off switch in the dashboard's RSVP Settings card. Default **on**, so nothing changes until it's flipped.
- **On:** guests must be added first and answer from their personal link. `/invitation` stays a showcase with no form (§11.6).
- **Off:** `/invitation` shows the RSVP form and anyone can answer. Each answer adds a guest to the list automatically, with the name they typed, labelled "via general link". After answering they see the normal thank-you page. Reopening `/invitation` shows a fresh form, so one phone can answer for several people.
- **Personal links keep working while the switch is off.** Nobody who was already messaged gets a broken link.
- **No limits on accepting guests:** no cap on the number of guests and no duplicate-name check. Duplicates can be deleted from the dashboard. The RSVP deadline and the "Close RSVPs now" switch still apply, to both kinds of link. Basic validation stays: a name is required and the guess is required if attending.
- **Invisible bot trap:** a hidden form field people never see. If it's filled in, nothing is stored.

**Build:**
- Migration: `settings.personalized_links boolean not null default true`, plus a new enum `guest_source ('admin', 'general_link')` and column `guests.added_via guest_source not null default 'admin'`. RLS doesn't change: the public form writes through the server-only service-role client, like guest answers.
- `submitGeneralRsvpAction` checks, in order: the bot trap, validation (plus-ones forced to 0), that the switch is off, and that RSVPs are open. It then inserts the guest (`added_via = 'general_link'`) and the response; if the response insert fails, the new guest is deleted again. It schedules the admin email as usual and returns the new guest's slug, so the form can go to `/rsvp/<slug>/thank-you`.
- The `/invitation` page becomes dynamic, because it reads the switch. When the switch is off, the RSVP section shows the form while RSVPs are open and the closed card when they're closed.
- On the thank-you page, guests added via the general link see "Answering for someone else? Fill in the form again" (a link to `/invitation`) while the switch is off.
- Dashboard: an on/off switch (`src/components/ui/switch.tsx`, Radix) in the Settings card. Under it, notes that follow the switch before saving (wording in `src/lib/link-mode.ts`): On says `/invitation` is a **showcase link** with no form; Off says it's the **general RSVP link** anyone can answer. The copy button is labelled to match, and a "Not saved yet" reminder shows until Save is pressed. Also a "via general link" badge in the guest table and cards, and an "Added via" column in the Excel export.

## 13. Baby items background (2026-11-23)

The couple asked for baby items across the whole invitation, keeping the current style, then for more of them. `BabyPatternBackground` draws 120 faint illustrations from 13 kinds (onesie, bottle, pacifier, rattle, star, cloud, balloons, heart, footprints, sock, teddy bear, sleepy moon, crib) behind the content of both invitation pages. Layout (`src/lib/baby-pattern.ts`, tested): 30 rows spread down the page height, each with an outer and an inner lane per side; the inner lane sits half a row lower, so the lanes zig-zag. Each item's kind is picked at random, never the same kind twice in a row within a lane. Wide screens (md+) place items in the side margins beside the invitation column (`calc((50% - 18rem) * across)`, measured from each page edge; the column is `max-w-xl`), so they stay clear of the text at any width, at 50% opacity. Phones place them at the very edges (1–6% and 94–99%), smaller and at 30% opacity, so they never sit on the text. Tinted items (onesie, pacifier, star, heart, footprints, sock) alternate pink and blue in equal numbers; the teddy bear has one pink and one blue ear and a pink-and-blue bow tie. A fixed seed keeps the server and browser render identical. The layer lives inside `PartyIntro`'s revealed content (`-z-10`, behind the sections), so the items fade in with the invitation instead of showing bunched up behind the envelope while the page is still one screen tall. Decorative only: `aria-hidden`, no pointer events.

## 14. Background music (2026-11-23)

The couple supplied a song (`public/party/bg_music.mp3`) and asked for a music player like the wedding's, kept simple and without the album cover.

- **Where:** the invitation pages only: guest links (`/rsvp/[guestSlug]`) and `/invitation`. Not the thank-you page or the dashboard.
- **When:** hidden until the guest taps the envelope. That tap starts the song, because browsers only allow sound in direct response to a tap: the envelope announces the tap synchronously (`src/lib/party-music.ts`) and `PartyMusicPlayer` calls `play()` inside it. If a browser still refuses, the Play button works. The song loops and is only downloaded once it plays (`preload="none"`).
- **Controls:** a compact bar pinned to the bottom of the screen, just above the site-wide copyright line: play/pause, "Background music" (the file has no title or artist tags), mute, and a volume slider (starts at 70%). iPhones ignore volume set by a page (only the side buttons change it), so the slider is shown only where it works (`canAdjustVolume`); mute works everywhere.
- **Left out of the wedding player on purpose:** album cover, song title and artist, skip and seek, minimize. The invitation pages get extra bottom padding so the bar never covers the closing or footer.
