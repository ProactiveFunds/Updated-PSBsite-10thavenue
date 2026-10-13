// Header navigation. Kept as data (not inline in MktChrome.jsx) so
// tests/nav-links.test.js can assert every destination resolves.
//
// `href` = a separate page. `id` = an on-page section anchor on the home page;
// off the home page it falls back to /#id. Never put the bond-specific Tenth
// Avenue portal link here: the nav renders on every page (see rules.md section 6).
export const NAV_GROUPS = [
  { label: 'Invest', items: [
    { label: 'Compare opportunities', desc: 'The bond options side by side.', id: 'opportunities' },
    { label: 'Q3 Special offering', desc: 'Our current limited-window bond.', href: '/q3-special' },
    { label: 'How it works', desc: 'From your investment to the homes it funds.', href: '/OurProcess' },
    { label: 'Self-Directed IRA', desc: 'Invest with retirement funds.', href: '/ira' },
    { label: 'Accreditation', desc: 'Check whether you qualify to invest.', href: '/accreditation' },
  ] },
  { label: 'Impact', items: [
    { label: 'Our impact', desc: 'Homes funded and residents housed.', id: 'impact' },
    { label: 'ProActively Verified™', desc: 'Third-party verification of our results.', href: '/verified' },
  ] },
  { label: 'Learn', items: [
    { label: 'Digest', desc: 'Articles and explainers on our model.', href: '/digest' },
    { label: 'Events', desc: 'Webinars and recordings.', href: '/events' },
  ] },
  { label: 'About', items: [
    { label: 'Team', desc: 'The people behind Proactive.', href: '/team' },
    { label: 'Our assets', desc: 'Every community we hold.', href: '/assets' },
  ] },
];

// Top-level links that sit beside the dropdowns.
export const NAV_TOP = [
  { label: 'Contact us', id: 'get-started' },
];

export const allNavLinks = () => [...NAV_GROUPS.flatMap((g) => g.items), ...NAV_TOP];
