import { SectionHead } from 'proactive-astro';

/** The default: left-aligned, full measure. Opens most interior sections. */
export const Default = () => (
  <SectionHead
    eyebrow="Portfolio"
    title="Where the capital goes"
    sub="Every community we finance, mapped and reported — with the numbers a diligence team would ask for."
  />
);

/** Centred: constrains to 46ch and centres the block. Used to open a page-width section. */
export const Centered = () => (
  <SectionHead
    eyebrow="How it works"
    title="From capital to keys, in four steps"
    sub="Capital is committed, matched to a community, deployed into rehab, and repaid from stabilised rent."
    align="center"
  />
);

/** Title only — no eyebrow, no supporting line. */
export const TitleOnly = () => <SectionHead title="Recent acquisitions" />;

/** Eyebrow and title, no sub — the compact form for a dense page. */
export const NoSub = () => <SectionHead eyebrow="Verification" title="Audited by third parties" />;
