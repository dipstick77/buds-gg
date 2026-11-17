# buds.gg — Discover (groups-first)

Adult gaming social discovery: find groups and players that fit your vibe. This Phase A UI shell ships a **Discover** homepage and public `/g/{slug}` group pages on **static seed data** — no Supabase keys required to run or deploy.

Not a Linktree product. Vanity `/{username}` player cards remain as a growth loop / Temporary Context until rich `/u/` profiles land.

## Quick start (no keys)

```bash
npm install
cp .env.example .env.local   # all keys can stay empty
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo routes

| Route | What you get |
|-------|----------------|
| `/` or `/discover` | Discover shell — groups-first grid + filters |
| `/g/summit-gaming` | Public group page (seed) |
| `/g/elite-raiders` | Applications-mode example |
| `/maya`, `/kai`, `/nova` | Seed player vanity cards (SQLite / in-memory on Vercel) |

## Stack

- **Next.js 15** App Router + TypeScript + Tailwind CSS v4
- Design tokens: Discord-sleek charcoal + mint (`src/app/globals.css`)
- **Seed groups:** `src/data/groups.json` (no DB)
- **Supabase:** client scaffold in `src/lib/supabase/*` — returns `null` when env unset
- **Schema stub:** `supabase/migrations/0001_init.sql` (apply later)
- Optional legacy SQLite for vanity player demos (`better-sqlite3`)

## Environment variables

| Variable | Required now? | Unlocks later |
|----------|---------------|---------------|
| `NEXT_PUBLIC_APP_URL` | Recommended | Canonical URL / OG |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Live Postgres + Auth clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Browser/server user-scoped client |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Trusted server jobs only (never ship to browser) |
| `DISCORD_CLIENT_ID` / `_SECRET` / `_REDIRECT_URI` | No | Discord OAuth login |
| `BUDS_DB_PATH` | No | Local SQLite path for vanity demos |
| `AUTH_DEV_ALLOWLIST` | Hosted: yes for email login | Comma-separated emails allowed for `/api/auth/dev`. Required on production/Vercel/Cursor; unset disables that path. |

## What’s in this PR

- App shell: sidebar (Discover / Groups / Players) + header search chrome
- Groups-first Discover: hero, tabs, filter chips (client state), group cards, optional right rail
- 8 seed groups + `/g/[slug]` public pages
- Temporary Context callouts for Auth, matching, applications, Supabase
- Reserved routes expanded: `g`, `discover`, `mod`, `onboarding`, …
- README + `.env.example` for zero-key local/Vercel runs

## Stubbed / deferred (on purpose)

- Real Auth, 18+ attestation, RLS against live DB
- Applications backend + owner review
- Matching / “For You” scoring
- Stripe / Premium
- Steam sync, messaging, realtime presence
- Persistent search (header search is chrome-only for now)

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deploy (Vercel)

Repo is wired for Vercel previews via GitHub. Leave Supabase vars empty — Discover still renders from seed JSON. Vanity `/{handle}` demos use in-memory SQLite on Vercel (`VERCEL=1`) and reseed on cold start.
