# Gender Reveal & Baby Shower RSVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A pink-and-blue baby-themed invitation and RSVP site with personal guest links, plus-one approval, a database-backed RSVP deadline, and an admin dashboard. It's built by copying and reshaping the `rsvp-wedding` codebase.

**Architecture:** Next.js 16 App Router with server components and server actions, plus Supabase Postgres and Auth, running locally through the Supabase CLI in Docker.
- **Guest pages** read and write only through a `server-only` service-role client, scoped to the UUID in the link.
- **Admin pages** use the signed-in session client plus an email allowlist.
- **RLS** gives `anon` nothing.
- **Business rules** (deadline window, answer normalization, plus-one decisions, stats) live in pure functions with unit tests.

**Tech Stack:**
- Next.js 16.2.1 (Proxy, not Middleware), React 19.2, TypeScript, Tailwind CSS 4, shadcn/ui (Radix)
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`, CLI 2.109), react-hook-form, zod 4
- TanStack Table, sonner, xlsx, `@emailjs/nodejs`
- Vitest 3, pgTAP via `supabase test db`

**Spec:** `docs/superpowers/specs/2026-11-21-gender-reveal-rsvp-design.md`. Read it. Section numbers (§) below refer to it.

**Source repo to copy and adapt from:** `d:\Developments\Projects\nextjs\rsvp-wedding`, read-only. Never modify it.

## Global Constraints

- **Next.js 16:** read `node_modules/next/dist/docs/` before framework code. Request interception lives in `src/proxy.ts` and exports `proxy`.
- **Time zone:** `Asia/Manila` (UTC+8, no DST) for everything displayed or entered. Deadline instants are stored as `YYYY-MM-DDT23:59:59+08:00`.
- **Event facts, verbatim:**
  - "Gender Reveal & Baby Shower"
  - "Philip & Vera"
  - "Saturday, December 5, 2026 · 5:00 PM"
  - "Aquatico Royalle Private Resort"
  - "South Spring Villas, Brgy. Bucal, Calamba, Laguna 4027"
- **Brief copy, verbatim:**
  - "Wear your guess! Wear pink if girl, blue if boy"
  - "Mini Vera or Mini Philip?"
  - "A lot of gift and cash prizes are waiting"
  - "We can't wait to see, celebrate, and guess with you"
  - "Philip & Vera will confirm with you if it's okay to bring them."
- **Seeded deadline:** `2026-12-01T23:59:59+08:00`. Plus-one count range 0–5.
- **Equal weight:** pink and blue never outweigh each other. Primary buttons use the ink color.
- **Colors and fonts:** only `party-*` tokens in components, no hex literals outside `globals.css`. Fonts are Fredoka (display) and Nunito (body).
- **Security:**
  - No `anon` table privileges or policies.
  - `SUPABASE_SERVICE_ROLE_KEY` is only ever imported from modules that start with `import "server-only"`.
  - Every admin action calls `requireAdmin()` first.
- **Environment:** `NEXT_PUBLIC_APP_URL=http://localhost:3000` for now. Deployment is out of scope.
- **Commands that must pass at the end of every task:**
  - `npm run lint`
  - `npm run type-check`
  - `npm test`
  - From Task 2 on, also `npx supabase test db`.
- **Git:**
  - Work on branch `feat/initial-build`.
  - Commit at the end of each task with a conventional message and the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
  - Never commit `.env*` (except `.env.example`).

## Review Focus

1. **Crafted form posts:** `plus_one_count` of "7", "-1" or "abc", or `guess` of "maybe". The schema must reject them and nothing is stored. *Test: Task 5 `rejects out-of-range or malformed fields`.*
2. **A guest picks a guess and 2 plus-ones, then switches to "can't make it"** (hidden fields still hold values). The stored row must have guess null, count 0, names null, status `none`. *Test: Task 5 `not attending clears guess and plus-ones`.*
3. **Double submit** (double tap, two tabs). The second insert must be refused, the first answer kept, and the guest told they already answered. *Tests: Task 2 pgTAP `second response insert for same guest fails 23505`; Task 8 maps `duplicate` to the already-answered message.*
4. **Server clock in UTC around the deadline.** 2026-12-01T15:59:59Z is open; 2026-12-01T16:00:00Z is closed. *Test: Task 4 `boundary evaluated in Manila regardless of server zone`.*
5. **Opened inside Messenger's in-app browser:** envelope tap, form submit and map must all work. *Test: Task 15 Playwright smoke with a Messenger user-agent on a 390×844 viewport.*

---

### Task 1: Scaffold the new repo from the wedding code

**Files:**
- Create: everything copied from `rsvp-wedding`, except the exclusions below
- Create: `vitest.config.ts`, `.env.example`, `README.md` (rewritten)
- Modify: `package.json`, `.gitignore`, `.github/workflows/ci-checks.yml`, `next.config.ts`
- Rename: `src/middleware.ts` → `src/proxy.ts`
- Delete (after copying): wedding-only code. Full list in Step 2.

**Interfaces:**
- Produces: a compiling app with the login and dashboard, `npm test` (Vitest, passes with no tests), and the `server-only` package installed.

- [ ] **Step 1: Branch and copy**

```bash
cd d:/Developments/Projects/nextjs/rsvp-gender-reveal
git add docs && git commit -m "docs: add design and implementation plan"
git switch -c feat/initial-build
```

Copy from `../rsvp-wedding` with `robocopy` or `tar`, excluding:
- `.git`, `node_modules`, `.next`
- `structure.pdf`, `.github/docs`, `public/wedding`
- `public/photo-circle-qr.png`
- `public/{file,globe,next,vercel,window}.svg`

Keep `docs/` as it is.

- [ ] **Step 2: Delete wedding-only code**
- **Routes:** `src/app/confirmation/`, `src/app/general-invitation/`, `src/app/details/`.
- **Guest components:** every file in `src/components/guest/` except `wedding-intro.tsx`, `wedding-envelope.tsx`, `wedding-venue-map.tsx` and `guest-notes-callout.tsx`. Leave those four unrouted; Task 7 adapts them.
- **Libraries and utilities:**
  - `src/lib/photo-circle-qr.ts`
  - `src/lib/wedding-downloads.ts`
  - `src/lib/confirmation-path.ts` (Task 4 recreates it as `rsvp-path.ts`)
  - `src/utils/wedding-media-exclusion.ts`

Then fix the imports and constants until the remaining files compile:
- `next.config.ts`: remove the `/general` redirect, leaving an empty config.

- [ ] **Step 3: Proxy rename**

`src/proxy.ts`:
- Exports `export async function proxy(request: NextRequest)` returning `updateSession(request)`.
- Keeps the wedding `config.matcher` unchanged.

