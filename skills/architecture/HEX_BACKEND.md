---
name: hex-backend
description: >
  Clean/Hexagonal architecture rules for Node.js backends.
  Trigger: When creating/moving backend folders, wiring dependencies, or refactoring controllers/services.
license: MIT
metadata:
  author: kervisworkflow
  version: "1.0"
---

## Goals

- Keep business rules independent from frameworks (Express) and infrastructure (Prisma, LDAP, WS).
- Make testing use-cases easy (mock ports).
- Avoid "fat controllers" and DB logic scattered across the app.

## Default Folder Structure

```text
src/
  app/                     # composition root (bootstrap)
  shared/                  # cross-cutting (config, db client, errors)
  domains/
    <module>/
      core/                # domain types + invariants + ports (interfaces)
      application/         # use-cases/orchestration
      adapters/            # implementations (http, persistence, ldap, ws)
```

## Dependency Rules

- `core/` must not import Express/Prisma/axios/etc.
- `application/` must not import Express/Prisma directly. It depends on `core/ports`.
- `adapters/http/` validates/parses input and calls `application`.
- `adapters/persistence/` implements repositories using Prisma and maps models to DTOs.

## Practical Mapping (Legacy -> Hex)

- `routes/` -> `domains/<module>/adapters/http/routes.ts`
- `controllers/` -> `domains/<module>/adapters/http/controller.ts`
- `services/` (business) -> `domains/<module>/application/use-cases/*`
- `prisma.ts` / DB client -> `shared/adapters/db/prismaClient.ts`
