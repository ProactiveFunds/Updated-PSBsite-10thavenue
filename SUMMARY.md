# Proactive Sustainable Bonds - Website Summary

_Last updated: 2026-08-11_

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
| `/events` | `events/index.astro` -> `EventsPage.jsx` | Events summary: upcoming sessions (featured card per event, speaker rail, countdown), past sessions, and a "keep me posted" CTA. Driven by `src/data/events.js`; renders an empty state when nothing is scheduled. |
| `/events/self-directed-ira` | `events/self-directed-ira.astro` -> `SdiraWebinarPage.jsx` | Landing page for the SDIRA webinar (Tue 18 Aug 2026, 6:30 PM ET) with guest Jeff Minnick of Directed IRA. Two-column hero with a sticky registration card, illustrative compounding comparison, agenda, speaker bio, all six team members, FAQ, sticky CTA bar. Has OG/Twitter tags plus `Event` JSON-LD. |

Top nav (`MktChrome.jsx` `NAV_LINKS`): Opportunities, Our Impact, ProActively Verified, How it
works, Assets, Team, **Events**, Digest, **Contact us** (-> `#get-started`). The old "Sign in"
button was removed (Aug 2026) - it was a dead button with no destination. Nav links light up on
their sub-pages too (`/events/…` keeps *Events* active).

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
- **`src/data/assets.js`** - 22 properties (drives map, table, KPIs). **Generated** from the client
  workbook by `scripts/generate-assets.py`; edit the workbook (or the generator's carried-over prose
  tables), not this file. Also exports `SDG_LABELS`, `FUNDS`, `STATUSES`.
- **`src/data/team.js`** - 5 `TeamMember` records + Dr. Williams' books. Headshots optimized to
  `public/img/team/*.webp` (transparent cutouts).
- **`src/data/blogPosts.js`** - 27 published posts (Markdown). **`src/data/digestPages.js`** - 11 Digest pages.
  **`src/data/digestNav.js`** - Digest nav groups/items.

## Canonical numbers currently shown
Source of truth: **`../Proactive Realty Group - Property Information.xlsx`** (two visible tabs —
*Property Information* = owned, *In Contract* = under contract), imported 11 Aug 2026.

- **22 communities · 842 units/pads · 8 states · $65M AUM · 27% occupancy · 15% (target) annual interest.**
- Split: **17 owned** (549 units, 5 states, $40.2M, 40% occupancy) + **5 under contract**
  (293 units, 3 further states, $25.2M, not yet closed).
- "$65M" is the workbook's *Estimated Value* column, footnoted there as **based on 100% occupancy**
  — stabilised, not current market value. Purchase price across the 22 is $18.7M. Pages that quote
  the figure now carry that caveat; keep it attached if you move the number.
- One owned row is deliberately **not** published: *906 West Main* (Peru, IN — 46 pads, $3.875M),
  which the workbook lists as "(for sale)". See `HELD_SKIP` in `scripts/generate-assets.py`; a test
  guards it. Add it back by clearing that set if it comes off the market.
- Quoted on: `/` (hero stats + "Communities audited"), `/assets` (KPI strip, computed from the data),
  `/OurProcess`, `/q3-special`, `/ira`. `tests/data.test.js` pins the totals, so a data refresh that
  moves them fails the suite and tells you which copy to update.
- Refresh with `python3 scripts/generate-assets.py` (needs `openpyxl`); it rewrites
  `src/data/assets.js` from the workbook.

## Deployment
- `render.yaml` blueprint (static): `npm install && npm run build` -> publish `dist`, `NODE_VERSION=22`.
- Auto-deploy is OFF. Push to both remotes, then run a **Manual Deploy** in Render (Deploy latest commit).
  Static CDN caches aggressively; hard-refresh (Cmd+Shift+R) after a deploy.

---

## Recent work log

