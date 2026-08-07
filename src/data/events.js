// Events — live webinars and sessions. Single source of truth for /events
// (the summary page) and each event's own landing page.
//
// `startsAt` / `endsAt` are ISO strings carrying an explicit UTC offset, so the
// date, the countdown, and the calendar links can never drift apart. Note that
// mid-August is daylight time on the US east coast: 6:30 PM Eastern is -04:00.
// Everything user-facing says "ET", which is correct year-round.

export const EVENT_TZ = 'America/New_York';

export const events = [
  {
    slug: 'self-directed-ira',
    href: '/events/self-directed-ira',
    kind: 'Live webinar',
    title: 'Your IRA is allowed to buy real homes',
    subtitle: 'A plain-English evening on the Self-Directed IRA',
    summary:
      'Sixty minutes with Jeff Minnick of Directed IRA on how a Self-Directed IRA actually works — what it can hold, how to move money without triggering a tax bill, and how investors are using theirs to earn 9–15% backed by real, occupied affordable homes.',
    startsAt: '2026-08-18T18:30:00-04:00',
    endsAt: '2026-08-18T19:30:00-04:00',
    durationMins: 60,
    location: 'Live on Zoom',
    cost: 'Complimentary',
    seatsNote: 'Seats are limited so the Q&A stays a real conversation.',
    // Zoom's own registration page. Registering here is what actually issues the
    // join link, so it is the live path until our Tenth Avenue form is approved
    // for direct Zoom API registration. Tracking parameters deliberately stripped.
    zoomRegisterUrl: 'https://perspectives-studio.zoom.us/webinar/register/WN_hi3PWvB_Rra21nSHQzzuZw',
    topics: [
      'What an SDIRA can hold',
      'Rollovers without a tax bill',
      'Tax-deferred compounding',
      'The rules, in plain English',
    ],
    speaker: {
      name: 'Jeff Minnick',
      title: 'VP, Relationship — New Accounts',
      org: 'Directed IRA',
      orgUrl: 'https://directedira.com/team/',
      linkedin: 'https://www.linkedin.com/in/jeff-minnick/',
      image: '/img/speakers/jeff-minnick.webp',
    },
  },
];

export function getEvent(slug) {
  return events.find((e) => e.slug === slug) || null;
}

/** Events still ahead of `now`, soonest first. */
export function upcomingEvents(now = new Date()) {
  const t = now.getTime();
  return events
    .filter((e) => new Date(e.endsAt).getTime() >= t)
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
}

/** Events already finished, most recent first. */
export function pastEvents(now = new Date()) {
  const t = now.getTime();
  return events
    .filter((e) => new Date(e.endsAt).getTime() < t)
    .sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));
}

/** "Tuesday, August 18, 2026" — always rendered in the event's own timezone. */
export function formatEventDate(event, opts = {}) {
  return new Date(event.startsAt).toLocaleDateString('en-US', {
    weekday: opts.short ? 'short' : 'long',
    month: opts.short ? 'short' : 'long',
    day: 'numeric',
    year: opts.year === false ? undefined : 'numeric',
    timeZone: EVENT_TZ,
  });
}

/** "6:30 PM ET" */
export function formatEventTime(event) {
  const t = new Date(event.startsAt)
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: EVENT_TZ })
    .replace(/ /g, ' ');
  return `${t} ET`;
}

/** Whole days from `now` until the event starts; 0 once it is under way. */
export function daysUntil(event, now = new Date()) {
  const ms = new Date(event.startsAt).getTime() - now.getTime();
  return ms <= 0 ? 0 : Math.ceil(ms / 86400000);
}

const stampUtc = (iso) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');

/** Google Calendar "add event" URL — used by the confirmation state. */
export function calendarUrl(event, { siteUrl = 'https://www.sustainablebonds.com' } = {}) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.title} — Proactive Sustainable Bonds`,
    dates: `${stampUtc(event.startsAt)}/${stampUtc(event.endsAt)}`,
    details: `${event.summary}\n\n${siteUrl}${event.href}`,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
