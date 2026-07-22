---
category: Hero
---
A rounded, captioned image frame — the standard way this system presents photography.

Used for property and team imagery. Without `src` it renders a tinted
placeholder at the same dimensions, which is what makes it safe to lay out a
page before the photography exists.

```jsx
<Photo src="/img/property.webp" label="Denmark, SC" sublabel="24 units - delivered 2025" h={360} />
<Photo label="Placeholder" h="100%" />
```

`h` accepts any CSS height (number = px). `radius` defaults to
`var(--radius-2xl)`; drop to `var(--radius-lg)` for tighter grids.
