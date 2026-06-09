# Proactive Sustainable Bonds — Website Summary

_Last updated: 2026-06-09_

A rebuild of the Proactive Sustainable Bonds marketing site as a fast, statically-generated
**Astro + React** project. Replaces the original single-file runtime-Babel bundle (kept at
`../_original-bundle-backup/`) and pulls real content/data from the legacy base44 app.

- **Repo:** https://github.com/ihavespokennow-ops/sustainablebonds (`main`)
- **Hosting:** Render **Static Site** (`sustainablebonds.onrender.com`), auto-deploys on push.
- **Run locally:** `npm install` → `npm run dev` (port 4321) · `npm run build` → `dist/`.

---

## Tech stack
- **Astro 5** (static output) + **@astrojs/react** islands.
- **React 19** components reused from the original design (nav, footer, hero, sections, modal).
- **leaflet** — portfolio map. **marked** — Markdown → HTML for the Digest/blog.
- Styling: design tokens + component styles in `src/styles/` (`global.css`, `responsive.css`,
  `motion.css`, `digest.css`). Fonts: Hanken Grotesk (sans), Newsreader (editorial serif),
  Spline Sans Mono. Light/dark theme via `data-theme` on `<html>`.

## Pages
| URL | Source | What it is |
|---|---|---|
| `/` | `index.astro` → `App.jsx` | Marketing home: hero ("The bond that builds"), calculator, partners, before/after, **comparison table** of opportunities, social proof, intake form. |
| `/assets` | `assets.astro` → `AssetsExplorer.jsx` | Portfolio "Explorer": filters + **interactive Leaflet map** (count bubbles per state, click to filter) + **sortable table** with **inline-expand rows** (occupancy, thesis, impact, SDGs) + Table/Timeline toggle. |
| `/team` | `team.astro` → `AboutTeam.jsx` | About + team. Mission hero, 3 principle cards, team as flowing alternating **transparent cutout** photos + bios + LinkedIn/email. Dr. Williams has a compact "Author of" book strip. (`/about` → redirects to `/team`.) |
| `/digest` | `digest/index.astro` | **Sustainable Bonds Digest** — newspaper/editorial section. Cover feature + masthead + sticky left "In This Digest" nav. |
| `/digest/<slug>` | `digest/[slug].astro` ← `digestPages.js` | 11 content pages (Why MHCs, Housing Crisis, Sustainability, Our Process, Property Management, Credibility White Paper, Partnerships, Self-Directed IRAs, FAQ, Video Library, Disclosure & Terms). |
| `/digest/blog` + `/digest/blog/<slug>` | `digest/blog/` ← `blogPosts.js` | Article index + 27 individual posts (Markdown). |

Top nav: Opportunities · Our Impact · How it works · Assets · Team · Digest.

## Data sources (all real, pulled from base44 public read API, app `68b47ee5ecb454d41bdb59c5`)
Raw exports live in `../_data-export/`. To refresh, re-run the export → transform → regenerate.

- **`src/data/assets.js`** — `Property` entity, published only, **de-duplicated by address**
  (41 published rows → 27 records). Drives the map, table, KPIs, and homepage stats.
- **`src/data/team.js`** — `TeamMember` entity (5 members) + Dr. Williams' books (Amazon ASINs;
  covers in `public/img/books/`). Headshots optimized to `public/img/team/*.webp` (transparent).
- **`src/data/blogPosts.js`** — `BlogPost` entity (27 published, deduped, Markdown content).
- **`src/data/digestPages.js`** — the 11 Digest content pages as Markdown, ported from the live site.
- **`src/data/digestNav.js`** — the Digest left-nav groups/items.

## Canonical numbers currently shown
- Homepage + `/assets`: **27 communities · 756 units · $26M AUM · 15% (target) annual interest**.
- ⚠️ These do **not** match the deck/cover-letter figures (**22 communities / 647 units**). See open items.

## Deployment
- `render.yaml` blueprint (static): `npm install && npm run build` → publish `dist`, `NODE_VERSION=22`.
- Push to `main` → Render auto-builds (≈1–3 min). Static CDN caches aggressively — hard-refresh
  (Cmd+Shift+R) after a deploy. Custom domain `sustainablebonds.com` to be pointed at Render later.

---

## Open items / known issues
1. **Number consistency** — assets/homepage say 27 / 756; the deck + investor cover letters say
   22 communities / 647 units. Pick one canonical set across site, deck, and the email campaign.
2. **One residual duplicate** — "252 Ceceile St" and "252 Cecile Street" (Denmark, SC) are the same
   property with a spelling variant the address-dedupe missed; true unique is ~26. Easy to collapse.
3. **Greg's headshot** is cropped tighter than the others (shoulders fill the frame) so it reads
   slightly boxier; a re-export with more headroom would make all five uniform.
4. **FAQ** (Digest) is ported verbatim from the old site and still uses the old "Bond Option 1–4 /
   Rapid Housing 45% total" return framing — reconcile with the corrected annual/total wording elsewhere.
5. **Video Library** is an honest "coming soon" placeholder (the old page was empty).
6. **Footer links** are still placeholder `#` anchors.
7. **Email campaign** ("Sustainable Bonds Digest" lead-nurture drafts) lives outside the repo — needs
   final number alignment and a compliance/legal pass before sending.
8. **GitHub PAT** that was pasted in chat should be revoked and rotated.

## Email campaign (separate deliverable)
A 4–5 email founder-voice lead-nurture sequence for accredited/institutional leads (Alphamaven/Greg),
plus the two source cover letters (Institutional 15% / Accredited 9–15%). Drafts delivered in chat;
not stored in this repo.
