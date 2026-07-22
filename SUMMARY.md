# Proactive Sustainable Bonds - Website Summary

_Last updated: 2026-07-22_

A rebuild of the Proactive Sustainable Bonds marketing site as a fast, statically-generated
**Astro + React** project. Replaces the original single-file runtime-Babel bundle (kept at
`../_original-bundle-backup/`) and pulls real content/data from the legacy Base44 app
(`../PSB2026-main/` is that old site, kept for reference only).

New to the project? Read **`rules.md`** first (how GitHub, Render, Supabase, and forms are
wired, plus conventions and gotchas), and **`CLAUDE.md`** for the working rules.

- **Repos (push to both):** `client` = ProactiveFunds/Updated-PSBsite-10thavenue (Render builds this),
  `origin` = ihavespokennow-ops/sustainablebonds (mirror). Branch `main`, direct commits.
- **Hosting:** Render **Static Site** `sustainablebonds` (`www.sustainablebonds.com`).
  **Auto-deploy is OFF** - a **Manual Deploy** in the Render dashboard is required to publish.
- **Run locally:** `npm install` -> `npm run dev` (port 4321). `npm test` (unit tests).
  `npm run build` -> `dist/`.

---

## Tech stack
- **Astro 5** (static output) + **@astrojs/react** islands. **React 19**. ESM (`type: module`).
- **leaflet** - portfolio map. **marked** - Markdown to HTML for the Digest/blog.
- Styling: design tokens + component styles in `src/styles/` (`global.css`, `responsive.css`,
  `motion.css`, `digest.css`). Fonts (self-hosted in `public/fonts/`): Hanken Grotesk (sans),
  Newsreader (editorial serif), Spline Sans Mono. Light/dark theme via `data-theme` on `<html>`.

## Pages
| URL | Source | What it is |
|---|---|---|
| `/` | `index.astro` -> `App.jsx` | Marketing home: hero ("The bond that builds"), calculator, partners, comparison table of opportunities, social proof, intake/contact form (`id="get-started"`). The "See the IMPACT" before/after section is temporarily hidden pending photos. |
| `/q3-special` | `q3-special.astro` -> `Q3SpecialPage.jsx` | Story-led landing page for the Q3 2026 Impact Bridge offering (hero video, story, tiers, past performance, verifications, team, CTA -> the Q3-only Tenth Avenue portal link, see "Invest CTA routing"). Has OG/Twitter tags for LinkedIn link cards. |
| `/verified` | `verified.astro` -> `VerifiedPage.jsx` | ProActively Verified: the third-party verification story. |
| `/assets` | `assets.astro` -> `AssetsExplorer.jsx` | Portfolio Explorer: filters + Leaflet map + sortable table with inline-expand rows + Table/Timeline toggle. |
| `/team` | `team.astro` -> `AboutTeam.jsx` | About + team as transparent-cutout photos + bios. Dr. Williams has an "Author of" book strip. (`/about` redirects to `/team`.) |
| `/OurProcess` | how-it-works page | "How it works". |
| `/digest`, `/digest/<slug>`, `/digest/blog[/<slug>]` | `digest/` <- `digestPages.js`, `blogPosts.js` | Editorial Digest: cover feature + 11 content pages + 27 blog posts (Markdown). |

Top nav (`MktChrome.jsx` `NAV_LINKS`): Opportunities, Our Impact, ProActively Verified, How it
works, Assets, Team, Digest, **Contact us** (-> `#get-started`).

## Invest CTA routing (where "Start investing" / "Invest now" goes)
Two destinations, deliberately kept apart. Guarded by `tests/invest-links.test.js`.

| CTA | Where | Destination |
|---|---|---|
| "Start investing" x3 (hero, offering, final) | `/q3-special` (`Q3SpecialPage.jsx` `INVEST_URL`) | **Q3-only** Tenth Avenue portal: `portal.tenthavenue.io/start/8ed1cd59…` |
| "Start investing" | `/OurProcess` (x2), `/accreditation`, home calculator (accredited result) | `tier2.sustainablebonds.com` |
| "Start investing" / "Invest now" | Nav, footer, mobile menu (`MktChrome.jsx`), home sections | No outbound link - `goToCalculator()` scrolls to `#calculator` |

