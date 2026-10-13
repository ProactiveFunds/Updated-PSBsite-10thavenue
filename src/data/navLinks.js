// Header navigation. Kept as data (not inline in MktChrome.jsx) so
// tests/nav-links.test.js can assert every destination resolves.
//
// `href` = a separate page. `id` = an on-page section anchor on the home page;
// off the home page it falls back to /#id. Never put the bond-specific Tenth
// Avenue portal link here: the nav renders on every page (see rules.md section 6).
export const NAV_GROUPS = [
  { label: 'Invest',
    // Shown as a card beside the links when the dropdown opens.
    feature: { eyebrow: 'Current offering', title: 'Q3 Special', desc: 'Our limited-window bond for accredited investors.', cta: 'View the offering', href: '/q3-special' },
    items: [
    { label: 'Compare opportunities', icon: 'bar-chart', desc: 'The bond options side by side.', id: 'opportunities' },
    { label: 'Q3 Special offering', icon: 'trending-up', desc: 'Our current limited-window bond.', href: '/q3-special' },
    { label: 'How it works', icon: 'layers', desc: 'From your investment to the homes it funds.', href: '/OurProcess' },
    { label: 'Self-Directed IRA', icon: 'wallet', desc: 'Invest with retirement funds.', href: '/ira' },
    { label: 'Accreditation', icon: 'check-circle', desc: 'Check whether you qualify to invest.', href: '/accreditation' },
  ] },
  { label: 'Impact', items: [
    { label: 'Our impact', icon: 'sprout', desc: 'Homes funded and residents housed.', id: 'impact' },
    { label: 'ProActively Verified™', icon: 'shield-check', desc: 'Third-party verification of our results.', href: '/verified' },
  ] },
  { label: 'Learn', items: [
    { label: 'Digest', icon: 'file-text', desc: 'Articles and explainers on our model.', href: '/digest' },
    { label: 'Events', icon: 'calendar', desc: 'Webinars and recordings.', href: '/events' },
  ] },
  { label: 'About', items: [
    { label: 'Team', icon: 'users', desc: 'The people behind Proactive.', href: '/team' },
    { label: 'Our assets', icon: 'building', desc: 'Every community we hold.', href: '/assets' },
  ] },
];

// Top-level links that sit beside the dropdowns.
export const NAV_TOP = [
  { label: 'Contact us', id: 'get-started' },
];

export const allNavLinks = () => [...NAV_GROUPS.flatMap((g) => g.items), ...NAV_TOP];
