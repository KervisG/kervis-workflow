# KervisWorkflow React Native Rules

Keep this file short and enforceable.
Use these keywords exactly:
- REJECT if: hard fail, must be fixed
- REQUIRE: mandatory
- PREFER: recommendation (ok to deviate with a short reason)
- ALLOW (exception): only allowed in the listed cases, must justify

## Stack
- Expo ~54 / React Native 0.81+
- NativeWind 4 + Tailwind CSS 3 (styling)
- TanStack Query 5 (server state)
- Zustand 5 (client state)
- Axios (HTTP)
- React Navigation 7 (routing)
- React Hook Form + Yup (forms)
- Reanimated 4 (animations)

## Workflow
REQUIRE:
- Propose file paths before edits.
- Keep changes small and isolated (minimal diff; no drive-by refactors).
- Explain the reasoning briefly (why, not just what).
- Provide a test checklist (commands + expected result).

## Git & Commits
REQUIRE:
- Use Conventional Commits for commit messages.
PREFER:
- Keep commits small and focused (one intent per commit).
- Follow `skills/git/COMMITS.md`.

## TypeScript (No Any)
REJECT if:
- `any`, `as any`, or "just to make it compile" type assertions are introduced.
- `@ts-ignore` is used.
REQUIRE:
- Use `unknown` + narrowing/type guards for uncertain data.
- Add explicit types for non-trivial public APIs (component props, exported functions, shared hooks).
PREFER:
- Prefer const maps (`as const`) + derived types over hand-written unions.
- Use `import type` for type-only imports.
- Follow `skills/typescript/TYPESCRIPT_STRICT.md`.

## Architecture & Layout (Hexagonal)
REQUIRE:
- Use this structure for all feature modules:
  - `app/domains/<module>/{core,application,adapters,ui}`
  - `app/shared/` for truly shared UI/infra (no business rules)
  - `app/navigation/` for composition root (navigators, providers, bootstrap)
- UI must not call HTTP directly.
- Data flow: `ui -> application -> adapters -> shared(adapters/http/axiosClient)`.

PREFER:
- `core/`: domain types, invariants, ports (interfaces). No React, no Axios.
- `application/`: use-cases/orchestration. No React.
- `adapters/`: implementations (api via Axios, storage via Zustand/AsyncStorage, mappers).
- `ui/`: React Native screens/components + TanStack Query hooks.

ALLOW (exception):
- If a module is small (1-2 screens, no complex logic), a flat structure inside `app/domains/<module>/` is acceptable. Apply hexagonal boundaries once the module grows.
- Existing modules (`app/auth`, `app/home`, `app/diet`, `app/trainer`, `app/user`) can be migrated gradually to `app/domains/` with hexagonal layers.

### Migration Map (current -> hexagonal)
PREFER:
- `app/auth/` -> `app/domains/auth/{core,application,adapters,ui}`
  - types -> `core/`
  - API calls -> `adapters/api/`
  - React Query hooks -> `ui/hooks/`
  - screens/components -> `ui/screens/` + `ui/components/`
- `app/home/` -> `app/domains/home/{core,application,adapters,ui}`
- `app/diet/` -> `app/domains/diet/{core,application,adapters,ui}`
- `app/trainer/` -> `app/domains/trainer/{core,application,adapters,ui}`
- `app/user/` -> `app/domains/user/{core,application,adapters,ui}`
- `config/axios.ts` -> `app/shared/adapters/http/axiosClient.ts`
- `config/api.config.ts` -> `app/shared/adapters/http/apiConfig.ts`
- `services/` -> distribute into `app/domains/<module>/adapters/` or `app/shared/adapters/`
- `components/` -> `app/shared/ui/` (for truly shared primitives)

## UI Colocation (Component-Folder Style)
REQUIRE:
- When a screen/component grows, colocate related files inside a folder:
  - `ui/screens/<ScreenName>/<ScreenName>.tsx`
  - `ui/components/<ComponentName>/<ComponentName>.tsx`
PREFER:
- Keep UI-only helpers next to the UI (`ui/.../utils.ts`).
- Keep business rules out of `ui/` (put them in `core/` or `application/`).

## Shared UI (Design System)
REQUIRE:
- Before creating a new UI primitive, search existing shared UI components and reuse them.
- If the primitive does not exist, create it in `app/shared/ui/` first, then consume it from domain UI.
REJECT if:
- Duplicating an existing shared UI primitive with a new component.
PREFER:
- Build shared components with NativeWind className variants.
- Expose consistent props (variant, size, disabled, loading) across shared primitives.

