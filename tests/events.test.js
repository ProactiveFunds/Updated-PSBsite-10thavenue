// Unit tests for src/data/events.js — the shared event layer behind /events and
// each event landing page. Guards the data invariants and the date/time helpers,
// which are the parts that quietly break (wrong weekday, wrong offset, dead link).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  events, getEvent, upcomingEvents, pastEvents, recordedEvents, getEventByRecordingSlug,
  formatEventDate, formatEventTime, formatRuntime, daysUntil, calendarUrl,
} from '../src/data/events.js';

test('every event carries the fields both pages render', () => {
  assert.ok(events.length > 0, 'there should be at least one event');
  for (const e of events) {
    for (const key of ['slug', 'href', 'kind', 'title', 'subtitle', 'summary',
      'startsAt', 'endsAt', 'location', 'cost', 'topics', 'speaker']) {
      assert.ok(e[key], `${e.slug}: missing ${key}`);
    }
    assert.ok(Array.isArray(e.topics) && e.topics.length, `${e.slug}: needs topics`);
    for (const key of ['name', 'title', 'org', 'image', 'linkedin']) {
      assert.ok(e.speaker[key], `${e.slug}: speaker missing ${key}`);
    }
  }
});

test('slugs are unique and href matches the slug', () => {
  const slugs = events.map((e) => e.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'slugs must be unique');
  for (const e of events) {
    assert.equal(e.href, `/events/${e.slug}`, `${e.slug}: href should follow the slug`);
  }
});

test('dates parse, end after start, and duration matches the window', () => {
  for (const e of events) {
    const start = new Date(e.startsAt);
    const end = new Date(e.endsAt);
    assert.ok(!Number.isNaN(start.getTime()), `${e.slug}: startsAt must parse`);
    assert.ok(!Number.isNaN(end.getTime()), `${e.slug}: endsAt must parse`);
    assert.ok(end > start, `${e.slug}: endsAt must be after startsAt`);
    assert.equal((end - start) / 60000, e.durationMins, `${e.slug}: durationMins must match the window`);
    assert.match(e.startsAt, /[+-]\d{2}:\d{2}$/, `${e.slug}: startsAt needs an explicit UTC offset`);
  }
});

test('the SDIRA webinar really is Tuesday 18 August 2026 at 6:30 PM Eastern', () => {
  const e = getEvent('self-directed-ira');
  assert.ok(e, 'the self-directed-ira event should exist');
  assert.equal(formatEventDate(e), 'Tuesday, August 18, 2026');
  assert.equal(formatEventTime(e), '6:30 PM ET');
  assert.equal(e.durationMins, 60);
});

test('getEvent returns null for an unknown slug', () => {
  assert.equal(getEvent('does-not-exist'), null);
});

test('upcoming and past partition the list around a given moment', () => {
  const e = getEvent('self-directed-ira');
  const before = new Date('2026-08-01T00:00:00Z');
  const after = new Date('2026-09-01T00:00:00Z');

  assert.ok(upcomingEvents(before).some((x) => x.slug === e.slug), 'should be upcoming beforehand');
  assert.ok(!pastEvents(before).some((x) => x.slug === e.slug), 'should not be past beforehand');

  assert.ok(pastEvents(after).some((x) => x.slug === e.slug), 'should be past afterwards');
  assert.ok(!upcomingEvents(after).some((x) => x.slug === e.slug), 'should not be upcoming afterwards');

  const now = new Date();
  assert.equal(upcomingEvents(now).length + pastEvents(now).length, events.length, 'no event may fall through both filters');
});

test('upcomingEvents is ordered soonest first', () => {
  const list = upcomingEvents(new Date('2026-01-01T00:00:00Z'));
  for (let i = 1; i < list.length; i += 1) {
    assert.ok(new Date(list[i - 1].startsAt) <= new Date(list[i].startsAt), 'upcoming must be ascending');
  }
});

test('daysUntil counts down and floors at zero once under way', () => {
  const e = getEvent('self-directed-ira');
  assert.equal(daysUntil(e, new Date('2026-08-17T18:30:00-04:00')), 1);
  assert.equal(daysUntil(e, new Date('2026-08-11T18:30:00-04:00')), 7);
  assert.equal(daysUntil(e, new Date('2026-08-18T18:30:00-04:00')), 0, 'zero at the start time');
  assert.equal(daysUntil(e, new Date('2026-09-01T00:00:00-04:00')), 0, 'never negative');
});

