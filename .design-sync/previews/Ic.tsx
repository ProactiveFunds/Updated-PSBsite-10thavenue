import { Ic } from 'proactive-astro';

const NAMES = [
  'sprout', 'leaf', 'home', 'building', 'map-pin', 'users',
  'trending-up', 'pie-chart', 'bar-chart', 'dollar', 'wallet', 'layers',
  'shield-check', 'check', 'check-circle', 'lock', 'file-text', 'eye',
  'arrow-right', 'arrow-up-right', 'arrow-up', 'arrow-down', 'chevron-right', 'chevron-down',
  'calendar', 'clock', 'mail', 'bell', 'search', 'filter',
  'sun', 'moon', 'menu', 'x', 'plus', 'settings',
  'download', 'external-link', 'play', 'youtube', 'linkedin', 'more',
  'chevron-left', 'logout',
] as const;

const cell = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: 8,
  padding: '14px 6px',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
};
const label = {
  fontSize: 10,
  fontFamily: 'var(--font-mono)',
  color: 'var(--fg-3)',
  letterSpacing: '0.02em',
};

/** Every glyph in the set, at the default 20px / 1.75 stroke. */
export const AllIcons = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, color: 'var(--fg-1)' }}>
    {NAMES.map((n) => (
      <div key={n} style={cell}>
        <Ic name={n} />
        <span style={label}>{n}</span>
      </div>
    ))}
  </div>
);

/** The size ramp used across the site: inline, control, bullet, feature. */
export const Sizes = () => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, color: 'var(--brand)' }}>
    {[13, 15, 20, 28, 40].map((s) => (
      <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <Ic name="shield-check" size={s} />
        <span style={label}>{s}px</span>
      </div>
    ))}
  </div>
);

/** Icons inherit `currentColor`, so they take the tone of the text around them. */
export const InheritsColor = () => (
  <div style={{ display: 'flex', gap: 26, alignItems: 'center', flexWrap: 'wrap' }}>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--fg-1)' }}>
      <Ic name="home" size={18} /> Default
    </span>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--brand)' }}>
      <Ic name="sprout" size={18} /> Brand
    </span>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--accent-press)' }}>
      <Ic name="leaf" size={18} /> Accent
    </span>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--fg-3)' }}>
      <Ic name="clock" size={18} /> Muted
    </span>
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--fg-on-forest)',
        background: 'var(--forest-700)', padding: '8px 14px', borderRadius: 'var(--radius-pill)',
      }}
    >
      <Ic name="check-circle" size={18} /> On forest
    </span>
  </div>
);

/** Stroke weight: 1.75 is the house default; go heavier only for small glyphs on busy ground. */
export const StrokeWeights = () => (
  <div style={{ display: 'flex', gap: 34, alignItems: 'center', color: 'var(--fg-1)' }}>
    {[1.25, 1.75, 2.4].map((w) => (
      <div key={w} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <Ic name="pie-chart" size={34} stroke={w} />
        <span style={label}>{w}</span>
      </div>
    ))}
  </div>
);