In `src/utils/supabase/middleware.ts`, set `publicRoutes = ["/login", "/rsvp", "/opengraph-image"]`.

- [ ] **Step 4: Package and tooling changes**

`package.json` changes:
- `name`: `rsvp-gender-reveal`
- New scripts:
  - `"test": "vitest run --passWithNoTests"`
  - `"test:db": "supabase test db"`
  - `"types:generate": "supabase gen types typescript --local > src/types/database.ts"`
  - `"admin:create": "node --env-file=.env.local scripts/create-admin.mjs"`
- Then: `npm install` and `npm install server-only` and `npm install -D vitest@3`.

`vitest.config.ts`:
- `test.environment: "node"`
- `test.include: ["src/**/*.test.ts", "src/**/*.test.tsx"]`
- `resolve.alias: { "@": <abs path to src> }`
- `esbuild: { jsx: "automatic" }`

`.gitignore`: delete the line `supabase/`, because migrations must be committed.

`.github/workflows/ci-checks.yml`: add the step `- name: Run unit tests` / `run: npm test` after type-check.

`.env.example` lists these keys with empty values:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `ADMIN_EMAILS`
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
- `EMAILJS_PRIVATE_KEY`
- `ADMIN_NOTIFICATION_EMAIL`

`README.md` covers:
- A short description
- Local setup: Docker, `npx supabase start`, `.env.local` from `npx supabase status -o env`, `npm run admin:create -- <email> <password>`, `npm run dev`
- The script list

- [ ] **Step 5: Verify**

Run: `npm run lint && npm run type-check && npm test && npm run build`
Expected: all exit 0. The build may warn about missing env vars, but must not fail.

- [ ] **Step 6: Commit** with the message `chore: scaffold rsvp-gender-reveal from rsvp-wedding`.

---

### Task 2: Local Supabase, schema, RLS, seed, types

**Files:**
- Create:
  - `supabase/config.toml` (via `npx supabase init`)
  - `supabase/migrations/20261121000001_initial_schema.sql`
  - `supabase/seed.sql`
  - `supabase/tests/database/schema.test.sql`
  - `scripts/create-admin.mjs`
  - `.env.local` (not committed)
- Modify: `src/types/database.ts` (regenerated), `src/types/guest.ts`
- Create: `src/types/response.ts`, `src/types/settings.ts`
- Delete: `src/types/respond.ts`

**Interfaces:**
- **Produces, database:**
  - Enums:
    - `attendance_status` (`pending`, `attending`, `not_attending`)
    - `rsvp_guess` (`girl`, `boy`)
    - `plus_one_status` (`none`, `pending`, `approved`, `declined`)
  - Tables `guests`, `responses` and `settings`, with columns exactly as spec §7.9 and §7.6.
- **Produces, TypeScript:**
  - `src/types/guest.ts`: `Guest`, `GuestInsert`, `GuestUpdate`, `AttendanceStatus`, and `GuestWithResponse = Guest & { response: GuestResponse | null }`.
  - `src/types/response.ts`: `GuestResponse`, `GuestResponseInsert`, `GuestResponseUpdate`, `RsvpGuess`, `PlusOneStatus`.
  - `src/types/settings.ts`: `Settings`, and `RsvpSettings = Pick<Settings, "rsvp_deadline" | "rsvp_closed">`.

- [ ] **Step 1: Init and configure.** Run `npx supabase init`. In `supabase/config.toml`, set `project_id = "rsvp-gender-reveal"` and `[auth] enable_signup = false`.

- [ ] **Step 2: Write the failing pgTAP test `supabase/tests/database/schema.test.sql`**

It wraps everything in `begin; create extension if not exists pgtap with schema extensions; select plan(N); … select * from finish(); rollback;`. The tests, in order:
- **`response insert syncs guest`:** after inserting a guest and a response with `is_attending = true`, the guest's `attendance_status = 'attending'` and `submitted_at is not null`.
- **`response update syncs guest`:** after updating that response to `is_attending = false`, the guest's status is `not_attending`.
- **`second response insert for same guest fails 23505`:** `throws_ok(<insert for the same guest_id>, '23505')`.
- **`plus_one_count above 5 rejected`:** `throws_ok(<insert with plus_one_count 6>, '23514')`.
- **`settings is a singleton`:** `throws_ok('insert into settings (id) values (2)', '23514')`.
- **`settings seeded`:** `results_eq` on `rsvp_deadline`, which equals `'2026-12-01T23:59:59+08:00'::timestamptz` and `rsvp_closed = false`.
- **`anon cannot read guests`:** `set local role anon;` then `throws_ok('select * from guests', '42501')`. Repeat for `responses`, `settings`, and an insert into `responses`. `reset role` afterwards.
- **`authenticated can read guests`:** `set local role authenticated;` then `lives_ok('select * from guests')`.

Run: `npx supabase start` (first run pulls images), then `npx supabase test db`.
Expected: FAIL, because the tables don't exist.

- [ ] **Step 3: Write the migration `20261121000001_initial_schema.sql`**
- **Enums** as listed in Interfaces.
- **Tables** per spec §7.9 and §7.6, with these checks:
  - `plus_one_count between 0 and 5`
  - `plus_one_approved_count is null or plus_one_approved_count between 0 and plus_one_count`
  - `settings.id = 1`
- **Seed row:** `settings (id, rsvp_deadline, rsvp_closed) values (1, '2026-12-01T23:59:59+08:00', false)`.
- **Triggers:**
  - `updated_at` on all three tables, using the wedding's `update_updated_at_column`.
  - `sync_guest_from_response()`, `SECURITY DEFINER`, `SET search_path = public`, `AFTER INSERT OR UPDATE OF is_attending ON responses`. It sets `guests.attendance_status` from `is_attending` and `submitted_at = coalesce(submitted_at, now())`.
- **Indexes:** `guests(uuid)` is unique, which already creates an index.
- **RLS and privileges:**
  - `alter table … enable row level security` on all three tables.
  - `revoke all on guests, responses, settings from anon;`
  - One policy per table: `for all to authenticated using (true) with check (true)`.

Run: `npx supabase db reset && npx supabase test db`
Expected: PASS.

- [ ] **Step 4: Seed and scripts**
- **`supabase/seed.sql`:** three sample guests with fixed UUIDs:
  - "Sample Guest One", `uuid 11111111-1111-4111-8111-111111111111`
  - "Sample Guest Two", `22222222-2222-4222-8222-222222222222`
  - "Sample Guest Three", `33333333-3333-4333-8333-333333333333`, `notes 'Bring a towel for the pool!'`
