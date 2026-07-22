---
category: Chrome
---
A sun/moon button that flips the whole system between light and dark.

It sets `data-theme` on `<html>` and persists the choice to `localStorage`.
Every colour token in the system is defined for both themes, so one toggle
re-themes an entire page with no other wiring.

```jsx
<ThemeToggle />
```

Already included inside `MktNav` — add it standalone only on surfaces that do
not use the standard nav.
