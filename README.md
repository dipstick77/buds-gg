# buds.gg — Gamer Linkhub MVP

Claimable `buds.gg/{handle}` gaming identity cards: manual platform links with Copy / Open CTAs, favorite games, avatar/bio, and 3 themes. Built for duo / LFG players.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS v4
- **SQLite** via `better-sqlite3` (`./data/buds.db`) — schema matches the product plan (`users`, `profiles`, `platform_links`, `favorite_games`, `showcase_items`, `sessions`) so swapping to Supabase/Postgres later is straightforward
- Auth: **Discord OAuth** when env vars are set; otherwise **dev email login** with on-page temporary context explaining what’s needed for Discord

## Quick start

```bash
npm install
cp .env.example .env.local   # optional; Discord vars can stay empty
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Seeded demo profiles (no auth):

- [/maya](http://localhost:3000/maya) — soft-buds theme
- [/kai](http://localhost:3000/kai) — midnight theme
- [/nova](http://localhost:3000/nova) — signal theme

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Recommended | Canonical app URL (OG + Discord redirect fallback). Default `http://localhost:3000`. |
| `BUDS_DB_PATH` | No | SQLite file path. Default `./data/buds.db`. |
| `DISCORD_CLIENT_ID` | For Discord auth | Discord application client ID |
| `DISCORD_CLIENT_SECRET` | For Discord auth | Discord application client secret |
| `DISCORD_REDIRECT_URI` | For Discord auth | Must match Discord app settings, e.g. `http://localhost:3000/api/auth/discord/callback` |
| `AUTH_DEV_ALLOWLIST` | No | If set, only these comma-separated emails can use `/api/auth/dev` |

### Finishing Discord OAuth

1. Create an application at [Discord Developer Portal](https://discord.com/developers/applications)
2. OAuth2 → add redirect `http://localhost:3000/api/auth/discord/callback` (and your production URL)
3. Copy Client ID / Secret into `.env.local`
4. Restart `npm run dev` — Login shows **Continue with Discord**

Until then, use **Continue with email (dev)** on `/login`.

## What works in this MVP

- Landing with brand-first hero + example profile links
- Public profiles at `/{handle}` with Copy / Open platform CTAs
- Favorite games strip, looking-for-a-bud flag, 3 themes (`midnight`, `soft-buds`, `signal`)
- Claim handle + edit profile (explicit Save)
- Dev auth + Discord OAuth routes (when configured)
- Visible **Temporary context** / Coming later copy for Steam inventory, Discord presence, Pro

## Stubbed / deferred (on purpose)

- Live Discord presence
- Steam inventory / skin gallery sync
- Per-platform OAuth verification badges
- Avatar file upload (URL only for now)
- Pro / payments / analytics
- Crew pages / full LFG board

## Scripts

```bash
npm run dev      # local development
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

## Deploying on Vercel

- Local/dev: file SQLite at `./data/buds.db` (or `BUDS_DB_PATH`).
- **On Vercel (`VERCEL=1`)**: SQLite runs **in-memory** and reseeds demo profiles (`maya` / `kai` / `nova`) on each cold start. Claims/edits do **not** persist across serverless instances — expected for this MVP preview. Swap to Supabase/Postgres for durable production data.
- Optional env on the Vercel project: `NEXT_PUBLIC_APP_URL` = your deployment URL; Discord vars when ready.

## Data upgrade path

Keep the TypeScript types in `src/lib/types.ts` and repository functions in `src/lib/db.ts`. Replacing SQLite with Supabase means swapping those DB calls for Postgres queries / RLS while keeping the same profile JSON shape returned to the UI.
