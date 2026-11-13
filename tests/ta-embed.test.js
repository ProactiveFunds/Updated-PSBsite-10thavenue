// Tenth Avenue form embeds (src/lib/taEmbed.js) and the SMS consent wording on the
// hand-built forms that remain.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { taEmbedBase, taEmbedSrc, taEmbedHeight } from '../src/lib/taEmbed.js';

const BASE = 'https://tenthavenue.io/f/webform?embed=1';
const SITE = 'www.sustainablebonds.com';
const via = (referrer) => new URL(taEmbedSrc('webform', { hostname: SITE, referrer })).searchParams.get('ta_via');

test('the base src is the embed URL Tenth Avenue issues', () => {
  assert.equal(taEmbedBase('webform'), BASE);
  assert.equal(taEmbedSrc('webform', { hostname: SITE }), BASE);
});

test('UTM tags and click IDs are copied into the iframe, capped at 500 chars', () => {
  const src = new URL(taEmbedSrc('webform', {
    hostname: SITE,
    search: `?utm_source=alphamaven&utm_campaign=q4&gclid=${'x'.repeat(600)}&unrelated=1`,
  }));
  assert.equal(src.searchParams.get('embed'), '1');
  assert.equal(src.searchParams.get('utm_source'), 'alphamaven');
  assert.equal(src.searchParams.get('utm_campaign'), 'q4');
  assert.equal(src.searchParams.get('gclid').length, 500);
  assert.equal(src.searchParams.get('unrelated'), null);
});

test('ta_via names another site the visitor came from, and nothing else', () => {
  assert.equal(via('https://www.alphamaven.com/deal/123'), 'alphamaven.com');
  assert.equal(via('https://www.sustainablebonds.com/ira'), null, 'own site');
  assert.equal(via('https://sustainablebonds.com/'), null, 'own site without www');
  assert.equal(via('https://blog.sustainablebonds.com/'), null, 'own subdomain');
  assert.equal(via(''), null, 'no referrer');
  assert.equal(via('not a url'), null);
  assert.equal(via('http://127.0.0.1:8080/'), null, 'bare IP has no letters');
});

test('ta_via still counts shared hosts, where subdomains have different owners', () => {
  const fromWix = new URL(taEmbedSrc('webform', { hostname: 'a.wixsite.com', referrer: 'https://wixsite.com/' }));
  assert.equal(fromWix.searchParams.get('ta_via'), 'wixsite.com');
});

test('taEmbedHeight accepts only sane Tenth Avenue resize messages', () => {
  assert.equal(taEmbedHeight({ type: 'ta-form-height', height: 812.2 }), 813);
  assert.equal(taEmbedHeight({ type: 'ta-form-height', height: '640' }), 640);
  assert.equal(taEmbedHeight({ type: 'ta-form-height', height: 0 }), null);
  assert.equal(taEmbedHeight({ type: 'ta-form-height', height: 25000 }), null);
  assert.equal(taEmbedHeight({ type: 'something-else', height: 500 }), null);
  assert.equal(taEmbedHeight(null), null);
  assert.equal(taEmbedHeight('ta-form-height'), null);
});

const read = (rel) => readFileSync(fileURLToPath(new URL(`../src/components/${rel}`, import.meta.url)), 'utf8');

test('the home intake is the Tenth Avenue webform embed, not a hand-built copy', () => {
  const home = read('HomeSections.jsx');
  assert.match(home, /<TaFormEmbed formKey="webform"/);
  assert.doesNotMatch(home, /api\/forms\/webform\/submit/);
});

test('hand-built forms carry the Nov 2026 SMS consent wording, not the retired one', () => {
  for (const file of ['IraPage.jsx', 'SdiraRecordingPage.jsx']) {
    const text = read(file);
    assert.doesNotMatch(text, /I consent to receive marketing and promotional messages/, file);
    assert.match(text, /a brand of PROACTIVE REALTY INCOME FUND II LLC/, file);
    assert.match(text, /Reply STOP to unsubscribe, HELP for help\. Consent is not a condition of purchase\./, file);
  }
});
