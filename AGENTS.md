# Repository Guidelines

Use this guide when contributing agents to the GDPR Seeker codebase.

## Project Structure & Module Organization
- `src/app` hosts App Router segments, UI-specific server actions, and route handlers; keep feature folders self-contained with `_components`.
- `src/server` contains tRPC routers (`api/routers`) and Drizzle wiring (`db/`); extend via new procedures and update `src/server/root.ts`.
- Client/server bridges live in `src/trpc`; reuse providers instead of creating ad-hoc API clients.
- Shared UI primitives sit in `src/components/ui`, global CSS in `src/styles`, static assets in `public/`, and SQL migrations in `drizzle/`.

## Build, Test, and Development Commands
- `pnpm dev` starts the Next.js dev server with Turbopack; `pnpm preview` validates the production bundle locally.
- `pnpm build` runs the production compiler; treat failures as blockers before opening a PR.
- `pnpm check` executes ESLint and TypeScript (CI gate); `pnpm lint:fix` and `pnpm format:write` clean up offenses.
- `pnpm db:generate`, `pnpm db:migrate`, and `pnpm db:push` manage Drizzle migrations; inspect generated SQL under `drizzle/` before committing.
- `pnpm db:studio` opens Drizzle Studio for Turso/libSQL inspection.

## Coding Style & Naming Conventions
- Write modern TypeScript; prefer `import type` when only types are used to satisfy ESLint rules.
- Allow Prettier + `prettier-plugin-tailwindcss` to format (2-space indent, deterministic class ordering); avoid manual Tailwind sorting.
- Name React exports in PascalCase; keep file names kebab-case except for Next route entries (`page.tsx`, `layout.tsx`).
- Contain database access in `src/server/db`; rely on existing Drizzle helpers and let eslint-drizzle enforce safe mutations.

## Testing Guidelines
- No automated test suite ships yet, so run `pnpm check` before every commit; treat it as the minimum safety net.
- When adding tests, favor Vitest for units/server utilities and Playwright for user flows; co-locate specs as `<name>.test.ts[x]` beside the source or under a feature-level `__tests__` directory.
- Seed or reset data through Drizzle migrations/fixtures; never hard-code production credentials in tests.
- Document coverage expectations and gaps in your PR description if significant logic ships without tests.

## Commit & Pull Request Guidelines
- Follow the existing log style: concise, imperative first lines such as "Add sign up page"; keep hard wraps ≤72 characters.
- Reference issues or Notion tickets in the body, and bundle schema changes with their corresponding migration files.
- PRs must list manual checks (`pnpm dev`, `pnpm check`, migrations, screenshots for UI changes) and call out new env vars or config steps.
- Request review from at least one maintainer familiar with the touched area and wait for CI to succeed before merging.

## Security & Configuration Tips
- Store Clerk and Turso secrets in `.env.local`; update `src/env.js` whenever new variables are introduced.
- Validate admin-only features with Clerk middleware and existing server helpers; do not bypass authentication in server routes.
- Scrub database dumps or personal data before sharing logs; prefer Drizzle Studio filters when troubleshooting locally.
