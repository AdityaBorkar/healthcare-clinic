# AGENTS.md

Multi-tenant hospital/clinic app ("Healthcare Clinic") built on **Bun + TanStack Start (file routes, SSR) + Vite 8 + Nitro (preset `bun`) + Tailwind v4 + oRPC**, with domain logic supplied by the linked **Aspen OS** platform packages.

## Commands

- `bun run dev` — dev server on **port 4020** (`vite dev --port 4020`)
- `bun run check:types` — `tsc --noEmit`
- `bun run check:lint` — `biome check --fix .` (auto-fixes; mutates files). Biome is the only formatter/linter — there is no eslint/prettier config.
- `bun run build` — `vite build` (Nitro outputs to `.output`)
- `bun run test` — `vitest run` (no test files exist yet; vitest config comes from vite.config.ts)
- `bun run gen:routes` — `tsr generate`; regenerates `src/routeTree.gen.ts` (`*.gen.ts` is gitignored; vite dev regenerates it automatically)
- `bun run db:studio` — Drizzle Studio via `aspen db-studio --config=./src/aspen/server.ts`
- `bun run update:deps` — `taze -w --maturity-period 3 && bun install`
- `bun run infra:up/preview/destroy -- <stack>` — Pulumi; `infra/index.ts` boots Postgres (port **9050**) and MinIO (ports 9000/9001) as Docker containers.

## Architecture

- **Aspen OS is a sibling repo** (`/home/aditya/projects/aspen-os`); `@aspen-os/platform|management|organization` are `link:` symlinks into `node_modules`. Changes there take effect without reinstall, but the `aspen` CLI lives in platform's build output — after editing aspen packages, run `bun run build` in `packages/platform` or the CLI/bin may be stale.
- Platform is configured in `src/aspen/server.ts` (exports `p`, an `IsolatedTenantPlatform` wired to auth/Postgres/S3) and `src/aspen/client.ts` (browser side). DB schema, auth, and storage live in Aspen OS, not this app.
- **oRPC** is the RPC layer: server router in `src/rpc/router.ts`, procedures in `src/rpc/procedures/`, called via `orpc` client from `src/lib/orpc.ts`. HTTP entry is `src/routes/api/rpc.$.ts` (`/api/rpc`); auth entry is `src/routes/api/auth.$.ts`.
- Route tree: `/` landing, `/account/*` (auth-free), `/(tenant)/*` guarded by a `beforeLoad` session check + subdomain-based organization lookup in `src/routes/(tenant)/route.tsx`.
- `src/schemas/*` hold zod/valibot schemas shared by procedures and forms.

## Conventions & gotchas

- **Env is validated at import** by `src/env.ts` (`@t3-oss/env-core`): `DB_*`, `AUTH_SECRET`, `GOOGLE_*`, `STORAGE_*` are required server-side. Missing vars crash on startup. All vars (including secrets) live in the gitignored `.env.local`; add any new var to both `src/env.ts` and `.env.local`.
- `src/components/ui/**` are shadcn-generated and **exempt from Biome lint** (`biome.json` override) — don't hand-edit them; regenerate via `shadcn`.
- Design tokens (stone palette + single cyan accent, fonts, radii) are defined in `src/styles.css` per `DESIGN.md` — keep new UI on those tokens, not ad-hoc colors.
- Imports are auto-sorted by Biome (URL → node/bun → package → alias) — run `check:lint` before finishing.
- `biome.json` enforces sorted Tailwind classes (`useSortedClasses`), double quotes, 2-space indent, 80-col width.
- Commits must follow conventional-commit types (incl. `wip`) via commitlint/husky; `lint-staged` runs `biome format --fix` on commit.
- The `aspen` CLI binary resolves to `@aspen-os/platform/.output/cli/index.js`, so `db:studio` requires that package to be built.
- Dockerfile runs every `gen:*` script before `bun run build` and then copies `/app/dist` and runs `dist/server/index.mjs` — note this conflicts with `vite.config.ts` `outDir: ".output"`; verify before trusting the container image.
