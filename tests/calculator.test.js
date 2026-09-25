// The home calculator's slider scale. The bug this guards against: the marks
// are the bond-band boundaries and the labels are drawn at each mark's own
// position, so if toPos() stops landing exactly on a mark the label and the
// handle drift apart. That is what Jesse reported on 25 Sep 2026 (a log scale
// put $100K at 25.9% while its label sat at 20%).
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { MARKS, MIN, MAX, toAmount, toPos, thumbCenter } from '../src/lib/investmentScale.js';

test('scale: every mark sits at an exact, evenly spaced position', () => {
  const segs = MARKS.length - 1;
  MARKS.forEach((m, i) => {
    assert.equal(toPos(m.v), i / segs, `${m.l} should sit at ${i}/${segs} of the track`);
  });
});

test('scale: a mark position round-trips back to the mark amount', () => {
  for (const m of MARKS) {
    assert.equal(toAmount(toPos(m.v)), m.v, `${m.l} does not round-trip`);
  }
});

test('scale: ends are clamped to the offering range', () => {
  assert.equal(toAmount(0), MIN);
  assert.equal(toAmount(1), MAX);
  assert.equal(toPos(MIN), 0);
  assert.equal(toPos(MAX), 1);
  assert.equal(toPos(1), 0, 'below the minimum clamps to the left end');
  assert.equal(toPos(99e6), 1, 'above the maximum clamps to the right end');
});

test('scale: position increases monotonically with amount', () => {
  let prev = -1;
  for (let a = MIN; a <= MAX; a += 7919) {   // prime step, so marks are not special-cased
    const p = toPos(a);
    assert.ok(p >= prev, `position went backwards at ${a}`);
    assert.ok(p >= 0 && p <= 1, `position out of range at ${a}`);
    prev = p;
  }
});

test('scale: amount increases monotonically with position', () => {
  let prev = -1;
  for (let i = 0; i <= 1000; i++) {
    const a = toAmount(i / 1000);
    assert.ok(a >= prev, `amount went backwards at step ${i}`);
    assert.ok(a >= MIN && a <= MAX, `amount out of range at step ${i}: ${a}`);
    prev = a;
  }
});

// Each segment is one bond band, so the band badge must flip exactly as the
// handle crosses a labelled tick, never a pixel before or after.
test('scale: each band boundary is its own mark', () => {
  const boundaries = [20000, 100000, 250000, 1000000, 2000000, 10000000];
  assert.deepEqual(MARKS.map((m) => m.v), boundaries);
});

test('thumbCenter: compensates for the thumb never reaching the track ends', () => {
  assert.equal(thumbCenter(0, 18), 'calc(9px + 0.0000% - 0.0000px)');
  assert.equal(thumbCenter(1, 18), 'calc(9px + 100.0000% - 18.0000px)');
  assert.equal(thumbCenter(0.5, 18), 'calc(9px + 50.0000% - 9.0000px)');
});
