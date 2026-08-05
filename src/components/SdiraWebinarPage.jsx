import React from 'react';
import { MktNav, MktFooter } from './MktChrome.jsx';
import { Ic } from './icons.jsx';
import { initInteractions } from '../lib/interactions.js';
import { getEvent, formatEventDate, formatEventTime, daysUntil, calendarUrl } from '../data/events.js';

const { useEffect, useState, useRef } = React;

// Registration posts to a Tenth Avenue form dedicated to this webinar, so the
// registrant list stays separate from the evergreen `ira` / `webform` enquiries
// (the Zoom link only goes to this list). The `sdira-webinar` form must exist in
// Tenth Avenue before the page goes live.
const TA_FORM = 'https://tenthavenue.io/api/forms/sdira-webinar/submit';

const EVENT = getEvent('self-directed-ira');

const TA_COUNTRIES = [['US', 'United States (+1)'], ['CA', 'Canada (+1)'], ['GB', 'United Kingdom (+44)'], ['AU', 'Australia (+61)'], ['IN', 'India (+91)'], ['AE', 'United Arab Emirates (+971)'], ['DE', 'Germany (+49)'], ['FR', 'France (+33)'], ['ES', 'Spain (+34)'], ['IT', 'Italy (+39)'], ['NL', 'Netherlands (+31)'], ['IE', 'Ireland (+353)'], ['NZ', 'New Zealand (+64)'], ['SG', 'Singapore (+65)'], ['HK', 'Hong Kong (+852)'], ['ZA', 'South Africa (+27)'], ['NG', 'Nigeria (+234)'], ['KE', 'Kenya (+254)'], ['MX', 'Mexico (+52)'], ['BR', 'Brazil (+55)'], ['JP', 'Japan (+81)'], ['CH', 'Switzerland (+41)']];

const LEARN = [
  {
    icon: 'home',
    title: 'What your IRA is actually allowed to own',
    body: 'The tax code runs backwards from what most people assume. It names the short list of things a retirement account may not hold — collectibles, life insurance — and leaves nearly everything else open, including real estate and private credit. You will leave knowing exactly where the line sits.',
  },
  {
    icon: 'shield-check',
    title: 'How to move the money without a tax bill',
    body: 'Old 401(k)s, existing IRAs, SEPs and SIMPLEs can move custodian-to-custodian without a taxable event. Jeff walks through the mechanics, the paperwork and the timing — including the small mistakes that quietly turn a clean transfer into a distribution.',
  },
  {
    icon: 'trending-up',
    title: 'What tax-deferred compounding really does',
    body: 'Income earned inside the account is not taxed as it arrives. On a fixed-income position paying quarterly, that difference stops being academic somewhere around year four. We will run the arithmetic on screen rather than put a number on a slide.',
  },
  {
    icon: 'file-text',
    title: 'The rules, before you need them',
    body: 'Prohibited transactions, disqualified persons, UBIT and UDFI — in plain English, with examples. This is the part that costs people money when they learn it late, and it is why the evening is worth an hour even if you never invest a dollar alongside us.',
  },
];

const AGENDA = [
  ['01', 'Where the money is now', '5 min', 'Why almost all retirement capital ends up in the same handful of funds, and what that quietly costs over a working life.'],
  ['02', 'The account, explained', '12 min', 'What a Self-Directed IRA is, who actually holds it, what it can own, and how it differs from the IRA you already have.'],
  ['03', 'Getting your money there', '12 min', 'Rollovers and transfers, step by step. What is taxable, what is not, and the paperwork order that keeps it clean.'],
  ['04', 'The rules that matter', '10 min', 'Prohibited transactions, disqualified persons, UBIT and UDFI — plainly, with the examples that make them stick.'],
  ['05', 'A worked example', '10 min', 'How a fixed-income, real-estate-backed position behaves inside an IRA, using a Proactive bond as the illustration.'],
  ['06', 'Live Q&A', 'The rest', 'Open floor. Your account, your situation, your questions — answered by the person who does this all day.'],
];

const FOR_YOU = [
  'You have an old 401(k) sitting with an employer you left years ago.',
  'You have an IRA earning a number you would rather not say out loud.',
  'You have heard "self-directed" and assumed it was complicated, or risky, or for somebody else.',
  'You would like the money you retire on to have done something you are glad about.',
];

const TEAM = [
  { img: '/img/team/canaan.webp', name: 'Dr. Canaan Van Williams', title: 'Impact CEO & Managing Founder' },
  { img: '/img/team/greg.webp', name: 'Greg C. Simonian', title: 'Senior Vice President' },
  { img: '/img/team/bob.webp', name: 'Bob Totaro', title: 'Vice President of Sales' },
  { img: '/img/team/tony.webp', name: 'Tony Lawrence', title: 'Director of Operations' },
  { img: '/img/team/jesse.webp', name: 'Jesse Hollander', title: 'Director' },
  { img: '/img/team/alicia.webp', name: 'Alicia Galloway', title: 'Investor Relations Manager' },
];

