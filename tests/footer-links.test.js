// Guards src/data/footerLinks.js. The footer renders on every page and its links
// sat as dead `#` placeholders for months, so every destination is asserted to
// resolve: real page routes, real Digest slugs, and real on-page anchor ids.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FOOTER_COLS, FOOTER_LEGAL, allFooterLinks } from '../src/data/footerLinks.js';
import { pages as digestPages } from '../src/data/digestPages.js';

// fileURLToPath, not URL.pathname — the repo path contains spaces, which
// pathname leaves percent-encoded and fs cannot open.
const SRC = fileURLToPath(new URL('../src', import.meta.url));

/** Routes Astro will emit from src/pages (static files + the digest collections). */
function pageRoutes() {
  const routes = new Set();
  const walk = (dir, prefix) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) { walk(join(dir, entry.name), `${prefix}/${entry.name}`); continue; }
      if (!/\.(astro|md)$/.test(entry.name)) continue;
      if (entry.name.startsWith('[')) continue;           // dynamic route, checked separately
      const base = entry.name.replace(/\.(astro|md)$/, '');
      routes.add(base === 'index' ? (prefix || '/') : `${prefix}/${base}`);
    }
  };
  walk(join(SRC, 'pages'), '');
  return routes;
}

/** Every `id="..."` present in the components — the anchor targets. */
function anchorIds() {
  const ids = new Set();
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) { walk(p); continue; }
      if (!/\.(jsx|astro)$/.test(entry.name)) continue;
      for (const m of readFileSync(p, 'utf8').matchAll(/\bid=["'{]?["']?([a-zA-Z0-9_-]+)["']?/g)) {
        ids.add(m[1]);
      }
    }
  };
  walk(join(SRC, 'components'));
  walk(join(SRC, 'pages'));
  return ids;
}

test('no footer link is a dead placeholder', () => {
  for (const [label, href] of allFooterLinks()) {
    assert.ok(href && href !== '#' && href !== '', `"${label}" has no destination`);
    assert.ok(!href.startsWith('#'), `"${label}" uses a bare "#${href.slice(1)}" — the footer is on every page, so anchors must be absolute ("/#id")`);
  }
});

test('every footer label is unique within its column', () => {
  for (const [heading, items] of FOOTER_COLS) {
    const labels = items.map(([l]) => l);
    assert.equal(new Set(labels).size, labels.length, `${heading} column repeats a label`);
  }
});

test('internal page links resolve to a real route', () => {
  const routes = pageRoutes();
  const digestSlugs = new Set(digestPages.map((p) => p.slug));
  for (const [label, href] of allFooterLinks()) {
    if (href.startsWith('http') || href.startsWith('/#')) continue;
    const path = href.replace(/\/$/, '');
    if (path.startsWith('/digest/')) {
      const slug = path.slice('/digest/'.length);
      const ok = digestSlugs.has(slug) || slug === 'blog' || routes.has(path);
      assert.ok(ok, `"${label}" -> ${href} is not a Digest page or route`);
      continue;
    }
    assert.ok(routes.has(path), `"${label}" -> ${href} has no matching file in src/pages`);
  }
});

test('anchor links point at an id that exists in the source', () => {
  const ids = anchorIds();
  for (const [label, href] of allFooterLinks()) {
    if (!href.startsWith('/#')) continue;
    const id = href.slice(2);
    assert.ok(ids.has(id), `"${label}" -> ${href} has no element with id="${id}"`);
  }
});

test('external footer links are https', () => {
  for (const [label, href] of allFooterLinks()) {
    if (!href.startsWith('http')) continue;
    assert.ok(href.startsWith('https://'), `"${label}" -> ${href} should be https`);
  }
});

test('legal row covers privacy, terms and disclosures', () => {
  const labels = FOOTER_LEGAL.map(([l]) => l.toLowerCase());
  for (const required of ['privacy', 'terms', 'disclosures']) {
    assert.ok(labels.includes(required), `legal row is missing "${required}"`);
  }
});
