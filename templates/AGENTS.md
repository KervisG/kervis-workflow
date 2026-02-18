# KervisWorkflow Frontend Rules

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

## TypeScript (No Any)
REJECT if:
- `any`, `as any`, or "just to make it compile" type assertions are introduced.
- `@ts-ignore` is used.
REQUIRE:
- Use `unknown` + narrowing/type guards for uncertain data.
- Add explicit types for non-trivial public APIs (component props, exported functions, shared hooks).

## Architecture & Layout (Clean + Hexagonal)
REQUIRE:
- Use this structure by default for all projects/modules:
  - `src/domains/<module>/{core,application,adapters,ui}`
  - `src/shared/` for truly shared UI/infra (no business rules)
  - `src/app/` for composition root (providers/router/bootstrap)
- UI must not call HTTP directly.
- Data flow: `ui -> application -> adapters -> shared(adapters/http/axiosClient)`.

PREFER:
- `core/`: domain types, invariants, ports (interfaces). No React, no Axios.
- `application/`: use-cases/orchestration. No React.
- `adapters/`: implementations (api via Axios, storage via Zustand, mappers).
- `ui/`: React pages/components + React Query hooks.

ALLOW (exception):
- If a repo already has an established structure, follow it and apply the same boundaries inside it.
- Use component-folder colocation inside `ui/` when UI grows (page/component becomes a folder with its local UI parts).

## UI Colocation (Component-Folder Style)
REQUIRE:
- When a page/component grows, colocate related files inside a folder:
  - `ui/pages/<PageName>/<PageName>.tsx`
  - `ui/components/<ComponentName>/<ComponentName>.tsx`
PREFER:
- Keep UI-only helpers next to the UI (`ui/.../utils.ts`).
- Keep business rules out of `ui/` (put them in `core/` or `application/`).

## Shared UI (shadcn-first)
REQUIRE:
- Before creating a new UI primitive, search existing shared UI components and reuse them.
- If the primitive does not exist, create it in shared UI first, then consume it from domain UI.
REJECT if:
- Duplicating an existing shared UI primitive with a new component.
PREFER:
- Extend shared primitives via CVA variants instead of creating near-duplicates.

## Examples (Mapping)
PREFER:
- `src/departments/{api,hooks,pages,components,types,utils}`
  -> `src/domains/departments/{core,application,adapters,ui}`:
  - `types/` -> `core/`
  - `api/` -> `adapters/api/`
  - React Query hooks -> `ui/hooks/`
  - `pages/` + `components/` -> `ui/pages/` + `ui/components/`

- `src/historial-impresiones/{api,components,hooks,pages,services,types,utils}`
  -> `src/domains/historial-impresiones/{core,application,adapters,ui}`:
  - `services/pdfGenerator.ts` -> `adapters/documents/pdfGenerator.ts`
  - `api/` -> `adapters/api/`
  - React Query hooks -> `ui/hooks/`
  - `pages/` + `components/` -> `ui/pages/` + `ui/components/`


## HTTP / API (Axios)
REQUIRE:
- Use a single configured `axiosClient` (baseURL, headers, interceptors).
- `axiosClient` lives in `src/shared/adapters/http/axiosClient.ts` (or equivalent shared http adapter).
- Endpoints live in `src/domains/<module>/adapters/api/*.ts` (not in UI components).
- API functions return typed data (`Promise<T>`), not raw axios responses.
REJECT if:
- `axios.get/post/...` is called directly in React components.

## Server State vs Client State
REQUIRE:
- Use TanStack Query for server state (fetch/cache/sync/invalidation).
- Use Zustand only for client-only state (UI toggles, drafts, preferences).
REJECT if:
- API response caching is implemented in Zustand (do not reimplement React Query).

## TanStack Query
REQUIRE:
- Centralize query keys (query key factory) for new queries.
- Mutations must invalidate/refetch the correct keys.

## Zustand
REQUIRE:
- Stores are small and focused; avoid “god stores”.
PREFER:
- Use selectors to minimize rerenders.
- Persist only preferences/drafts; add versioning/migration if persisted shape changes.

## Styling (Tailwind-first, no CSS by default)
REJECT if:
- Inline styles (`style={{ ... }}`) are introduced.
- New CSS files are added for app styling.
REQUIRE:
- Tailwind via `className`; conditional classes via `cn()`.
- Use CVA for variants when a component has multiple visual styles.
ALLOW (exception):
- Third-party CSS imports required by a library.
- Minimal global CSS only for Tailwind directives/tokens/variables or cases Tailwind cannot reasonably express (must justify).

## DRY (Duplication)
REJECT if:
- Copy-pasted logic/JSX appears 2+ times without extraction.
REQUIRE:
- Extract repeated logic into a hook, repeated UI into a component, pure logic into a util.

## Accessibility
REQUIRE:
- `aria-label` for icon-only buttons.
- Keyboard/focus behavior works; loading/disabled states are explicit.