test('calendarUrl encodes the real UTC window and links back to the page', () => {
  const e = getEvent('self-directed-ira');
  const url = new URL(calendarUrl(e));
  assert.equal(url.origin + url.pathname, 'https://calendar.google.com/calendar/render');
  // 6:30 PM Eastern in August is 22:30 UTC.
  assert.equal(url.searchParams.get('dates'), '20260818T223000Z/20260818T233000Z');
  assert.ok(url.searchParams.get('text').includes('Proactive'), 'title should name the host');
  assert.ok(url.searchParams.get('details').includes(`https://www.sustainablebonds.com${e.href}`), 'details should link back');
});

test('formatEventDate short form drops the year when asked', () => {
  const e = getEvent('self-directed-ira');
  const short = formatEventDate(e, { short: true, year: false });
  assert.ok(!short.includes('2026'), 'short form should omit the year');
  assert.ok(short.includes('Aug'), 'short form should abbreviate the month');
});

/* --------------------------------------------------------------- recordings */

test('every published recording carries the fields both pages render', () => {
  for (const e of events.filter((x) => x.recording)) {
    const r = e.recording;
    for (const key of ['slug', 'href', 'zoomUrl', 'durationMins', 'publishedAt', 'title', 'summary']) {
      assert.ok(r[key], `${e.slug}: recording missing ${key}`);
    }
    assert.equal(r.href, `/events/${r.slug}`, `${e.slug}: recording href should follow its slug`);
    assert.notEqual(r.slug, e.slug, `${e.slug}: the recording needs its own route, not the event's`);
    assert.match(r.zoomUrl, /^https:\/\/[a-z0-9.-]+\.zoom\.us\/rec\//, `${e.slug}: zoomUrl should be a Zoom recording share link`);
    assert.ok(r.durationMins > 0, `${e.slug}: recording needs a real runtime`);
    assert.ok(!Number.isNaN(new Date(r.publishedAt).getTime()), `${e.slug}: publishedAt must parse`);
    assert.match(r.publishedAt, /[+-]\d{2}:\d{2}$/, `${e.slug}: publishedAt needs an explicit UTC offset`);
    // A recording cannot predate the session it is a recording of.
    assert.ok(new Date(r.publishedAt) >= new Date(e.endsAt), `${e.slug}: publishedAt must be after the event ends`);
  }
});

test('recording slugs are unique and never collide with an event slug', () => {
  const recSlugs = events.filter((e) => e.recording).map((e) => e.recording.slug);
  assert.equal(new Set(recSlugs).size, recSlugs.length, 'recording slugs must be unique');
  for (const s of recSlugs) {
    assert.ok(!events.some((e) => e.slug === s), `${s} is already an event slug`);
  }
});

test('recordedEvents lists only finished events that have one, most recent first', () => {
  const before = new Date('2026-08-01T00:00:00Z');
  const after = new Date('2026-09-01T00:00:00Z');

  assert.deepEqual(recordedEvents(before), [], 'nothing is watchable before the session happens');

  const list = recordedEvents(after);
  assert.ok(list.some((e) => e.slug === 'self-directed-ira'), 'the SDIRA session should be listed afterwards');
  for (const e of list) {
    assert.ok(e.recording, 'recordedEvents must only return events with a recording');
    assert.ok(new Date(e.endsAt) < after, 'recordedEvents must only return finished events');
  }
  for (let i = 1; i < list.length; i += 1) {
    assert.ok(new Date(list[i - 1].startsAt) >= new Date(list[i].startsAt), 'recordings must be newest first');
  }
});

test('getEventByRecordingSlug resolves the route back to its event', () => {
  const e = getEventByRecordingSlug('self-directed-ira-recording');
  assert.ok(e, 'the recording route should resolve');
  assert.equal(e.slug, 'self-directed-ira');
  assert.equal(getEventByRecordingSlug('does-not-exist'), null);
});

test('the SDIRA recording is the 67-minute file at its own route', () => {
  const r = getEvent('self-directed-ira').recording;
  assert.equal(r.durationMins, 67, 'the recording runs 67 minutes, not the scheduled 60');
  assert.equal(r.href, '/events/self-directed-ira-recording');
  assert.equal(r.promoCode, 'PROACTIVE200', 'the code Jeff gave on the call');
});

test('formatRuntime reads as hours and minutes', () => {
  assert.equal(formatRuntime(67), '1 hr 7 min');
  assert.equal(formatRuntime(45), '45 min');
  assert.equal(formatRuntime(60), '1 hr');
  assert.equal(formatRuntime(125), '2 hr 5 min');
});
