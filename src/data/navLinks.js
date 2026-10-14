// Header navigation. Kept as data (not inline in MktChrome.jsx) so
// tests/nav-links.test.js can assert every destination resolves.
//
// `href` = a separate page. `id` = an on-page section anchor on the home page
// (HomeSections.jsx / Hero.jsx); off the home page it falls back to /#id. Never
// put the bond-specific Tenth Avenue portal link here: the nav renders on every
// page (see rules.md section 6).
export const NAV_LINKS = [
  { label: 'Opportunities', id: 'opportunities' },
  { label: 'Our Impact', id: 'impact' },
  { label: 'ProActively Verified™', href: '/verified' },
  { label: 'How it works', href: '/OurProcess' },
  { label: 'Assets', href: '/assets' },
  { label: 'Team', href: '/team' },
  { label: 'Events', href: '/events' },
  { label: 'Digest', href: '/digest' },
  { label: 'Contact us', id: 'get-started' },
];
