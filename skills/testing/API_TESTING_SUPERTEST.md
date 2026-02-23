---
name: api-testing-supertest
description: >
  API testing conventions (Supertest) for Express backends.
  Trigger: When adding tests for routes/controllers/use-cases.
license: MIT
metadata:
  author: kervisworkflow
  version: "1.0"
---

## Test Levels

- Unit: test `application/use-cases` by mocking ports.
- Integration: test HTTP routes with Supertest using a real app instance.

## Tips

- Prefer creating an `app` instance without `listen()` for Supertest.
- Seed test data via adapters (repo methods) or Prisma fixtures.
- Clean up between tests (transaction rollback, truncation, or dedicated test DB).
