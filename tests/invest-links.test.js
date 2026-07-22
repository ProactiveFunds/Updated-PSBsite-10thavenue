// Guards the invest-CTA routing invariant.
//
// The Q3 2026 Impact Bridge offering has its own Tenth Avenue portal link. It is
// bond-specific, so it must appear ONLY on /q3-special — never in shared chrome
// (nav/footer, which render on every page) and never on the evergreen invest
// pages, which keep funnelling through the calculator / tier2.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const src = (rel) => readFileSync(fileURLToPath(new URL(`../src/${rel}`, import.meta.url)), 'utf8');

const Q3_PORTAL = 'https://portal.tenthavenue.io/start/8ed1cd5979977726126230c2e3cdd7004c8c3a0f';
const TIER2 = 'https://tier2.sustainablebonds.com';

test('q3-special: every "Start investing" CTA points at the bond-specific portal', () => {
  const code = src('components/Q3SpecialPage.jsx');
  assert.ok(code.includes(Q3_PORTAL), 'Q3 portal URL should be defined on the Q3 page');

  const ctas = code.match(/href=\{[A-Z_0-9]+\}>Start investing/g) || [];
  assert.equal(ctas.length, 3, 'expected 3 "Start investing" CTAs (hero, offering, final)');

  // All three must resolve through the one constant holding the portal URL.
  const constName = code.match(/const\s+([A-Z_0-9]+)\s*=\s*'https:\/\/portal\.tenthavenue\.io/)?.[1];
  assert.ok(constName, 'portal URL should live in a named constant');
  for (const cta of ctas) {
    assert.equal(cta, `href={${constName}}>Start investing`, 'CTA should use the portal constant');
  }
});

test('q3-special: no longer routes to the generic tier2 destination', () => {
  const hrefs = src('components/Q3SpecialPage.jsx').match(/href=\{?'?https:\/\/tier2\./g) || [];
  assert.deepEqual(hrefs, [], 'Q3 page should not link to tier2');
});

test('nav/footer chrome never carries the bond-specific portal link', () => {
  // MktChrome renders on every page, so a bond-specific link here would leak the
  // Q3 offering onto unrelated pages.
  assert.ok(!src('components/MktChrome.jsx').includes('portal.tenthavenue.io'));
});

test('evergreen invest pages keep their generic destination', () => {
  for (const file of ['components/ProcessPage.jsx', 'components/AccreditationPage.jsx', 'components/HomeCalculator.jsx']) {
    const code = src(file);
    assert.ok(code.includes(TIER2), `${file} should still route to tier2`);
    assert.ok(!code.includes('portal.tenthavenue.io'), `${file} must not use the Q3-only portal link`);
  }
});
