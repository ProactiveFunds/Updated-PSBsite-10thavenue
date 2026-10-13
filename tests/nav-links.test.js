import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { NAV_GROUPS, NAV_TOP, allNavLinks } from '../src/data/navLinks.js';

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

test('nav: four dropdown groups plus Contact us', () => {
  assert.deepEqual(NAV_GROUPS.map((g) => g.label), ['Invest', 'Impact', 'Learn', 'About']);
  assert.deepEqual(NAV_TOP.map((l) => l.label), ['Contact us']);
});

test('nav: every group has items, each with a label and a description', () => {
  for (const g of NAV_GROUPS) {
    assert.ok(g.items.length >= 2, `${g.label} dropdown should hold at least two links`);
    for (const l of g.items) assert.ok(l.label && l.desc, `${g.label} / ${l.label} needs a label and a description`);
  }
});

test('nav: every destination resolves', () => {
  const known = routes();
  const home = readFileSync(root('src/components/HomeSections.jsx'), 'utf8') + readFileSync(root('src/components/Hero.jsx'), 'utf8');
  for (const l of allNavLinks()) {
    assert.ok(Boolean(l.href) !== Boolean(l.id), `${l.label}: exactly one of href or id`);
    if (l.href) assert.ok(known.has(l.href), `${l.label} points at ${l.href}, which is not a page`);
    else assert.ok(home.includes(`id="${l.id}"`), `${l.label} anchor #${l.id} not found on the home page`);
  }
});

test('nav: labels are unique and the bond-specific portal link stays out', () => {
  const labels = allNavLinks().map((l) => l.label);
  assert.equal(new Set(labels).size, labels.length, 'duplicate nav label');
  assert.doesNotMatch(readFileSync(root('src/data/navLinks.js'), 'utf8'), /tenthavenue|tier2\./i);
});
