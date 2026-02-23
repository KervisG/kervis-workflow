---
name: node-ts-project
description: >
  Conventions for Node.js + TypeScript backend projects.
  Trigger: When adding scripts, build/run tooling, env handling, or runtime entrypoints.
license: MIT
metadata:
  author: kervisworkflow
  version: "1.0"
---

## Runtime

- Node.js >= 18.
- Prefer ESM (`"type": "module"`) or a consistent module system across the repo.

## Entrypoints

- Keep `src/index.ts` minimal (start the app; no business logic).
- Put server creation/wiring in `src/app/server.ts`.

## Environment Variables

- Use `.env.example` as the contract.
- Parse env at startup and fail fast on missing/invalid values.
- Treat env values as `unknown` and validate/transform (Zod recommended).

## Build Output

- Emit compiled code to `dist/`.
- Do not commit `dist/` unless the repo explicitly requires it.
