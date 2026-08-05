import React from 'react';
import { MktNav, MktFooter } from './MktChrome.jsx';
import { Ic } from './icons.jsx';
import { initInteractions } from '../lib/interactions.js';
import { upcomingEvents, pastEvents, formatEventDate, formatEventTime, daysUntil } from '../data/events.js';

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
  const past = pastEvents();

  return (
    <React.Fragment>
      <MktNav />
      <main>
        <section className="ev-hero">
          <div className="ev-hero-glow" />
          <div className="ev-hero-inner">
            <span className="eyebrow-pill ev-eyebrow">Live sessions &amp; webinars</span>
            <h1 className="ev-h1">The conversations we wish somebody had had with us.</h1>
            <p className="ev-lead">
              Every so often we bring in someone who genuinely knows their corner of this world —
              custodians, tax specialists, operators — and give them an hour and an open floor.
              No pitch decks, no hard sell. Just the things that turn out to matter, explained
              early enough to be useful.
            </p>
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

        {past.length > 0 && (
          <section className="ev-sec">
            <div className="ev-sec-head">
              <span className="eyebrow">Previously</span>
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
        .ev-sec { max-width: 1180px; margin: 0 auto; padding: 96px 22px 0; }
        .ev-sec-head { margin-bottom: 34px; }
        .ev-h2 { margin: 13px 0 0; font-family: var(--font-editorial); font-weight: 600;
          font-size: clamp(1.75rem, 3.2vw, 2.4rem); line-height: 1.12; letter-spacing: -0.022em; color: var(--forest-700); }
        [data-theme="dark"] .ev-h2 { color: var(--lime-300); }

        /* hero */
        .ev-hero { position: relative; overflow: hidden;
          background: linear-gradient(158deg, var(--forest-700) 0%, var(--forest-900) 70%, #071a0f 100%); }
        .ev-hero-glow { position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(720px 560px at 84% -10%, rgba(149,196,92,0.20), transparent 62%); }
        .ev-hero-inner { position: relative; z-index: 1; max-width: 880px; margin: 0 auto; padding: 88px 22px 92px; }
        .ev-eyebrow { margin-bottom: 24px; background: rgba(255,255,255,0.10); color: #eaf3e2;
          border: 1px solid rgba(255,255,255,0.26); font-weight: 600; }
        .ev-h1 { margin: 0 0 20px; font-family: var(--font-editorial); font-weight: 600; color: #fff;
          font-size: clamp(2.1rem, 4.2vw, 3.2rem); line-height: 1.08; letter-spacing: -0.024em; max-width: 20ch; }
        .ev-lead { margin: 0; max-width: 60ch; color: rgba(238,246,232,0.82); line-height: 1.72; font-size: var(--text-base); }

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
        .ev-feature-p { margin: 18px 0 0; max-width: 60ch; color: var(--fg-2); line-height: 1.72; font-size: var(--text-base); }
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