- **`scripts/create-admin.mjs`:** reads `process.argv[2..3]` (email, password). It calls `createClient(url, serviceRoleKey).auth.admin.createUser({ email, password, email_confirm: true })` and prints the user id or the error.
- **`.env.local`:** from `npx supabase status -o env`:
  - `NEXT_PUBLIC_SUPABASE_URL` = API_URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = ANON_KEY
  - `SUPABASE_SERVICE_ROLE_KEY` = SERVICE_ROLE_KEY
  - `NEXT_PUBLIC_APP_URL=http://localhost:3000`
  - `ADMIN_EMAILS=admin@local.test`
- **Local admin:** run `npm run admin:create -- admin@local.test LocalAdmin123!`.

- [ ] **Step 5: Types.** Run `npm run types:generate`, then write the three type files from Interfaces. Fix compile errors in the copied admin code only as far as types demand; Task 10 reshapes the UI. Remove `guest_type` and `number_of_plus_invited_guests` usages, and switch `responds` to `responses`.

Run: `npm run lint && npm run type-check && npm test && npx supabase test db`
Expected: all pass.

- [ ] **Step 6: Commit** with the message `feat(db): schema, RLS lockdown, sync trigger, seed and types`.

---

### Task 3: Admin auth guard

**Files:**
- Create: `src/lib/auth/admin-emails.ts` (pure), `src/lib/auth/admin-emails.test.ts`, `src/lib/auth/require-admin.ts` (server-only)
- Create: `src/utils/supabase/service.ts` (server-only)
- Modify: `src/actions/auth.ts`, `src/actions/guest.ts`, `src/app/dashboard/layout.tsx`

**Interfaces:**
- Produces:
  - `parseAdminEmails(raw: string | undefined): string[]`: trims, lowercases and drops empty entries.
  - `isAdminEmail(email: string | null | undefined, allowlist: readonly string[]): boolean`
  - `requireAdmin(): Promise<{ id: string; email: string }>`: if there's no session user, or the email isn't in `parseAdminEmails(process.env.ADMIN_EMAILS)`, it calls `redirect("/login")`.
  - `createServiceClient(): SupabaseClient<Database>`: uses `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, with `auth: { persistSession: false }`.

- [ ] **Step 1: Failing tests `admin-emails.test.ts`**
- `parseAdminEmails(" A@x.com, ,b@y.com ")` → `["a@x.com","b@y.com"]`
- `parseAdminEmails(undefined)` → `[]`
- `isAdminEmail("A@X.com", ["a@x.com"])` → `true`
- `isAdminEmail("c@z.com", ["a@x.com"])` → `false`
- `isAdminEmail(null, ["a@x.com"])` → `false`
- `isAdminEmail("a@x.com", [])` → `false`

Run: `npx vitest run src/lib/auth` → FAIL.

- [ ] **Step 2: Implement** `admin-emails.ts`, then `require-admin.ts` and `service.ts`, each starting with `import "server-only"`. Run the tests again → PASS.

- [ ] **Step 3: Wire it up**
- **`loginAction`:** after a successful `signInWithPassword`, if `!isAdminEmail(user.email, parseAdminEmails(process.env.ADMIN_EMAILS))`, call `signOut()` and return `{ error: "This account isn't allowed to manage this event." }`.
- **Every exported action in `src/actions/guest.ts`:** starts with `await requireAdmin()`. Remove `fetchGuestsAction`; pages call repositories after `requireAdmin()`.
- **`dashboard/layout.tsx`:** uses `const admin = await requireAdmin()` and passes `admin.email` to the navigation.

- [ ] **Step 4: Verify**
1. Run `npm run dev`. Signing in as `admin@local.test` / `LocalAdmin123!` reaches `/dashboard`.
2. Temporarily set `ADMIN_EMAILS=someone@else.test` and restart. The same sign-in shows the "isn't allowed" error.
3. Restore the value.

Then run the four commands from Global Constraints.

- [ ] **Step 5: Commit** with the message `feat(auth): admin email allowlist and server-side guard`.

---

### Task 4: RSVP window and link paths

**Files:**
- Create: `src/lib/rsvp-window.ts`, `src/lib/rsvp-window.test.ts`, `src/lib/rsvp-path.ts`, `src/lib/rsvp-path.test.ts`

**Interfaces:**
- Consumes: `RsvpSettings` (Task 2).
- **`rsvp-window.ts` produces:**
  - `isRsvpOpen(settings: RsvpSettings, now: Date): boolean`
  - `rsvpClosedReason(settings: RsvpSettings, now: Date): "manual" | "deadline" | null`. `"manual"` wins when both apply.
  - `deadlineFromManilaDate(date: string): string`: `"2026-12-01"` → `"2026-12-01T23:59:59+08:00"`. Throws `RangeError` unless the input matches `/^\d{4}-\d{2}-\d{2}$/` and is a real calendar date.
  - `manilaDateFromDeadline(iso: string): string` → `YYYY-MM-DD` in Manila. Use `Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" })`.
  - `formatDeadlineDateManila(iso: string): string` → `"Tuesday, December 1"`
  - `formatDeadlineManila(iso: string): string` → `"Tuesday, December 1, 11:59 PM"`. Build it from separate date and time formatters, and replace `\u202f` with a regular space.
- **`rsvp-path.ts` produces:** `slugifyGuestNameForUrl(name)`, `rsvpPathSegment(name, uuid)`, `parseGuestUuidFromRsvpParam(param): string | null`, `rsvpSlugsMatch(a, b)`. These behave exactly like the wedding's `src/lib/confirmation-path.ts` functions of the same purpose; copy and rename them.

- [ ] **Step 1: Failing tests `rsvp-window.test.ts`**

With `const s = { rsvp_deadline: "2026-12-01T23:59:59+08:00", rsvp_closed: false }`:
- `isRsvpOpen(s, new Date("2026-12-01T15:59:59Z"))` → `true`
- `isRsvpOpen(s, new Date("2026-12-01T16:00:00Z"))` → `false`. Name this test `boundary evaluated in Manila regardless of server zone`.
- `isRsvpOpen({ ...s, rsvp_deadline: null }, new Date("2030-01-01Z"))` → `true`
- `isRsvpOpen({ ...s, rsvp_closed: true }, new Date("2026-11-21Z"))` → `false`
- `rsvpClosedReason({ ...s, rsvp_closed: true }, new Date("2026-12-10Z"))` → `"manual"`
- `rsvpClosedReason(s, new Date("2026-12-02T00:00:00+08:00"))` → `"deadline"`
- `rsvpClosedReason(s, new Date("2026-11-21Z"))` → `null`
- `deadlineFromManilaDate("2026-12-01")` → `"2026-12-01T23:59:59+08:00"`. Both `"2026-02-30"` and `"12/01/2026"` throw `RangeError`.
- `manilaDateFromDeadline("2026-12-01T23:59:59+08:00")` → `"2026-12-01"`. This test must pass even though the instant is Dec 1 15:59Z.
- `formatDeadlineDateManila(s.rsvp_deadline)` → `"Tuesday, December 1"`
- `formatDeadlineManila(s.rsvp_deadline)` → `"Tuesday, December 1, 11:59 PM"`

