---
name: react-19-vite
description: >
  React 19 patterns for Vite/SPA projects.
  Trigger: When building React components, forms, and UI primitives.
license: MIT
metadata:
  author: kervisworkflow
  version: "1.0"
---

## Scope

This playbook is for React 19 in Vite/SPA projects.
It intentionally excludes framework-specific server-only features (Server Components, server actions, route revalidation, etc.).

## Core Rules

### Imports (REQUIRED)

```ts
// Always named imports
import { useEffect, useMemo, useRef, useState } from "react";

// Never
// import React from "react";
// import * as React from "react";
```

### Memoization (PREFER: keep it simple)

- PREFER: Do not introduce `useMemo`/`useCallback` by default.
- ALLOW: Use them only when there is a clear performance reason or referential-equality issue.
- REQUIRE: If you add memoization, briefly explain why (1 line comment near the hook).

Examples:

```tsx
// Good: keep it simple unless proven otherwise
function ListPage({ items }: { items: Array<{ id: string; active: boolean }> }) {
  const visible = items.filter((x) => x.active);
  return <ul>{visible.map((x) => <li key={x.id}>{x.id}</li>)}</ul>;
}

// Acceptable: heavy computation or stable identity requirement
function Expensive({ items }: { items: number[] }) {
  // Reason: expensive reduce on every keystroke
  const total = useMemo(() => items.reduce((a, b) => a + b, 0), [items]);
  return <div>{total}</div>;
}
```

## Forms: Actions + useActionState (React 19)

### When to use

- PREFER: Use form actions + `useActionState` for simple/medium forms where you want built-in pending + error state.
- ALLOW: Use React Hook Form for very dynamic/complex forms (still validate with Zod).

### Pattern (REQUIRED)

- REQUIRE: Validate user input with Zod inside the action.
- REQUIRE: Keep boundaries: UI action -> application/use-case -> adapters/api -> axiosClient.
- PREFER: Return a small state object `{ ok, fieldErrors?, message? }`.

```tsx
import { useActionState } from "react";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;
type ActionState =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Partial<Record<keyof FormValues, string>> };

export function CreateUserForm({
  createUser,
}: {
  // application/use-case function (calls adapters/api)
  createUser: (input: FormValues) => Promise<void>;
}) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      const raw = Object.fromEntries(formData.entries());
      const parsed = schema.safeParse(raw);
      if (!parsed.success) {
        const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as keyof FormValues | undefined;
          if (key) fieldErrors[key] = issue.message;
        }
        return { ok: false, message: "Invalid form data", fieldErrors };
      }

      try {
        await createUser(parsed.data);
        return { ok: true };
      } catch {
        return { ok: false, message: "Request failed" };
      }
    },
    { ok: false, message: "" }
  );

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          className="w-full"
          aria-invalid={state.ok ? undefined : state.fieldErrors?.email ? true : undefined}
        />
        {!state.ok && state.fieldErrors?.email ? (
          <p className="text-sm text-destructive">{state.fieldErrors.email}</p>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          className="w-full"
          aria-invalid={state.ok ? undefined : state.fieldErrors?.name ? true : undefined}
        />
        {!state.ok && state.fieldErrors?.name ? (
          <p className="text-sm text-destructive">{state.fieldErrors.name}</p>
        ) : null}
      </div>

      {!state.ok && state.message ? <p className="text-sm text-destructive">{state.message}</p> : null}

      <button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

### useFormStatus (optional)

If you want a separate SubmitButton component that knows pending state:

```tsx
import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Working..." : children}
    </button>
  );
}
```

## Zod at Boundaries

- REQUIRE: Validate external/untrusted data with Zod.
  - Forms: inside the action (as shown).
  - API: inside adapters (validate `response.data` before mapping to core models).
- PREFER: Derive types via `z.infer<typeof Schema>`.
- REJECT: Using `as SomeType` to pretend data is valid.

## Refs (React 19 + shadcn/ui)

- PREFER: Use `forwardRef` for shared UI primitives and Radix/shadcn wrappers.
- ALLOW: Use "ref as a prop" for simple internal components when it improves clarity.
- Do not rewrite existing shared primitives just to remove `forwardRef`.
