import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { NAV_LINKS } from '../src/data/navLinks.js';

const root = (rel) => fileURLToPath(new URL(`../${rel}`, import.meta.url));

// Every route that exists, derived from src/pages (index.astro = the folder itself).
function routes(dir = 'src/pages', prefix = '') {
  const out = new Set();
  for (const e of readdirSync(root(dir), { withFileTypes: true })) {
    if (e.isDirectory()) routes(`${dir}/${e.name}`, `${prefix}/${e.name}`).forEach((r) => out.add(r));
    else if (e.name.endsWith('.astro')) out.add(e.name === 'index.astro' ? (prefix || '/') : `${prefix}/${e.name.replace('.astro', '')}`);
  }
  return out;
}

test('nav: the original flat header, nine links with no dropdowns', () => {
  assert.deepEqual(NAV_LINKS.map((l) => l.label), [
    'Opportunities', 'Our Impact', 'ProActively Verified™', 'How it works',
    'Assets', 'Team', 'Events', 'Digest', 'Contact us',
  ]);
});

test('nav: every destination resolves', () => {
  const known = routes();
  const home = readFileSync(root('src/components/HomeSections.jsx'), 'utf8') + readFileSync(root('src/components/Hero.jsx'), 'utf8');
  for (const l of NAV_LINKS) {
    assert.ok(Boolean(l.href) !== Boolean(l.id), `${l.label}: exactly one of href or id`);
    if (l.href) assert.ok(known.has(l.href), `${l.label} points at ${l.href}, which is not a page`);
    else assert.ok(home.includes(`id="${l.id}"`), `${l.label} anchor #${l.id} not found on the home page`);
  }
});

test('nav: labels are unique and the bond-specific portal link stays out', () => {
  const labels = NAV_LINKS.map((l) => l.label);
  assert.equal(new Set(labels).size, labels.length, 'duplicate nav label');
  assert.doesNotMatch(readFileSync(root('src/data/navLinks.js'), 'utf8'), /tenthavenue|tier2\./i);
});