## Styling (NativeWind-first)
REQUIRE:
- Use NativeWind `className` for all static styling.
- Conditional classes via a utility function (e.g., `cn()` or template literals).
- Design tokens (colors, spacing, radius, typography) must be defined in `tailwind.config.js` and consumed via className.
REJECT if:
- `StyleSheet.create` is used for styling that NativeWind can handle (static layouts, colors, spacing, typography).
- Inline style objects (`style={{ color: 'red' }}`) are used for static values.
ALLOW (exception):
- `style={}` for dynamic/computed values at runtime (Animated.Value, layout measurements, interpolations).
- `style={}` for properties NativeWind does not support (e.g., some transform combinations, native-specific props).
- Third-party component styling that requires style prop (e.g., react-native-reanimated Animated styles).
PREFER:
- Map all design tokens to Tailwind theme in `tailwind.config.js` (colors, spacing, borderRadius, fontSize).
- Follow `skills/react-native/REACT_NATIVE_AGENT_V2.md` NativeWind section.

## HTTP / API (Axios)
REQUIRE:
- Use a single configured `axiosClient` (baseURL, headers, interceptors).
- `axiosClient` lives in `app/shared/adapters/http/axiosClient.ts` (or current `config/axios.ts` until migrated).
- Endpoints live in `app/domains/<module>/adapters/api/*.ts` (not in UI components/screens).
- API functions return typed data (`Promise<T>`), not raw axios responses.
REJECT if:
- `axios.get/post/...` is called directly in React Native screens or components.

## Server State vs Client State
REQUIRE:
- Use TanStack Query for server state (fetch/cache/sync/invalidation).
- Use Zustand only for client-only state (UI toggles, drafts, preferences, auth tokens).
REJECT if:
- API response caching is implemented in Zustand (do not reimplement React Query).

## TanStack Query
REQUIRE:
- Centralize query keys (query key factory) for new queries.
- Mutations must invalidate/refetch the correct keys.
PREFER:
- Place query/mutation hooks in `app/domains/<module>/ui/hooks/`.

## Zustand
REQUIRE:
- Stores are small and focused; avoid "god stores".
PREFER:
- Use selectors to minimize rerenders.
- Persist only preferences/auth via AsyncStorage; add versioning/migration if persisted shape changes.

## Navigation (React Navigation)
REQUIRE:
- Define navigators in `app/navigation/`.
- Screens receive only navigation params; business data comes from hooks/context.
- Type all navigation params with `ParamList` types.
REJECT if:
- Business logic runs inside navigator definitions.
PREFER:
- Use deep linking config for applicable routes.

## Forms (React Hook Form + Yup)
REQUIRE:
- Use React Hook Form for form state management.
- Use Yup schemas for validation; colocate schema next to the form or in `core/` if reused.
REJECT if:
- Manual `useState` form management when React Hook Form would be cleaner.

## Performance (React Native)
REQUIRE:
- Use `FlatList`/`SectionList` for dynamic lists; never `ScrollView` + `.map()` for lists > 10 items.
- Clean up subscriptions and resources in `useEffect` cleanup (listeners, timers, abort controllers).
- Use `useNativeDriver: true` for Animated API; prefer Reanimated for complex animations.
REJECT if:
- `ScrollView` + `.map()` is used for unbounded or large lists.
- Barrel imports (`import { A, B } from '@/components'`) are used instead of direct imports.
PREFER:
- `React.memo` for expensive pure components.
- `useCallback`/`useMemo` for callbacks and computed values passed as props.
- Direct imports: `import { A } from '@/components/A'` instead of barrel re-exports.
- Follow `skills/react-native/REACT_NATIVE_AGENT_V2.md` for full performance rules.

## Platform Patterns
PREFER:
- Use platform-specific files (`Component.ios.tsx` / `Component.android.tsx`) for significant platform differences.
- Use `Platform.OS` / `Platform.select` for minor conditional styling.
- Always wrap screens in `SafeAreaView` (via `react-native-safe-area-context`).


## DRY (Duplication)
REJECT if:
- Copy-pasted logic/JSX appears 2+ times without extraction.
REQUIRE:
- Extract repeated logic into a hook, repeated UI into a component, pure logic into a util.

## Accessibility
REQUIRE:
- `accessibilityLabel` for icon-only buttons and touchable elements.
- `accessibilityRole` for interactive elements.
- Loading/disabled states are explicit and communicated to assistive tech.
PREFER:
- Test with screen reader (TalkBack/VoiceOver) for critical flows.

## Memory & Resources
REQUIRE:
- Cancel network requests on unmount (AbortController or query cancellation).
- Remove event listeners and timers in cleanup functions.
REJECT if:
- `useEffect` with subscriptions/timers lacks a cleanup return.
