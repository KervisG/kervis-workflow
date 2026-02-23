---
name: prisma-patterns
description: >
  Prisma patterns for backend repos (client singleton, repositories, error mapping, transactions).
  Trigger: When adding or refactoring Prisma usage.
license: MIT
metadata:
  author: kervisworkflow
  version: "1.0"
---

## Prisma Client

- Create a single Prisma client in `src/shared/adapters/db/prismaClient.ts`.
- Do not import `PrismaClient` in domain/application layers.

## Repositories

- Define repository interfaces in `domains/<module>/core/ports/*`.
- Implement them in `domains/<module>/adapters/persistence/*`.
- Map Prisma models to DTOs/domain types in one place (mappers).

## Transactions

- Use `$transaction` when multiple writes must be atomic.
- Keep transaction scopes minimal.

## Error Mapping

- Convert Prisma errors to app/domain errors at the adapter boundary.
- Keep HTTP error formatting in the HTTP adapter (error middleware).
