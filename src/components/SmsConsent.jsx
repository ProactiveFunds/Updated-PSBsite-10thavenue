import React from 'react';
import { SMS_CONSENT_TEXT } from '../data/smsConsent.js';
// SmsConsent.jsx — the SMS opt-in checkbox shared by the site-built Tenth Avenue
// forms (home, /ira, the recording page). The wording lives in data/smsConsent.js.
// `field_yapu2` is the consent field on the `webform` and `ira` form keys.

export function SmsConsentCheck() {
  return (
    <label className="ta-form__check">
      <input type="checkbox" name="field_yapu2" />
      <span>
        {SMS_CONSENT_TEXT}{' '}
        <a href="https://tenthavenue.io/legal/proactive/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
        {' · '}
        <a href="https://tenthavenue.io/legal/proactive/terms" target="_blank" rel="noreferrer">SMS Terms</a>
      </span>
    </label>
  );
}
