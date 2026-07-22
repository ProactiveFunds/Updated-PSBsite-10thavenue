# RULES.md - Proactive Sustainable Bonds operating manual

Portable project memory. Read this first in any new session. It captures how the
project is wired (GitHub, Render, Supabase, forms), the conventions to follow, and
the hard-won gotchas so nothing has to be relearned.

Keep this file updated whenever a new fact or rule is learned.

---

## 1. What this project is / folder map

Primary working project: **`proactive-astro/`** (this folder). Astro 5 + React 19
static marketing site for Proactive Sustainable Bonds. This is the site that ships.

The parent folder (`New Website/`) also contains:

| Folder | What it is | Active? |
|---|---|---|
| `proactive-astro/` | **Current** site (Astro + React islands, self-hosted assets). Deploys to Render. | YES - work here |
| `PSB2026-main/` | **Old** site. A Base44 export (`base44-app`, Vite + React). Pulls its images/PDFs from a public Supabase storage bucket. Kept for reference/content only. | No (legacy) |
| `_original-bundle-backup/` | The original single-file runtime-Babel bundle the Astro site replaced. | No (backup) |
| `_data-export/` | Raw JSON exports from the legacy Base44 app (`team-raw.json`, `blog-raw.json`) used to generate `src/data/*`. | Reference |

When someone says "the site" or "the website," they mean `proactive-astro`.

---

## 2. GitHub (two remotes, push to both)

The repo has **two** remotes and we keep them in sync:

- **`client`** = `github.com/ProactiveFunds/Updated-PSBsite-10thavenue` (the client's repo; this is what Render builds from)
- **`origin`** = `github.com/ihavespokennow-ops/sustainablebonds` (our mirror)

Branch: **`main`**. Workflow is **direct commits to `main`** (no PR flow), then:

```bash
git push client main && git push origin main
```

Notes / rules:
- Auth is via a Personal Access Token embedded in the remote URL. **Never print the
  token.** Mask it in any command output (`sed 's#https://[^@]*@#https://***@#g'`).
- A GitHub PAT was once pasted in chat. It **must be rotated/revoked** and never pasted again.
- Direct pushes to `main` can be blocked by the environment's auto-approval classifier
  ("Git Push to Default Branch"). That is expected; proceed only after the user explicitly
  asks to push (their "push" instruction is the authorization), then run both pushes.
- Only commit/push when the user asks. Keep commits focused (one logical change).
- Commit trailer to use: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

## 3. Render (hosting + deploy)

- Service: a Render **Static Site** named `sustainablebonds` (default URL
  `sustainablebonds.onrender.com`; custom domain `www.sustainablebonds.com`).
- Config: `render.yaml` (blueprint). Build `npm install && npm run build`, publish
  `./dist`, `NODE_VERSION=22`.
- **Auto-deploy is currently OFF.** Pushing to `main` does **not** deploy on its own.
  To publish, the user must open the Render dashboard -> the `sustainablebonds` site ->
  **Manual Deploy** -> **Deploy latest commit**.
- There is **no deploy hook URL or Render API key stored** in the repo or workspace, so
  Claude cannot trigger a deploy directly. To enable that, the user can create a Deploy
  Hook (Render site -> Settings -> Deploy Hook) and paste the URL; then a single POST
  triggers a build. Treat that URL as a secret.
- Render's CDN caches aggressively; hard-refresh (Cmd+Shift+R) after a deploy.
- After pushing, remind the user a Manual Deploy is needed and list which commits are pending.

---

## 4. Supabase

The **current** site (`proactive-astro`) does **not** connect to Supabase. All images,
logos, fonts, and PDFs are **self-hosted** under `public/` (e.g. `public/img`,
`public/fonts`, `public/verified`).

Supabase only appears in the **old** Base44 site (`PSB2026-main`), where it is used purely
as **public asset storage / CDN** (no database client, no auth in the front end):

- Project ref / host: `qtrypzzcjebvfcihiynt.supabase.co`
- Bucket: `base44-prod`, public path pattern
  `https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/...`
- These URLs are public and read-only (logos, report PDFs, project photos).

If real Supabase (DB/storage) access is ever needed, a **Supabase MCP connector** is
available in the workspace tools. Confirm which project/keys before using it; do not
assume the Base44 bucket above is the right target.

---

## 5. Forms (Tenth Avenue)

Lead/contact forms submit to **Tenth Avenue** (`tenthavenue.io`), the email/marketing
platform used for the AlphaMaven campaign.

- Markup uses `.ta-form` classes; submits `POST` to
  `https://tenthavenue.io/api/forms/<form-key>/submit` targeting a hidden `<iframe>`.
- The home page intake/contact form is the section with **`id="get-started"`**
  (heading "Tell us about your goals."). The nav "Contact us" link points to `#get-started`.

---

## 6. Site conventions (proactive-astro)

- **Stack:** Astro 5 (static) + `@astrojs/react` islands, React 19. `leaflet` (assets map),
  `marked` (Markdown -> HTML for Digest/blog). ESM project (`"type": "module"`).
- **Structure:** components in `src/components/`, routes in `src/pages/`, data in
  `src/data/`, shared logic in `src/lib/`, styles in `src/styles/`.
- **Nav + footer:** `src/components/MktChrome.jsx` (`MktNav` uses the `NAV_LINKS` array;
  anchor links scroll on the home page and fall back to `/#id` off-page via `go()`).
- **Fonts (self-hosted):** woff2 files in `public/fonts/`, declared via `@font-face` in
  `src/styles/global.css`. Families: **Hanken Grotesk** (sans/UI), **Newsreader**
  (editorial serif), **Spline Sans Mono** (numbers/labels).
- **Brand tokens** (in `global.css :root`): forest scale (primary `--forest-600 #1f5e2e`,
  deep `--forest-900 #0d2a17`), lime accent (`--lime-500 #7fb24f`, on-dark `--lime-300 #aed079`),
  warm paper `--paper #f7f8f4`, ink `#1a1d18`. Light/dark theme via `data-theme` on `<html>`.
- **Team photos** are **transparent cutout** `.webp` files in `public/img/team/` shared by
  the team page and the Q3 landing collage. A matching cutout can be produced from a
  white-background photo with Pillow flood-fill keying (threshold tuned per image, then a
  small erode + gaussian blur on alpha).
- **Verified/partner logos** live in `public/img/` and `public/img/partners/`. There is a
  white logo variant `public/img/logo-white.png` (generated for dark backgrounds).
- **Invest CTAs have two destinations, kept strictly apart** (see SUMMARY.md "Invest CTA routing"):
  - `/q3-special` "Start investing" (x3) -> the **Q3-only** Tenth Avenue portal link
    (`INVEST_URL` in `Q3SpecialPage.jsx`). This URL is **bond-specific**: it must never be
    copied into `MktChrome.jsx` (nav/footer/mobile menu render on every page) or onto the
    evergreen invest pages.
  - `/OurProcess`, `/accreditation`, home calculator -> `tier2.sustainablebonds.com`.
  - Nav/footer/mobile menu and home "Invest now" -> no outbound link; `goToCalculator()` scrolls
    to `#calculator`.
  - When a new bond offering gets its own portal link, add a new constant on that offering's page
    rather than changing a shared one. `tests/invest-links.test.js` enforces this boundary.

---

## 7. Print / PDF and graphics pipeline (learned)

For print-ready collateral (flyers, one-pagers) built to match the site:

- Build the piece as **HTML** using the site's real tokens + `@font-face` (reference
  `/fonts/*.woff2` and `/img/*`), then render with **headless Google Chrome**:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new
  --disable-gpu --no-pdf-header-footer --print-to-pdf=out.pdf <url>`.
- **Chrome writes the PDF within a few seconds, then does NOT exit** (it hangs). Run it
  with a short timeout or kill it after the file appears; the produced PDF is complete.
- **The Astro dev server's HMR websocket breaks `--print-to-pdf`** (the page never reaches
  network-idle, so print never fires). Do **not** print from `localhost:4321`. Instead make
  a **self-contained** copy: base64-embed the fonts as `data:` URIs, copy images locally,
  and render via a `file://` URL with `--allow-file-access-from-files`.
