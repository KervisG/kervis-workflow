---
name: responsive-tailwind
description: >
  Mobile-first responsive UI playbook for React + Tailwind.
  Trigger: When building or modifying UI components/pages.
license: MIT
metadata:
  author: kervisworkflow
  version: "1.0"
---

## Definition of Done

A UI change is not done until it works at:
- 360px (mobile)
- 768px (tablet)
- 1024px+ (desktop)

## Tailwind Breakpoints

- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px
- `2xl:` 1536px

Mobile-first: start with base styles (mobile), then add `sm:`/`md:`/`lg:`.

## Layout Rules

- Prefer fluid sizing: `w-full`, `max-w-*`, `min-w-0`, `flex-1`, `grow`.
- Avoid fixed widths/heights unless necessary.
- Prevent overflow: use `min-w-0` on flex children that contain long text.

## Common Patterns

### Page Container

```tsx
<div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
  {children}
</div>
```

### Header With Actions

```tsx
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <h1 className="text-lg font-semibold sm:text-xl">Title</h1>
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
    {actions}
  </div>
</div>
```

### Forms

```tsx
<form className="space-y-4">
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <FieldA />
    <FieldB />
  </div>

  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
    <Cancel />
    <Submit />
  </div>
</form>
```

### Tables (mobile-safe)

Pick one approach:

1) Horizontal scroll wrapper (default)

```tsx
<div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
  <div className="min-w-max">
    <Table />
  </div>
</div>
```

2) Hide non-essential columns on small screens

```tsx
<TableCell className="hidden sm:table-cell">Secondary</TableCell>
```

3) Render rows as cards on mobile when the table is dense

### Dialog / Overlay Content

- Ensure content fits on mobile.
- Allow internal scroll: `overflow-auto`.
- Prefer Tailwind scale values; use arbitrary values only if necessary.

```tsx
<div className="w-full max-w-lg overflow-auto p-4 sm:p-6">
  {content}
</div>
```

### Text Overflow

```tsx
<span className="min-w-0 truncate">Long single-line title</span>
<p className="break-words">Long paragraph text that should wrap.</p>
```

## QA Checklist

- 360px: no unexpected horizontal scroll
- 360px: dialogs are usable (content scrolls if needed)
- 360px: buttons/inputs are tappable and not cramped
- 768px: layout uses space well (no awkward stacking)
- 1024px+: spacing/max-width look intentional
- Keyboard: focus visible and tab order works
