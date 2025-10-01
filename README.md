# GDPR Seeker

GDPR Seeker helps candidates generate and track GDPR data access/deletion requests after interviews. Built on Next.js App Router with tRPC, Drizzle ORM (Turso/libSQL), and Clerk.

## Tech Stack

- Next.js 15 (App Router) + React 19
- TypeScript
- Authentication: Clerk (hosted auth + components)
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
      trpc/[trpc]/route.ts           # tRPC fetch adapter endpoint

  server/
    api/
      routers/
        company.ts              # Company CRUD + search (admin verify)
        gdprRequest.ts          # Create, list, and state of requests
      trpc.ts                   # tRPC init, context, procedures
      root.ts                   # App router composition
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
- `admin_users`: whitelist of admin user IDs
- `gdpr_request`: per-user requests (company, personal info)
- `gdpr_request_interview`: interviews attached to a request
- `gdpr_request_state`: request state transitions (STARTED → DONE)

Only verified companies are searchable/usable. Users can suggest companies; admins verify or delete them.

### API (tRPC)

- `company` router: `getById`, `create`, `listUnverified` (admin), `verify` (admin), `remove` (admin), `searchByName`
- `gdprRequest` router: `getMyLatest` (prefill), `create`, `getState`, `listMine`

### Auth (Clerk)

- Authentication flows are handled by Clerk's hosted UI via `ClerkProvider`.
- Sign-in page: `src/app/sign-in/page.tsx`. OAuth redirects finalize at `src/app/sign-in/sso-callback/page.tsx`.

## Getting Started

### Prerequisites

- Node.js 18.18+ (recommended: Node 20 LTS)
- pnpm 10+ (`corepack enable` or `npm i -g pnpm`)
- Active Clerk project with publishable + secret keys (https://clerk.com)
- Turso/libSQL database (or compatible libsql endpoint)
- Vercel CLI (`npm i -g vercel`) if you plan to sync env vars from Vercel

### 1) Install dependencies

```
pnpm install
```

### 2) Configure environment

Create `.env.local` (or `.env`) in the project root with:

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database (Turso / libSQL)
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

Values must match the schema in `src/env.js`.

If you manage configuration through Vercel, pull the remote environment into your local file after logging in:

```
vercel env pull .env.local
```

Update Clerk redirect URLs in the Clerk dashboard to include your local and deployed domains (e.g. `http://localhost:3000` and your Vercel preview/production URLs).

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
- Provide Clerk publishable + secret keys and configure redirect URLs in the Clerk dashboard to match your deployment domain.

## License

Proprietary — internal project.
