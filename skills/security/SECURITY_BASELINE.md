---
name: security-baseline
description: >
  Baseline security checklist for Node.js APIs.
  Trigger: When adding auth, CORS, headers, rate limiting, or handling sensitive data.
license: MIT
metadata:
  author: kervisworkflow
  version: "1.0"
---

## Headers

- Use Helmet (or equivalent) with explicit config.

## CORS

- Default to an allowlist (not `*`) when credentials are used.
- Keep origins in env/config.

## Rate Limiting

- Apply rate limits to auth endpoints.

## Secrets

- Never commit `.env`.
- Rotate secrets if exposed.

## Auth

- Validate JWT signature + expiry.
- Use token versioning / revocation when possible.
