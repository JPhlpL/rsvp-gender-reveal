# Gender Reveal & Baby Shower RSVP

Invitation and RSVP site for Philip & Vera's Gender Reveal & Baby Shower — Saturday, December 5, 2026, 5:00 PM at Aquatico Royalle Private Resort.

Each guest gets a personal link (`/rsvp/<name>-<code>`) to a pink-and-blue invitation where they RSVP and share their guess. The couple manage guests, record or reset answers, and set the RSVP deadline from an admin dashboard. A public showcase of the invitation, with no RSVP form, is at `/invitation`.

Built with Next.js 16 (App Router), Supabase (Postgres + Auth), Tailwind CSS 4 and shadcn/ui. Design: [`docs/superpowers/specs/`](docs/superpowers/specs/). Plan: [`docs/superpowers/plans/`](docs/superpowers/plans/).

## Local setup

Requires Node 20+ and Docker Desktop (running).

```bash
npm install
npx supabase start                 # local Postgres/Auth/Studio in Docker
npx supabase status -o env         # copy API_URL, ANON_KEY, SERVICE_ROLE_KEY into .env.local
cp .env.example .env.local         # then fill in the values (see below)
npx supabase db reset              # apply migrations + seed sample guests
npm run admin:create -- you@example.com 'a-strong-password'
npm run dev                        # http://localhost:3005
```

`.env.local` for local development:

```bash
NEXT_PUBLIC_SUPABASE_URL=<API_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY>
NEXT_PUBLIC_APP_URL=http://localhost:3005
ADMIN_EMAILS=you@example.com
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript, no emit |
| `npm test` | Unit tests (Vitest) |
| `npm run test:db` | Database tests (pgTAP via `supabase test db`; needs local Supabase running) |
| `npm run types:generate` | Regenerate `src/types/database.ts` from the local database |
| `npm run admin:create -- <email> <password>` | Create an admin user (or mark an existing one as admin). Only users created this way can see guest data. |

## Private project

All rights reserved.

## Local services and ports

- App: http://localhost:3005 (port 3000 is used by another app on this machine).
- Supabase (local, via Docker): API 54421, DB 54422, Studio http://127.0.0.1:54423, mail catcher 54424. These avoid the default 543xx ports used by another local Supabase project. Storage and analytics are turned off.
- Sample guests are seeded by `npx supabase db reset` (this also wipes users — re-run `npm run admin:create` afterwards).

## Before sending invitations

0. **Real phone check:** add a test guest, send its link to yourself and open it on a real phone *inside Messenger* (and once in a regular browser): tap the envelope, scroll every section, open the map and send a test RSVP. Then delete the test guest from the dashboard. The app was only tested with an emulated phone.
1. **Baby photos:** save them as `public/party/mini-vera.jpg` and `public/party/mini-philip.jpg` (portrait works best). Until then the frames show a cartoon placeholder.
2. **Deploy:** create a cloud Supabase project (the free plan allows 2 active projects — pause the wedding one if needed), apply `supabase/migrations/`, disable sign-ups, and create the admin users. Deploy to Vercel with the env vars from `.env.example`.
3. **Real address:** set `NEXT_PUBLIC_APP_URL` to the final domain *before* copying any guest links — copied links keep whatever address was set when copied. Links copied on localhost won't work for guests.
4. **Admins:** create each admin with `npm run admin:create` (pointed at the cloud project's URL and service-role key) and list their emails in `ADMIN_EMAILS`. Both are needed: the database only shares guest data with users the script marked as admin, so an account made by hand in the Supabase dashboard — or by someone signing up — sees nothing.
5. **Email notifications (optional):** set the EmailJS variables. Template fields: `guest_name`, `respondent_name`, `attendance_status`, `guess`, `plus_one_request`, `message`, `submitted_at`, `dashboard_url`, `to_email`.
6. **Music (optional):** not included; add a song and a player if wanted.
