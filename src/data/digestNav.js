// Left-nav structure for the Sustainable Bonds Digest.
// Groups → items. `slug` matches the page under /digest/<slug>.
export const DIGEST_GROUPS = [
  {
    label: 'About NOAH',
    items: [
      { slug: 'why-mobile-home-communities', title: 'Why Mobile Home Communities?', read: '6 min' },
      { slug: 'housing-crisis', title: 'Addressing the Housing Crisis', read: '7 min' },
      { slug: 'sustainability', title: 'Sustainability', read: '5 min' },
    ],
  },
  {
    label: 'How We Invest',
    items: [
      { slug: 'our-process', title: 'Our Process', read: '8 min' },
      { slug: 'property-management', title: 'Property Management', read: '5 min' },
      { slug: 'credibility-white-paper', title: 'Credibility White Paper', read: '11 min' },
      { slug: 'partnerships', title: 'Partnerships', read: '4 min' },
    ],
  },
  {
    label: 'For Investors',
    items: [
      { slug: 'self-directed-iras', title: 'Self-Directed IRAs', read: '6 min' },
      { slug: 'faq', title: 'Frequently Asked Questions', read: '9 min' },
      { slug: 'video-library', title: 'Video Library', read: '—' },
      { slug: 'disclosure-terms', title: 'Disclosure & Terms', read: '5 min' },
    ],
  },
  {
    label: 'The Digest',
    items: [
      { slug: 'blog', title: 'Articles & Letters', read: '27 pieces' },
    ],
  },
];

// Flat lookup helper.
export const DIGEST_ITEMS = DIGEST_GROUPS.flatMap((g) => g.items);
