# KervisWorkflow Backend Rules (Node.js)

Keep this file short and enforceable.
Use these keywords exactly:
- REJECT if: hard fail, must be fixed
- REQUIRE: mandatory
- PREFER: recommendation (ok to deviate with a short reason)
- ALLOW (exception): only allowed in the listed cases, must justify

## Workflow
REQUIRE:
- Propose file paths before edits.
- Keep changes small and isolated (minimal diff; no drive-by refactors).
- Explain the reasoning briefly (why, not just what).
- Provide a test checklist (commands + expected result).

## Git & Commits
REQUIRE:
- Use Conventional Commits.
PREFER:
- Follow `skills/git/COMMITS.md`.

## TypeScript (Strict)
REJECT if:
- `any`, `as any`, or `@ts-ignore` are introduced.
REQUIRE:
- Prefer `unknown` + validation/narrowing for external input (HTTP/WS/env).
- Use `import type` for type-only imports.
- Follow `skills/typescript/TYPESCRIPT_STRICT.md`.

## Architecture (Clean + Hexagonal)
REQUIRE:
- Use this structure by default for backend modules:
  - `src/domains/<module>/{core,application,adapters}`
  - `src/shared/` for cross-cutting (config, errors, db client, logger, validation)
  - `src/app/` for composition root (Express bootstrap, routers, swagger, websocket)
- Dependency direction:
  - `adapters/http -> application -> core`
  - `adapters/persistence|ldap|ws -> core (ports)`

PREFER:
- Follow `skills/architecture/HEX_BACKEND.md`.

REJECT if:
- Controllers contain business rules.
- `PrismaClient` (or DB client) is imported in `core/` or `application/`.

ALLOW (exception):
- If the repo already has an established structure, follow it and apply the same boundaries inside it.

## HTTP (Express)
REQUIRE:
- Controllers are thin: validate/parse input, call use-case, map response.
- Cross-cutting middlewares live in `src/app/http/middlewares/`.

PREFER:
- Follow `skills/express/EXPRESS_CONVENTIONS.md`.

## Validation (Zod)
REQUIRE:
- Validate `params/query/body` at the boundary (HTTP and WS).
- Prefer deriving DTO types via `z.infer<typeof Schema>`.

## Persistence (Prisma)
REQUIRE:
- Use a single configured Prisma client in `src/shared/adapters/db/prismaClient.ts`.
- Repository implementations live in `src/domains/<module>/adapters/persistence/`.

PREFER:
- Follow `skills/prisma/PRISMA_PATTERNS.md`.

## Errors
REQUIRE:
- Domain/application throw typed errors; HTTP maps them to uniform JSON.

## WebSocket
REQUIRE:
- Authenticate WS connections and validate input events.
