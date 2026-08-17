// Unit tests for the data layer (src/data/*). Node built-in runner: `npm test`.
// These guard against data regressions: missing fields, broken image paths,
// duplicate slugs/ids, and enum drift. Cheap to run, high signal.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { team } from '../src/data/team.js';
import { assets, SDG_LABELS, PORTFOLIO_SDGS, FUNDS, STATUSES } from '../src/data/assets.js';
import { posts } from '../src/data/blogPosts.js';
import { pages } from '../src/data/digestPages.js';
import { DIGEST_GROUPS, DIGEST_ITEMS } from '../src/data/digestNav.js';

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const dupes = (arr) => arr.filter((v, i) => arr.indexOf(v) !== i);

test('team: non-empty array of well-formed members', () => {
  assert.ok(Array.isArray(team) && team.length > 0, 'team should be a non-empty array');
  for (const m of team) {
    assert.ok(isNonEmptyString(m.name), `member missing name: ${JSON.stringify(m).slice(0, 60)}`);
    assert.ok(isNonEmptyString(m.role), `member ${m.name} missing role`);
    assert.ok(isNonEmptyString(m.bio), `member ${m.name} missing bio`);
    assert.ok(isNonEmptyString(m.image), `member ${m.name} missing image`);
    assert.match(m.image, /^\/img\/team\/.+\.webp$/, `member ${m.name} image path off: ${m.image}`);
    if (m.email != null) assert.ok(m.email.includes('@'), `member ${m.name} email looks invalid`);
    if (m.linkedin != null) assert.match(m.linkedin, /^https?:\/\//, `member ${m.name} linkedin not a url`);
  }
});

test('team: names are unique', () => {
  const names = team.map((m) => m.name);
  assert.deepEqual(dupes(names), [], `duplicate team names: ${dupes(names).join(', ')}`);
});

test('team: Alicia Galloway present with the updated cutout headshot', () => {
  const alicia = team.find((m) => /alicia/i.test(m.name));
  assert.ok(alicia, 'Alicia should be on the team');
  assert.equal(alicia.image, '/img/team/alicia.webp', 'Alicia headshot path regressed');
});

test('assets: records well-formed and enums consistent', () => {
  assert.ok(Array.isArray(assets) && assets.length > 0, 'assets should be a non-empty array');
  assert.ok(Array.isArray(FUNDS) && FUNDS.length === 3, 'expected 3 FUNDS');
  assert.ok(Array.isArray(STATUSES) && STATUSES.length > 0, 'STATUSES should be non-empty');
  assert.ok(SDG_LABELS && typeof SDG_LABELS === 'object' && Object.keys(SDG_LABELS).length > 0, 'SDG_LABELS should be a non-empty object');
  for (const a of assets) {
    assert.ok(isNonEmptyString(a.id), 'asset missing id');
    assert.ok(isNonEmptyString(a.name), `asset ${a.id} missing name`);
    assert.ok(isNonEmptyString(a.state), `asset ${a.name} missing state`);
    assert.ok(Number.isFinite(a.units) && a.units >= 0, `asset ${a.name} units not a non-negative number`);
    assert.ok(STATUSES.includes(a.status), `asset ${a.name} has status "${a.status}" not in STATUSES`);
    assert.ok(isNonEmptyString(a.fund), `asset ${a.name} missing fund`);
  }
});

test('assets: ids are unique', () => {
  const ids = assets.map((a) => a.id);
  assert.deepEqual(dupes(ids), [], `duplicate asset ids: ${dupes(ids).join(', ')}`);
});

// The figures below are the canonical set quoted on /, /process, /q3-special
// and /ira. They come from "Proactive Realty Group - Property Information.xlsx".
// If this test fails after a data refresh, the marketing copy needs updating too
// — see SUMMARY.md "Canonical numbers currently shown".
test('assets: portfolio totals match the canonical numbers quoted site-wide', () => {
  const sum = (f) => assets.reduce((s, a) => s + (a[f] || 0), 0);
  assert.equal(assets.length, 22, 'asset count drifted from the 22 quoted site-wide');
  assert.equal(assets.filter((a) => a.status === 'Acquired').length, 17, 'owned-asset count drifted');
  assert.equal(assets.filter((a) => a.status === 'Under Contract').length, 5, 'under-contract count drifted');
  assert.equal(sum('units'), 842, 'total units drifted from the 842 quoted site-wide');
  assert.equal(sum('occupiedUnits'), 227, 'occupied units drifted');
  assert.equal(sum('estimatedValue'), 65377060, 'estimated value drifted from the $65M quoted site-wide');
  assert.equal(new Set(assets.map((a) => a.state)).size, 8, 'state count drifted from the 8 quoted site-wide');
  assert.equal(Math.round((sum('occupiedUnits') / sum('units')) * 100), 27, 'portfolio occupancy drifted');
});

// 906 West Main is on the workbook's owned tab as "(for sale)" and is
// deliberately excluded — see HELD_SKIP in scripts/generate-assets.py.
test('assets: the property being marketed for sale is not published', () => {
  assert.ok(!assets.some((a) => /906|west main/i.test(a.name)), '906 West Main is back on the site');
});

test('assets: per-asset occupancy is internally consistent', () => {
  for (const a of assets) {
    assert.ok(a.occupiedUnits <= a.units, `${a.name}: ${a.occupiedUnits} occupied > ${a.units} units`);
    assert.equal(a.occupancyRate, Math.round((a.occupiedUnits / a.units) * 100),
      `${a.name}: occupancyRate ${a.occupancyRate}% does not match ${a.occupiedUnits}/${a.units}`);
    assert.ok(Number.isFinite(a.estimatedValue) && a.estimatedValue > 0, `${a.name} missing estimatedValue`);
    assert.ok(Number.isFinite(a.purchasePrice) && a.purchasePrice > 0, `${a.name} missing purchasePrice`);
    assert.ok(isNonEmptyString(a.county), `${a.name} missing county`);
  }
});

test('assets: under-contract deals are not dated as acquired', () => {
  for (const a of assets.filter((x) => x.status === 'Under Contract')) {
    assert.equal(a.purchaseDate, null, `${a.name} is under contract but carries a purchaseDate`);
    assert.equal(a.yearAcquired, null, `${a.name} is under contract but carries a yearAcquired`);
  }
});

// Dr. Van asked (17 Aug 2026) for one address house style across every listing:
//   "<number> <directional> <street> <Type>, <City>, <ST>"
// e.g. "921 N Las Vegas Blvd, Las Vegas, NV". Set in the generator's ADDRESS
// table, because the workbook's own strings are inconsistent.
// Three rows the workbook cannot yet express in that style — raised with the
// client 17 Aug 2026. Drop an id from here once the real address arrives.
const ADDRESS_GAPS = new Set([
  'umh-citrus-circle-sc',        // no house number ("Citrus Circle")
  '526-518-520-522-stilton-sc',  // no street type ("518–526 Stilton")
  '926-moseley-sc',              // no street type ("926 Moseley")
]);

test('assets: every address follows the one house style', () => {
  const STREET_TYPE = /(?:St|Ave|Rd|Dr|Blvd|Ct|Ln|Way|Cir|Circle|Pl|Ter|Pkwy)$|(?:Highway|Hwy)\s+\d+$/;
  for (const a of assets) {
    assert.ok(isNonEmptyString(a.address), `${a.name} missing address`);
    assert.ok(a.address.endsWith(`, ${a.city}, ${a.state}`),
      `${a.address} should end ", ${a.city}, ${a.state}"`);
    const street = a.address.slice(0, -`, ${a.city}, ${a.state}`.length);
    assert.ok(!/\.$|\w\./.test(street), `${a.address}: abbreviations take no period`);
    assert.ok(!/ & | and /i.test(street), `${a.address}: use an en-dash range, not "&"`);
    assert.ok(!/\b(Street|Avenue|Road|Drive|Boulevard|Court)\b/.test(street),
      `${a.address}: spell street types short (St, Ave, Rd, Dr, Blvd, Ct)`);
    // Unit suffixes are the one permitted extra comma.
    const head = street.split(', Unit ')[0];
    assert.ok(!head.includes(','), `${a.address}: street line should not be a comma list`);
    if (!ADDRESS_GAPS.has(a.id)) {
      assert.match(head, /^\d/, `${a.address}: should start with a house number`);
      assert.ok(STREET_TYPE.test(head), `${a.address}: unexpected street type`);
    }
  }
});

// Guards the reverse direction: if a real address lands for one of the three
// gaps, this fails and reminds us to take it off the list.
test('assets: the address gaps raised with the client are still open', () => {
  for (const id of ADDRESS_GAPS) {
    assert.ok(assets.some((a) => a.id === id), `${id} is gone — drop it from ADDRESS_GAPS`);
  }
});

test('assets: the 921 N Las Vegas Blvd correction survives regeneration', () => {
  const a = assets.find((x) => x.id === '921-las-vegas-blvd-nv');
  assert.ok(a, '921 Las Vegas Blvd went missing');
  assert.equal(a.address, '921 N Las Vegas Blvd, Las Vegas, NV',
    'the workbook still says "921 Las Vegas Blvd" — the ADDRESS override was lost');
});

test('assets: SDG alignment is stated once for the portfolio', () => {
  assert.deepEqual(PORTFOLIO_SDGS, [1, 3, 5, 6, 7, 10, 11], 'portfolio SDG set changed');
  for (const n of PORTFOLIO_SDGS) {
    assert.ok(isNonEmptyString(SDG_LABELS[n]), `SDG ${n} has no label to render`);
  }
});

// A previous import left OpenAI-style citation markers (【…†…】) in two impact
// theses; they rendered verbatim on /assets. Guard against that coming back.
test('assets: prose carries no citation artefacts', () => {
  for (const a of assets) {
    for (const field of ['investmentThesis', 'impactThesis']) {
      assert.ok(!/[【】]/.test(a[field] || ''), `${a.name} ${field} contains a citation artefact`);
    }
  }
});

test('blogPosts: non-empty, slug+title present, slugs unique', () => {
  assert.ok(Array.isArray(posts) && posts.length > 0, 'posts should be a non-empty array');
  for (const p of posts) {
    assert.ok(isNonEmptyString(p.slug), 'post missing slug');
    assert.ok(isNonEmptyString(p.title), `post ${p.slug} missing title`);
  }
  const slugs = posts.map((p) => p.slug);
  assert.deepEqual(dupes(slugs), [], `duplicate post slugs: ${dupes(slugs).join(', ')}`);
});

test('digestPages: non-empty, slug+title present, slugs unique', () => {
  assert.ok(Array.isArray(pages) && pages.length > 0, 'pages should be a non-empty array');
  for (const pg of pages) {
    assert.ok(isNonEmptyString(pg.slug), 'digest page missing slug');
    assert.ok(isNonEmptyString(pg.title), `digest page ${pg.slug} missing title`);
  }
  const slugs = pages.map((pg) => pg.slug);
  assert.deepEqual(dupes(slugs), [], `duplicate digest page slugs: ${dupes(slugs).join(', ')}`);
});

test('digestNav: groups have items; DIGEST_ITEMS flattened, slugs unique', () => {
  assert.ok(Array.isArray(DIGEST_GROUPS) && DIGEST_GROUPS.length > 0, 'DIGEST_GROUPS should be non-empty');
  for (const g of DIGEST_GROUPS) {
    assert.ok(isNonEmptyString(g.label), 'digest group missing label');
    assert.ok(Array.isArray(g.items) && g.items.length > 0, `digest group ${g.label} has no items`);
  }
  const flattened = DIGEST_GROUPS.flatMap((g) => g.items).length;
  assert.equal(DIGEST_ITEMS.length, flattened, 'DIGEST_ITEMS should equal the flattened group items');
  for (const it of DIGEST_ITEMS) {
    assert.ok(isNonEmptyString(it.slug), 'digest item missing slug');
    assert.ok(isNonEmptyString(it.title), `digest item ${it.slug} missing title`);
  }
  const slugs = DIGEST_ITEMS.map((it) => it.slug);
  assert.deepEqual(dupes(slugs), [], `duplicate digest item slugs: ${dupes(slugs).join(', ')}`);
});