const FAQ = [
  ['Do I need to be an accredited investor to attend?', 'No. The evening is about how the account works, and it is open to anyone who wants to understand it. Proactive’s own bonds are offered only to accredited investors under Rule 506(c) — but that is a separate conversation, and not this one.'],
  ['Is this a pitch?', 'No. Jeff’s hour is about the account, not our bonds. We use one Proactive position as the worked example in section five because abstract examples teach nobody anything. If you leave and open a Self-Directed IRA to buy something else entirely, the evening did its job.'],
  ['What if I cannot make it live?', 'Register anyway. We send the recording and the slides to everyone on the list. The Q&A is the part that does not really survive a recording, so come if you can.'],
  ['Does moving my 401(k) trigger taxes?', 'Handled correctly, as a direct custodian-to-custodian transfer, no. Handled carelessly, it can. Telling those two apart is most of section three.'],
  ['What does it cost?', 'Nothing. No cost, no obligation, and nobody will call you unless you ask us to.'],
];

const AMOUNTS = [100000, 250000, 500000];
const YEARS = 10;
const BASE_RATE = 0.05;
const IMPACT_RATE = 0.12;

const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
const grow = (p, r, y) => p * Math.pow(1 + r, y);

function scrollToId(id) {
  return (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof document === 'undefined') return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
}

/* ------------------------------------------------------------------ hero -- */

function EventMeta({ tone = 'dark' }) {
  const items = [
    ['calendar', formatEventDate(EVENT)],
    ['clock', `${formatEventTime(EVENT)} · ${EVENT.durationMins} minutes`],
    ['play', EVENT.location],
    ['check-circle', EVENT.cost],
  ];
  return (
    <div className={`sd-meta sd-meta-${tone}`}>
      {items.map(([ic, label]) => (
        <span key={label} className="sd-meta-item"><Ic name={ic} size={16} />{label}</span>
      ))}
    </div>
  );
}

function Countdown() {
  const [days, setDays] = useState(null);
  useEffect(() => { setDays(daysUntil(EVENT)); }, []);
  if (days === null) return null;
  if (days === 0) return <span className="sd-count">Happening today</span>;
  return <span className="sd-count">{days} {days === 1 ? 'day' : 'days'} to go</span>;
}

