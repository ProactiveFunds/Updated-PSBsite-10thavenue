import { InvestModal } from 'proactive-astro';

// The modal is a controlled overlay: it renders nothing when `open` is false,
// so the card has to hold it open. A relative, sized host keeps the fixed
// backdrop inside the preview cell instead of escaping across the page.
const host = {
  position: 'relative' as const,
  height: 560,
  borderRadius: 'var(--radius-xl)',
  overflow: 'hidden',
  border: '1px solid var(--border)',
  background: 'var(--bg)',
};

/** The dialog in its open state — glass panel over a dimmed backdrop. */
export const Open = () => (
  <div style={host}>
    <InvestModal open onClose={() => {}} />
  </div>
);
