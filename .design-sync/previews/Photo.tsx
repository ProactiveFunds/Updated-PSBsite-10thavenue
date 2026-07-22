import { Photo } from 'proactive-astro';

/** Captioned frame with a label and sublabel — the standard property treatment. */
export const Captioned = () => (
  <div style={{ maxWidth: 460 }}>
    <Photo label="Cedar Grove Community" sublabel="Austin, TX · 24 units · delivered 2025" h={300} />
  </div>
);

/** Without `src` it renders a tinted duotone placeholder at the same dimensions — which is what makes it safe to lay a page out before the photography exists. */
export const Placeholder = () => (
  <div style={{ maxWidth: 460 }}>
    <Photo label="Photography to come" h={240} />
  </div>
);

/** Label only, no sublabel. */
export const LabelOnly = () => (
  <div style={{ maxWidth: 460 }}>
    <Photo label="Willowbrook Commons" h={240} />
  </div>
);

/** In a grid: uniform heights, tighter corner radius for dense layouts. */
export const InAGrid = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
    <Photo label="Magnolia Trace" sublabel="Savannah, GA" h={190} radius="var(--radius-lg)" />
    <Photo label="Riverbend" sublabel="Denmark, SC" h={190} radius="var(--radius-lg)" />
    <Photo label="Oakhurst" sublabel="Columbus, OH" h={190} radius="var(--radius-lg)" />
  </div>
);
