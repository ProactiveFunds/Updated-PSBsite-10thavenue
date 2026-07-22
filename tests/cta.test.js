// Unit tests for src/lib/cta.js (pure-ish util with SSR guards).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { goToCalculator } from '../src/lib/cta.js';

test('goToCalculator is a function', () => {
  assert.equal(typeof goToCalculator, 'function');
});

test('goToCalculator calls preventDefault and returns safely when there is no DOM (SSR guard)', () => {
  // In Node there is no `document`, so the function should hit its SSR guard and return
  // without throwing, after honoring the event's preventDefault.
  let prevented = 0;
  const fakeEvent = { preventDefault: () => { prevented += 1; } };
  const result = goToCalculator(fakeEvent);
  assert.equal(prevented, 1, 'preventDefault should be called exactly once');
  assert.equal(result, undefined, 'should return undefined');
});

test('goToCalculator does not throw when called with no argument', () => {
  assert.doesNotThrow(() => goToCalculator());
});
