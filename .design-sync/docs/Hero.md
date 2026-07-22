---
category: Hero
---
The full home-page hero: rotating headline, muted background video, dual CTAs and floating glass stat cards.

Self-contained and content-complete — the headline, stats and imagery are baked
in. It expects to be the first thing inside `<main>` and to span the full
viewport width.

```jsx
<Hero onInvest={(e) => openInvestFlow(e)} />
```

`onInvest` is optional: with no handler the CTA scrolls to the on-page
calculator (`#calculator`), falling back to `/#calculator` on pages that do not
have one. The floating stat cards animate via `motion.css`; they hold still
under `prefers-reduced-motion`.
