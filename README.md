# GDPR Seeker

GDPR Seeker helps candidates generate and track GDPR data access/deletion requests after interviews. Built on Next.js App Router with tRPC, Drizzle ORM (Turso/libSQL), and NextAuth.

## Tech Stack

- Next.js 15 (App Router) + React 19
- TypeScript
- Authentication: NextAuth v5 (Discord provider) with Drizzle adapter
- API: tRPC v11 + SuperJSON, TanStack Query v5
- Database: Drizzle ORM (SQLite dialect via Turso/libSQL)
- Styling: Tailwind CSS v4
- Env validation: @t3-oss/env-nextjs + Zod

## Architecture Overview

```
src/
  app/
    page.tsx                    # Landing page
    get-started/page.tsx        # Authed home: search, progress
    gdpr-request/page.tsx       # Create GDPR request (authed)
    admin/page.tsx              # Admin verify/remove companies
    _components/
      company-search.tsx        # Search verified companies + select
      add-company-button.tsx    # Modal to propose a new company
      gdpr-request-form.tsx     # Form to submit a GDPR request
      back-button.tsx
    api/
      auth/[...nextauth]/route.ts    # NextAuth route handler
      trpc/[trpc]/route.ts           # tRPC fetch adapter endpoint

  server/
    api/
      routers/
        company.ts              # Company CRUD + search (admin verify)
        gdprRequest.ts          # Create, list, and state of requests
      trpc.ts                   # tRPC init, context, procedures
      root.ts                   # App router composition
    auth/
      config.ts                 # NextAuth config (Discord, adapter)
      index.ts                  # Exports auth, handlers, signIn/out
    db/
      schema.ts                 # All tables and relations
      index.ts                  # Drizzle + libsql client

  trpc/
    server.ts                   # RSC caller + hydration helpers
    react.tsx                   # Client provider + links
    query-client.ts             # QueryClient defaults (SuperJSON)

  styles/
    globals.css                 # Tailwind v4 setup

drizzle/                         # SQL migrations + meta
drizzle.config.ts                 # Drizzle Kit (turso dialect)
next.config.js                    # Loads env and Next config
package.json                      # Scripts and dependencies
```

### Data Model (Drizzle / SQLite)

- `companies`: name, domain, gdprEmail, verified
- `users`, `accounts`, `sessions`, `verification_tokens`: NextAuth tables
- `admin_users`: whitelist of admin user IDs
- `gdpr_request`: per-user requests (company, personal info)
- `gdpr_request_interview`: interviews attached to a request
- `gdpr_request_state`: request state transitions (STARTED → DONE)

Only verified companies are searchable/usable. Users can suggest companies; admins verify or delete them.

### API (tRPC)

- `company` router: `getById`, `create`, `listUnverified` (admin), `verify` (admin), `remove` (admin), `searchByName`
- `gdprRequest` router: `getMyLatest` (prefill), `create`, `getState`, `listMine`

### Auth (NextAuth v5)

- Discord provider; Drizzle adapter persists users/sessions in the same DB.
- Route handler at `src/app/api/auth/[...nextauth]/route.ts`.

## Getting Started

### Prerequisites

- Node.js 18.18+ (recommended: Node 20 LTS)
- pnpm 10+ (`corepack enable` or `npm i -g pnpm`)
- Turso/libSQL database (or compatible libsql endpoint)

### 1) Install dependencies

```
pnpm install
```

### 2) Configure environment

Create `.env.local` (or `.env`) in the project root with:

```
# NextAuth
AUTH_SECRET= # required in production (generate with `openssl rand -base64 32`)
AUTH_DISCORD_ID=
AUTH_DISCORD_SECRET=

# Database (Turso / libSQL)
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

Values must match the schema in `src/env.js`. In development, `AUTH_SECRET` is optional, but Discord OAuth requires `AUTH_DISCORD_ID` and `AUTH_DISCORD_SECRET`.

### 3) Initialize the database

Drizzle Kit is configured for Turso (`drizzle.config.ts`). Either push the current schema or run migrations:

```
# Option A: Push current schema
pnpm db:push

# Option B: Generate + migrate
pnpm db:generate
pnpm db:migrate

# Optional: Inspect with Drizzle Studio
pnpm db:studio
```

Note: Drizzle prefixes tables with `gdpr-seeker_` (see `schema.ts`).

### 4) Run the app

```
pnpm dev
```

Visit http://localhost:3000.

### 5) Make yourself an admin (optional)

To verify companies via `/admin`, add your user ID (from the `gdpr-seeker_user` table) to `gdpr-seeker_admin_users` after signing in once:

```sql
INSERT INTO "gdpr-seeker_admin_users" (userId) VALUES ("<your-user-id>");
```

You can run this via `pnpm db:studio` or your DB console.

## Common Workflows

- Propose a company: use “Add Company” in search; an admin must verify it.
- Create a GDPR request: pick a verified company, fill details; the latest request pre-fills future forms.
- Track progress: `/get-started` shows your requests and latest states.
- Admin: `/admin` lists unverified companies to verify/delete (server actions).

## Scripts

- `pnpm dev` — Run Next.js dev server
- `pnpm build` — Build production bundle
- `pnpm preview` — Build then start
- `pnpm start` — Start production server
- `pnpm check` — Lint + typecheck
- `pnpm lint` / `pnpm lint:fix` — ESLint
- `pnpm typecheck` — TypeScript
- `pnpm format:check` / `pnpm format:write` — Prettier
- `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:push` / `pnpm db:studio` — Drizzle Kit

## Deployment Notes

- Set all env vars in your host (e.g., Vercel). Ensure the Turso/libSQL endpoint is reachable from your runtime.
- Use the same DB for NextAuth tables.
- Configure OAuth callback URLs for Discord to match your deployment domain.

## License

Proprietary — internal project.