- [ ] **Step 2: Failing tests `rsvp-path.test.ts`** (`U = "1a2b3c4d-1111-4222-8333-123456789abc"`)
- `rsvpPathSegment("Maria Santos", U)` → `` `maria-santos-${U}` ``
- `rsvpPathSegment("Ñiño 👶", U)` → `` `nino-${U}` ``
- `rsvpPathSegment("!!!", U)` → `` `guest-${U}` ``
- `parseGuestUuidFromRsvpParam(`maria-santos-${U.toUpperCase()}`)` → `U`
- `parseGuestUuidFromRsvpParam(U)` → `U`
- `parseGuestUuidFromRsvpParam("hello")` → `null`
- `parseGuestUuidFromRsvpParam("%E0%A4%A")` → `null`
- `rsvpSlugsMatch(`Maria-Santos-${U}`, `maria-santos-${U}`)` → `true`

Run: `npx vitest run src/lib` → FAIL.

- [ ] **Step 3: Implement both modules.** Run the tests → PASS. Run the four global commands.

- [ ] **Step 4: Commit** with the message `feat: RSVP window (Manila deadline) and guest link paths`.

---

### Task 5: RSVP schema, answer rules, invitation view

**Files:**
- Create:
  - `src/schemas/rsvp.ts`, `src/schemas/rsvp.test.ts`
  - `src/lib/answer-rules.ts`, `src/lib/answer-rules.test.ts`
  - `src/lib/invitation-view.ts`, `src/lib/invitation-view.test.ts`
- Delete: `src/schemas/respond.ts`
- Modify: `src/utils/constants.ts` to add `PLUS_ONE_MAX = 5`.

**Interfaces:**
- Consumes: Task 2 types, Task 4 `rsvpClosedReason`.
- **`src/schemas/rsvp.ts`:**
  - `rsvpAnswerSchema` (zod) with these fields:
    - `is_attending: boolean`
    - `name`: trimmed, 1–255 characters, error "Please enter your name"
    - `guess: "girl" | "boy" | null`
    - `plus_one_count`: int 0–`PLUS_ONE_MAX`
    - `plus_one_names: string | null`: trimmed, up to 500 characters
    - `message: string | null`: trimmed, up to 1000 characters
  - `superRefine` rules:
    - Attending with a null guess fails on path `guess`: "Pick your guess: girl or boy".
    - Attending with count > 0 and empty names fails on path `plus_one_names`: "Please tell us their names".
  - `type RsvpAnswer = z.infer<typeof rsvpAnswerSchema>`
  - `parseRsvpFormData(fd: FormData): Record<string, unknown>`:
    - `is_attending`: `"true"` → `true`, `"false"` → `false`, anything else → `undefined`
    - `plus_one_count`: `Number(...)`, with a missing value → `0`
    - Empty strings → `null`
    - `guess`: passed through as a string or `null`
- **`src/lib/answer-rules.ts`:**
  - `toGuestResponseInsert(guestId: string, a: RsvpAnswer): GuestResponseInsert`
  - `toAdminResponseFields(a: RsvpAnswer): Omit<GuestResponseInsert, "guest_id">`
  - `plusOneDecision(requested: number, d: { approve: true; count: number } | { approve: false }): Pick<GuestResponseUpdate, "plus_one_status" | "plus_one_approved_count">`
- **`src/lib/invitation-view.ts`:**
  - `type InvitationView = { kind: "form" } | { kind: "answered"; response: GuestResponse } | { kind: "closed"; reason: "manual" | "deadline" }`
  - `resolveInvitationView(response: GuestResponse | null, settings: RsvpSettings, now: Date): InvitationView`. An existing response always gives `"answered"`, even when closed.
  - `type AnswerStatus = "attending" | "plus_pending" | "plus_approved" | "plus_declined" | "not_attending"`
  - `answerStatus(r: GuestResponse): AnswerStatus`

- [ ] **Step 1: Failing tests**

**`rsvp.test.ts`:**
- **Valid attending answer:** `parseRsvpFormData` of `{is_attending:"true", name:" Ana ", guess:"girl", plus_one_count:"2", plus_one_names:"Ben, Cy", message:""}` parses to `{ is_attending: true, name: "Ana", guess: "girl", plus_one_count: 2, plus_one_names: "Ben, Cy", message: null }`.
- **`rejects out-of-range or malformed fields`:** each fails `safeParse`:
  - `plus_one_count` of "7", "-1" or "abc"
  - `guess` of "maybe"
  - `is_attending` missing
- **Attending rules:** attending with no guess gives the `guess` path error. Attending with count 1 and no names gives the `plus_one_names` error.
- **Not attending:** `is_attending:false` with no guess passes.

**`answer-rules.test.ts`:**
- **`not attending clears guess and plus-ones`:** `toGuestResponseInsert("g1", {is_attending:false, name:"Ana", guess:"boy", plus_one_count:2, plus_one_names:"Ben", message:"sorry"})` → `{ guest_id:"g1", name:"Ana", is_attending:false, guess:null, plus_one_count:0, plus_one_names:null, plus_one_status:"none", plus_one_approved_count:null, message:"sorry" }`.
- **Guest requests plus-ones:** attending with count 2 → `plus_one_status:"pending"`, `plus_one_approved_count:null`. Count 0 → `"none"`, names `null`.
- **Admin enters plus-ones:** `toAdminResponseFields(attending, count 3)` → `plus_one_status:"approved"`, `plus_one_approved_count:3`. Not attending → the same cleared fields as the guest rule.
- **Decisions:**
  - `plusOneDecision(3, {approve:true, count:2})` → `{ plus_one_status:"approved", plus_one_approved_count:2 }`
  - `plusOneDecision(3, {approve:false})` → `{ plus_one_status:"declined", plus_one_approved_count:0 }`
  - `plusOneDecision(3, {approve:true, count:4})` and `(…, count:0)` throw `RangeError`.

**`invitation-view.test.ts`:**
- A response with `rsvp_closed:true` → `kind:"answered"`.
- No response, open → `"form"`.
- No response, past the deadline → `{kind:"closed", reason:"deadline"}`.
- `answerStatus`, one case per variant.

Run: `npx vitest run src/schemas src/lib` → FAIL.

- [ ] **Step 2: Implement.** Run the tests → PASS. Run the global commands.

- [ ] **Step 3: Commit** with the message `feat: RSVP schema, answer normalization and invitation view rules`.

---

