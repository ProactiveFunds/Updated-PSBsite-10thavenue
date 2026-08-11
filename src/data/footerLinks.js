// Footer navigation. Kept as data (not inline in MktChrome.jsx) so
// tests/footer-links.test.js can assert every destination actually resolves —
// these shipped as dead `#` placeholders for months before anyone noticed.
//
// The footer renders on every page, so on-page anchors are written absolute
// (`/#id`) and navigate home rather than hunting for a section that isn't there.

export const FOOTER_COLS = [
  ['Invest', [
    ['Opportunities', '/#opportunities'],
    ['Proactive QOZ Fund', '/#opportunities'],
    ['SDIRA', '/ira'],
  ]],
  ['Company', [
    ['Our mission & team', '/team'],
    ['The housing crisis', '/digest/housing-crisis'],
    ['Partnerships', '/digest/partnerships'],
  ]],
  ['Learn', [
    ['Insights', '/digest/blog'],
    ['Investor testimonials', '/#testimonials'],
    ['FAQ', '/digest/faq'],
    ['Video library', '/digest/video-library'],
  ]],
];

// The privacy policy lives with Tenth Avenue (the forms platform). Terms and
// disclosures are both covered by the Digest disclosure page.
export const FOOTER_LEGAL = [
  ['Privacy', 'https://tenthavenue.io/legal/proactive/privacy'],
  ['Terms', '/digest/disclosure-terms'],
  ['Disclosures', '/digest/disclosure-terms'],
];

/** Every footer destination, flattened — used by the tests. */
export function allFooterLinks() {
  return [...FOOTER_COLS.flatMap(([, items]) => items), ...FOOTER_LEGAL];
}
