# AGENTS.md

Bun + TanStack Start (file routes, SSR) + Vite 8 + Nitro (preset `bun`) + Tailwind v4 + oRPC. Domain workflows (`pm.healthcare.*`, `pm.management.*`, auth/storage) live in the sibling Aspen OS repo (`~/projects/aspen-os`, readable per `opencode.json`); `@aspen-os/*` are `link:` deps. This repo holds thin oRPC wrappers (`src/rpc/procedures/` → `pm.*.run(...)`) plus UI — put clinic business logic in Aspen OS, wiring/UI here.

## Commands

- `bun run dev` — `infra:dev-run` injects `dev`-stack Pulumi config as env (prompts for `PULUMI_CONFIG_PASSPHRASE` unless set), then `vite dev --port 4020`. Same wrapper applies to `test`, `preview`, `db:studio`, `dev:seed`, `dev:prepare` — never run bare `vite`/`vitest` expecting env.
- `bun run dev:prepare` — non-interactive control-plane setup (`pm.$prepareInfra` + required-tables check); `bun run dev:seed` — interactive `@clack/prompts` CLI creating org + user. Run prepare before seed on a fresh DB.
- `bun run check:types` — `tsc --noEmit`. `bun run check:lint` — `biome check --fix` (auto-fixes; mutates). Biome is the only linter/formatter.
- `bun run test` — `vitest run` via the wrapper; no `*.test.*` files exist yet, so expect "No test files found" until a suite is added.
- `bun run build` — `vite build` → `.output/`. `bun run gen:routes` — `tsr generate` (`*.gen.ts` gitignored; TanStack plugin regenerates on dev, rarely needed manually).
- `bun run db:studio` — `aspen db-studio --config=./src/aspen/server.ts` via wrapper.
- `bun run update-deps` — `bun update --latest && bun install` (note name: `update-deps`, no colon).
- `bun run infra:up|preview|refresh|down -- --stack <dev|preview|production>` — Pulumi; `infra/index.ts` provisions OCI VPS + Docker (postgres, app, caddy) + Cloudflare DNS. `dev` stack skips the VPS and uses local Docker only.

## Architecture

- Aspen platform: `src/aspen/server.ts` exports `pm` (`IsolatedTenantPlatform` + `ManagementPlane`); `src/aspen/client.ts` exports browser `pm`. DB/auth/storage configured there from `src/env.ts`. Tenant profile is the better-auth `organization` row (name/slug/logo) via `ManagementPlane` workflows (`tenants.get`/`tenants.update`).
- Server/client boundary: `src/aspen/server.ts` is server-only (reads `src/env.ts`, opens the DB) — never import it at module top level outside server context. Procedures lazy `await import("#/aspen/server")` inside handlers; only `src/routes/api/*` server handlers import it directly. UI uses `pm` from `#/aspen/client` (auth) and `orpc` from `#/lib/rpc` for data. The only top-level `router` imports are `#/lib/rpc` (isomorphic: direct `RouterClient` on server, `RPCLink → /api/rpc` in browser) and `src/routes/api/rpc.$.ts`.
- oRPC: router in `src/rpc/router.ts`, procedures in `src/rpc/procedures/`, `base`/`authed` in `src/rpc/middlewares/auth.ts` (initial context is headers-only — see `src/rpc/context.ts`; `authed` resolves the session via `pm.auth…getSession({headers})`). New tenant procedures follow `authed.input(<valibot schema>).handler(...)` → `requireOrganizationSlug(headers)` → `resolveTenantDatabaseName(headers)` → `pm.run(dbName, () => pm.healthcare.<domain>.<op>.run(payload, { actorId: context.session.user.id }))`. `pm.run("$global", …)` is only for auth/management-plane ops; only session/subdomain bootstrap procedures (`auth.getSession`, `organizations.bySubdomain`, `organizations.list`) use `base`.
- HTTP entries: `src/routes/api/rpc.$.ts` (`/api/rpc`), `src/routes/api/auth.$.ts` (`pm.auth.fetchHandler` with subdomain-aware CORS via `isTrustedWebOrigin`).
- Routes: `/` landing, `/account/*`, `/(tenant)/*` guarded by `beforeLoad` in `src/routes/(tenant)/route.tsx` (session check → redirect `/`, then `orpc.organizations.bySubdomain()`; org resolved from `Host` subdomain vs `PUBLIC_WEB_DOMAIN`).
- Validation schemas in `src/schemas/*` are valibot (not zod). Note `src/env.ts` itself uses `zod` via `@t3-oss/env-core`.
- Alias `#/*` → `src/*` (`tsconfig.json` + `resolve.tsconfigPaths` + `components.json` shadcn aliases); only `PUBLIC_*` env is client-exposed (`envPrefix` + `clientPrefix`).

## Verify frontend

- After UI changes, `bun run dev` (port 4020) then verify with `agent-browser`: load the `agent-browser` skill first (`agent-browser skills get core`), then `open http://localhost:4020`, snapshot/interact via `@eN` refs, screenshot the fixed state.
- Tenant routes (`/(tenant)/*`) resolve the org from `Host` subdomain vs `PUBLIC_WEB_DOMAIN` — on bare `localhost:4020` they redirect to `/account/organizations`; that redirect is expected, not a bug.

## Gotchas

- Env comes from Pulumi stack config, not `.env*` (gitignored, no `.env.local`). Adding a var requires all three: `src/env.ts` (validated at import — missing var crashes startup), `APP_ENV_VARS` in `infra/utils/extract-env.ts` (`source`/`secret`/`build` entry), **and** `pulumi config set <namespace>:<NAME> --stack <stack>`. `PUBLIC_*` vars need `build: true` — Vite bakes them into the bundle at build time, so they ship as Docker build args; secrets must never be build args.
- Dockerfile runs every `gen:*` script at build time, then `vite build`; runtime serves `.output/server/index.mjs` on port 3000.
- TS is strict (`noUncheckedIndexedAccess`, `verbatimModuleSyntax` → use `import type`, `noUnusedLocals/Parameters`).
- Biome auto-sorts imports (URL → node/bun → package → alias); run `check:lint` before finishing.