function RegisterCard({ id }) {
  const [done, setDone] = useState(false);
  const submitted = useRef(false);
  const onSink = () => { if (submitted.current) setDone(true); };
  return (
    <div id={id} className="sd-reg" style={{ scrollMarginTop: 96 }}>
      {done ? (
        <div className="sd-reg-done">
          <div className="check-ring"><span className="ripple" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <h3 className="sd-reg-done-h">Your seat is saved.</h3>
          <p className="sd-reg-done-p">
            Check your inbox — your private Zoom link is on its way. Put it in the calendar now
            so the evening does not slip past you.
          </p>
          <a className="btn btn-accent" href={calendarUrl(EVENT)} target="_blank" rel="noreferrer">
            <Ic name="calendar" size={17} />Add to calendar
          </a>
          <p className="sd-reg-fine" style={{ marginTop: 18 }}>
            {formatEventDate(EVENT)} · {formatEventTime(EVENT)} · {EVENT.location}
          </p>
        </div>
      ) : (
        <React.Fragment>
          <div className="sd-reg-head">
            <span className="sd-reg-badge">{EVENT.cost} · Limited seats</span>
            <h3 className="sd-reg-h">Save your seat</h3>
            <p className="sd-reg-sub">
              We will send your private Zoom link straight away, plus a calendar hold so the
              evening does not quietly disappear into next week.
            </p>
          </div>
          <form action={TA_FORM} method="POST" className="ta-form" target="ta_sink_webinar" onSubmit={() => { submitted.current = true; }}>
            <div style={{ position: 'absolute', left: -9999 }} aria-hidden="true">
              <label>Leave this field empty<input type="text" name="_hp" tabIndex={-1} autoComplete="off" /></label>
            </div>
            <div className="ta-row">
              <div className="ta-form__field"><label className="ta-form__label" htmlFor="wb_first">First name *</label><input id="wb_first" type="text" name="first_name" required /></div>
              <div className="ta-form__field"><label className="ta-form__label" htmlFor="wb_last">Last name *</label><input id="wb_last" type="text" name="last_name" required /></div>
            </div>
            <div className="ta-form__field"><label className="ta-form__label" htmlFor="wb_email">Email *</label><input id="wb_email" type="email" name="email" required /></div>
            <div className="ta-form__field">
              <label className="ta-form__label" htmlFor="wb_phone">Phone *</label>
              <div className="ta-form__phone">
                <select name="phone__country" className="ta-form__phone-country" aria-label="Country code">{TA_COUNTRIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                <input id="wb_phone" type="tel" inputMode="tel" name="phone" placeholder="Phone number" required />
              </div>
            </div>
            <div className="ta-form__field">
              <label className="ta-form__label" htmlFor="wb_msg">Anything you would like Jeff to cover?</label>
              <textarea id="wb_msg" name="message" rows={2} placeholder="Optional — we read every one of these before the call."></textarea>
            </div>
            <label className="ta-form__check">
              <input type="checkbox" name="field_yapu2" />
              <span>Text me the Zoom link as well. Message and data rates may apply; reply STOP to opt out. <a href="https://tenthavenue.io/legal/proactive/privacy" target="_blank" rel="noreferrer">Privacy</a> · <a href="https://tenthavenue.io/legal/proactive/terms" target="_blank" rel="noreferrer">SMS Terms</a></span>
            </label>
            <button type="submit" className="ta-form__submit">Save my seat <Ic name="arrow-right" size={18} /></button>
            <p className="sd-reg-fine">No cost, no obligation, and no one calls you unless you ask.</p>
          </form>
        </React.Fragment>
      )}
      <iframe name="ta_sink_webinar" title="registration" onLoad={onSink} style={{ display: 'none' }}></iframe>
    </div>
  );
}

function Hero() {
  return (
    <section className="sd-hero">
      <div className="sd-hero-glow" />
      <div className="sd-hero-inner">
        <div className="sd-hero-copy">
          <span className="eyebrow-pill sd-eyebrow">
            <span className="dot" style={{ color: 'var(--lime-300)' }} />
            {EVENT.kind} · {formatEventDate(EVENT, { short: true, year: false })} · {formatEventTime(EVENT)}
          </span>
          <h1 className="sd-h1">
            Your IRA is allowed to buy real homes.{' '}
            <em>Nobody at the bank will tell you.</em>
          </h1>
          <p className="sd-lead">
            Most retirement savings sit in a fund somebody else picked, earning whatever the
            market decides that decade. There has been another road since 1974 — quieter, and
            mostly travelled by people who happened to find out early.
          </p>
          <p className="sd-lead">
            On the 18th, <strong>Jeff Minnick of Directed IRA</strong> will show you exactly how
            it works: what a Self-Directed IRA can hold, how to move money into one without
            triggering a tax bill, and what changes when retirement capital starts earning
            <strong> 9–15% a year</strong> behind real, occupied, affordable homes.
          </p>
          <p className="sd-lead sd-lead-last">One evening. Sixty minutes. Bring every question you have.</p>
          <EventMeta />
          <div className="sd-hero-cta">
            <a className="btn btn-accent btn-lg" href="#register" onClick={scrollToId('register')}>Save my seat <Ic name="arrow-right" size={18} /></a>
            <a className="btn btn-lg sd-btn-light" href="#agenda" onClick={scrollToId('agenda')}>See what we will cover</a>
            <Countdown />
          </div>
          <div className="sd-speaker-mini">
            <img src={EVENT.speaker.image} alt={EVENT.speaker.name} loading="eager" />
            <div>
              <div className="sd-speaker-mini-n">{EVENT.speaker.name}</div>
              <div className="sd-speaker-mini-r">{EVENT.speaker.title} · {EVENT.speaker.org}</div>
            </div>
          </div>
        </div>
        <div className="sd-hero-form"><RegisterCard id="register" /></div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- the dream -- */

function Dream() {
  const [amt, setAmt] = useState(AMOUNTS[1]);
  const base = grow(amt, BASE_RATE, YEARS);
  const impact = grow(amt, IMPACT_RATE, YEARS);
  return (
    <section className="sd-sec sd-sec-narrow">
      <span className="eyebrow">Why this evening</span>
      <h2 className="sd-h2">The retirement you actually pictured.</h2>
      <div className="sd-prose">
        <p>
          Most retirement arithmetic is built quietly on four or five percent and a certain amount
          of hope. It is the number underneath everything else — whether you stop at sixty-two or
          keep going to seventy, whether the house is paid off, whether there is something left
          over for the people who come after you.
        </p>
        <p>
          Very few people are ever told that the account itself was never the limit. An IRA can
          hold far more than funds — real estate, private notes, private credit — and inside the
          account, every dollar of that income compounds without being taxed on its way through.
        </p>
        <p>
          Applied patiently across a decade, that one change is the difference between a
          comfortable retirement and a generous one.
        </p>
      </div>

      <div className="sd-calc">
        <div className="sd-calc-head">
          <span className="data-label">If you moved</span>
          <div className="tabs sd-calc-tabs" role="tablist">
            {AMOUNTS.map((a) => (
              <button key={a} role="tab" aria-selected={a === amt} onClick={() => setAmt(a)}>
                {usd(a)}
              </button>
            ))}
          </div>
          <span className="data-label">for {YEARS} years</span>
        </div>
        <div className="sd-calc-grid">
          <div className="sd-calc-col">
            <div className="sd-calc-label">Left where it is</div>
            <div className="figure sd-calc-n sd-calc-n-muted">{usd(base)}</div>
            <div className="sd-calc-rate">at {Math.round(BASE_RATE * 100)}% a year</div>
          </div>
          <div className="sd-calc-arrow"><Ic name="arrow-right" size={22} /></div>
          <div className="sd-calc-col sd-calc-col-hero">
            <div className="sd-calc-label">Working behind real homes</div>
            <div className="figure sd-calc-n">{usd(impact)}</div>
            <div className="sd-calc-rate">at {Math.round(IMPACT_RATE * 100)}% a year, tax-deferred</div>
          </div>
        </div>
        <div className="sd-calc-delta">
          <Ic name="trending-up" size={18} />
          <span>A difference of <strong>{usd(impact - base)}</strong> — on money you already have.</span>
        </div>
        <p className="sd-calc-fine">
          Illustrative only, for education. Assumes annual compounding inside a tax-deferred
          account with no withdrawals, using 5% as a conventional fixed-income baseline and 12% as
          the midpoint of Proactive's 9–15% target range. Actual returns will differ, targets are
          not guarantees, and every investment can lose value.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- what you get -- */

function Learn() {
  return (
    <section className="sd-sec">
      <div className="sd-sec-head">
        <span className="eyebrow">What you will walk away with</span>
        <h2 className="sd-h2">Four things most people learn ten years too late.</h2>
        <p className="sd-sec-sub">
          No slides about market outlook. Just the mechanics of an account you are already
          allowed to open, explained by somebody who sets them up every day.
        </p>
      </div>
      <div className="sd-learn">
        {LEARN.map((c) => (
          <div key={c.title} className="sd-learn-card">
            <div className="sd-learn-ic"><Ic name={c.icon} size={22} /></div>
            <h3 className="sd-learn-h">{c.title}</h3>
            <p className="sd-learn-p">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- speaker -- */

function Speaker() {
  return (
    <section className="sd-sec sd-sec-narrow">
      <div className="sd-speaker">
        <div className="sd-speaker-photo">
          <img src={EVENT.speaker.image} alt={EVENT.speaker.name} loading="lazy" />
          <a className="sd-speaker-li" href={EVENT.speaker.linkedin} target="_blank" rel="noreferrer">
            <Ic name="linkedin" size={16} />LinkedIn
          </a>
        </div>
        <div>
          <span className="eyebrow">Your guest</span>
          <h2 className="sd-h2 sd-h2-tight">Meet Jeff Minnick.</h2>
          <p className="sd-speaker-role">{EVENT.speaker.title} · <a href={EVENT.speaker.orgUrl} target="_blank" rel="noreferrer">Directed IRA</a></p>
          <div className="sd-prose">
            <p>
              Jeff spends his days walking investors through exactly this decision — what to move,
              how to move it, and what to watch for on the way. He has had the conversation you are
              about to have several thousand times.
            </p>
            <p>
              Directed IRA is the tradename of Directed Trust Company, a licensed Arizona trust
              company examined each year by state bank examiners and audited by outside CPAs. It
              was founded in 2018 by Mat Sorensen and Mark Kohler — the team behind{' '}
              <em>The Self-Directed IRA Handbook</em> and the Directed IRA Podcast — and has been
              named by Inc. 5000 several times over as the fastest-growing IRA provider in the
              industry, with more than a thousand five-star client reviews behind it.
            </p>
            <p className="sd-pull">He is not coming to sell you a bond. He is coming to explain the account.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- agenda -- */

function Agenda() {
  return (
    <section id="agenda" className="sd-sec sd-sec-narrow" style={{ scrollMarginTop: 92 }}>
      <div className="sd-sec-head">
        <span className="eyebrow">The hour</span>
        <h2 className="sd-h2">How the evening runs.</h2>
        <p className="sd-sec-sub">Tight, useful, and finished on time. The last stretch belongs to you.</p>
      </div>
      <div className="sd-agenda">
        {AGENDA.map(([n, title, mins, body]) => (
          <div key={n} className="sd-agenda-row">
            <span className="sd-agenda-n">{n}</span>
            <div className="sd-agenda-body">
              <div className="sd-agenda-top">
                <h3 className="sd-agenda-h">{title}</h3>
                <span className="sd-agenda-mins">{mins}</span>
              </div>
              <p className="sd-agenda-p">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- who it's for */

function ForYou() {
  return (
    <section className="sd-sec sd-sec-narrow">
      <div className="sd-foryou">
        <div>
          <span className="eyebrow">Come along if</span>
          <h2 className="sd-h2 sd-h2-tight">This evening was built for you.</h2>
        </div>
        <ul className="sd-foryou-list">
          {FOR_YOU.map((t) => (
            <li key={t}><span className="sd-foryou-tick"><Ic name="check" size={14} /></span>{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- hosts */

function Hosts() {
  return (
    <section className="sd-sec">
      <div className="sd-sec-head">
        <span className="eyebrow">Your hosts</span>
        <h2 className="sd-h2">Why we are the ones putting this on.</h2>
        <p className="sd-sec-sub">
          We finance naturally occurring affordable housing — the manufactured-home communities,
          workforce apartments and SRO buildings quietly holding up the bottom half of the American
          housing market. It is exactly the kind of asset a Self-Directed IRA was built to hold:
          real, occupied, income-producing, and boring in the best possible way.
        </p>
        <p className="sd-sec-sub">
          We are not the custodian and we take nothing for the account. We simply meet a great many
          investors who wish somebody had explained this to them ten years sooner. So we asked Jeff.
          The whole team will be on the call.
        </p>
      </div>
      <div className="sd-team">
        {TEAM.map((m) => (
          <div key={m.name} className="sd-team-card">
            <img className="sd-team-photo" src={m.img} alt={m.name} loading="lazy" />
            <div className="sd-team-name">{m.name}</div>
            <div className="sd-team-title">{m.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- faq */

function Faq() {
  return (
    <section className="sd-sec sd-sec-narrow">
      <div className="sd-sec-head">
        <span className="eyebrow">Before you ask</span>
        <h2 className="sd-h2">The honest answers.</h2>
      </div>
      <div className="sd-faq">
        {FAQ.map(([q, a]) => (
          <details key={q} className="sd-faq-item">
            <summary><span>{q}</span><Ic name="chevron-down" size={18} /></summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- final cta */

function FinalCta() {
  return (
    <section className="sd-sec" style={{ paddingBottom: 120 }}>
      <div className="sd-final">
        <span className="eyebrow" style={{ color: 'var(--lime-300)' }}>{formatEventDate(EVENT)}</span>
        <h2 className="sd-final-h">Sixty minutes that quietly change the next twenty years.</h2>
        <p className="sd-final-p">
          The account has been sitting there, available, your entire working life. This is simply
          the evening somebody finally explains it. {EVENT.seatsNote}
        </p>
        <a className="btn btn-accent btn-lg" href="#register" onClick={scrollToId('register')}>
          Save my seat <Ic name="arrow-right" size={18} />
        </a>
        <div className="sd-final-meta">
          {formatEventTime(EVENT)} · {EVENT.durationMins} minutes · {EVENT.location} · {EVENT.cost}
        </div>
        <p className="sd-disc">
          This session is educational and is not tax, legal, or investment advice; please consult
          your own advisor about your circumstances. Proactive Sustainable Bonds is not a custodian
          and does not provide custodial services. Nothing here is an offer to sell or a
          solicitation to buy any security. Interests in Proactive's bonds are offered solely under
          Rule 506(c) of Regulation D to accredited investors via the Fund's Private Placement
          Memorandum, which governs. Such securities are unregistered, speculative and illiquid,
          involve risk including loss of capital, and are not FDIC- or SIPC-insured. Past
          performance does not indicate future results; targets are illustrative.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- sticky rail */

function StickyBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 780);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <div className="sd-sticky glass glass-strong">
      <div className="sd-sticky-txt">
        <strong>{formatEventDate(EVENT, { short: true })}</strong>
        <span>{formatEventTime(EVENT)} · {EVENT.location}</span>
      </div>
      <a className="btn btn-accent btn-sm" href="#register" onClick={scrollToId('register')}>Save my seat</a>
    </div>
  );
}

/* -------------------------------------------------------------------- page */

export default function SdiraWebinarPage() {
  useEffect(() => { initInteractions(); }, []);
  return (
    <React.Fragment>
      <MktNav />
      <main>
        <Hero />
        <Dream />
        <Learn />
        <Speaker />
        <Agenda />
        <ForYou />
        <Hosts />
        <Faq />
        <FinalCta />
      </main>
      <StickyBar />
      <MktFooter />

      <style>{`
        /* ---- shared section rhythm ---- */
        /* One container width everywhere, so every section shares a left edge.
           Sections that want a narrower measure cap their own content block. */
        .sd-sec { max-width: 1180px; margin: 0 auto; padding: 104px 22px 0; }
        .sd-sec-narrow .sd-calc,
        .sd-sec-narrow .sd-agenda,
        .sd-sec-narrow .sd-faq { max-width: 920px; }
        .sd-sec-narrow .sd-speaker,
        .sd-sec-narrow .sd-foryou { max-width: 980px; }
        .sd-sec-head { max-width: 62ch; margin-bottom: 40px; }
        .sd-h2 { margin: 14px 0 0; font-size: clamp(1.85rem, 3.4vw, 2.6rem); line-height: 1.1;
                 letter-spacing: -0.022em; color: var(--forest-700); font-weight: 600; font-family: var(--font-editorial); }
        [data-theme="dark"] .sd-h2 { color: var(--lime-300); }
        .sd-h2-tight { margin-bottom: 6px; }
        .sd-sec-sub { color: var(--fg-2); font-size: var(--text-base); line-height: 1.72; margin: 16px 0 0; }
        .sd-prose { display: grid; gap: 18px; margin-top: 20px; max-width: 64ch; }
        .sd-prose p { color: var(--fg-2); line-height: 1.78; margin: 0; }
        .sd-prose strong { color: var(--fg-1); font-weight: 600; }

        /* ---- hero ---- */
        .sd-hero { position: relative; overflow: hidden; background: linear-gradient(158deg, var(--forest-700) 0%, var(--forest-900) 62%, #071a0f 100%); }
        .sd-hero-glow { position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(760px 620px at 88% -6%, rgba(149,196,92,0.22), transparent 62%),
                      radial-gradient(680px 520px at -8% 108%, rgba(127,178,79,0.14), transparent 60%); }
        .sd-hero-inner { position: relative; z-index: 1; max-width: 1240px; margin: 0 auto;
          padding: 72px 22px 88px; display: grid; grid-template-columns: 1.08fr 0.92fr; gap: 56px; align-items: start; }
        .sd-eyebrow { margin-bottom: 26px; background: rgba(255,255,255,0.10); color: #eaf3e2;
          border: 1px solid rgba(255,255,255,0.26); font-weight: 600; }
        .sd-h1 { margin: 0 0 22px; font-family: var(--font-editorial); font-weight: 600;
          font-size: clamp(2.3rem, 4.4vw, 3.5rem); line-height: 1.07; letter-spacing: -0.024em; color: #fff; }
        .sd-h1 em { font-style: italic; color: var(--lime-300); }
        .sd-lead { max-width: 56ch; margin: 0 0 15px; color: rgba(238,246,232,0.84); line-height: 1.7; font-size: var(--text-base); }
        .sd-lead strong { color: #fff; font-weight: 600; }
        .sd-lead-last { color: var(--lime-300); font-weight: 500; }

        .sd-meta { display: flex; flex-wrap: wrap; gap: 10px; margin: 26px 0 28px; }
        .sd-meta-item { display: inline-flex; align-items: center; gap: 7px; font-size: var(--text-xs);
          font-weight: 600; padding: 0.5em 0.9em; border-radius: var(--radius-pill); }
        .sd-meta-dark .sd-meta-item { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16); color: #e6f0de; }
        .sd-meta-dark .sd-meta-item svg { color: var(--lime-300); }
        .sd-meta-light .sd-meta-item { background: var(--surface); border: 1px solid var(--border); color: var(--fg-2); }
        .sd-meta-light .sd-meta-item svg { color: var(--brand); }

        .sd-hero-cta { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }
        .sd-btn-light { color: #fff; border: 1px solid rgba(255,255,255,0.42); background: rgba(255,255,255,0.06); text-decoration: none; }
        .sd-btn-light:hover { background: rgba(255,255,255,0.12); }
        .sd-count { font-family: var(--font-mono); font-size: var(--text-xs); letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--lime-300); }

        .sd-speaker-mini { display: flex; align-items: center; gap: 14px; margin-top: 34px;
          padding-top: 26px; border-top: 1px solid rgba(255,255,255,0.14); }
        .sd-speaker-mini img { width: 56px; height: 56px; border-radius: 50%; object-fit: cover;
          flex: none; box-shadow: 0 0 0 2px rgba(174,208,121,0.55); }
        .sd-speaker-mini-n { color: #fff; font-weight: 700; font-size: var(--text-sm); }
        .sd-speaker-mini-r { color: rgba(234,243,226,0.66); font-size: var(--text-xs); margin-top: 2px; }

        /* ---- registration card ---- */
        .sd-hero-form { position: sticky; top: 96px; }
        .sd-reg { background: var(--surface); border-radius: var(--radius-2xl); padding: 32px 30px;
          box-shadow: 0 28px 70px rgba(6,20,12,0.42); border: 1px solid rgba(255,255,255,0.5); }
        [data-theme="dark"] .sd-reg { border-color: var(--border); }
        .sd-reg-head { margin-bottom: 22px; }
        .sd-reg-badge { display: inline-block; font-size: var(--text-2xs); font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--forest-600);
          background: var(--lime-100); padding: 0.45em 0.85em; border-radius: var(--radius-pill); }
        [data-theme="dark"] .sd-reg-badge { background: rgba(127,178,79,0.18); color: var(--lime-300); }
        .sd-reg-h { margin: 14px 0 8px; font-size: var(--text-2xl); font-weight: 700; letter-spacing: -0.02em; color: var(--fg-1); }
        .sd-reg-sub { margin: 0; font-size: var(--text-sm); color: var(--fg-2); line-height: 1.6; }
        .sd-reg-fine { margin: 4px 0 0; font-size: var(--text-xs); color: var(--fg-3); text-align: center; line-height: 1.5; }
        .sd-reg-done { text-align: center; display: grid; justify-items: center; gap: 14px; padding: 22px 4px; }
        .sd-reg-done-h { margin: 6px 0 0; font-size: var(--text-2xl); font-weight: 700; color: var(--fg-1); letter-spacing: -0.02em; }
        .sd-reg-done-p { margin: 0; font-size: var(--text-sm); color: var(--fg-2); line-height: 1.65; max-width: 34ch; }

        /* ---- the compounding illustration ---- */
        .sd-calc { margin-top: 42px; border-radius: var(--radius-2xl); padding: 32px clamp(22px, 4vw, 40px);
          background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow-md); }
        .sd-calc-head { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-bottom: 26px; }
        .sd-calc-tabs button { font-family: var(--font-mono); font-size: var(--text-sm); }
        .sd-calc-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center; }
        .sd-calc-col { border-radius: var(--radius-xl); padding: 24px 22px; background: var(--bg-sunken); text-align: center; }
        .sd-calc-col-hero { background: linear-gradient(158deg, var(--forest-600), var(--forest-800)); }
        .sd-calc-label { font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--fg-3); }
        .sd-calc-col-hero .sd-calc-label { color: var(--lime-300); }
        .sd-calc-n { font-size: clamp(1.6rem, 3.6vw, 2.5rem); font-weight: 600; letter-spacing: -0.03em;
          color: #fff; margin: 10px 0 6px; line-height: 1; }
        .sd-calc-n-muted { color: var(--fg-2); }
        .sd-calc-rate { font-size: var(--text-xs); color: var(--fg-3); }
        .sd-calc-col-hero .sd-calc-rate { color: rgba(234,243,226,0.72); }
        .sd-calc-arrow { color: var(--fg-3); display: grid; place-items: center; }
        .sd-calc-delta { display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-top: 22px; padding: 14px 18px; border-radius: var(--radius-pill);
          background: var(--lime-100); color: var(--forest-700); font-size: var(--text-sm); text-align: center; }
        .sd-calc-delta strong { font-family: var(--font-mono); font-weight: 600; }
        [data-theme="dark"] .sd-calc-delta { background: rgba(127,178,79,0.16); color: var(--lime-300); }
        .sd-calc-fine { margin: 18px 0 0; font-size: var(--text-xs); color: var(--fg-3); line-height: 1.6; }

        /* ---- what you'll learn ---- */
        .sd-learn { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .sd-learn-card { background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-2xl); padding: 30px 30px 32px; box-shadow: var(--shadow-sm); }
        .sd-learn-ic { width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center;
          background: color-mix(in srgb, var(--brand) 13%, var(--surface)); color: var(--forest-600); margin-bottom: 18px; }
        [data-theme="dark"] .sd-learn-ic { color: var(--lime-300); }
        .sd-learn-h { margin: 0 0 10px; font-size: var(--text-lg); font-weight: 700; color: var(--fg-1); line-height: 1.25; letter-spacing: -0.015em; }
        .sd-learn-p { margin: 0; font-size: var(--text-sm); color: var(--fg-2); line-height: 1.72; }

        /* ---- speaker ---- */
        .sd-speaker { display: grid; grid-template-columns: 260px 1fr; gap: 44px; align-items: start; }
        .sd-speaker-photo { display: grid; justify-items: center; gap: 14px; }
        .sd-speaker-photo img { width: 100%; max-width: 260px; aspect-ratio: 1; border-radius: 50%;
          object-fit: cover; box-shadow: 0 0 0 4px var(--surface), 0 0 0 7px var(--lime-300), var(--shadow-lg); }
        .sd-speaker-li { display: inline-flex; align-items: center; gap: 6px; font-size: var(--text-sm);
          font-weight: 600; color: var(--brand); text-decoration: none; }
        .sd-speaker-li:hover { text-decoration: underline; }
        .sd-speaker-role { margin: 4px 0 0; font-size: var(--text-sm); font-weight: 600; color: var(--fg-3); }
        .sd-speaker-role a { color: var(--brand); }
        .sd-pull { font-family: var(--font-editorial); font-style: italic; font-size: var(--text-lg);
          line-height: 1.5; color: var(--forest-700) !important; border-left: 2px solid var(--accent); padding-left: 18px; }
        [data-theme="dark"] .sd-pull { color: var(--lime-300) !important; }

        /* ---- agenda ---- */
        .sd-agenda { display: grid; gap: 2px; border-radius: var(--radius-xl); overflow: hidden;
          border: 1px solid var(--border); background: var(--border); }
        .sd-agenda-row { display: grid; grid-template-columns: 76px 1fr; gap: 18px; align-items: start;
          padding: 24px 28px; background: var(--surface); }
        .sd-agenda-n { font-family: var(--font-mono); font-size: var(--text-xl); font-weight: 500;
          color: color-mix(in srgb, var(--brand) 55%, transparent); line-height: 1.2; }
        .sd-agenda-top { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
        .sd-agenda-h { margin: 0; font-size: var(--text-base); font-weight: 700; color: var(--fg-1); }
        .sd-agenda-mins { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--fg-3); white-space: nowrap; }
        .sd-agenda-p { margin: 8px 0 0; font-size: var(--text-sm); color: var(--fg-2); line-height: 1.66; }

        /* ---- who it's for ---- */
        .sd-foryou { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 44px; align-items: start;
          background: var(--bg-sunken); border-radius: var(--radius-2xl); padding: clamp(30px, 4vw, 48px); }
        .sd-foryou-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 16px; }
        .sd-foryou-list li { display: flex; gap: 13px; align-items: flex-start; font-size: var(--text-base);
          color: var(--fg-1); line-height: 1.6; }
        .sd-foryou-tick { flex: none; width: 24px; height: 24px; border-radius: 50%; display: grid;
          place-items: center; background: var(--accent); color: #fff; margin-top: 2px; }

        /* ---- hosts ---- */
        .sd-team { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; }
        .sd-team-card { text-align: center; }
        .sd-team-photo { width: 100%; max-width: 128px; aspect-ratio: 1; border-radius: 50%; object-fit: cover;
          margin: 0 auto 14px; background: var(--bg-sunken); box-shadow: 0 0 0 3px var(--surface), 0 0 0 5px var(--lime-300); }
        .sd-team-name { font-size: var(--text-sm); font-weight: 700; color: var(--forest-700); line-height: 1.25; }
        [data-theme="dark"] .sd-team-name { color: var(--lime-300); }
        .sd-team-title { font-size: var(--text-2xs); font-weight: 700; letter-spacing: 0.05em;
          text-transform: uppercase; color: var(--fg-3); margin-top: 6px; line-height: 1.35; }

        /* ---- faq ---- */
        .sd-faq { display: grid; gap: 10px; }
        .sd-faq-item { background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 4px 22px; }
        .sd-faq-item summary { display: flex; align-items: center; justify-content: space-between; gap: 16px;
          cursor: pointer; list-style: none; padding: 18px 0; font-weight: 600; color: var(--fg-1); font-size: var(--text-base); }
        .sd-faq-item summary::-webkit-details-marker { display: none; }
        .sd-faq-item summary svg { flex: none; color: var(--fg-3); transition: transform var(--dur-base) var(--ease-out); }
        .sd-faq-item[open] summary svg { transform: rotate(180deg); }
        .sd-faq-item p { margin: 0 0 20px; font-size: var(--text-sm); color: var(--fg-2); line-height: 1.72; max-width: 72ch; }

        /* ---- final ---- */
        .sd-final { position: relative; overflow: hidden; border-radius: var(--radius-2xl); text-align: center;
          padding: clamp(46px, 6vw, 76px) clamp(24px, 5vw, 64px);
          background: linear-gradient(155deg, var(--forest-600), var(--forest-900)); }
        .sd-final-h { margin: 14px auto 0; max-width: 22ch; color: #fff; font-family: var(--font-editorial);
          font-weight: 600; font-size: clamp(1.8rem, 3.6vw, 2.7rem); line-height: 1.12; letter-spacing: -0.022em; }
        .sd-final-p { margin: 18px auto 30px; max-width: 54ch; color: rgba(234,243,226,0.85);
          line-height: 1.68; font-size: var(--text-base); }
        .sd-final-meta { margin-top: 22px; font-size: var(--text-xs); letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(234,243,226,0.62); font-weight: 600; }
        .sd-disc { margin: 34px auto 0; max-width: 82ch; color: rgba(234,243,226,0.5); font-size: 11px; line-height: 1.65; }

        /* ---- sticky bar ---- */
        .sd-sticky { position: fixed; left: 50%; transform: translateX(-50%); bottom: 20px; z-index: 60;
          display: flex; align-items: center; gap: 20px; padding: 12px 12px 12px 22px;
          border-radius: var(--radius-pill); animation: psb-rise var(--dur-slow) var(--ease-out) both; }
        .sd-sticky-txt { display: flex; flex-direction: column; line-height: 1.25; }
        .sd-sticky-txt strong { font-size: var(--text-sm); color: var(--fg-1); }
        .sd-sticky-txt span { font-size: var(--text-xs); color: var(--fg-3); }

        /* ---- form (matches the site's Tenth Avenue form styling) ---- */
        .ta-form { display: grid; gap: 14px; font-family: inherit; position: relative; }
        .ta-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ta-form__field { display: grid; gap: 6px; }
        .ta-form__label { font-size: var(--text-sm); font-weight: 600; color: var(--fg-2); }
        .ta-form input[type=text], .ta-form input[type=email], .ta-form input[type=tel], .ta-form select, .ta-form textarea {
          font: inherit; width: 100%; padding: 11px 13px; border: 1px solid var(--border); border-radius: var(--radius-md);
          background: var(--surface); color: var(--fg-1); box-sizing: border-box;
          transition: border-color .15s var(--ease-out), box-shadow .15s var(--ease-out); }
        .ta-form input:focus, .ta-form select:focus, .ta-form textarea:focus {
          outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
        .ta-form input::placeholder, .ta-form textarea::placeholder { color: var(--fg-3); }
        .ta-form textarea { resize: vertical; min-height: 58px; }
        .ta-form__phone { display: flex; gap: 8px; }
        .ta-form__phone-country { flex: 0 0 auto; max-width: 44%; }
        .ta-form__phone input[type=tel] { flex: 1 1 auto; }
        .ta-form__check { display: flex; align-items: flex-start; gap: 10px; font-size: var(--text-xs); color: var(--fg-2); line-height: 1.5; }
        .ta-form__check input { margin-top: 2px; flex: none; accent-color: var(--accent); }
        .ta-form a { color: var(--brand); }
        .ta-form__submit { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font: inherit;
          font-weight: 600; font-size: var(--text-base); padding: 14px 18px; border: 0; border-radius: 999px;
          background: var(--accent); color: #fff; cursor: pointer; width: 100%; margin-top: 4px;
          transition: background .15s var(--ease-out), transform .1s var(--ease-out); }
        .ta-form__submit:hover { background: color-mix(in srgb, var(--accent) 86%, #000); }
        .ta-form__submit:active { transform: scale(.98); }

        /* ---- responsive ---- */
        @media (max-width: 1060px) {
          .sd-hero-inner { grid-template-columns: 1fr; gap: 40px; padding-top: 56px; }
          .sd-hero-form { position: static; }
          .sd-reg { max-width: 560px; }
          .sd-team { grid-template-columns: repeat(3, 1fr); gap: 26px; }
        }
        @media (max-width: 860px) {
          .sd-sec { padding-top: 84px; }
          .sd-learn { grid-template-columns: 1fr; }
          .sd-speaker { grid-template-columns: 1fr; gap: 30px; justify-items: start; }
          .sd-speaker-photo img { max-width: 200px; }
          .sd-foryou { grid-template-columns: 1fr; gap: 26px; }
          .sd-calc-grid { grid-template-columns: 1fr; }
          .sd-calc-arrow { transform: rotate(90deg); }
        }
        @media (max-width: 560px) {
          .ta-row { grid-template-columns: 1fr; }
          .sd-team { grid-template-columns: repeat(2, 1fr); }
          .sd-agenda-row { grid-template-columns: 1fr; gap: 6px; padding: 20px 20px; }
          .sd-agenda-top { flex-direction: column; gap: 2px; }
          .sd-sticky { left: 12px; right: 12px; transform: none; width: auto; }
          .sd-calc-head { gap: 10px; }
        }
      `}</style>
    </React.Fragment>
  );
}
