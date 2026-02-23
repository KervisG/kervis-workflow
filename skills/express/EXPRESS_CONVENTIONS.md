---
name: express-conventions
description: >
  Express routing/controller/middleware conventions for maintainable APIs.
  Trigger: When creating endpoints, controllers, validation, or error handling.
license: MIT
metadata:
  author: kervisworkflow
  version: "1.0"
---

## Structure

- Routes register endpoints and middlewares; no business logic.
- Controllers do: validate/parse -> call use-case -> map response.
- Use-cases live outside Express (application layer).

## Validation

- Validate `params/query/body` at the boundary.
- Prefer Zod schemas per route (keep them close to controller/route).

## Errors

- Throw typed errors in domain/application.
- Central error middleware maps errors to a consistent JSON shape.
- Avoid `try/catch` per controller unless you need to translate specific errors.

## Middleware Order (Typical)

1) request id / logging
2) security (helmet)
3) CORS
4) body parsing
5) auth
6) routes
7) 404 handler
8) error handler
