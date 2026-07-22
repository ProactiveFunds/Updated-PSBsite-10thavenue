import { ThemeToggle } from 'proactive-astro';

const frame = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '16px 20px',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-sm)',
};

/** The control itself — a sun/moon button that flips `data-theme` on `<html>`. */
export const Default = () => (
  <div style={frame}>
    <ThemeToggle />
    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)' }}>Switch appearance</span>
  </div>
);

/** How it sits in a nav bar: trailing the links, ahead of the primary CTA. */
export const InNavBar = () => (
  <div
    style={{
      display: 'flex', alignItems: 'center', gap: 22, padding: '12px 20px',
      borderRadius: 'var(--radius-pill)', background: 'var(--glass-bg-strong)',
      border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
    }}
  >
    <strong style={{ fontSize: 'var(--text-sm)', letterSpacing: '-0.01em' }}>Proactive</strong>
    <span style={{ flex: 1 }} />
    <a href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', textDecoration: 'none' }}>Opportunities</a>
    <a href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', textDecoration: 'none' }}>Team</a>
    <ThemeToggle />
    <button className="btn btn-primary" style={{ fontSize: 'var(--text-sm)' }}>Invest now</button>
  </div>
);
