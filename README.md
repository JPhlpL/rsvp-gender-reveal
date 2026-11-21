# Gender Reveal & Baby Shower RSVP

Invitation and RSVP site for Philip & Vera's Gender Reveal & Baby Shower — Saturday, December 5, 2026, 5:00 PM at Aquatico Royalle Private Resort.

Each guest gets a personal link (`/rsvp/<name>-<code>`) to a pink-and-blue invitation where they RSVP, share their guess, and request plus-ones. The couple manage guests, approve plus-ones, and set the RSVP deadline from an admin dashboard.

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
npm run dev                        # http://localhost:3000
```

`.env.local` for local development:

```bash
NEXT_PUBLIC_SUPABASE_URL=<API_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY>
NEXT_PUBLIC_APP_URL=http://localhost:3000
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
| `npm run admin:create -- <email> <password>` | Create an admin user in the local database |

## Private project

All rights reserved.