### Task 6: Party theme and illustrations

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Create: `src/components/illustrations/` containing `crib.tsx`, `baby-bottle.tsx`, `onesie.tsx`, `rattle.tsx`, `pacifier.tsx`, `balloons.tsx`, `cloud.tsx`, `star.tsx`, `baby-outline.tsx`, `clothespin.tsx`, `index.ts`
- Create: `src/components/illustrations/illustrations.test.tsx`
- Create: `src/components/party/party-divider.tsx`

**Interfaces:**
- **Produces, tokens:** `--color-party-*` in `@theme inline`, replacing all `--color-wedding-*`:
  - `pink` #F7C6D9, `pink-deep` #D9719B
  - `blue` #BFDDF5, `blue-deep` #4F8FC9
  - `cream` #FFF9F3, `white` #FFFFFF
  - `ink` #3A4560, `ink-soft` #6B7590
- **Produces, font variables:** `--font-display` (Fredoka) and `--font-body` (Nunito), set in the root `layout.tsx` via `next/font/google`.
- **Produces, components:** each illustration is `(props: { className?: string; title?: string }) => JSX.Element`, rendering an `<svg>` that has:
  - `viewBox`
  - `aria-hidden="true"` unless `title` is given, in which case `role="img"` and `<title>`
  - fills and strokes only via `currentColor` or `var(--color-party-*)`

  Also `PartyDivider()`: a small centered row of stars and clouds.

- [ ] **Step 1: Failing test `illustrations.test.tsx`.** For each export of `index.ts`, `renderToStaticMarkup(<C />)` (from `react-dom/server`):
- contains `<svg`
- contains `aria-hidden="true"`
- does not match `/#[0-9a-fA-F]{3,8}\b/`

Run: `npx vitest run src/components/illustrations` → FAIL.

- [ ] **Step 2: Draw the SVGs.** Flat, rounded cartoon style with strokes in `var(--color-party-ink)` at about 2px.
- **Two-color items** use both `party-pink` and `party-blue`: crib, balloons, baby bottle, rattle.
- **Single items** inherit `currentColor`, so callers pick pink or blue in matched pairs: onesie, pacifier, clothespin.
- **`baby-outline`** is a simple baby face and blanket silhouette, used as the frame placeholder.

Run the tests → PASS.

- [ ] **Step 3: Theme.**
- **`globals.css`:**
  - Replace the wedding tokens with the party tokens.
  - Recolor the `.envelope-*` rules: body `party-cream`, closed lid `party-pink`, open lid `party-blue`, front gradient pink-to-blue, letter `party-white`.
  - Change the body background to a soft `party-cream` with faint pink and blue radial washes.
- **`layout.tsx`:** load Fredoka and Nunito, set `font-body` on `<body>`, and keep the Toaster.
- **Other files:** update every remaining `wedding-*` class in the copied admin and login files to the matching `party-*` token, with `ink` for text and primary buttons. `grep -r "wedding-" src` must return nothing except the four guest files and `src/utils/constants.ts`, which Task 7 replaces.

- [ ] **Step 4: Verify.** Run the global commands. Then `npm run dev`: `/login` renders in the new palette and fonts.

- [ ] **Step 5: Commit** with the message `feat(ui): pink-and-blue party theme and SVG baby illustrations`.

---

### Task 7: Invitation page and sections

**Files:**
- Create: `src/repositories/invitationRepository.ts` (server-only)
- Create: `src/lib/public-file.ts` (server-only)
- Create: `src/app/rsvp/layout.tsx`, `src/app/rsvp/page.tsx` (redirects to `/rsvp/error`), `src/app/rsvp/error/page.tsx`, `src/app/rsvp/[guestSlug]/page.tsx`
- Create, under `src/components/party/`:
  - `party-intro.tsx` and `party-envelope.tsx`, adapted from the wedding's `wedding-intro.tsx` and `wedding-envelope.tsx`
  - `party-header.tsx`
  - `mini-frames.tsx`
  - `wear-your-guess.tsx`
  - `party-venue.tsx` (from `wedding-venue-map.tsx`)
  - `prizes-teaser.tsx`
  - `party-closing.tsx`
  - `party-footer.tsx`
  - `guest-notes-callout.tsx` (moved)
- Delete: `src/components/guest/`
- Modify: `src/utils/constants.ts`

**Interfaces:**
- Consumes: Task 3 `createServiceClient`, Task 4 path helpers, Task 5 `resolveInvitationView`, Task 6 illustrations and tokens.
- **Produces, `invitationRepository`:**
  - `getInvitationByUuid(uuid: string): Promise<{ guest: Pick<Guest, "id" | "uuid" | "name" | "notes">; response: GuestResponse | null } | null>`
  - `getRsvpSettings(): Promise<RsvpSettings>`
  - `insertGuestResponse(row: GuestResponseInsert): Promise<"inserted" | "duplicate">`: Postgres error code `23505` maps to `"duplicate"`; any other error throws.
- **Produces:** `publicFileExists(publicPath: string): boolean`, using `fs.existsSync(path.join(process.cwd(), "public", publicPath))`.
- **Produces, constants:** `EVENT_TITLE`, `EVENT_HOSTS`, `EVENT_DATE_DISPLAY`, `VENUE_NAME`, `VENUE_ADDRESS`, `VENUE_MAPS_EMBED_URL`, `VENUE_MAPS_URL`, `COPY_*` (one per brief sentence), `PARTY_PHOTO_PATHS = { vera: "/party/mini-vera.jpg", philip: "/party/mini-philip.jpg" }`, `STORAGE_PARTY_ENVELOPE_OPENED = "party-envelope-opened"`, `MANILA_TIME_ZONE = "Asia/Manila"`, plus the retained admin constants.
  - `VENUE_MAPS_EMBED_URL = "https://www.google.com/maps?q=Aquatico+Royalle+Private+Resort,+South+Spring+Villas,+Bucal,+Calamba,+Laguna&output=embed"`
  - `VENUE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Aquatico+Royalle+Private+Resort+Bucal+Calamba+Laguna"`
  - Delete all wedding constants.
- **Produces, `rsvp/[guestSlug]/page.tsx`:**
  - `export const dynamic = "force-dynamic"`. `params: Promise<{ guestSlug: string }>`.
  - Parse the UUID; if it's missing or no invitation matches, `redirect("/rsvp/error")`.
  - A non-canonical slug redirects to `/rsvp/${rsvpPathSegment(...)}`.
  - Computes `view = resolveInvitationView(response, settings, new Date())`.
  - Renders the sections in §7.3 order, with `rsvpSlot` passed `view`, the guest and settings. For this task, `rsvpSlot` is a temporary `<p data-view={view.kind}>`; Task 8 replaces it.

- [ ] **Step 1: Build the repository, the helper and the constants.** They are verified through the page in Step 3.