**August 2026**
- **Portfolio data re-imported from the client workbook (11 Aug).** `Proactive Realty Group -
  Property Information.xlsx` replaced the base44 export as the source of truth for every per-asset
  figure. `src/data/assets.js` is now **generated** by `scripts/generate-assets.py` from the two
  visible tabs; re-running it is idempotent.
  - **27 rows → 22 properties**: four base44 duplicate pairs collapsed (252 Ceceile/Cecile,
    1905 Ellis Ave/Avenue, 105 W. 154/154th, Stilton); two rows absent from the workbook dropped
    (720 E. Charleston Blvd, 100 Banashee Circle); and *906 West Main*, listed in the workbook as
    "(for sale)", withheld. All three confirmed with the client on 11 Aug.
  - Units, occupancy, estimated value and purchase dates all refreshed; several moved a long way
    (6633 McCartney 24 → 89 pads, 121 Fountainevue 136 → 176, 3 Wycombe 68 → 66 and 0 → 18 occupied).
    New fields: `county`, `purchasePrice`.
  - Status **"In Contract" → "Under Contract"** everywhere (data, `STATUSES`, filter, pill), and
    `/assets` now says in words how many assets are under contract and that they have not closed.
  - Carried-over prose was corrected where the workbook contradicted it (926 Moseley was described
    as "38-unit … 95% occupancy", now 40 and 90%; 1905 Ellis said "$61K acquisition", actually
    $610K), and two impact theses had raw citation artefacts (`【…†…】`) rendering on the page —
    stripped, with `tests/data.test.js` guarding against their return.
  - `/assets` occupancy KPI is now **unit-weighted** rather than a mean of per-asset rates, so a
    1-unit condo at 100% no longer offsets a 176-pad park at 34%. Added a portfolio-value KPI and
    a `county` fact; detail grid went 5 columns → 3 (six facts now).
  - Canonical numbers updated on `/`, `/OurProcess`, `/q3-special`, `/ira` — see the section above.
- **Footer tidy-up (11 Aug).** *Newsletter* now points at `/digest` (it went to the home intake
  form); *Investment scenarios* removed; *Our mission* and *Team* merged into one
  **Our mission & team** link on `/team` — *Our mission* pointed at the home `#impact` anchor, so
  the Company column had two near-duplicate destinations.
- **Footer links connected.** All 16 were dead `#` placeholders. The map now lives in
  `src/data/footerLinks.js` (data, not inline JSX, so it is testable) and every destination is a
  real route, Digest page or on-page anchor. Anchors are written absolute (`/#id`) because the
  footer renders on every page. Added `id="testimonials"` to `Testimonials.jsx`, which had no
  anchor, and pointed the dead Newsletter button at `/#get-started`.
  `tests/footer-links.test.js` asserts no placeholder survives, every page path exists in
  `src/pages`, every Digest slug exists in `digestPages.js`, and every anchor id exists in the
  component source — verified by breaking three links and watching it fail.
