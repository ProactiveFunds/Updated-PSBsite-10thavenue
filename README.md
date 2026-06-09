# Proactive Sustainable Bonds — Website (Astro)

Marketing site rebuilt on **Astro + React islands**, ported from the original
single-file bundle (kept at `../_original-bundle-backup/`).

## Commands

```bash
npm install      # install dependencies
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build → ./dist
npm run preview  # preview the production build locally
```

## How it's put together

- `src/pages/index.astro` — the page shell (head, fonts, global styles) that
  server-renders the app and hydrates it with `<App client:load />`.
- `src/components/` — the React components, one file per area:
  - `App.jsx` — composes the page.
  - `MktChrome.jsx` — nav + footer + theme toggle.
  - `Hero.jsx`, `HomeCalculator.jsx`, `Sections.jsx`, `HomeSections.jsx` — page sections.
  - `icons.jsx` — inline icon set (`<Ic name="…" />`).
- `src/lib/interactions.js` — cursor lighting, theme persistence, sparkline +
  scroll-reveal animation (`initInteractions()` runs once on mount).
- `src/styles/`
  - `global.css` — design tokens, typography, component styles (fonts in `public/fonts/`).
  - `responsive.css` — collapses the desktop grids on tablet/phone. Desktop is untouched.
  - `motion.css` — floating hero cards + section scroll-reveal. Honors `prefers-reduced-motion`.

## Notes

- The build is fully static and server-rendered (good for SEO); the interactive
  app hydrates on top.
- Responsiveness is layered on via `responsive.css` so the original desktop
  design is preserved exactly.
- Next natural step if an investor portal returns (login/dataroom/reporting):
  keep this marketing site in Astro and add a separate app for the portal.