- [ ] **Step 2: Build the sections**
- **`MiniFrames`** is a server component:
  - Two `-rotate-2` / `rotate-2` cards: left pink "Mini Vera", right blue "Mini Philip", with a round "or" badge between them and a `Clothespin` on each.
  - Each shows `next/image` from `PARTY_PHOTO_PATHS` when `publicFileExists` is true, otherwise `BabyOutline` in its frame color.
  - Side by side at 360px width.
- **`PartyEnvelope`:** "You're invited!" and "tap to open". The seal shows a "?".
- **`PartyIntro`:** keeps the wedding's sessionStorage and idle-mount behavior, using `STORAGE_PARTY_ENVELOPE_OPENED`.
- **`PartyVenue`:** iframe `VENUE_MAPS_EMBED_URL`, the address with a copy-to-clipboard button (sonner toast), and an "Open in Google Maps" link to `VENUE_MAPS_URL` with `target="_blank"`.
- **Other sections:** brief copy verbatim from constants. Tokens only; no hex.

- [ ] **Step 3: Verify.** Run `npx supabase db reset`, then `npm run dev`, then:
- `curl -s localhost:3000/rsvp/sample-guest-one-11111111-1111-4111-8111-111111111111` contains `Mini Vera or Mini Philip?`, `Aquatico Royalle Private Resort` and `data-view="form"`.
- `curl -sI localhost:3000/rsvp/wrong-name-11111111-1111-4111-8111-111111111111` returns a redirect, with `location` ending in `/rsvp/sample-guest-one-11111111-…`.
- `curl -sI localhost:3000/rsvp/nope` redirects to `/rsvp/error`.
- `curl -s localhost:3000/rsvp/sample-guest-three-33333333-3333-4333-8333-333333333333` contains `Bring a towel for the pool!`.

Run the global commands.

- [ ] **Step 4: Commit** with the message `feat(guest): invitation page with party sections and photo frames`.

---

### Task 8: RSVP form, submission, status and closed cards

**Files:**
- Create:
  - `src/actions/rsvp.ts`
  - `src/components/party/rsvp-form.tsx` (client)
  - `src/components/party/answer-status-card.tsx`
  - `src/components/party/rsvp-closed-card.tsx`
  - `src/components/party/rsvp-section.tsx`
  - `src/app/rsvp/[guestSlug]/thank-you/page.tsx`
- Modify: `src/services/emailService.ts`, `src/app/rsvp/[guestSlug]/page.tsx`
- Delete: `src/actions/respond.ts`, `src/repositories/respondRepository.ts`

**Interfaces:**
- Consumes: Tasks 4, 5 and 7.
- **Produces:** `type RsvpActionState = { error?: string; success?: boolean }` and `submitRsvpAction(uuid: string, prev: RsvpActionState, fd: FormData): Promise<RsvpActionState>`.
- **Order of checks and their messages:**
  1. Schema failure → the first issue's message.
  2. No invitation → `"This invitation link isn't valid."`
  3. An existing response, or `insertGuestResponse` returning `"duplicate"` → `"You've already sent your RSVP. Message Philip & Vera if something changed."`
  4. `!isRsvpOpen(settings, new Date())` → `"RSVPs are closed. Message Philip & Vera if you'd still like to come."`
  5. Otherwise, insert `toGuestResponseInsert(...)`.
  6. Schedule `sendAdminNotification` with `after()` from `next/server`.
  7. `revalidatePath` the guest path, then return `{ success: true }`.
- **Produces:** `RsvpSection({ guest, settings, view, slug })`, which renders the deadline line `Please RSVP by ${formatDeadlineDateManila(...)}` when there's a deadline and the view is `"form"`, then `GuestNotesCallout`, then one of `RSVPForm`, `AnswerStatusCard` or `RsvpClosedCard`.

- [ ] **Step 1: Build the form.**
- Fields, the sketch and the hide-when-not-attending rule are as in spec §7.4. It uses `react-hook-form` with `zodResolver(rsvpAnswerSchema)` and posts via `useActionState(submitRsvpAction.bind(null, uuid))`.
- Hidden fields aren't sent. Not-attending answers are also normalized server-side by Task 5, which is the guarantee.
- **Copy:**
  - Greeting: "Dear {guest.name},"
  - Count select: 0–5
  - Plus-one note: verbatim from Global Constraints
  - Submit button: "Send RSVP"
- On success, `window.location.href = /rsvp/${slug}/thank-you`. On error, show a sonner toast.

- [ ] **Step 2: Build the status and closed cards.**
- **`AnswerStatusCard`** has one variant per `answerStatus`:
  - **Attending:** includes "Your guess: Girl. Wear pink!" or "Your guess: Boy. Wear blue!"
  - **Plus-ones pending:** "Waiting for Philip & Vera to confirm your +N (names)"
  - **Plus-ones approved:** "Confirmed: you + N"
  - All variants end with "Need to change something? Message Philip & Vera."
- **`RsvpClosedCard`:**
  - Reason `deadline`: "RSVPs closed on {formatDeadlineDateManila}. Message Philip & Vera if you'd still like to come."
  - Reason `manual`: "RSVPs are closed. Message Philip & Vera if you'd still like to come."
- **Thank-you page:** "Thank you!", a summary line, and the closing copy.

- [ ] **Step 3: Email.** Update the template params to:
- `guest_name`, `respondent_name`
- `attendance_status`: "Attending" or "Not attending"
- `guess`: "Girl", "Boy" or "—"
- `plus_one_request`: "+2: Ben, Cy" or "None"
- `message`
- `submitted_at`: formatted in Manila
- `dashboard_url`: `${NEXT_PUBLIC_APP_URL}/dashboard`

It still returns early, without throwing, when EmailJS env vars are missing.

- [ ] **Step 4: Verify** with `npx supabase db reset && npm run dev`:
1. Submit the Sample Guest One form with attending, girl, 2 and "Ben, Cy". It lands on `/thank-you`.
2. Reopen the link: it shows "Waiting for Philip & Vera to confirm your +2".
3. `npx supabase db query "select attendance_status, submitted_at is not null from guests where name='Sample Guest One'"` returns `attending | t`. If `db query` isn't available, use `psql` with the DB URL from `supabase status`.
4. Run `update settings set rsvp_closed=true`, then open Sample Guest Two: it shows "RSVPs are closed." Post the form action directly from a stale tab, and it returns the closed error.
5. Reset with `update settings set rsvp_closed=false`.

Run the global commands.

- [ ] **Step 5: Commit** with the message `feat(guest): RSVP submission with deadline enforcement and status views`.

---

### Task 9: Link preview and metadata

**Files:**
- Create: `src/app/opengraph-image.tsx`
- Modify: `src/app/layout.tsx`, `src/app/rsvp/layout.tsx`

