# CODING_CONVENTIONS (repo-specific, non-standard)

Non-obvious conventions in this repo. Standard TS/React/TanStack/oRPC practices omitted.

## 1. Thin-wrapper repo — no domain logic here

- Clinic business logic lives in sibling Aspen OS repo (`~/projects/aspen-os`, `link:` deps `@aspen-os/*`).
- This repo holds only thin oRPC wrappers (`src/rpc/procedures/` → `pm.*.run(...)`) + UI wiring.
- Do not implement workflows here; call `pm.healthcare.<domain>.<op>.run(...)` or `pm.management.*`.

## 2. Path alias is `#/*`, not `@/*`

- `#/*` → `src/*` via `tsconfig.json:paths` + `vite.config.ts:resolve.tsconfigPaths` + `components.json` shadcn aliases.
- Use `@aspen-os/healthcare`, `@aspen-os/masters`, `@aspen-os/management` for validation schemas, `#/aspen/server`, `#/lib/rpc`. Sibling files inside `src/rpc/` use relative imports (`../middlewares/scoped_auth`, `./subdomain`).

## 3. oRPC router is a noun→verb tree; procedure files export verbs

- `src/rpc/router.ts` nests plural nouns → verbs: `patients: { create: registerPatient, get: getPatient, merges: { approve: approveMerge } }`.
- Procedure modules (`src/rpc/procedures/*.ts`) export verb-named handlers (`register`, `get`, `approveMerge`).
- `router.ts` renames on import to disambiguate: `import { register as registerEntry ... }`, `book as bookAppointment`, `cancel as cancelAppointment`.

## 4. Three-tier procedure auth — `base` vs `authMiddleware` vs `scopedAuthMiddleware`

- `src/rpc/middlewares/auth.ts` exports `base` (headers-only context: `os.$context<{ headers: Headers }>`) + `authMiddleware` (session check via `pm.auth...getSession({ headers })`).
- `src/rpc/middlewares/scoped_auth.ts` exports `scopedAuthMiddleware` = session + `requireOrganizationSlug(headers)` + `resolveTenantDatabaseName(headers)` → `{ actorId, organizationSlug, pm, session, tenantId }`.
- Rule: only bootstrap procedures use `base` (`auth.session.get`, `organizations.getBySubdomain`, `organizations.list`). All tenant procedures use `scopedAuthMiddleware` (or `authMiddleware` + explicit slug helpers for `$global` workspace ops).
- Canonical tenant handler shape (`src/rpc/procedures/patients.ts`):
  ```ts
  export const register = scopedAuthMiddleware
    .input(PatientRegisterSchema)
    .handler(async ({ context, input }) => {
      const { actorId, pm, tenantId } = context;
      return await pm.run(tenantId, () =>
        pm.healthcare.patients.register.run({ input: { ... } }, { actorId }),
      );
    });
  ```
- Note double wrap: workflow payload is `{ input: {...} }`, options second arg is `{ actorId }`.
- `pm.run("$global", ...)` is only for auth / management-plane ops. Never use `$global` for tenant domain work.

## 5. Server-only boundary — lazy-import `#/aspen/server`

- `src/aspen/server.ts` reads `src/env.ts` and opens the DB — server-only.
- Never top-level import it outside server context. Inside procedures: `const { pm } = await import("#/aspen/server")`.
- Only `src/routes/api/*` server handlers import server-side modules directly.
- UI/data split: browser auth uses `pm` from `#/aspen/client`; all data uses `orpc` from `#/lib/rpc` (isomorphic: server = direct `RouterClient` with `getRequestHeaders()`, client = `RPCLink → /api/rpc`). See `src/lib/rpc.ts`, `src/routes/api/rpc.$.ts` (headers-only initial context + `onError` logging interceptor).

## 6. Subdomain IS the workspace identity

- No `orgId` params. Org slug comes from `Host` subdomain vs `PUBLIC_WEB_DOMAIN` via `extractSubdomain()` / `requireOrganizationSlug(headers)` (`src/rpc/utils/subdomain.ts`).
- Missing/invalid subdomain throws `"This request is not associated with a workspace"`.
- Tenant DB name resolved centrally in `src/rpc/utils/workspace-organization.ts:resolveTenantDatabaseName(headers)` (slug → `getWorkspaceOrganization` → `pm.management.tenants.get` → `databaseName`).
- Workspace helpers live there too: `getWorkspaceOrganization`, `requireWorkspaceAdmin`, `renameAuthUser`. Policy: reads stay member-visible; only membership/role mutations require `owner`/`admin` via `requireWorkspaceAdmin(org, session, action)`. Never reach `pm.auth.rest` directly — use `renameAuthUser()`.

## 7. Procedure errors wrap with remedy hint

- Pattern: `catch (error) { throw new Error(\`<Op> failed (${msg}); <remedy>\`) }`, e.g. `"Patient registration failed (...); verify phone/ABHA and retry"`. Always preserve inner `error.message`, add actionable retry hint.

## 8. Env comes from Pulumi, not `.env`

- No `.env*` files. `bun run dev|test|preview|db:studio|dev:seed|dev:prepare` all go through `infra:dev-run` wrapper that injects `dev`-stack Pulumi config as env. Never run bare `vite`/`vitest` expecting env.
- Adding a var requires all three: `src/env.ts` + `APP_ENV_VARS` entry in `infra/utils/extract-env.ts` (`source: "app"|"postgres"|"derived"`, `secret`, `build`, `optional`) + `pulumi config set <namespace>:<NAME> --stack <stack>`.
- `PUBLIC_*` vars need `build: true` (Vite bakes into bundle → Docker build args, see `Dockerfile`). Secrets must never be build args (`requireSecret`, runtime-only).

## 9. Biome import-group order + TS strict extras

- Biome is the only linter/formatter. `check:lint` (`biome check --fix`) auto-fixes and auto-sorts imports: `:URL:` → blank → `:NODE:`/`:BUN:`/`:PACKAGE_WITH_PROTOCOL:` → blank → `:PACKAGE:` → blank → `:ALIAS:` (`#/...`) → `:PATH:` (relative). Run before finishing.
- TS: `noUncheckedIndexedAccess`, `verbatimModuleSyntax` (use `import type`), `noUnusedLocals/Parameters`, `moduleDetection: force`, `allowImportingTsExtensions`.

## 10. Naming / infra quirks

- Script is `update-deps` (no colon) unlike `dev:*`, `check:*`, `infra:*`, `gen:*`. `Dockerfile` loops all `gen:*` scripts at build time before `vite build`; runtime serves `.output/server/index.mjs` on 3000.
- `gen:routes` (`tsr generate`, `*.gen.ts` gitignored) rarely run manually — TanStack plugin regenerates on dev.
- `dev` serves port 4020. Tenant route guard lives in `src/routes/(tenant)/route.tsx:beforeLoad` (session → `orpc.organizations.getBySubdomain()` → redirect `/account/organizations`). On bare `localhost:4020` that redirect is expected, not a bug.
- Commits follow conventional commits with restricted `type-enum` (`.commitlintrc.json`): `build|chore|ci|docs|feat|fix|perf|refactor|revert|test|wip`.
