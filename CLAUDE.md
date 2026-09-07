# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — run the API with hot reload (`tsx --watch src/server.ts`)
- `pnpm test` — run unit tests once (`vitest run`)
- `pnpm test:watch` — watch mode
- `pnpm test:coverage` / `pnpm test:ui` — coverage report / Vitest UI
- Run a single test file: `pnpm vitest run src/services/check-in.spec.ts`
- Filter by name: `pnpm vitest run -t "should not be able to check in twice"`
- `pnpm build` — bundle to `build/` with tsup; `pnpm start` runs the build
- `pnpm biome check --write` — lint + format + organize imports (Biome; no npm script defined)
- `pnpm exec prisma migrate dev` — apply/create migrations; `pnpm exec prisma generate` regenerates the client into `prisma/generated/prisma`
- `docker compose up -d` — start local Postgres (user/pass/db: `docker`/`docker`/`apisolid`, port 5432)

Requires Node >=22, pnpm. Env vars (`src/env/index.ts`, validated with Zod): `NODE_ENV` (`dev`|`test`|`production`), `PORT` (default 3333), `DATABASE_URL`.

## Architecture

Layered dependency-injected design. Request flow: **route → controller → factory → service → repository**.

- `src/http/routes.ts` — Fastify route registration. `src/http/controllers/*` — parse/validate input with Zod, translate domain errors to HTTP status codes, and delegate. Controllers instantiate services via `make*` factories.
- `src/services/*.ts` — one class per use case with a single `handle()` method. Business rules live here (distance checks, duplicate-day check-ins, 20-minute validation window, password hashing). Services depend on repository *interfaces*, never concrete classes. Each has a co-located `*.spec.ts`.
- `src/services/factories/make-*.ts` — wire a service to its Prisma repository implementations. Controllers use these; tests do not.
- `src/services/errors/*` — typed domain error classes thrown by services and caught in controllers / `app.ts`.
- `src/repositories/*-repository.ts` — repository interfaces. Two implementations each: `prisma/` (production) and `in-memory/` (used directly in service specs, no DB needed).
- `src/utils/get-distance-between-coordinates.ts` — Haversine distance helper used by check-in / nearby-gyms services.
- `src/app.ts` — builds the Fastify instance and the global error handler (ZodError → 400, else 500). `src/server.ts` — entrypoint that calls `app.listen`.
- `src/lib/prisma.ts` — single `PrismaClient` using the `@prisma/adapter-pg` driver adapter; query logging in `dev`.

Prisma schema (`prisma/schema.prisma`): `User`, `Gym`, `CheckIn`; `@@map` to snake_case tables; client generated to `prisma/generated/prisma` (imported via relative path, not a package). `Gym.latitude/longitude` are `Decimal` — call `.toNumber()` before math.

## Conventions

- Path alias `@/*` → `src/*`; imports include explicit `.ts` extensions (`allowImportingTsExtensions`).
- ESM only (`"type": "module"`), `verbatimModuleSyntax` — use `import type` for types.
- Biome formatting: single quotes, semicolons as-needed, 70-char width for JS/TS.
- Adding a use case: create service + `*.spec.ts` (test against in-memory repo) → add repository methods to interface + both implementations → add `make-*` factory → add controller → register route.
- `README.md` (Portuguese) is the requirements checklist (RF / RN / RNF). JWT auth and admin role checks are noted there as not yet implemented.