**Interfaces:**
- **Produces:** `opengraph-image.tsx` with `size = { width: 1200, height: 630 }`, `contentType = "image/png"`, `alt = "Gender Reveal & Baby Shower of Philip & Vera"`, and a default export returning `new ImageResponse(...)` from `next/og`. The card is a half-pink, half-blue background with this text:
  - `EVENT_TITLE`
  - "of Philip & Vera"
  - "Saturday, December 5, 2026 · 5:00 PM"
  - `VENUE_NAME`
- **Root metadata:** `metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_PUBLIC_APP_URL)`, `title: "Gender Reveal & Baby Shower | Philip & Vera"`, and a description that includes the date and venue.
- **`rsvp/layout.tsx`:** the same title, plus `robots: { index: false }`.

- [ ] **Step 1: Implement**, then verify:
- `curl -sI localhost:3000/opengraph-image` → `200` and `content-type: image/png`, without any redirect to `/login`.
- `curl -s localhost:3000/rsvp/sample-guest-two-…` contains `property="og:image"` with an absolute `http://localhost:3000/opengraph-image…` URL. If it's absent on nested routes, add a re-export file `src/app/rsvp/[guestSlug]/opengraph-image.tsx` that re-exports the root one.

Run the global commands.

- [ ] **Step 2: Commit** with the message `feat: link-preview card and page metadata`.

---

### Task 10: Admin guest management for the new model

**Files:**
- Modify: `src/repositories/guestRepository.ts`, `src/schemas/guest.ts`, `src/actions/guest.ts`, `src/app/dashboard/guests/page.tsx`
- Modify: `src/components/admin/` files: `create-guest-modal.tsx`, `edit-guest-modal.tsx`, `guest-table.tsx`, `guest-card.tsx`, `guest-card-list.tsx`, `copy-link-modal.tsx`, `view-response-modal.tsx`, `export-guests-button.tsx`, `filtered-guest-table.tsx`, `admin-navigation.tsx`
- Modify: `src/utils/exportGuests.ts`
- Create: `src/utils/exportGuests.test.ts`, `src/repositories/responseRepository.ts`, `src/actions/response.ts`

**Interfaces:**
- **Produces, `guestRepository`** (session client): `getAllGuestsWithResponses(): Promise<GuestWithResponse[]>`, using `.select("*, response:responses(*)").order("created_at", { ascending: false })`. Keep `createGuest`, `updateGuest`, `deleteGuest` and `deleteAllGuests`.
- **Produces, `responseRepository`** (session client):
  - `getResponseByGuestId(guestId): Promise<GuestResponse | null>`
  - `upsertAdminResponse(guestId, fields: Omit<GuestResponseInsert, "guest_id">): Promise<GuestResponse>`
  - `updatePlusOneDecision(guestId, fields): Promise<GuestResponse>`
- **Produces, `actions/response.ts`:** `fetchResponseAction(guestId): Promise<GuestResponse | null>`, which calls `requireAdmin()` first.
- **Produces:** `toExportRows(rows: GuestWithResponse[]): ExportRow[]`, with columns in the order given in spec §7.8. `exportGuestsToExcel(rows)` uses it.
- **Guest schema:** `name`, `email`, `phone` and `notes` only.
- **Guest page fields:**
  - Desktop table columns: Name, Status, Guess, Plus-ones ("+2 pending", "+1 approved", "+2 declined", "—"), Created, Actions.
  - Mobile cards show the same fields.
  - Search and status filters stay.
- **Copy-link:** builds `${NEXT_PUBLIC_APP_URL}/rsvp/${rsvpPathSegment(name, uuid)}`.
- **View-response modal:** shows every response field and the Manila-formatted answer time.

- [ ] **Step 1: Failing test `exportGuests.test.ts`**
- For a guest with an approved +2 response: `toExportRows` gives `Status:"Attending"`, `Guess:"Girl"`, `"Plus-ones requested":2`, `"Plus-one status":"Approved"`, `"Plus-ones approved":2`.
- For a guest with no response: `Status:"No answer yet"` and empty plus-one cells.

Run it → FAIL.

- [ ] **Step 2: Implement the repositories, actions, schema and components.** Run the test → PASS.

- [ ] **Step 3: Verify.** Sign in, then:
1. Add the guest "Test Person", copy their link, and open it in a private window: the invitation renders.
2. Edit their name: the old link redirects to the new slug.
3. Delete them.
4. The Excel export downloads.

Run the global commands.

- [ ] **Step 4: Commit** with the message `feat(admin): guest management for responses, guesses and plus-ones`.

---

### Task 11: Settings card (RSVP deadline)

**Files:**
- Create: `src/repositories/settingsRepository.ts` (session client), `src/actions/settings.ts`, `src/components/admin/settings-card.tsx`, `src/schemas/settings.ts`, `src/schemas/settings.test.ts`
- Modify: `src/app/dashboard/page.tsx`

**Interfaces:**
- Consumes: Task 4 `deadlineFromManilaDate`, `manilaDateFromDeadline`, `formatDeadlineManila`, `rsvpClosedReason`.
- **Produces:**
  - `updateRsvpSettings(fields: { rsvp_deadline: string | null; rsvp_closed: boolean }): Promise<Settings>`
  - `getSettings(): Promise<Settings>`
  - `settingsFormSchema`: `deadline_date` is `""` or `YYYY-MM-DD`, and `rsvp_closed` is boolean (FormData `"on"` → `true`, absent → `false`)
  - `toSettingsUpdate(parsed): { rsvp_deadline: string | null; rsvp_closed: boolean }`
  - `updateRsvpSettingsAction(prev, fd)`, which calls `requireAdmin()` first
- **Card UI:**
  - A native `<input type="date" name="deadline_date">`, defaulting to `manilaDateFromDeadline`.
  - A "Close RSVPs now" checkbox/switch and a Save button.
  - A status line:
    - Open: `Open until ${formatDeadlineManila(d)} (Manila)`
    - Closed by the deadline: `Closed — deadline passed ${formatDeadlineManila(d)} (Manila)`
    - Closed manually: `Closed manually`
    - No deadline: `Open — no deadline`

- [ ] **Step 1: Failing tests `settings.test.ts`**
- `toSettingsUpdate` of `{deadline_date:"2026-12-01", rsvp_closed:false}` → `{ rsvp_deadline:"2026-12-01T23:59:59+08:00", rsvp_closed:false }`
- `deadline_date:""` → `rsvp_deadline:null`
- `"2026-13-01"` fails the schema

Run → FAIL.

- [ ] **Step 2: Implement.** Run → PASS.

- [ ] **Step 3: Verify.**
1. Set the date to yesterday (Manila) and save. A guest link with no response shows the closed card, and the status line reads "Closed — deadline passed…".
2. Restore `2026-12-01`.
3. Toggle "Close now" and confirm the guest page responds.
4. Untoggle it.