- **Events section added.** New `/events` summary page and the first event landing page,
  `/events/self-directed-ira` - a webinar on **Tuesday 18 August 2026, 6:30 PM ET** with guest
  **Jeff Minnick, VP Relationship - New Accounts at Directed IRA**. Structure follows the
  milapennchazak.com/tax-strategy reference (hero + sticky register card, value section,
  agenda, speaker, hosts, FAQ, final CTA) but rebuilt in the Proactive design system.
  - `src/data/events.js` is the single source of truth for both pages (ISO timestamps with
    explicit offsets, `formatEventDate/Time`, `daysUntil`, `calendarUrl`). Covered by
    `tests/events.test.js` (12 cases, incl. that the date really is a Tuesday and that the
    Google-Calendar window is 22:30-23:30 UTC).
  - **Registration posts to a dedicated Tenth Avenue form key, `sdira-webinar`** (constant
    `TA_FORM` in `SdiraWebinarPage.jsx`). This form must exist in Tenth Avenue before launch -
    it is deliberately separate from `ira`/`webform` so the Zoom link only goes to registrants.
  - Nav: **"Sign in" removed**, **"Events" added**; nav collapse breakpoint moved 1080 -> 1180px
    because the pill now carries nine links.
  - New assets: `public/img/team/bob.webp` (Bob Totaro keyed from `Headshots/Bob-Tataro` -
    his backdrop is neutral/cool while his white hair is warm, so `B - R` separates them where
    luminance cannot), `public/img/speakers/jeff-minnick.webp`, and the 1200x644 link card
    `public/img/events-sdira-og.png`.
  - Copy is deliberately dream-result-led rather than sales-led; the compounding panel is
    labelled illustrative (5% baseline vs 12%, the midpoint of the site's 9-15% range).
- **Fixed: sections not filling the page on wide screens, and added a guard.** The webinar page
  capped its inner blocks (calc panel, speaker, agenda, FAQ) with a bare `max-width`, which
  left-aligns rather than centres — so each one sat pinned left with a dead right gutter that grew
  with the viewport (861px of empty space at 2560px). Every block now spans one 1240px centred
  container and only raw text keeps a readable measure. New **`npm run audit:layout`**
  (`scripts/layout-audit.mjs`, zero deps) drives headless Chrome across every route at
  1440/1920/2560 and fails on horizontal overflow or a "stranded box"; it was verified to catch
  the exact regression before being committed. Rule written up in `rules.md` section 6 (Layout)
  and added to the `CLAUDE.md` post-change checklist.
- **Follow-up: the same fault in text form.** Filling the *boxes* was not enough — headings and
  paragraphs capped at ~62ch still sat in the left half of a 1240px row with the other half empty.
  Section heads (and the `/events` hero, and the speaker card) now run as **two columns** —
  heading left, copy right, collapsing to one column under 900px — so the row fills and each
  column lands near 65 characters with no cap at all. The audit gained a **stranded-text** check
  (prose abandoning more than a quarter of its row), which immediately found a live instance of
  the same bug on `/verified` (`.vf-section-head`, capped at 60ch, stranding 573px); fixed there
  too. The old guidance in `rules.md` — "only raw text is capped… text stopping early looks
  intentional" — was wrong and has been rewritten.
- **Two audit blind spots closed.** The FAQ answers (`max-width: 72ch`) and the sticky CTA bar
  both shipped broken while the audit reported clean, because it only measured what was visible
  at scroll 0 with accordions shut. It now forces every `<details>` open and scrolls past the
  fold before probing, and gained an **off-centre pinned element** check. The sticky bar's cause
  is worth remembering: it was centred with `left: 50%` + `translateX(-50%)`, and the `psb-rise`
  entrance animation ends on `transform: none`, which wiped out the centring translate and
  shunted the bar half its width right. It now centres with `margin-inline: auto` and no
  transform. The FAQ runs as two columns above 1000px so an open answer fills its item.

**July 2026**
- **Design system synced to Claude Design** (`claude.ai/design`) so its design agent builds new
  PSB screens out of our real components instead of generic ones.
  Project: <https://claude.ai/design/p/2fdd6050-b7b0-4fea-910a-fc3fa53329e9>.
  - **21 components** exported — the reusable surface only, in 5 groups: *chrome* (MktNav,
    MktFooter, ThemeToggle), *hero* (Hero, ImpactBand, Photo), *sections* (SectionHead,
    HomeSectionHead, Partners, SocialProof, Insights, Process, Testimonial, BeforeAfter),
    *investing* (HomeCalculator, ReturnComparison, Opportunities, Opportunities2, InvestModal,
    IntakeForm), *primitives* (Ic). Page-level and leaflet/data-bound components are excluded.
  - Each ships an authored preview (34 cells, all graded good), a hand-written props contract,
    and a usage doc. Final validate: **21/21 render cleanly, zero warnings**.
  - Sync inputs live in **`.design-sync/`** (committed): `config.json`, `entry.mjs`,
    `prepare-css.mjs`, `prepare-assets.py`, `previews/`, `docs/`, `conventions.md`, `NOTES.md`.
    Build output (`ds-bundle/`) and the staged converter (`.ds-sync/`) are gitignored.
  - Re-sync is one command, but **read `.design-sync/NOTES.md` first** — it documents the two
    non-obvious traps (duplicate `@font-face` shadowing the brand fonts, and `/img/` paths that
    need data-URI inlining to survive outside the Astro server).
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
- **Investor deck team slide re-shot** - all six headshots on slide 6 ("Experienced Stewards of
  Capital") of `Presentations/PSB Deck_7.26.26.pptx` replaced with the current green-tie set from
  `Headshots/`. The deck's slides are flattened screenshots, so this was a pixel edit of
  `ppt/media/image6.png` (see `rules.md` s7 for the geometry). Written as
  `Presentations/PSB Deck_7.26.26 (new headshots).pptx`; the original is untouched.
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
0. **Create the `sdira-webinar` form in Tenth Avenue** before `/events/self-directed-ira` goes
   live, and wire it to send the Zoom link + calendar hold. Until it exists the registration
   form will post into the void (the page still shows its success state, because the confirmation
   is driven by the hidden iframe's load event). Also decide whether Bob Totaro should join
   `src/data/team.js` so he appears on `/team` too - he is currently only on the webinar page.
1. ~~**Number consistency** - site/assets say 27 / 756; deck + cover letters say 22 / 647.~~
   **Done (11 Aug 2026)** — the client workbook is now the single source of truth and the site
   says **22 / 842 / $65M**. The deck, cover letters and the AlphaMaven email sequence still carry
   the old 22 / 647 and $25–29M figures and need the same pass (the deck's "22" is a coincidence —
   different properties, different unit count).
2. ~~**Residual duplicate** - "252 Ceceile St" vs "252 Cecile Street".~~ **Done (11 Aug 2026)** —
   all four base44 duplicate pairs collapsed in the workbook import.
2a. ~~Three judgement calls in the import.~~ **Resolved 11 Aug** — client confirmed all three are
   off the site: *720 E. Charleston Blvd* (was "In Contract", on neither tab), *100 Banashee Circle*
   (sold 2018), and *906 West Main* (owned but being marketed for sale).
2b. **"38 Communities audited · Verified · Deloitte"** on the homepage now reads **22**, tracking the
   portfolio. The attribution was never re-verified — confirm the audited count with Deloitte, since
   the label makes it a third-party claim.
3. **Greg's headshot** is cropped tighter than the others; a re-export with more headroom would make all five uniform.
4. **FAQ** (Digest) still uses the old "Bond Option 1-4 / Rapid Housing 45% total" framing; reconcile with corrected wording.
5. **Video Library** is a "coming soon" placeholder.
6. ~~**Footer links** are still placeholder `#` anchors.~~ **Done (Aug 2026)** — wired in
   `src/data/footerLinks.js` and guarded by `tests/footer-links.test.js`. Two labels still have no
   dedicated destination and share a target: *Proactive QOZ Fund* points at `/#opportunities`
   (where the QOZ Fund I card lives, but there is no QOZ page), and *Terms* shares
   `/digest/disclosure-terms` with *Disclosures*. Give either its own page and update the map.
7. **Before/after impact section** stays hidden until photos are provided.
8. **Real Leaders Real Estate Award** shown as a text ribbon on collateral (no clean badge yet); confirm exact name/logo.
9. **Email campaign** (AlphaMaven lead-nurture) lives outside the repo; needs number alignment + compliance pass before sending.
10. **GitHub PAT** pasted in chat should be revoked and rotated.

## Email campaign (separate deliverable)
A founder-voice lead-nurture sequence for accredited/institutional leads (AlphaMaven/Greg), plus the two
source cover letters (Institutional 15% / Accredited 9-15%). The outreach plan/templates were sent to Greg
as `Proactive_Sustainable_Bonds_Outreach_Plan.pdf` (June 22). Drafts are not stored in this repo.