- Use `@page { size: Letter; margin: 0 }` + `-webkit-print-color-adjust: exact` so gradients
  print. A US Letter page is `8.5in x 11in` = **816 x 1056 px at 96dpi**; verify each
  `.page` `scrollHeight` == 1056 to catch overflow before rendering.
- WEBP does **not** render as an image fill in some contexts (e.g. Figma fills); convert to
  JPEG/PNG when a fill fails to appear.
- Inspect rendered PDFs with PyMuPDF (`fitz`) - it is available (`pip`/`python3 -c "import fitz"`).
- LinkedIn Featured image size used: **1200 x 644**. OG/Twitter preview tags matter for link
  cards; refresh via LinkedIn Post Inspector after changing them.

---

## 8. Verification / preview quirks (learned)

- Use the **Claude Preview** tools (dev server on port 4321), not Bash, to run/inspect the site.
- **Screenshots are unreliable on deep scroll** (blank/misaligned). Prefer DOM/`eval`
  measurements (`scrollHeight`, `getBoundingClientRect`) and `preview_snapshot`.
- **`scrollIntoView({behavior:'smooth'})` does not animate in the preview browser** - `scrollY`
  stays 0 even though the handler fired. This is an environment quirk, not a bug; confirm anchor
  wiring with an instant scroll or `location.hash`, and by checking the handler ran (e.g. the
  active nav state changed). It works normally in real browsers.

---

## 9. Testing + regression policy

- After any change: run the **full unit-test suite** (`npm test`) and it must be **100%
  passing**. Investigate every failure, including low-value ones - a red test is a signal.
- Also run **`npm run build`** (Astro build must succeed with no errors) as a regression check
  for anything the unit tests do not cover.
- For any change observable in the browser, **drive the preview** and confirm the actual
  behavior (see section 8), do not rely on the build alone.
- The suite lives in `tests/` and uses Node's built-in runner (`node --test`, zero deps). It
  guards the data layer (`src/data/*`) and pure utilities (`src/lib/*`). Add a test whenever new
  pure logic or data invariants are introduced.

---

## 10. Content caveats (see SUMMARY.md "Open items" for the live list)

- Number inconsistency: site/assets show **27 communities / 756 units / $26M AUM / 15%**,
  while the deck + cover letters say **22 / 647**. Pick one canonical set before big sends.
- The "See the IMPACT ... before/after" home section is intentionally **hidden** (commented
  out in `App.jsx`) until real before/after photos exist.
- Real Leaders "Real Estate Award" (2026) currently rendered as a text ribbon on collateral
  because only an email screenshot exists, not a clean badge; confirm exact award name/logo.

---

## 11. Security rules

- Never paste, print, commit, or store secrets (GitHub PAT, Supabase keys, deploy hook URLs,
  API keys). Mask credentials in command output.
- Rotate any secret that has been exposed (the pasted GitHub PAT).
- Do not enter credentials into forms/sites on the user's behalf; direct the user to do it.
