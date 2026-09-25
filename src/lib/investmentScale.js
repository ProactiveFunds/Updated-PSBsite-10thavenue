// Slider scale for the home calculator's investment amount.
//
// The marks are the bond-band boundaries, so the scale is PIECEWISE LINEAR
// between them: every band owns an equal share of the track, and a mark sits
// at exactly its own label. That is what makes the tick labels honest.
//
// This replaced a logarithmic mapping (25 Sep 2026). The log scale put the
// handle at 25.9% for $100K while the evenly spaced "$100K" label sat at 20%,
// so the handle never lined up with its own tick. Reported by Jesse.
//
// Pure functions, no DOM: tests/calculator.test.js pins them.

export const MARKS = [
  { v: 20000, l: '$20K' },
  { v: 100000, l: '$100K' },
  { v: 250000, l: '$250K' },
  { v: 1000000, l: '$1M' },
  { v: 2000000, l: '$2M' },
  { v: 10000000, l: '$10M' },
];

export const MIN = MARKS[0].v;
export const MAX = MARKS[MARKS.length - 1].v;
const SEGS = MARKS.length - 1;

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Slider position (0..1) -> dollar amount, rounded to the nearest $1,000.
export function toAmount(t) {
  const x = clamp(t, 0, 1) * SEGS;
  const i = Math.min(SEGS - 1, Math.floor(x));
  const lo = MARKS[i].v, hi = MARKS[i + 1].v;
  return Math.round((lo + (hi - lo) * (x - i)) / 1000) * 1000;
}

// Dollar amount -> slider position (0..1). Exact at every mark.
export function toPos(amount) {
  const v = clamp(amount, MIN, MAX);
  let i = SEGS - 1;
  for (let k = 0; k < SEGS; k++) {
    if (v <= MARKS[k + 1].v) { i = k; break; }
  }
  const lo = MARKS[i].v, hi = MARKS[i + 1].v;
  return (i + (v - lo) / (hi - lo)) / SEGS;
}

// Where the CENTRE of a native range thumb sits for position `t`, as a CSS
// length. A thumb's centre travels from thumb/2 to (track - thumb/2), never the
// full width, so a label placed at a bare percentage drifts by up to half a
// thumb at the ends. Used for both the tick labels and the track fill.
export function thumbCenter(t, thumb) {
  const pct = clamp(t, 0, 1) * 100;
  return `calc(${thumb / 2}px + ${pct.toFixed(4)}% - ${((pct / 100) * thumb).toFixed(4)}px)`;
}
