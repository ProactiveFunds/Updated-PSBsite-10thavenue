# CLAUDE.md

Operating instructions for this project (Proactive Sustainable Bonds website).

## Start here
- **Read [`rules.md`](rules.md) at the start of every session.** It is the project's
  memory: how GitHub (two remotes), Render (manual deploy), Supabase (legacy asset
  storage only), and the Tenth Avenue forms work, plus site conventions, the PDF/graphics
  pipeline, preview quirks, and content caveats. If `rules.md` and this file disagree,
  `rules.md` wins on details.
- **Read [`SUMMARY.md`](SUMMARY.md)** for current state, what has shipped, and open items.

## Always, after any change
1. **Update `SUMMARY.md`** - keep the work log, canonical numbers, and open items current.
   Bump the "Last updated" date. If you learned a new fact or rule, also add it to `rules.md`.
2. **Run the full unit-test suite: `npm test`. It must be 100% passing.** Investigate every
   failure, even low-value ones. Add tests when you introduce new pure logic or data invariants.
3. **Run `npm run build`** (Astro build must succeed) as a regression check.
4. For anything visible in the browser, **drive the Claude Preview** (dev server, port 4321)
   and confirm the real behavior. Note the preview quirks in `rules.md` section 8
   (deep-scroll screenshots and smooth-scroll do not work in-preview; use DOM checks).

## Shipping
- Commit only when asked; keep commits focused. Trailer:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Push to **both** remotes: `git push client main && git push origin main`. Mask any token
  in output. Never commit or print secrets.
- Render **auto-deploy is OFF**: after pushing, tell the user to run a **Manual Deploy** in
  Render (or fire a deploy hook if they have provided one). List the pending commits.

## Commands
```bash
npm run dev      # dev server, http://localhost:4321
npm test         # unit tests (node --test), must be 100% green
npm run build    # production build -> ./dist  (must pass)
npm run preview  # preview the production build
```
