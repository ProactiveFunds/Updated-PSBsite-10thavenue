// The site-built Tenth Avenue forms: field names must match the form in Tenth
// Avenue, and every form that asks for SMS consent must use the shared wording.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SMS_CONSENT_TEXT } from '../src/data/smsConsent.js';

const read = (rel) => readFileSync(fileURLToPath(new URL(`../src/components/${rel}`, import.meta.url)), 'utf8');

test('SMS consent wording carries the required carrier disclosures', () => {
  for (const phrase of [
    'Proactive Sustainable Bonds, a brand of PROACTIVE REALTY INCOME FUND II LLC',
    'Message frequency varies.',
    'Msg & data rates may apply.',
    'Reply STOP to unsubscribe, HELP for help.',
    'Consent is not a condition of purchase.',
    'No mobile information will be shared with third parties or affiliates for marketing purposes.',
  ]) assert.ok(SMS_CONSENT_TEXT.includes(phrase), phrase);
});

test('home, /ira and the recording page use the shared consent checkbox, not their own copy', () => {
  for (const file of ['HomeSections.jsx', 'IraPage.jsx', 'SdiraRecordingPage.jsx']) {
    const text = read(file);
    assert.match(text, /<SmsConsentCheck \/>/, file);
    assert.doesNotMatch(text, /name="field_yapu2"/, `${file} has its own consent checkbox`);
    assert.doesNotMatch(text, /I consent to receive marketing and promotional messages/, file);
  }
});

test('the home form posts the same fields and options as the Tenth Avenue webform', () => {
  const home = read('HomeSections.jsx');
  assert.match(home, /action="https:\/\/tenthavenue\.io\/api\/forms\/webform\/submit"/);
  for (const name of ['_hp', 'first_name', 'last_name', 'email', 'phone', 'message', 'field_9zklv']) {
    assert.match(home, new RegExp(`name="${name}"`), name);
  }
  // Accredited status: values must be the ones Tenth Avenue stores, and no answer is pre-selected.
  for (const value of ['Yes', 'No', 'Not sure']) assert.match(home, new RegExp(`<option value="${value}">`), value);
  assert.match(home, /name="field_9zklv" required defaultValue=""/);
});