The portal link is **bond-specific** (Q3 2026 Impact Bridge). Never put it in `MktChrome.jsx`
or on the evergreen invest pages - shared chrome renders on every page and must stay generic.

## Data sources (real, from the legacy Base44 export; raw JSON in `../_data-export/`)
- **`src/data/assets.js`** - `Property` entity, published, de-duplicated by address (drives map, table, KPIs).
  Also exports `SDG_LABELS`, `FUNDS`, `STATUSES`.
- **`src/data/team.js`** - 5 `TeamMember` records + Dr. Williams' books. Headshots optimized to
  `public/img/team/*.webp` (transparent cutouts).
- **`src/data/blogPosts.js`** - 27 published posts (Markdown). **`src/data/digestPages.js`** - 11 Digest pages.
  **`src/data/digestNav.js`** - Digest nav groups/items.

## Canonical numbers currently shown
- Homepage + `/assets`: **27 communities, 756 units, $26M AUM, 15% (target) annual interest**.
- These do **not** match the deck/cover-letter figures (**22 communities / 647 units**). See open items.

## Deployment
- `render.yaml` blueprint (static): `npm install && npm run build` -> publish `dist`, `NODE_VERSION=22`.
- Auto-deploy is OFF. Push to both remotes, then run a **Manual Deploy** in Render (Deploy latest commit).
  Static CDN caches aggressively; hard-refresh (Cmd+Shift+R) after a deploy.

---

## Recent work log

**July 2026**
- **Q3 invest CTAs repointed to the Tenth Avenue portal.** All three "Start investing" buttons on
  `/q3-special` (hero, offering, final CTA) now go to
  `https://portal.tenthavenue.io/start/8ed1cd5979977726126230c2e3cdd7004c8c3a0f` instead of
  `tier2.sustainablebonds.com`. `TIER2` renamed to `INVEST_URL` in `Q3SpecialPage.jsx`.
  **Scope is deliberately Q3-only** - the link is specific to this bond, so nav/footer/mobile-menu
  CTAs and the evergreen invest pages (`/OurProcess`, `/accreditation`, home calculator) were left
  untouched. Verified in the built `dist/q3-special/index.html` (3/3 anchors, 0 stale `tier2`) and
  on the dev server; the new portal URL appears in no other page. New regression test
  `tests/invest-links.test.js` locks the boundary in both directions. See "Invest CTA routing".
- **Brand logo swapped** to the new lockup (sprout growing through the "i" in *Proactive*).
  Replaced `public/img/logo.png` with `Logos/Proactive Sustainable Bonds PNG/Green.png`
  (1228×519, 28KB — smaller than the old 176KB). Updates every usage automatically: header +
  footer (`MktChrome.jsx`), the Proactive mark on `VerifiedPage.jsx`, and `public/banner.html`.
  New lockup has a squarer aspect ratio (~2.37 vs 3.03), so it renders a bit more compact at the
  same pixel heights. `White.png`/`grey.png` variants are available in the same folder if a
  theme-aware (dark-mode) logo is wanted later; `logo-white.png` remains unused.
- **Outbound-bandwidth fixes** (Render reported ~5GB/7 days, driven by the hero background videos):
  - Re-encoded the autoplay background videos with a static `ffmpeg` (audio stripped — they are
    muted/decorative; H.264 CRF 30, `+faststart`). `banner.mp4` 3.89MB→1.06MB, `ira.mp4` 0.95MB→0.13MB.
    WebM came out larger than the optimized H.264 for this short/low-res content, so MP4-only.
    Originals moved to `video-originals-backup/` (gitignored, outside `public/`).
  - Added poster frames (`public/videos/banner-poster.jpg`, `ira-poster.jpg`) and set `preload="metadata"`
    on the three hero videos (`Hero.jsx`, `Q3SpecialPage.jsx`, `IraPage.jsx`). Autoplay preserved
    (muted autoplay works regardless of preload); poster paints instantly.
  - Added `Cache-Control` headers in `render.yaml` (`/_astro/*` + `/fonts/*` immutable 1yr;
    `/videos/*`, `/img/*`, `/verified/*` 30 days) so repeat visitors/crawlers stop re-downloading.
  - Added `public/robots.txt` disallowing crawlers from `/verified/` (28MB of multi-MB PDFs; still
    reachable by direct link). Revert if those PDFs are wanted in search results.
