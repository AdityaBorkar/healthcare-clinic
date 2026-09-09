# AGENTS.md

Bun + TanStack Start (file routes, SSR) + Vite 8 + Nitro (preset `bun`) + Tailwind v4 + oRPC. Domain logic (auth/Postgres/S3 schema) lives in sibling Aspen OS repo (`~/projects/aspen-os`, readable per `opencode.json`); `@aspen-os/*` are `link:` deps.

## Commands

- `bun run dev` — `infra:dev-run` injects Pulumi `dev`-stack `app:*` config as env (prompts for `PULUMI_CONFIG_PASSPHRASE` unless set), then `vite dev --port 4020`. Same wrapper applies to `test` and `db:studio` — never run bare `vite`/`vitest` expecting env.
- `bun run check:types` — `tsc --noEmit`. `bun run check:lint` — `biome check --fix` (auto-fixes; mutates). Biome is the only linter/formatter.
- `bun run build` — `vite build`, emits to `.output/` (`vite.config.ts`).
- `bun run test` — `vitest run` via wrapper; no test files exist yet.
- `bun run gen:routes` — `tsr generate` (`*.gen.ts` is gitignored; TanStack plugin regenerates on dev, rarely needed manually).
- `bun run db:studio` — `aspen db-studio --config=./src/aspen/server.ts` via wrapper.
- `bun run update-deps` — `bun update --latest && bun install` (note name: `update-deps`, no colon).
- `bun run infra:up|preview|refresh|down -- --stack <dev|preview|production>` — Pulumi; `infra/index.ts` currently provisions only Postgres (MinIO commented out). Ports come from stack config (dev `postgres:DB_PORT=5410`), not hardcoded.

## Architecture

- Aspen platform: `src/aspen/server.ts` exports `pm` (`IsolatedTenantPlatform` + `ManagementPlane`); `src/aspen/client.ts` exports browser `pm`. DB/auth/storage are configured there from `src/env.ts`. The standalone `@aspen-os/organization` module was removed upstream — tenant profile is now the better-auth `organization` row (name/slug/logo) managed via `ManagementPlane` workflows (`tenants.get`/`tenants.update`).
- oRPC: router in `src/rpc/router.ts`, procedures in `src/rpc/procedures/`, `authed` middleware in `src/rpc/middlewares/auth.ts` (session via `pm.auth…getSession({headers})`). UI/server-components must call via `orpc` from `src/lib/orpc.ts` (isomorphic: direct `RouterClient` on server, `RPCLink → /api/rpc` in browser) — never import `src/aspen/server.ts` or the router at module top level in shared/client code; procedures use lazy `await import("#/aspen/server")` for this reason.
- HTTP entries: `src/routes/api/rpc.$.ts` (`/api/rpc`), `src/routes/api/auth.$.ts` (`pm.auth.fetchHandler` with subdomain-aware CORS via `isTrustedWebOrigin`).
- Routes: `/` landing, `/account/*`, `/(tenant)/*` guarded by `beforeLoad` in `src/routes/(tenant)/route.tsx` (session check → redirect `/`, then `orpc.organizations.bySubdomain()`).
- Validation schemas in `src/schemas/*` are valibot (not zod).
- Alias `#/*` → `src/*` (`tsconfig.json` + `resolve.tsconfigPaths` + `components.json`); only `PUBLIC_*` env is client-exposed (`envPrefix` + `clientPrefix`).

## Gotchas

- Env comes from Pulumi stack config, not `.env.local` (no such file; `.env*` gitignored). Adding a var requires `src/env.ts` (`@t3-oss/env-core`, validated at import — missing var crashes startup) **and** `pulumi config set app:<NAME> --stack <stack>`.
- Dockerfile builds to `.output/` and runtime copies `.output` (fixed Sep 2026).
- TS is strict (`noUncheckedIndexedAccess`, `verbatimModuleSyntax` → use `import type`, `noUnusedLocals/Parameters`).
- Biome auto-sorts imports (URL → node/bun → package → alias); run `check:lint` before finishing.
- Design tokens (stone canvas + single cyan accent) live in `src/styles.css` per `DESIGN.md` — reuse them, no ad-hoc colors.
- `.commitlintrc.json` allows `wip` type; `lint-staged` is an unused dep (no config) and `.husky/` has no active hooks — don't assume pre-commit enforcement.
