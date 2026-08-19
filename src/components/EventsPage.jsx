import React from 'react';
import { MktNav, MktFooter } from './MktChrome.jsx';
import { Ic } from './icons.jsx';
import { initInteractions } from '../lib/interactions.js';
import { upcomingEvents, pastEvents, recordedEvents, formatEventDate, formatEventTime, formatRuntime, daysUntil } from '../data/events.js';

const { useEffect, useState } = React;

function Countdown({ event }) {
  const [days, setDays] = useState(null);
  useEffect(() => { setDays(daysUntil(event)); }, [event]);
  if (days === null) return null;
  if (days === 0) return <span className="ev-count">Today</span>;
  return <span className="ev-count">{days} {days === 1 ? 'day' : 'days'} to go</span>;
}

function FeaturedEvent({ event }) {
  return (
    <article className="ev-feature">
      <div className="ev-feature-body">
        <div className="ev-tags">
          <span className="ev-tag ev-tag-live"><span className="dot" />{event.kind}</span>
          <Countdown event={event} />
        </div>
        <h2 className="ev-feature-h">{event.title}</h2>
        <p className="ev-feature-sub">{event.subtitle}</p>
        <p className="ev-feature-p">{event.summary}</p>

        <div className="ev-meta">
          <span><Ic name="calendar" size={16} />{formatEventDate(event)}</span>
          <span><Ic name="clock" size={16} />{formatEventTime(event)} · {event.durationMins} min</span>
          <span><Ic name="play" size={16} />{event.location}</span>
          <span><Ic name="check-circle" size={16} />{event.cost}</span>
        </div>

        <div className="ev-topics">
          {event.topics.map((t) => <span key={t} className="ev-topic">{t}</span>)}
        </div>

        <div className="ev-feature-cta">
          <a className="btn btn-accent btn-lg" href={event.href}>Save my seat <Ic name="arrow-right" size={18} /></a>
          <a className="btn btn-ghost btn-lg" href={event.href}>Read the full agenda</a>
        </div>
      </div>

      <aside className="ev-feature-side">
        <span className="data-label" style={{ color: 'var(--lime-300)' }}>Guest speaker</span>
        <img className="ev-speaker-img" src={event.speaker.image} alt={event.speaker.name} loading="lazy" />
        <div className="ev-speaker-n">{event.speaker.name}</div>
        <div className="ev-speaker-r">{event.speaker.title}</div>
        <div className="ev-speaker-o">{event.speaker.org}</div>
        <p className="ev-speaker-note">
          Sixty minutes on the retirement account almost nobody is told about — and a live Q&amp;A
          with the person who sets them up all day.
        </p>
      </aside>
    </article>
  );
}

// A finished session whose recording is published. The whole card is the link,
// so the "Watch" button below is decoration inside it rather than a nested <a>.
function RecordingCard({ event }) {
  const rec = event.recording;
  return (
    <a className="ev-rec" href={rec.href}>
      <div className="ev-rec-body">
        <div className="ev-tags">
          <span className="ev-tag ev-tag-rec"><Ic name="play" size={13} />Recording</span>
          <span className="ev-count">{formatEventDate(event, { short: true })} · {formatRuntime(rec.durationMins)}</span>
        </div>
        <h3 className="ev-rec-h">{event.title}</h3>
        <p className="ev-rec-sub">{event.subtitle}</p>
        <p className="ev-rec-p">{rec.summary}</p>
        <span className="ev-rec-cta">Watch the recording <Ic name="arrow-right" size={17} /></span>
      </div>
      <div className="ev-rec-side">
        <img className="ev-rec-img" src={event.speaker.image} alt="" loading="lazy" />
        <div className="ev-speaker-n">{event.speaker.name}</div>
        <div className="ev-speaker-r">{event.speaker.org}</div>
        <div className="ev-rec-meta">
          <span><Ic name="clock" size={14} />{formatRuntime(rec.durationMins)}</span>
          <span><Ic name="check-circle" size={14} />Q&amp;A included</span>
        </div>
      </div>
    </a>
  );
}

// A finished session with no recording published — still worth listing, but it
// only ever links back to its own landing page.
function PastEvent({ event }) {
  return (
    <a className="ev-past" href={event.href}>
      <span className="ev-past-date">{formatEventDate(event, { short: true })}</span>
      <span className="ev-past-title">{event.title}</span>
      <Ic name="arrow-right" size={16} />
    </a>
  );
}