- **Q3 Special offering** added as the first (highlighted) row of the home "Compare the
  opportunities" table (`HomeSections.jsx`), and its "Invest now" points to the new landing page.
- **`/q3-special` landing page** created (story-led, leads to `tier2.sustainablebonds.com`), with an
  OG image (`public/img/q3-special-og.png`, 1200x644) so LinkedIn renders a branded link card.
- **LinkedIn + event graphics** produced in Figma: Q3 Featured image (1200x644) and square (1200x1200);
  SOCAP26 event cover + post for Dr. Van; a "Contact us" team-collage Featured graphic.
- **Home "See the IMPACT" before/after section hidden** (commented out in `App.jsx`) until real photos exist.
- **Alicia Galloway headshot** updated on the team page: keyed the white background out of the new photo
  into a transparent cutout matching the others; overwrote `public/img/team/alicia.webp`.
  Committed `6641184`, pushed to both remotes.
- **Impact & Investment Overview** ("Impact 2.5 Pager") built as a 3-page, print-ready PDF matching the
  site + LinkedIn banner (deep-green hero, lime accents, real logo, verification wall, mission pillars,
  case studies, investment terms, audience chips, and a prominent IMPORTANT DISCLOSURES block above the
  legal fine print). Delivered to the Desktop; source + render pipeline kept in the session scratchpad,
  not in this repo. Generated `public/img/logo-white.png` (white logo for dark backgrounds).
  A variant with the investment figure changed from `$20,000 MINIMUM` to `$100K–$2M+ INVESTMENT`
  was later produced by editing the PDF in place (redraw in the brand's Spline Mono / Hanken fonts),
  saved alongside the original as `...Overview (100K-2M).pdf` in the project root.
- **"Contact us" nav link** added (`MktChrome.jsx`), scrolls to the intake form (`#get-started`).
  Committed `a6670c1`, pushed to both remotes.
- **Project memory added:** `rules.md` (operating manual), `CLAUDE.md` (working rules), this `SUMMARY.md`,
  and a `tests/` unit-test suite (Node's built-in runner) covering the data layer and pure utilities.

**Pending deploy:** the following commits are on both remotes but **not yet live** - they publish
only after a Render Manual Deploy (latest = `c4a8469`):
- `c4a8469` - brand logo swapped to the new lockup
- `ad612d2` - outbound-bandwidth fixes (compressed videos, cache headers, robots.txt)
- `a6670c1` - Contact us nav link
- `6641184` - Alicia Galloway headshot

---

## Open items / known issues
1. **Number consistency** - site/assets say 27 / 756; deck + cover letters say 22 / 647. Pick one canonical set.
2. **Residual duplicate** - "252 Ceceile St" vs "252 Cecile Street" (Denmark, SC) is one property; true unique ~26.
3. **Greg's headshot** is cropped tighter than the others; a re-export with more headroom would make all five uniform.
4. **FAQ** (Digest) still uses the old "Bond Option 1-4 / Rapid Housing 45% total" framing; reconcile with corrected wording.
5. **Video Library** is a "coming soon" placeholder.
6. **Footer links** are still placeholder `#` anchors.
7. **Before/after impact section** stays hidden until photos are provided.
8. **Real Leaders Real Estate Award** shown as a text ribbon on collateral (no clean badge yet); confirm exact name/logo.
9. **Email campaign** (AlphaMaven lead-nurture) lives outside the repo; needs number alignment + compliance pass before sending.
10. **GitHub PAT** pasted in chat should be revoked and rotated.

## Email campaign (separate deliverable)
A founder-voice lead-nurture sequence for accredited/institutional leads (AlphaMaven/Greg), plus the two
source cover letters (Institutional 15% / Accredited 9-15%). The outreach plan/templates were sent to Greg
as `Proactive_Sustainable_Bonds_Outreach_Plan.pdf` (June 22). Drafts are not stored in this repo.