Run the global commands.

- [ ] **Step 4: Commit** with the message `feat(admin): RSVP deadline settings card in Manila time`.

---

### Task 12: Plus-one requests card

**Files:**
- Create: `src/components/admin/plus-one-requests-card.tsx`
- Modify: `src/actions/response.ts`, `src/app/dashboard/page.tsx`

**Interfaces:**
- Consumes: Task 5 `plusOneDecision`, Task 10 `updatePlusOneDecision` and `getAllGuestsWithResponses`.
- **Produces:**
  - `decidePlusOneAction(guestId: string, decision: { approve: true; count: number } | { approve: false }): Promise<{ error?: string; success?: boolean }>`. It calls `requireAdmin()`, loads the response, applies `plusOneDecision(response.plus_one_count, decision)` (a `RangeError` becomes the error "Pick between 1 and N"), saves, and calls `revalidatePath("/dashboard")` and `revalidatePath("/dashboard/guests")`.
  - `PlusOneRequestsCard({ rows: GuestWithResponse[] })`: lists attending rows with `plus_one_status === "pending"`. Each shows the name, "+N", the names, the message, a number input (1..N, default N) with **Approve**, and **Decline**. When there are none: "No plus-one requests waiting."

- [ ] **Step 1: Implement**, then verify:
1. With Sample Guest One's +2 pending request from Task 8, approve 1.
2. The card empties, and the guest link shows "Confirmed: you + 1".
3. Decline instead after reseeding: the guest sees the declined variant.

Run the global commands.

- [ ] **Step 2: Commit** with the message `feat(admin): approve or decline plus-one requests`.

---

### Task 13: Dashboard stats

**Files:**
- Modify: `src/utils/statistics.ts`, `src/components/admin/dashboard-stats.tsx`, `src/app/dashboard/page.tsx`
- Create: `src/utils/statistics.test.ts`

**Interfaces:**
- Consumes: `GuestWithResponse`.
- **Produces:** `interface PartyStats { invited; attending; notAttending; noAnswer; approvedPlusOnes; pendingPlusOneRequests; pendingPlusOneSeats; expectedHeadcount; headcountIfAllApproved; teamPink; teamBlue }` (all numbers), and `calculatePartyStats(rows: GuestWithResponse[]): PartyStats`.
  - Attendance comes from `guests.attendance_status`.
  - Plus-one and guess figures count only attending rows.
  - `expectedHeadcount = attending + approvedPlusOnes`
  - `headcountIfAllApproved = expectedHeadcount + pendingPlusOneSeats`
- **`DashboardStats({ rows })`:**
  - Cards: Invited, Attending, Not attending, No answer yet, Expected headcount (subtitle "{headcountIfAllApproved} if all pending plus-ones are approved"), and Plus-one requests waiting.
  - A Team Pink vs Team Blue bar: two equal-height segments sized by share; 50/50 when both are 0.
  - Cards expand into `FilteredGuestTable`, as in the wedding.

- [ ] **Step 1: Failing test.** Rows:
- A: attending, girl, approved 2 of 2
- B: attending, boy, pending 3
- C: attending, girl, 0
- D: not attending
- E: no answer

Expect `{ invited:5, attending:3, notAttending:1, noAnswer:1, approvedPlusOnes:2, pendingPlusOneRequests:1, pendingPlusOneSeats:3, expectedHeadcount:5, headcountIfAllApproved:8, teamPink:2, teamBlue:1 }`. Run → FAIL.

- [ ] **Step 2: Implement.** Run → PASS. Check the dashboard in the browser. Run the global commands.

- [ ] **Step 3: Commit** with the message `feat(admin): headcount and Team Pink vs Team Blue stats`.

---

### Task 14: Admin "Edit answer" form

**Files:**
- Create: `src/components/admin/edit-answer-modal.tsx`
- Modify: `src/actions/response.ts`, `src/components/admin/guest-table.tsx`, `src/components/admin/guest-card.tsx`, `src/components/admin/view-response-modal.tsx`

**Interfaces:**
- Consumes: Task 5 `rsvpAnswerSchema`, `parseRsvpFormData`, `toAdminResponseFields`. Task 10 `upsertAdminResponse`.
- **Produces:**
  - `saveAdminAnswerAction(guestId: string, prev, fd: FormData): Promise<{ error?: string; success?: boolean }>`: calls `requireAdmin()`, parses with the same schema, upserts `toAdminResponseFields(answer)`, and revalidates the dashboard paths. It ignores the deadline and the closed switch.
  - `EditAnswerModal({ guest, response })`: a `BaseModal` with the §7.4 fields, prefilled from `response` or empty. The title is "Record answer" when there's no response, otherwise "Edit answer".

- [ ] **Step 1: Implement**, then verify:
1. With RSVPs closed via settings, record an answer for Sample Guest Two: attending, boy, +1 "Dee". The guest's link shows "Confirmed: you + 1".
2. Edit it to not attending. The plus-ones clear, and stats update.

Run the global commands.

- [ ] **Step 2: Commit** with the message `feat(admin): record or edit a guest's answer`.

---

### Task 15: Docs, full verification, Messenger smoke test

**Files:**
- Create: `.github/docs/changelog.md`
- Modify: `README.md`, `docs/superpowers/specs/2026-11-21-gender-reveal-rsvp-design.md` (status line → "Approved; implemented on feat/initial-build")

- [ ] **Step 1: Full checks.** Run `npm run lint && npm run type-check && npm test && npx supabase test db && npm run build`. All must exit 0.

- [ ] **Step 2: Security spot checks**
- Running `curl -s "http://127.0.0.1:54321/rest/v1/guests?select=*" -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"` returns a permission error or `[]`, never rows.
- `grep -rn "SERVICE_ROLE" src` lists only `src/utils/supabase/service.ts`.
- Every file that imports `createServiceClient` starts with `import "server-only"`.

- [ ] **Step 3: Messenger smoke test.** Use Playwright (MCP or script) with viewport 390×844 and a user-agent containing `FBAN/MessengerForiOS;FBAV/450.0` on Sample Guest Three's link:
1. The envelope opens on tap.
2. The frames are side by side.
3. The map iframe is present.
4. Submitting not attending → the thank-you page.
5. Reopening → "We'll miss you"-style card.

Take screenshots for the record (not committed).

- [ ] **Step 4: Docs.**
- **Changelog entry:** the initial build.
- **README:** list remaining items from spec §8: baby photos to `public/party/`, song, deployment and domain, cloud Supabase, admin emails, EmailJS.

- [ ] **Step 5: Commit** with the message `docs: changelog, README and spec status`. Then run the final whole-branch review, merge `feat/initial-build` into `main`, and run the checks again on `main`.
