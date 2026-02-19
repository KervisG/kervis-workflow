---
name: typescript-strict
description: >
  TypeScript strict patterns for React/TS codebases.
  Trigger: When writing or refactoring .ts/.tsx (types, interfaces, generics, narrowing, removing any).
license: MIT
metadata:
  author: kervisworkflow
  version: "1.0"
---

## Goals

- Keep types safe and maintainable.
- Avoid "type lies" (`any`, unsafe assertions) that push bugs to runtime.
- Prefer single-source-of-truth patterns for enums/consts.

## Rules

### 1) Const Maps -> Derived Types (PREFER)

Prefer a const map + derived type instead of hand-written unions.

```ts
const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];
```

Why:
- Single source of truth (runtime values + TS type)
- Better autocomplete and refactors

### 2) Flat Interfaces (PREFER)

Avoid inline nested object types in interfaces. Extract nested shapes.

```ts
interface UserAddress {
  street: string;
  city: string;
}

interface User {
  id: string;
  name: string;
  address: UserAddress;
}
```

### 3) Never Use `any` (REQUIRED)

If something is unknown, use `unknown` + narrowing/validation.

```ts
function parseUser(input: unknown): User {
  if (isUser(input)) return input;
  throw new Error("Invalid user");
}
```

Use generics for flexible utilities:

```ts
export function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

### 4) Prefer Utility Types (PREFER)

Use utility types to derive variants instead of duplicating types.

```ts
type UserPreview = Pick<User, "id" | "name">;
type UserDraft = Partial<User>;
type UserWithoutId = Omit<User, "id">;
type UsersById = Record<string, User>;
```

### 5) Type Guards for Narrowing (PREFER)

When you must handle `unknown` without Zod, use a type guard.

```ts
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}
```

If you use Zod at boundaries, prefer Zod schemas over ad-hoc guards.

### 6) `import type` (REQUIRED)

Use type-only imports to avoid runtime imports and cycles.

```ts
import type { User } from "./types";
import { createUser, type Config } from "./utils";
```

## Notes for React Projects

- Public APIs should be typed explicitly (component props, exported hooks).
- Prefer deriving types from Zod schemas via `z.infer<typeof Schema>`.