export default function EventsPage() {
  useEffect(() => { initInteractions(); }, []);
  const upcoming = upcomingEvents();
  const recorded = recordedEvents();
  // Finished sessions with nothing to watch yet keep the plain list; anything
  // with a published recording graduates to a card above it.
  const past = pastEvents().filter((e) => !e.recording);

  return (
    <React.Fragment>
      <MktNav />
      <main>
        <section className="ev-hero">
          <div className="ev-hero-glow" />
          <div className="ev-hero-inner">
            <span className="eyebrow-pill ev-eyebrow">Live sessions &amp; webinars</span>
            <div className="ev-hero-grid">
              <h1 className="ev-h1">The conversations we wish somebody had had with us.</h1>
              <p className="ev-lead">
                Every so often we bring in someone who genuinely knows their corner of this world —
                custodians, tax specialists, operators — and give them an hour and an open floor.
                No pitch decks, no hard sell. Just the things that turn out to matter, explained
                early enough to be useful.
              </p>
            </div>
          </div>
        </section>

        <section className="ev-sec">
          <div className="ev-sec-head">
            <span className="eyebrow">Coming up</span>
            <h2 className="ev-h2">{upcoming.length ? 'Next on the calendar' : 'Nothing scheduled right now'}</h2>
          </div>

          {upcoming.length ? (
            upcoming.map((e) => <FeaturedEvent key={e.slug} event={e} />)
          ) : (
            <div className="ev-empty">
              <p>
                There is nothing on the calendar at the moment. The next session will land here
                first — and we will email the list before we announce it anywhere else.
              </p>
              <a className="btn btn-accent" href="/#get-started">Tell us you want in <Ic name="arrow-right" size={17} /></a>
            </div>
          )}
        </section>

        {recorded.length > 0 && (
          <section id="recordings" className="ev-sec" style={{ scrollMarginTop: 92 }}>
            <div className="ev-sec-head ev-sec-head-split">
              <div>
                <span className="eyebrow">Previously</span>
                <h2 className="ev-h2">Past event recordings</h2>
              </div>
              <p className="ev-sec-copy">
                Every session is recorded and published here in full — the presentation, the
                slides that mattered, and the live Q&amp;A, which is usually the half people
                remember. Free to watch, no registration, no time limit.
              </p>
            </div>
            <div className="ev-rec-list">
              {recorded.map((e) => <RecordingCard key={e.slug} event={e} />)}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="ev-sec">
            <div className="ev-sec-head">
              <span className="eyebrow">Also behind us</span>
              <h2 className="ev-h2">Past sessions</h2>
            </div>
            <div className="ev-past-list">
              {past.map((e) => <PastEvent key={e.slug} event={e} />)}
            </div>
          </section>
        )}

        <section className="ev-sec" style={{ paddingBottom: 120 }}>
          <div className="ev-cta">
            <h2 className="ev-cta-h">Never miss the next one.</h2>
            <p className="ev-cta-p">
              We run these a few times a year and the rooms stay deliberately small. Tell us where
              to find you and you will hear about the next one before it goes public.
            </p>
            <a className="btn btn-accent btn-lg" href="/#get-started">Keep me posted <Ic name="arrow-right" size={18} /></a>
          </div>
        </section>
      </main>
      <MktFooter />

      <style>{`
        .ev-sec { max-width: 1240px; margin: 0 auto; padding: 96px 22px 0; }
        .ev-sec-head { margin-bottom: 34px; }
        /* Heading left, copy right, so the row fills instead of stranding a
           capped paragraph in the left half. rules.md section 6 "Layout". */
        @media (min-width: 900px) {
          .ev-sec-head-split { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: clamp(36px, 5vw, 76px); align-items: end; }
        }
        .ev-sec-copy { margin: 0; color: var(--fg-2); line-height: 1.76; font-size: var(--text-base); }
        .ev-h2 { margin: 13px 0 0; font-family: var(--font-editorial); font-weight: 600;
          font-size: clamp(1.75rem, 3.2vw, 2.4rem); line-height: 1.12; letter-spacing: -0.022em; color: var(--forest-700); }
        [data-theme="dark"] .ev-h2 { color: var(--lime-300); }

        /* hero */
        .ev-hero { position: relative; overflow: hidden;
          background: linear-gradient(158deg, var(--forest-700) 0%, var(--forest-900) 70%, #071a0f 100%); }
        .ev-hero-glow { position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(720px 560px at 84% -10%, rgba(149,196,92,0.20), transparent 62%); }
        /* Hero runs as two columns on wide screens — heading left, lead right — so
           the row is filled instead of stranding both in the left half. */
        .ev-hero-inner { position: relative; z-index: 1; max-width: 1240px; margin: 0 auto; padding: 88px 22px 92px; }
        .ev-eyebrow { margin-bottom: 26px; background: rgba(255,255,255,0.10); color: #eaf3e2;
          border: 1px solid rgba(255,255,255,0.26); font-weight: 600; }
        .ev-hero-grid { display: grid; gap: 22px; }
        @media (min-width: 900px) {
          .ev-hero-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: clamp(36px, 5vw, 76px); align-items: end; }
        }
        .ev-h1 { margin: 0; font-family: var(--font-editorial); font-weight: 600; color: #fff;
          font-size: clamp(2.1rem, 4.2vw, 3.2rem); line-height: 1.08; letter-spacing: -0.024em; }
        .ev-lead { margin: 0; color: rgba(238,246,232,0.82); line-height: 1.72; font-size: var(--text-base); }

        /* featured card */
        .ev-feature { display: grid; grid-template-columns: 1fr 300px; gap: 0; overflow: hidden;
          border-radius: var(--radius-2xl); background: var(--surface); border: 1px solid var(--border);
          box-shadow: var(--shadow-md); }
        .ev-feature-body { padding: clamp(30px, 4vw, 48px); }
        .ev-tags { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 18px; }
        .ev-tag { display: inline-flex; align-items: center; gap: 8px; font-size: var(--text-2xs);
          font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.5em 0.9em;
          border-radius: var(--radius-pill); }
        .ev-tag-live { background: var(--lime-100); color: var(--forest-700); }
        [data-theme="dark"] .ev-tag-live { background: rgba(127,178,79,0.18); color: var(--lime-300); }
        .ev-count { font-family: var(--font-mono); font-size: var(--text-xs); letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--fg-3); }
        .ev-feature-h { margin: 0; font-family: var(--font-editorial); font-weight: 600; color: var(--fg-1);
          font-size: clamp(1.6rem, 3vw, 2.15rem); line-height: 1.14; letter-spacing: -0.022em; }
        .ev-feature-sub { margin: 8px 0 0; font-size: var(--text-lg); color: var(--brand); font-weight: 500; }
        .ev-feature-p { margin: 18px 0 0; color: var(--fg-2); line-height: 1.72; font-size: var(--text-base); }
        .ev-meta { display: flex; flex-wrap: wrap; gap: 10px; margin: 24px 0 0; }
        .ev-meta span { display: inline-flex; align-items: center; gap: 7px; font-size: var(--text-xs);
          font-weight: 600; color: var(--fg-2); background: var(--bg-sunken); padding: 0.55em 0.9em;
          border-radius: var(--radius-pill); }
        .ev-meta svg { color: var(--brand); }
        .ev-topics { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
        .ev-topic { font-size: var(--text-xs); color: var(--fg-3); border: 1px solid var(--border);
          padding: 0.4em 0.8em; border-radius: var(--radius-pill); }
        .ev-feature-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

        .ev-feature-side { padding: clamp(30px, 4vw, 40px) 30px; text-align: center;
          background: linear-gradient(165deg, var(--forest-600), var(--forest-900)); }
        .ev-speaker-img { width: 132px; height: 132px; border-radius: 50%; object-fit: cover;
          margin: 16px auto 16px; display: block; box-shadow: 0 0 0 3px rgba(255,255,255,0.14), 0 0 0 5px var(--lime-300); }
        .ev-speaker-n { color: #fff; font-weight: 700; font-size: var(--text-base); }
        .ev-speaker-r { color: var(--lime-300); font-size: var(--text-xs); font-weight: 600; margin-top: 5px; line-height: 1.4; }
        .ev-speaker-o { color: rgba(234,243,226,0.66); font-size: var(--text-xs); margin-top: 3px; }
        .ev-speaker-note { margin: 20px 0 0; font-size: var(--text-xs); color: rgba(234,243,226,0.72); line-height: 1.6; }

        /* recordings */
        .ev-tag-rec { display: inline-flex; align-items: center; gap: 7px; background: var(--forest-600); color: #fff; }
        [data-theme="dark"] .ev-tag-rec { background: rgba(127,178,79,0.22); color: var(--lime-300); }
        .ev-rec-list { display: grid; gap: 16px; }
        /* One card per row, split into two columns so it fills the container at
           any width rather than sitting in a narrow strip on a wide monitor. */
        .ev-rec { display: grid; grid-template-columns: minmax(0, 1fr) 280px; overflow: hidden;
          border-radius: var(--radius-2xl); background: var(--surface); border: 1px solid var(--border);
          text-decoration: none; color: inherit; box-shadow: var(--shadow-sm);
          transition: box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out); }
        .ev-rec:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .ev-rec-body { padding: clamp(28px, 3.4vw, 42px); }
        .ev-rec-h { margin: 0; font-family: var(--font-editorial); font-weight: 600; color: var(--fg-1);
          font-size: clamp(1.45rem, 2.6vw, 1.95rem); line-height: 1.15; letter-spacing: -0.02em; }
        .ev-rec-sub { margin: 8px 0 0; font-size: var(--text-base); color: var(--brand); font-weight: 500; }
        [data-theme="dark"] .ev-rec-sub { color: var(--lime-300); }
        .ev-rec-p { margin: 16px 0 0; color: var(--fg-2); line-height: 1.72; font-size: var(--text-sm); }
        .ev-rec-cta { display: inline-flex; align-items: center; gap: 8px; margin-top: 24px;
          font-size: var(--text-sm); font-weight: 700; color: var(--brand); }
        .ev-rec:hover .ev-rec-cta svg { transform: translateX(3px); }
        .ev-rec-cta svg { transition: transform var(--dur-base) var(--ease-out); }
        .ev-rec-side { padding: clamp(28px, 3.4vw, 38px) 28px; text-align: center;
          background: linear-gradient(165deg, var(--forest-600), var(--forest-900)); }
        .ev-rec-img { width: 104px; height: 104px; border-radius: 50%; object-fit: cover;
          margin: 0 auto 14px; display: block;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.14), 0 0 0 5px var(--lime-300); }
        .ev-rec-meta { display: grid; gap: 8px; margin-top: 20px; padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.14); }
        .ev-rec-meta span { display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          font-size: var(--text-xs); color: rgba(234,243,226,0.78); }
        .ev-rec-meta svg { color: var(--lime-300); }

        /* empty + past */
        .ev-empty { border: 1px dashed var(--border-strong); border-radius: var(--radius-2xl);
          padding: 48px 36px; text-align: center; display: grid; justify-items: center; gap: 20px; }
        .ev-empty p { margin: 0; max-width: 52ch; color: var(--fg-2); line-height: 1.7; }
        .ev-past-list { display: grid; gap: 10px; }
        .ev-past { display: grid; grid-template-columns: 140px 1fr auto; gap: 18px; align-items: center;
          padding: 20px 24px; border-radius: var(--radius-lg); background: var(--surface);
          border: 1px solid var(--border); text-decoration: none; color: inherit;
          transition: box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out); }
        .ev-past:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .ev-past-date { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--fg-3); }
        .ev-past-title { font-weight: 600; color: var(--fg-1); }

        /* closing cta */
        .ev-cta { border-radius: var(--radius-2xl); text-align: center;
          padding: clamp(44px, 6vw, 70px) clamp(24px, 5vw, 60px);
          background: linear-gradient(155deg, var(--forest-600), var(--forest-900)); }
        .ev-cta-h { margin: 0; color: #fff; font-family: var(--font-editorial); font-weight: 600;
          font-size: clamp(1.7rem, 3.4vw, 2.5rem); letter-spacing: -0.022em; }
        .ev-cta-p { margin: 16px auto 28px; max-width: 50ch; color: rgba(234,243,226,0.84);
          line-height: 1.68; font-size: var(--text-base); }

        @media (max-width: 940px) {
          .ev-feature { grid-template-columns: 1fr; }
          .ev-feature-side { order: -1; padding: 34px 30px; }
          .ev-speaker-img { width: 108px; height: 108px; margin-top: 12px; }
          .ev-rec { grid-template-columns: 1fr; }
          .ev-rec-side { order: -1; padding: 30px 28px; }
        }
        @media (max-width: 560px) {
          .ev-past { grid-template-columns: 1fr auto; }
          .ev-past-date { grid-column: 1 / -1; }
          .ev-feature-cta .btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </React.Fragment>
  );
}
