import { HomeSectionHead } from 'proactive-astro';

/** The house marketing treatment: centred, editorial serif title in forest. */
export const Serif = () => (
  <HomeSectionHead
    eyebrow="Why investors choose us"
    title="Investment return comparison"
    sub="Yields are similar across our vehicles. What changes is the entry point, term, and access."
    serif
  />
);

/** Without `serif`: the UI sans at weight 700 in the primary text colour. */
export const Sans = () => (
  <HomeSectionHead
    eyebrow="Investment opportunities"
    title="Compare the opportunities"
    sub="Open any row for the full terms, minimums and access."
  />
);

/** Left-aligned — drops the 46rem clamp and the auto margins. */
export const LeftAligned = () => (
  <HomeSectionHead
    eyebrow="The Proactive difference"
    title="See the impact your investments make"
    sub="Every community we acquire is transformed into safe, attainable housing — and a performing asset."
    align="left"
    serif
  />
);

/** Title only, serif — the lightest form. */
export const TitleOnly = () => <HomeSectionHead title="Thinking on housing & yield" serif />;
