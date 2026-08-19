import React from 'react';
import { MktNav, MktFooter } from './MktChrome.jsx';
import { Ic } from './icons.jsx';
import { initInteractions } from '../lib/interactions.js';
import { getEvent, formatEventDate, formatEventTime, formatRuntime } from '../data/events.js';

const { useEffect, useState, useRef } = React;

// Companion page for the recording of the 18 August 2026 Self-Directed IRA
// webinar. Everything on this page comes from the session itself — the Zoom
// recording and its transcript — so it can be read instead of watched, or used
// afterwards as a reference. Figures quoted by the speaker are attributed to
// him and carry the "as stated on the call" caveat rather than being restated
// as Proactive's own numbers.
const EVENT = getEvent('self-directed-ira');
const REC = EVENT.recording;

// Enquiries from this page go to the evergreen `ira` list in Tenth Avenue, the
// same key /ira uses. Deliberately NOT the `sdira-webinar` key: that list is for
// people awaiting a Zoom join link, and the evening has already happened.
// See rules.md section 5 — a form key that does not exist still shows success.
const TA_FORM = 'https://tenthavenue.io/api/forms/ira/submit';

const TA_COUNTRIES = [['US', 'United States (+1)'], ['CA', 'Canada (+1)'], ['GB', 'United Kingdom (+44)'], ['AU', 'Australia (+61)'], ['IN', 'India (+91)'], ['AE', 'United Arab Emirates (+971)'], ['DE', 'Germany (+49)'], ['FR', 'France (+33)'], ['ES', 'Spain (+34)'], ['IT', 'Italy (+39)'], ['NL', 'Netherlands (+31)'], ['IE', 'Ireland (+353)'], ['NZ', 'New Zealand (+64)'], ['SG', 'Singapore (+65)'], ['HK', 'Hong Kong (+852)'], ['ZA', 'South Africa (+27)'], ['NG', 'Nigeria (+234)'], ['KE', 'Kenya (+254)'], ['MX', 'Mexico (+52)'], ['BR', 'Brazil (+55)'], ['JP', 'Japan (+81)'], ['CH', 'Switzerland (+41)']];

const WHEN = `${formatEventDate(EVENT)} · ${formatEventTime(EVENT)}`;
const RUNTIME = formatRuntime(REC.durationMins);

/* ---------------------------------------------------------------- content -- */

// Headline figures, drawn from the session. Kept to three so the band reads at
// a glance; each one is something Jeff said on the night. The offer deliberately
// is not one of them — it lives in the promo card down at Next steps, where
// somebody who has actually watched the hour will be.
const HERO_STATS = [
  ['Runtime', RUNTIME, 'Presentation and live Q&A'],
  ['Sitting in American IRAs', '$18.2T', 'Most of it never leaves the market'],
  ['Your IRA may not hold', '3 things', 'Everything else is fair game'],
];

// Chapter marks are minutes into the recording, taken from the transcript. Zoom
// has no reliable relative deep link, so these are read as signposts rather
// than rendered as links.
const CHAPTERS = [
  ['00:41', 'Who Jeff is, and who Directed IRA is', 'Fourteen years in the industry, and a custodian founded by the tax attorney who wrote the handbook. Why a trust company can hold what Fidelity and Schwab will not.'],
  ['09:28', 'What your IRA is allowed to hold', 'The rules were written in the mid-1970s to allow almost anything. Real estate, private funds, notes, metals, land, crypto — the list is long enough that the short version is the other one.'],
  ['10:54', 'The three things it may not hold', 'Life insurance contracts, S-corporation stock, and certain collectibles. That is the whole prohibited list.'],
  ['12:22', 'Six accounts you can self-direct', 'Traditional and Roth IRAs, SEP IRAs, the solo 401(k), the HSA with its three-way tax break, and the Coverdell education account almost nobody mentions.'],
  ['21:53', 'Why a private fund suits a retirement account', 'Passive by construction, genuinely uncorrelated to the market, compounding untaxed inside the account, and — unusually — with the rate disclosed before you invest.'],
  ['25:48', 'The rules that cost people money', 'Your IRA cannot transact with you, your spouse, your parents, your children, or your in-laws. Your brother, your aunt and your friends are all fine.'],
  ['29:08', 'Can you mix alternatives and the market?', 'Greg Simonian asks whether a self-directed account has to be all-in on alternatives, and how quickly money can move between them.'],
  ['34:09', 'Getting started: open, fund, invest', 'Five minutes to open. Five to seven business days to transfer, two to three weeks to roll over. The one paperwork mistake that sends a transfer back to the start.'],
  ['43:19', 'Direction of Investment, and how to title it', 'The form that authorises your custodian to wire, the supporting document that goes with it, and the vesting title that keeps the whole thing tax-sheltered.'],
  ['48:17', 'A real deal: Jeff’s own $100,000 note', 'His Roth IRA and his HSA lending together against a rehab, at 10% with two points — and exactly how the interest came back tax-free.'],
  ['55:50', 'The offer for people on the call', `Promotion code ${REC.promoCode}: ${REC.promoNote.replace(/\.$/, '')}.`],
  ['57:02', 'Where Proactive fits', 'Dr. Canaan Van Williams on the affordable-housing portfolio behind the bonds, the short two- and three-year terms, and the quarterly income.'],
  ['58:44', 'Live Q&A', 'Ten questions from the room, the chat and the team — minimums, volatility, custodian due diligence, and whether your current employer’s 401(k) can move.'],
];

// The six things worth writing down. Ordered the way Jeff ranked them by how
// often they trip people up, not the order he presented them in.
const TAKEAWAYS = [
  {
    n: '01',
    icon: 'file-text',
    title: 'The prohibited list is three items long',
    body: 'Life insurance contracts, S-corporation stock, and certain collectibles — alcohol, firearms, collectible cars. Everything else is fair game: real estate, undeveloped land, private funds, private company stock, promissory notes, tax lien certificates, precious metals, oil and gas, cryptocurrency. Jeff put it plainly: it is easier to tell you what you cannot invest in.',
  },
  {
    n: '02',
    icon: 'users',
    title: 'Disqualified persons run up and down, not across',
    body: 'Your IRA may not transact with you, your spouse, your parents, your grandparents, your children, your grandchildren, or your sons- and daughters-in-law. Brothers, sisters, aunts, uncles, nieces, nephews and friends are all allowed — which is why "your IRA cannot invest with family" is the wrong summary of the rule.',
  },
  {
    n: '03',
    icon: 'arrow-right',
    title: 'A transfer and a rollover are not the same thing',
    body: 'IRA to IRA is a transfer: about five to seven business days, and you can move part of a balance rather than all of it. An old employer plan to an IRA is a rollover: two to three weeks, initiated with the plan administrator, and — in 2026 — still settled by a paper check in the mail.',
  },
  {
    n: '04',
    icon: 'check-circle',
    title: 'Sell to cash before you request the transfer',
    body: 'The most common reason a transfer comes back rejected. Your current custodian cannot send Apple shares to fund a bond subscription, and they will not guess which holdings you meant to liquidate. Call them, raise the cash, then file the transfer request.',
  },
  {
    n: '05',
    icon: 'lock',
    title: 'The vesting title is what keeps it tax-sheltered',
    body: 'On the subscription agreement the subscriber is not you. It is "Directed Trust Company FBO [your name] Roth IRA". Get that line right and every dividend flows back into the account untaxed; get it wrong and you have a personal investment with an unwelcome tax consequence. Length does not matter — Jeff has seen a title run half a page.',
  },
  {
    n: '06',
    icon: 'shield-check',
    title: 'Your accreditation extends to your IRA',
    body: 'On an accredited questionnaire you answer personally, then title the subscription to the account. And note what the custodian is: a passive custodian reviews an asset for custody, not for merit. The due diligence stays with you.',
  },
];

// Contribution limits are the ones Jeff quoted for tax year 2026, on the call.
const ACCOUNTS = [
  ['Traditional IRA', '$7,500 for 2026', 'Deduct now, grow tax-deferred, pay tax on distributions after 59½.'],
  ['Roth IRA', '$7,500 for 2026', 'No deduction, but growth and qualified distributions are tax-free — and beneficiaries inherit the same treatment.'],
  ['SEP IRA', 'Up to 25% of pay, max $72,000', 'For the self-employed and small businesses. Self-directs exactly like an IRA.'],
  ['Solo 401(k)', 'Up to $72,000', 'Self-employed with no full-time staff. Traditional and Roth sides, chosen year by year.'],
  ['Health savings account', 'Requires a qualifying HDHP', 'The three-way break: deductible in, tax-free growth, tax-free out for qualified medical costs.'],
  ['Coverdell ESA', 'Education expenses', 'Grows tax-free and distributes tax-free for qualified education. One client turned a $1,000 contribution into a $12,000 tax-free assignment fee for her grandchildren.'],
];

const STEPS = [
  ['Open', 'About five minutes', 'An online application: your details, your beneficiary, an electronic signature. Directed IRA processes applications within one business day and emails the new account number.'],
  ['Fund — transfer', 'Five to seven business days', 'IRA to IRA, custodian to custodian, no taxable event. Partial transfers are fine, so you can move only what an investment needs and leave the rest where it is. Liquidate to cash first.'],
  ['Fund — rollover', 'Two to three weeks', 'From an old employer plan. Start with the plan administrator, not the custodian. If it is your current employer, check whether the plan allows an in-service rollover — more do than used to, sometimes for part of the balance.'],
  ['Fund — contribution', 'Next day by wire', 'Check, wire, ACH or a linked bank account. Wires are available the following day; the rest clear in a few business days.'],
  ['Invest', 'Same day, once funded', 'A Direction of Investment form authorising the custodian, plus the supporting document — a subscription agreement for a private fund, a purchase contract for property, an invoice for metals. Then the vesting title, and the wire goes out.'],
];

// Jeff's own transaction, presented as he presented it.
const DEAL = [
  ['Loan amount', '$100,000'],
  ['From his Roth IRA', '$75,000 · 75%'],
  ['From his HSA', '$25,000 · 25%'],
  ['Interest rate', '10% simple, annually'],
  ['Payments', 'Interest only, monthly'],
  ['Points at closing', '2%'],
  ['Term', '18 months, balloon, optional extension'],
  ['Cash-on-cash return', '12% a year'],
  ['Security', 'Deed of trust on the property'],
  ['Closed at', 'The local title company'],
  ['Lender of record', 'Directed Trust Company FBO Jeff Minnick Roth IRA, 75% undivided interest'],
  ['Outcome', 'Borrower refinanced; both accounts repaid in full'],
];

const QA = [
  {
    n: '01',
    q: 'Does the Self-Directed IRA Handbook actually cover an investment like Proactive’s?',
    who: 'Asked by Addie Agarwal',
    a: ['Yes. It covers every asset class you can hold, and private funds are one of them — there is a chapter that walks step by step through making that kind of investment with an IRA or 401(k), including how to handle and title the investment documents. Offerings like Proactive’s are an extremely common investment for us to process.'],
  },
  {
    n: '02',
    q: 'Are your clients all-in on alternatives, or do they mix in the market? And how quickly can money move between the two?',
    who: 'Asked by Greg Simonian',
    a: [
      'You can still hold stocks, bonds, mutual funds and ETFs here. Most clients are in alternatives — that is why they opened the account — and we are not a discount brokerage, so we will not be the cheapest place to trade the market.',
      'What I mostly see is investors taking returns from an alternative and, if there is not enough to do another one yet, parking it in a stock or a bond so it keeps working. You can also transfer it back to a Schwab IRA if you would rather invest it there. Both roads are open.',
    ],
  },
  {
    n: '03',
    q: 'Can one account hold several different alternative investments at the same time?',
    who: 'Asked by Greg Simonian',
    a: ['Yes. A private fund, a rental property and some precious metals can all sit in a single self-directed IRA, and you can move between asset types as opportunities come up.'],
  },
  {
    n: '04',
    q: 'Is there a minimum to contribute if you are just starting out?',
    who: 'Asked by Steven, in the chat',
    a: ['There is no minimum. You could open an account with $5 if you wanted to. What you can invest is simply whatever balance the account holds, so in practice it is the investment’s own minimum that sets the number.'],
  },
  {
    n: '05',
    q: 'Is it true that $18.2 trillion sits in these custodian accounts, earning 6–7% on average?',
    who: 'Asked by Addie Agarwal',
    a: ['That is an accurate statistic, and it is IRAs alone. Add the employer plans — 401(k)s, thrift savings plans — and the figure is closer to $47 trillion in US retirement accounts.'],
  },
  {
    n: '06',
    q: 'And the same custodians put that money into real estate and alternatives themselves?',
    who: 'Asked by Addie Agarwal',
    a: ['Also true. Look at how the wealthiest households allocate: the further up you go, the larger the share of wealth sitting in real estate and alternatives rather than in the market.'],
  },
  {
    n: '07',
    q: 'So is this the same access the top 1% has, opened up to everyone else?',
    who: 'Asked by Addie Agarwal',
    a: ['That is exactly right. We are trying to democratise it — the everyday American investing the same way institutions and family offices do, in things like real estate. An operator like Proactive Sustainable Bonds is one of the ways that becomes available to you.'],
  },
  {
    n: '08',
    q: 'How does holding real estate inside a self-directed IRA affect volatility?',
    who: 'Asked by Jesse Hollander',
    a: ['Real estate is an appreciating asset, and it is not moving with the market day to day. That is exactly why many of our account holders diversify into it — it tends to appreciate over time and produce a more consistent rate of return, which takes some of the volatility out.'],
  },
  {
    n: '09',
    q: 'Is anyone at Directed IRA watching these investments and warning people when something goes wrong?',
    who: 'Asked by Greg Simonian',
    a: [
      'Directed IRA is a passive custodian. We do not recommend investments and we do not review them for merit — the due diligence sits with the account owner, and I would keep saying that.',
      'What we do review is whether an asset is approved for custody: whether the documentation is there to hold it properly, and whether there is anything about the parties involved — a history of fraud, say — that means we would rather not hold it. Being founded by a tax attorney, we have a robust compliance department behind that review. It is a real check, but it is not a substitute for your own research.',
    ],
  },
  {
    n: '10',
    q: 'Can I use the 401(k) I have with my current employer?',
    who: 'Asked in the chat',
    a: ['It depends on the plan, and only your plan administrator can tell you. The sponsoring company sets the rules, and many plans do not allow a rollover while you are still working and contributing. But some do, more are allowing it than used to, and some permit a partial rollover rather than the whole balance. It is worth the phone call.'],
  },
];

const QUOTES = [
  ['It’s easier for me to tell you guys what you can’t invest into.', 'Jeff Minnick, on the prohibited list'],
  ['The true power of a self-directed IRA is you’re able to invest in what you know and what you’re more comfortable with.', 'Jeff Minnick'],
  ['What other vehicle does the government afford you where you can actually build wealth truly 100% tax-free?', 'Jeff Minnick, on the Roth IRA'],
  ['It is 2026, but 99.9% of rollovers are still checks sent through the mail.', 'Jeff Minnick, on giving yourself lead time'],
  ['It’s unfortunate they don’t teach you Retirement 101 when we’re in school, so the onus is really on you.', 'Jeff Minnick'],
  ['We are trying to democratize — you can invest the same way as these large institutional investors or family offices.', 'Jeff Minnick'],
];

const HOSTS = [
  ['/img/team/canaan.webp', 'Dr. Canaan Van Williams', 'Impact CEO & Managing Founder'],
  ['/img/team/greg.webp', 'Greg C. Simonian', 'Senior Vice President'],
  ['/img/team/jesse.webp', 'Jesse Hollander', 'Director'],
];

/* ----------------------------------------------------------------- helpers -- */

function scrollToId(id) {
  return (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof document === 'undefined') return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
}

// Section heading. With copy it runs as two columns on wide screens — heading
// left, copy right — so the row is filled while each column keeps a readable
// measure. See rules.md section 6 "Layout".
function SecHead({ eyebrow, title, children }) {
  return (
    <div className={`rc-sec-head${children ? ' rc-sec-head-split' : ''}`}>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="rc-h2">{title}</h2>
      </div>
      {children ? <div className="rc-sec-head-copy">{children}</div> : null}
    </div>
  );
}

/* -------------------------------------------------------------------- hero -- */

function Hero({ onWatch }) {
  return (
    <section className="rc-hero">
      <div className="rc-hero-glow" />
      <div className="rc-hero-inner">
        <span className="eyebrow-pill rc-eyebrow">
          <span className="dot" style={{ color: 'var(--lime-300)' }} />
          Webinar recording · Watch any time
        </span>
        <div className="rc-hero-grid">
          <div>
            <h1 className="rc-h1">The Self-Directed IRA session. <em>The whole hour.</em></h1>
            <p className="rc-hero-when">Recorded {WHEN}</p>
            <p className="rc-hero-who">
              Jeff Minnick of Directed IRA, with Dr. Canaan Van Williams and the Proactive team
            </p>
          </div>
          <div className="rc-hero-side">
            <p className="rc-lead">
              Thank you for spending your Tuesday evening with us. Here is the recording in full,
              along with the parts worth keeping: what the account is allowed to hold, the
              paperwork order that keeps a transfer clean, the deal Jeff did with his own Roth
              IRA, and every question that came in on the night.
            </p>
            <div className="rc-hero-cta">
              <a className="btn btn-accent btn-lg" href="#watch" onClick={onWatch}>
                Watch the recording <Ic name="play" size={17} />
              </a>
              <a className="btn btn-lg rc-btn-light" href="#chapters" onClick={scrollToId('chapters')}>
                What it covered
              </a>
            </div>
          </div>
        </div>

        <div className="rc-stats">
          {HERO_STATS.map(([label, figure, note]) => (
            <div key={label} className="rc-stat">
              <span className="rc-stat-l">{label}</span>
              <span className="figure rc-stat-n">{figure}</span>
              <span className="rc-stat-s">{note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- watch -- */

// Zoom's own player, framed — but only after the visitor asks for it.
//
// Two reasons the poster is not decoration. First, Zoom's player moves focus
// into itself about a second after it loads, and focusing an element inside a
// frame scrolls the *parent* to bring the frame into view: mounting the iframe
// on page load yanked the reader ~1100px down the page, past the whole hero,
// unprompted. Deferring the mount to a click makes that jump the thing the
// visitor just asked for. Second, it keeps Zoom's cookies and its consent
// banner off the page until somebody actually wants to watch.
//
// The escape hatch below is load-bearing too: this is a cross-origin player,
// and a browser that blocks third-party cookies outright (Safari by default)
// may stop Zoom's own session completing inside a frame. Anyone who hits that
// needs a visible way out.
function Watch({ playing, onPlay }) {
  return (
    <section id="watch" className="rc-sec" style={{ scrollMarginTop: 88 }}>
      <SecHead eyebrow="The recording" title="Watch the full session.">
        <p>
          Unedited, start to finish. Jeff takes the first fifty-odd minutes and the room takes the
          rest — the questions run right through to the end, which is the part that never really
          survives a summary.
        </p>
        <p className="rc-sec-note">
          The player is Zoom’s own and loads when you press play. If it does not run in your
          browser, <a href={REC.zoomUrl} target="_blank" rel="noreferrer">open the recording on
          Zoom</a> instead — same video, new tab.
        </p>
      </SecHead>

      <div className={playing ? 'rc-player rc-player-live' : 'rc-player'}>
        {playing ? (
          <iframe
            src={REC.zoomUrl}
            title="Self-Directed IRA webinar recording — 18 August 2026"
            allow="fullscreen; autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <button type="button" className="rc-poster" onClick={onPlay}>
            <span className="rc-poster-glow" />
            <span className="rc-poster-body">
              <span className="rc-poster-play"><Ic name="play" size={26} /></span>
              <span className="rc-poster-h">Play the full session</span>
              <span className="rc-poster-s">
                {RUNTIME} · Recorded {formatEventDate(EVENT)}
              </span>
            </span>
            <span className="rc-poster-face">
              <img src={EVENT.speaker.image} alt="" loading="lazy" />
              <span className="rc-poster-face-n">{EVENT.speaker.name}</span>
              <span className="rc-poster-face-r">{EVENT.speaker.org}</span>
            </span>
          </button>
        )}
      </div>

      <div className="rc-player-facts">
        <div><span className="data-label">Runtime</span><strong>{RUNTIME}</strong></div>
        <div><span className="data-label">Recorded</span><strong>{formatEventDate(EVENT)}</strong></div>
        <div><span className="data-label">Guest</span><strong>{EVENT.speaker.name}, {EVENT.speaker.org}</strong></div>
        <div><span className="data-label">Questions</span><strong>Ten, answered live</strong></div>
        <a className="btn btn-ghost btn-sm rc-player-out" href={REC.zoomUrl} target="_blank" rel="noreferrer">
          Open on Zoom <Ic name="external-link" size={15} />
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ who was on it -- */

function Room() {
  return (
    <section className="rc-sec">
      <SecHead eyebrow="Who was on the call" title="One guest, and the people who put him there.">
        <p>
          We meet a great many investors who wish somebody had explained this account to them ten
          years sooner. So rather than explain it ourselves, we asked the person who sets them up
          all day — and then got out of the way.
        </p>
      </SecHead>

      <div className="rc-room">
        <div className="rc-guest">
          <img className="rc-guest-img" src={EVENT.speaker.image} alt={EVENT.speaker.name} loading="lazy" />
          <div className="rc-guest-body">
            <span className="rc-guest-tag">Guest speaker</span>
            <h3 className="rc-guest-n">{EVENT.speaker.name}</h3>
            <p className="rc-guest-r">
              Vice President of Relationship Management ·{' '}
              <a href={EVENT.speaker.orgUrl} target="_blank" rel="noreferrer">Directed IRA</a>
            </p>
            <p className="rc-guest-p">
              Fourteen years in the self-directed IRA industry, holding both the Certified IRA
              Services Professional and Certified IRA Professional designations. Directed IRA is
              the tradename of Directed Trust Company, an Arizona trust company founded by Mat
              Sorensen — the tax attorney who wrote <em>The Self-Directed IRA Handbook</em>, now in
              its third edition, and the first training manual Jeff was handed when he started.
            </p>
            <a className="rc-guest-li" href={EVENT.speaker.linkedin} target="_blank" rel="noreferrer">
              <Ic name="linkedin" size={16} />LinkedIn
            </a>
          </div>
        </div>

        <aside className="rc-hosts">
          <span className="data-label" style={{ color: 'var(--lime-300)' }}>From Proactive</span>
          <ul className="rc-hosts-list">
            {HOSTS.map(([img, name, role]) => (
              <li key={name}>
                <img src={img} alt={name} loading="lazy" />
                <div>
                  <div className="rc-host-n">{name}</div>
                  <div className="rc-host-r">{role}</div>
                </div>
              </li>
            ))}
          </ul>
          <p className="rc-hosts-note">
            Hosted by Addie Agarwal, who carried the questions from the chat into the room.
          </p>
        </aside>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- chapters -- */

function Chapters() {
  return (
    <section id="chapters" className="rc-sec" style={{ scrollMarginTop: 92 }}>
      <SecHead eyebrow="The hour, in order" title="What the session covered, and when.">
        <p>
          Minute marks, so you can go straight to the part you came for. If you only have ten
          minutes, take 25:48 for the rules and 48:17 for the deal Jeff did with his own account —
          they are the two that change how people behave.
        </p>
      </SecHead>
      <ol className="rc-chapters">
        {CHAPTERS.map(([at, title, body]) => (
          <li key={at} className="rc-chapter">
            <span className="rc-chapter-t">{at}</span>
            <div>
              <h3 className="rc-chapter-h">{title}</h3>
              <p className="rc-chapter-p">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* -------------------------------------------------------------- takeaways -- */

function Takeaways() {
  return (
    <section className="rc-sec">
      <SecHead eyebrow="Worth writing down" title="Six things people learn ten years too late.">
        <p>
          Most of the hour is mechanics, and mechanics are easy to nod along to and then forget.
          These are the six that decide whether the account does what you expect — the ones that
          cost real money when they are learned after the fact rather than before.
        </p>
      </SecHead>
      <div className="rc-takeaways">
        {TAKEAWAYS.map((t) => (
          <article key={t.n} className="rc-take">
            <div className="rc-take-top">
              <span className="rc-take-ic"><Ic name={t.icon} size={20} /></span>
              <span className="rc-take-n">{t.n}</span>
            </div>
            <h3 className="rc-take-h">{t.title}</h3>
            <p className="rc-take-p">{t.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- accounts -- */

function Accounts() {
  return (
    <section className="rc-sec">
      <SecHead eyebrow="The accounts" title="Six plans that can be self-directed.">
        <p>
          Not one account type but six, and most people only ever hear about the first two. The
          figures are the 2026 limits Jeff quoted on the night; they are indexed and change, so
          confirm yours with your custodian or CPA before you act on them.
        </p>
      </SecHead>
      <div className="rc-table">
        {ACCOUNTS.map(([name, limit, note]) => (
          <div key={name} className="rc-row">
            <div className="rc-row-n">{name}</div>
            <div className="rc-row-v">{limit}</div>
            <div className="rc-row-p">{note}</div>
          </div>
        ))}
      </div>
      <p className="rc-fine">
        Retirement age for penalty-free distributions is 59½. Eligibility for the SEP IRA, solo
        401(k), HSA and Coverdell depends on your circumstances — self-employment, staff, and in
        the HSA’s case a qualifying high-deductible health plan. A plan that merely has a high
        deductible does not necessarily qualify; your provider can confirm.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ steps -- */

function Steps() {
  return (
    <section className="rc-sec">
      <SecHead eyebrow="How it actually happens" title="Open, fund, invest. The timing is the hard part.">
        <p>
          Opening the account is the fast bit and it is the only step the custodian controls.
          Everything after it depends on somebody else’s mailroom, which is why Jeff’s advice was
          to start earlier than feels necessary — particularly if an offering has a closing date.
        </p>
      </SecHead>
      <div className="rc-steps">
        {STEPS.map(([title, timing, body], i) => (
          <div key={title} className="rc-step">
            <span className="rc-step-n">{String(i + 1).padStart(2, '0')}</span>
            <div className="rc-step-body">
              <div className="rc-step-top">
                <h3 className="rc-step-h">{title}</h3>
                <span className="rc-step-time">{timing}</span>
              </div>
              <p className="rc-step-p">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- deal -- */

function CaseStudy() {
  return (
    <section className="rc-sec">
      <SecHead eyebrow="The case study" title="A real deal, done with his own accounts.">
        <p>
          Jeff closed the presentation with a transaction of his own rather than a hypothetical:
          his Roth IRA and his health savings account lending together against a property somebody
          else was rehabbing, after that borrower had exhausted the bank financing.
        </p>
        <p>
          The point of it is the last line. Every dollar of interest came back into a Roth IRA and
          an HSA, which is to say it came back tax-free, and then went straight out again into the
          next deal.
        </p>
      </SecHead>
      <div className="rc-deal">
        <div className="rc-deal-grid">
          {DEAL.map(([k, v]) => (
            <div key={k} className="rc-deal-row">
              <span className="rc-deal-k">{k}</span>
              <span className="rc-deal-v">{v}</span>
            </div>
          ))}
        </div>
        <aside className="rc-deal-side">
          <p className="rc-pull">
            Two accounts, one note, and not a cent of tax on the way through.
          </p>
          <ul className="rc-points">
            <li>You cannot lend to yourself or any disqualified person</li>
            <li>You and the borrower set the terms — but 0% is a gift, not an investment</li>
            <li>Secured or unsecured; Jeff secures</li>
            <li>Multiple accounts can partner on one deal, or pool into an IRA-owned LLC</li>
          </ul>
          <p className="rc-deal-note">
            One grandfather on Jeff’s books partnered fourteen of his grandchildren’s accounts into
            a single transaction. The vesting title ran half a page. It made no difference.
          </p>
        </aside>
      </div>
      <p className="rc-fine">
        Described as presented on the call. It is one investor’s completed transaction, offered as
        an illustration of how a note is held inside a retirement account — not a Proactive
        offering, not a projection, and not a representation of any result you should expect.
      </p>
    </section>
  );
}

/* --------------------------------------------------------------------- qa -- */

function Questions() {
  return (
    <section id="questions" className="rc-sec" style={{ scrollMarginTop: 92 }}>
      <SecHead eyebrow="Live Q&amp;A · 18 August" title="Every question. Every answer.">
        <p>
          Everything that came in during the session — from the room, from the chat, and from our
          own team — tidied up for reading but not softened. If your question is not here, it did
          not get asked, so send it to us and we will get you an answer.
        </p>
      </SecHead>
      <div className="rc-qa">
        {QA.map((item) => (
          <details key={item.n} className="rc-qa-item">
            <summary>
              <span className="rc-qa-n">{item.n}</span>
              <span className="rc-qa-q">{item.q}</span>
              <Ic name="chevron-down" size={18} />
            </summary>
            <div className="rc-qa-body">
              <span className="rc-qa-who">{item.who}</span>
              <div className="rc-qa-a">
                <span className="rc-qa-by">Jeff Minnick</span>
                {item.a.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- quotes -- */

function Quotes() {
  return (
    <section className="rc-sec">
      <SecHead eyebrow="From the session" title="Lines worth keeping.">
        <p>
          If you skim one part of this page, make it this one. These are the moments where the
          thinking behind the account came through most clearly.
        </p>
      </SecHead>
      <div className="rc-quotes">
        {QUOTES.map(([q, who]) => (
          <figure key={who + q.slice(0, 12)} className="rc-quote">
            <blockquote>“{q}”</blockquote>
            <figcaption>{who}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- next steps -- */

function NextSteps() {
  return (
    <section id="next" className="rc-sec" style={{ scrollMarginTop: 92 }}>
      <div className="rc-next">
        <div className="rc-next-copy">
          <span className="eyebrow" style={{ color: 'var(--lime-300)' }}>Next steps</span>
          <h2 className="rc-next-h">The account has been available your entire working life.</h2>
          <p className="rc-next-p">
            Two things came out of the evening. Jeff will walk through your own situation — where
            your money is now, which account you need, how to move it — and open the account with
            {' '}<strong>{REC.promoCode}</strong> applied. And we will send you the Proactive
            materials, so that when the money lands there is something waiting for it.
          </p>
          <div className="rc-next-cta">
            <a className="btn btn-accent btn-lg" href="#contact" onClick={scrollToId('contact')}>
              Send us a note <Ic name="arrow-right" size={18} />
            </a>
            <a className="btn btn-lg rc-btn-light" href="/ira">How our bonds sit inside an IRA</a>
          </div>
        </div>
        <div className="rc-promo">
          <span className="rc-promo-l">Promotion code, from the call</span>
          <span className="rc-promo-code">{REC.promoCode}</span>
          <p className="rc-promo-p">{REC.promoNote}</p>
          <a className="btn btn-ghost btn-sm rc-promo-btn" href={EVENT.speaker.orgUrl} target="_blank" rel="noreferrer">
            Directed IRA <Ic name="external-link" size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- form -- */

function Contact() {
  const [done, setDone] = useState(false);
  const submitted = useRef(false);
  const onSink = () => { if (submitted.current) setDone(true); };

  return (
    <section id="contact" className="rc-sec" style={{ scrollMarginTop: 88 }}>
      <SecHead eyebrow="Ask us anything" title="Send a note and a person will answer it.">
        <p>
          Anything from the session: which account fits your situation, how to get an old 401(k)
          moving, what our bonds pay and how they are secured, or an introduction to Jeff. Tell us
          roughly where you are and we will come back to you.
        </p>
        <p className="rc-sec-note">
          Nobody calls you unless you ask. This is educational, not advice, and not an offer of
          any security.
        </p>
      </SecHead>

      <div className="rc-contact">
        <div className="rc-contact-side">
          <ul className="rc-points">
            <li>Which account type fits — IRA, Roth, SEP, solo 401(k) or HSA</li>
            <li>What to ask your current custodian before you transfer</li>
            <li>How a Proactive bond is titled and held inside an IRA</li>
            <li>An introduction to Jeff at Directed IRA</li>
          </ul>
          <p className="rc-contact-note">
            You do not need to be an accredited investor to ask. Proactive’s bonds themselves are
            offered only to accredited investors under Rule 506(c) — a separate conversation, and
            one we are happy to have when you get there.
          </p>
        </div>

        <div className="rc-form-card">
          {done ? (
            <div className="rc-done">
              <div className="check-ring"><span className="ripple" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <h3 className="rc-done-h">Got it. Talk soon.</h3>
              <p className="rc-done-p">
                Thank you — a real person reads these and one of the team will come back to you.
                In the meantime the recording is up above, and it is not going anywhere.
              </p>
              <a className="btn btn-accent" href="#watch" onClick={scrollToId('watch')}>
                <Ic name="play" size={16} />Back to the recording
              </a>
            </div>
          ) : (
            <form action={TA_FORM} method="POST" className="ta-form" target="ta_sink_recording" onSubmit={() => { submitted.current = true; }}>
              <div style={{ position: 'absolute', left: -9999 }} aria-hidden="true">
                <label>Leave this field empty<input type="text" name="_hp" tabIndex={-1} autoComplete="off" /></label>
              </div>
              <div className="ta-row">
                <div className="ta-form__field"><label className="ta-form__label" htmlFor="rc_first">First name *</label><input id="rc_first" type="text" name="first_name" required /></div>
                <div className="ta-form__field"><label className="ta-form__label" htmlFor="rc_last">Last name *</label><input id="rc_last" type="text" name="last_name" required /></div>
              </div>
              <div className="ta-form__field"><label className="ta-form__label" htmlFor="rc_email">Email *</label><input id="rc_email" type="email" name="email" required /></div>
              <div className="ta-form__field">
                <label className="ta-form__label" htmlFor="rc_phone">Phone *</label>
                <div className="ta-form__phone">
                  <select name="phone__country" className="ta-form__phone-country" aria-label="Country code">{TA_COUNTRIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                  <input id="rc_phone" type="tel" inputMode="tel" name="phone" placeholder="Phone number" required />
                </div>
              </div>
              <div className="ta-form__field">
                <label className="ta-form__label" htmlFor="rc_msg">What came up while you were watching?</label>
                <textarea id="rc_msg" name="message" rows={3} placeholder="Where your retirement money sits today, what you would like to move, anything from the session you want unpacked."></textarea>
              </div>
              <div className="ta-form__field">
                <label className="ta-form__label" htmlFor="rc_acc">Are you an accredited investor? *</label>
                <select id="rc_acc" name="field_9zklv" required defaultValue=""><option value="" disabled>Select one…</option><option value="Yes">Yes</option><option value="No">No</option><option value="Not sure">Not sure</option></select>
              </div>
              <label className="ta-form__check">
                <input type="checkbox" name="field_yapu2" />
                <span>I consent to receive marketing and promotional messages from Proactive Sustainable Bonds at the phone number provided. Frequency may vary; message &amp; data rates may apply. Text HELP for help, STOP to opt out. <a href="https://tenthavenue.io/legal/proactive/privacy" target="_blank" rel="noreferrer">Privacy</a> · <a href="https://tenthavenue.io/legal/proactive/terms" target="_blank" rel="noreferrer">SMS Terms</a></span>
              </label>
              <button type="submit" className="ta-form__submit">Send it <Ic name="arrow-right" size={18} /></button>
            </form>
          )}
          <iframe name="ta_sink_recording" title="form submission" onLoad={onSink} style={{ display: 'none' }}></iframe>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- disclosures -- */

function Disclosures() {
  return (
    <section className="rc-sec" style={{ paddingBottom: 120 }}>
      <div className="rc-disc">
        <h2 className="rc-disc-h">Important disclosures</h2>
        <p>
          This page and the recording are for educational and informational purposes only. They are
          not tax, legal, accounting or investment advice, and nothing here is an offer to sell or a
          solicitation of an offer to buy any security. Please consult your own attorney, CPA and
          financial adviser about your circumstances before acting on anything in the session.
        </p>
        <p>
          Statements made during the recording reflect the speakers’ views on{' '}
          {formatEventDate(EVENT)} and are not updated. Contribution limits, retirement ages and
          plan rules are quoted as stated on the call for tax year 2026; they are indexed, they
          change, and they depend on your eligibility — confirm them with your custodian or tax
          professional. The transaction described in the case study is one investor’s completed
          deal, presented as an illustration of custody and titling, not as an offering, a
          projection, or an expected result.
        </p>
        <p>
          Proactive Sustainable Bonds is not a custodian, a trust company, a broker-dealer or an
          investment adviser, and provides no custodial services. Directed IRA is the tradename of
          Directed Trust Company, an independent third party; Proactive receives no compensation for
          accounts opened there and the promotion code was offered by Directed IRA. A passive
          custodian does not review any investment for merit — due diligence remains with the
          account owner.
        </p>
        <p>
          Interests in Proactive’s bonds are offered solely under Rule 506(c) of Regulation D to
          verified accredited investors, through the Fund’s Private Placement Memorandum and
          subscription agreement, which contain material risk factors, fees and conflicts of
          interest and which govern in all respects. Such securities are unregistered, speculative
          and illiquid, involve risk including the loss of capital, and are not FDIC- or
          SIPC-insured. Targets are illustrative and are not guarantees; past performance does not
          indicate future results.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- sticky rail -- */

function StickyBar({ onWatch }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <div className="rc-sticky glass glass-strong">
      <div className="rc-sticky-txt">
        <strong>Self-Directed IRA · recording</strong>
        <span>{RUNTIME} · {formatEventDate(EVENT, { short: true })}</span>
      </div>
      <a className="btn btn-accent btn-sm" href="#watch" onClick={onWatch}>Watch</a>
    </div>
  );
}

/* -------------------------------------------------------------------- page -- */

export default function SdiraRecordingPage() {
  useEffect(() => { initInteractions(); }, []);

  // One piece of state for every control that says "watch": the hero button,
  // the poster and the sticky bar all mount the player and land on it, so the
  // reader never has to press play twice.
  const [playing, setPlaying] = useState(false);
  const startWatching = (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    setPlaying(true);
    if (typeof document === 'undefined') return;
    // Land the frame where the reader expects it before Zoom's own focus call
    // does it for us, so the two do not fight over the scroll position.
    const el = document.getElementById('watch');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <React.Fragment>
      <MktNav />
      <main>
        <Hero onWatch={startWatching} />
        <Watch playing={playing} onPlay={startWatching} />
        <Room />
        <Chapters />
        <Takeaways />
        <Accounts />
        <Steps />
        <CaseStudy />
        <Questions />
        <Quotes />
        <NextSteps />
        <Contact />
        <Disclosures />
      </main>
      <StickyBar onWatch={startWatching} />
      <MktFooter />

      <style>{`
        /* ---- shared section rhythm ----
           One container width everywhere (1240 = the nav pill / footer rhythm), and
           every block inside a section spans it edge to edge. Only raw text takes a
           measure, and it takes it from a column rather than a bare max-width.
           See rules.md section 6 "Layout". */
        .rc-sec { max-width: 1240px; margin: 0 auto; padding: 104px 22px 0; }
        .rc-sec-head { margin-bottom: 44px; }
        .rc-sec-head-copy { display: grid; gap: 18px; align-content: start; }
        .rc-sec-head-copy p { margin: 0; color: var(--fg-2); font-size: var(--text-base); line-height: 1.78; }
        .rc-sec-head-copy strong { color: var(--fg-1); font-weight: 600; }
        .rc-sec-note { font-size: var(--text-sm) !important; color: var(--fg-3) !important; }
        .rc-sec-note a { color: var(--brand); font-weight: 600; }
        @media (min-width: 900px) {
          .rc-sec-head-split { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: clamp(36px, 5vw, 76px); align-items: start; }
        }
        .rc-h2 { margin: 14px 0 0; font-size: clamp(1.85rem, 3.4vw, 2.6rem); line-height: 1.1;
          letter-spacing: -0.022em; color: var(--forest-700); font-weight: 600; font-family: var(--font-editorial); }
        [data-theme="dark"] .rc-h2 { color: var(--lime-300); }
        .rc-fine { margin: 22px 0 0; font-size: var(--text-xs); color: var(--fg-3); line-height: 1.7; }

        /* ---- hero ---- */
        .rc-hero { position: relative; overflow: hidden;
          background: linear-gradient(158deg, var(--forest-700) 0%, var(--forest-900) 62%, #071a0f 100%); }
        .rc-hero-glow { position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(760px 620px at 86% -8%, rgba(149,196,92,0.22), transparent 62%),
                      radial-gradient(680px 520px at -8% 106%, rgba(127,178,79,0.14), transparent 60%); }
        .rc-hero-inner { position: relative; z-index: 1; max-width: 1240px; margin: 0 auto; padding: 76px 22px 78px; }
        .rc-eyebrow { margin-bottom: 28px; background: rgba(255,255,255,0.10); color: #eaf3e2;
          border: 1px solid rgba(255,255,255,0.26); font-weight: 600; }
        /* Two columns so the heading and the standfirst fill the row instead of
           stranding half of it. Collapses under 900px. */
        .rc-hero-grid { display: grid; gap: 26px; }
        @media (min-width: 900px) {
          .rc-hero-grid { grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
            gap: clamp(36px, 5vw, 72px); align-items: end; }
        }
        .rc-h1 { margin: 0; font-family: var(--font-editorial); font-weight: 600; color: #fff;
          font-size: clamp(2.2rem, 4.3vw, 3.35rem); line-height: 1.07; letter-spacing: -0.024em; }
        .rc-h1 em { font-style: italic; color: var(--lime-300); }
        .rc-hero-when { margin: 22px 0 0; font-family: var(--font-mono); font-size: var(--text-sm);
          letter-spacing: 0.04em; color: var(--lime-300); }
        .rc-hero-who { margin: 8px 0 0; font-size: var(--text-sm); color: rgba(234,243,226,0.7); }
        .rc-hero-side { display: grid; gap: 26px; }
        .rc-lead { margin: 0; color: rgba(238,246,232,0.84); line-height: 1.74; font-size: var(--text-base); }
        .rc-hero-cta { display: flex; flex-wrap: wrap; gap: 13px; }
        .rc-btn-light { color: #fff; border: 1px solid rgba(255,255,255,0.42);
          background: rgba(255,255,255,0.06); text-decoration: none; }
        .rc-btn-light:hover { background: rgba(255,255,255,0.12); }

        .rc-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px;
          margin-top: 52px; background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.14);
          border-radius: var(--radius-xl); overflow: hidden; }
        .rc-stat { padding: 26px 28px; background: rgba(8,25,14,0.42); display: grid; gap: 7px; }
        .rc-stat-l { font-size: var(--text-2xs); font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--lime-300); }
        .rc-stat-n { font-size: clamp(1.6rem, 3.2vw, 2.3rem); font-weight: 600; letter-spacing: -0.03em;
          color: #fff; line-height: 1; }
        .rc-stat-s { font-size: var(--text-xs); color: rgba(234,243,226,0.62); line-height: 1.5; }

        /* ---- player ----
           Zoom's recording page is not a bare video: it carries its own title
           bar, a download link and a transcript rail beside the player, and it
           reflows those itself. So the frame gets an explicit height rather than
           an aspect ratio — measured against Zoom's own layout at this column
           width, where the player and transcript finish around 570px. An aspect
           ratio leaves a growing band of Zoom's white page under the controls on
           a wide monitor. If Zoom ever needs more room it scrolls inside the
           frame, and the "Open on Zoom" escape hatch sits directly below. */
        .rc-player { position: relative; width: 100%; height: 420px;
          border-radius: var(--radius-2xl); overflow: hidden; background: #08190e;
          border: 1px solid var(--border); box-shadow: var(--shadow-lg);
          transition: height var(--dur-slow) var(--ease-out); }
        .rc-player-live { height: 620px; }
        .rc-player iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }

        /* Click-to-load poster. A button, not a div, so it is reachable by
           keyboard and announced as the control it is. */
        .rc-poster { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; cursor: pointer;
          overflow: hidden; font: inherit; text-align: left; padding: clamp(28px, 5vw, 66px);
          display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center;
          gap: clamp(24px, 5vw, 60px);
          background: linear-gradient(152deg, var(--forest-600) 0%, var(--forest-900) 58%, #061710 100%); }
        .rc-poster-glow { position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(620px 520px at 82% 12%, rgba(149,196,92,0.24), transparent 62%),
                      radial-gradient(560px 460px at 4% 98%, rgba(127,178,79,0.16), transparent 60%); }
        .rc-poster-body { position: relative; z-index: 1; display: grid; justify-items: start; gap: 18px; }
        .rc-poster-play { width: 84px; height: 84px; border-radius: 50%; display: grid; place-items: center;
          background: var(--accent); color: #fff; padding-left: 5px;
          box-shadow: 0 0 0 12px rgba(127,178,79,0.16), 0 18px 44px rgba(6,20,12,0.5);
          transition: transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out); }
        .rc-poster:hover .rc-poster-play { transform: scale(1.06); box-shadow: 0 0 0 16px rgba(127,178,79,0.20), 0 22px 54px rgba(6,20,12,0.55); }
        .rc-poster:focus-visible { outline: 3px solid var(--lime-300); outline-offset: -3px; }
        .rc-poster-h { color: #fff; font-family: var(--font-editorial); font-weight: 600;
          font-size: clamp(1.5rem, 3vw, 2.35rem); letter-spacing: -0.022em; line-height: 1.1; }
        .rc-poster-s { color: rgba(234,243,226,0.72); font-size: var(--text-sm); line-height: 1.6; }
        .rc-poster-face { position: relative; z-index: 1; display: grid; justify-items: center; gap: 4px; }
        .rc-poster-face img { width: clamp(120px, 17vw, 188px); aspect-ratio: 1; border-radius: 50%;
          object-fit: cover; margin-bottom: 12px;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.16), 0 0 0 5px var(--lime-300), 0 18px 44px rgba(6,20,12,0.45); }
        .rc-poster-face-n { color: #fff; font-weight: 700; font-size: var(--text-sm); }
        .rc-poster-face-r { color: rgba(234,243,226,0.66); font-size: var(--text-xs); }
        .rc-player-facts { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 34px;
          margin-top: 22px; padding: 18px 24px; border-radius: var(--radius-xl);
          background: var(--bg-sunken); }
        .rc-player-facts > div { display: grid; gap: 4px; }
        .rc-player-facts strong { font-size: var(--text-sm); color: var(--fg-1); font-weight: 600; }
        .rc-player-out { margin-left: auto; }

        /* ---- the room ---- */
        .rc-room { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.65fr); gap: 20px; }
        .rc-guest { display: grid; grid-template-columns: 200px minmax(0, 1fr);
          gap: clamp(24px, 3vw, 40px); align-items: start; background: var(--surface);
          border: 1px solid var(--border); border-radius: var(--radius-2xl);
          padding: clamp(28px, 3.4vw, 44px); box-shadow: var(--shadow-sm); }
        .rc-guest-img { width: 100%; aspect-ratio: 1; border-radius: 50%; object-fit: cover;
          box-shadow: 0 0 0 4px var(--surface), 0 0 0 7px var(--lime-300), var(--shadow-lg); }
        .rc-guest-tag { display: inline-block; font-size: var(--text-2xs); font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--forest-600);
          background: var(--lime-100); padding: 0.45em 0.85em; border-radius: var(--radius-pill); }
        [data-theme="dark"] .rc-guest-tag { background: rgba(127,178,79,0.18); color: var(--lime-300); }
        .rc-guest-n { margin: 16px 0 0; font-family: var(--font-editorial); font-weight: 600;
          font-size: var(--text-2xl); letter-spacing: -0.02em; color: var(--fg-1); }
        .rc-guest-r { margin: 6px 0 0; font-size: var(--text-sm); font-weight: 600; color: var(--fg-3); }
        .rc-guest-r a { color: var(--brand); }
        .rc-guest-p { margin: 18px 0 0; color: var(--fg-2); line-height: 1.78; font-size: var(--text-base); }
        .rc-guest-li { display: inline-flex; align-items: center; gap: 6px; margin-top: 18px;
          font-size: var(--text-sm); font-weight: 600; color: var(--brand); text-decoration: none; }
        .rc-guest-li:hover { text-decoration: underline; }

        /* Grid with space-between so the rail fills the row the guest card sets
           rather than pooling empty gradient under the last name. */
        .rc-hosts { border-radius: var(--radius-2xl); padding: clamp(26px, 3vw, 34px);
          display: grid; align-content: space-between; gap: 8px;
          background: linear-gradient(165deg, var(--forest-600), var(--forest-900)); }
        .rc-hosts-list { list-style: none; margin: 20px 0 0; padding: 0; display: grid; gap: 18px; }
        .rc-hosts-list li { display: flex; align-items: center; gap: 14px; }
        .rc-hosts-list img { width: 54px; height: 54px; border-radius: 50%; object-fit: cover; flex: none;
          background: rgba(255,255,255,0.08); box-shadow: 0 0 0 2px rgba(174,208,121,0.55); }
        .rc-host-n { color: #fff; font-weight: 700; font-size: var(--text-sm); line-height: 1.3; }
        .rc-host-r { color: rgba(234,243,226,0.66); font-size: var(--text-xs); margin-top: 3px; }
        .rc-hosts-note { margin: 22px 0 0; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.14);
          font-size: var(--text-xs); color: rgba(234,243,226,0.72); line-height: 1.65; }

        /* ---- chapters ---- */
        .rc-chapters { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px;
          border: 1px solid var(--border); background: var(--border); border-radius: var(--radius-xl);
          overflow: hidden; counter-reset: none; }
        .rc-chapter { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 20px;
          align-items: start; padding: 22px 28px; background: var(--surface); }
        .rc-chapter-t { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: 500;
          color: var(--brand); padding-top: 2px; }
        [data-theme="dark"] .rc-chapter-t { color: var(--lime-300); }
        .rc-chapter-h { margin: 0; font-size: var(--text-base); font-weight: 700; color: var(--fg-1); line-height: 1.35; }
        .rc-chapter-p { margin: 7px 0 0; font-size: var(--text-sm); color: var(--fg-2); line-height: 1.7; }

        /* ---- takeaways ---- */
        .rc-takeaways { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
        .rc-take { background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-2xl); padding: 28px 28px 30px; box-shadow: var(--shadow-sm); }
        .rc-take-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .rc-take-ic { width: 44px; height: 44px; border-radius: 13px; display: grid; place-items: center;
          background: color-mix(in srgb, var(--brand) 13%, var(--surface)); color: var(--forest-600); }
        [data-theme="dark"] .rc-take-ic { color: var(--lime-300); }
        .rc-take-n { font-family: var(--font-mono); font-size: var(--text-lg); font-weight: 500;
          color: color-mix(in srgb, var(--brand) 45%, transparent); }
        .rc-take-h { margin: 0 0 10px; font-size: var(--text-lg); font-weight: 700; color: var(--fg-1);
          line-height: 1.28; letter-spacing: -0.015em; }
        .rc-take-p { margin: 0; font-size: var(--text-sm); color: var(--fg-2); line-height: 1.72; }

        /* ---- accounts table ---- */
        .rc-table { display: grid; gap: 2px; border: 1px solid var(--border); background: var(--border);
          border-radius: var(--radius-xl); overflow: hidden; }
        .rc-row { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 0.8fr) minmax(0, 2fr);
          gap: 20px; align-items: baseline; padding: 22px 28px; background: var(--surface); }
        .rc-row-n { font-weight: 700; color: var(--fg-1); font-size: var(--text-base); }
        .rc-row-v { font-family: var(--font-mono); font-size: var(--text-sm); color: var(--brand); }
        [data-theme="dark"] .rc-row-v { color: var(--lime-300); }
        .rc-row-p { font-size: var(--text-sm); color: var(--fg-2); line-height: 1.7; }

        /* ---- steps ---- */
        .rc-steps { display: grid; gap: 2px; border: 1px solid var(--border); background: var(--border);
          border-radius: var(--radius-xl); overflow: hidden; }
        .rc-step { display: grid; grid-template-columns: 76px minmax(0, 1fr); gap: 18px;
          align-items: start; padding: 24px 28px; background: var(--surface); }
        .rc-step-n { font-family: var(--font-mono); font-size: var(--text-xl); font-weight: 500;
          color: color-mix(in srgb, var(--brand) 55%, transparent); line-height: 1.2; }
        .rc-step-top { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
        .rc-step-h { margin: 0; font-size: var(--text-base); font-weight: 700; color: var(--fg-1); }
        .rc-step-time { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--fg-3); white-space: nowrap; }
        .rc-step-p { margin: 8px 0 0; font-size: var(--text-sm); color: var(--fg-2); line-height: 1.7; }

        /* ---- case study ---- */
        .rc-deal { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr); gap: 20px; }
        .rc-deal-grid { display: grid; gap: 1px; background: var(--border); border: 1px solid var(--border);
          border-radius: var(--radius-xl); overflow: hidden; align-content: start; }
        .rc-deal-row { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between;
          gap: 14px; padding: 15px 24px; background: var(--surface); }
        .rc-deal-k { font-size: var(--text-sm); color: var(--fg-2); }
        /* margin-inline-start: auto keeps a long value right-aligned even when it
           wraps onto its own line, where flex would otherwise start it at the left. */
        .rc-deal-v { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: 500;
          color: var(--fg-1); text-align: right; margin-inline-start: auto; }
        /* space-between, like the hosts rail: the panel is always shorter than the
           twelve-row table beside it, and pooling that slack at the bottom reads
           as an unfinished box. */
        .rc-deal-side { border-radius: var(--radius-2xl); padding: clamp(26px, 3vw, 34px);
          background: var(--bg-sunken); display: grid; gap: 22px; align-content: space-between; }
        .rc-pull { margin: 0; font-family: var(--font-editorial); font-style: italic;
          font-size: var(--text-lg); line-height: 1.5; color: var(--forest-700);
          border-left: 2px solid var(--accent); padding-left: 18px; }
        [data-theme="dark"] .rc-pull { color: var(--lime-300); }
        .rc-deal-note { margin: 0; font-size: var(--text-sm); color: var(--fg-2); line-height: 1.7; }
        .rc-points { list-style: none; margin: 0; padding: 0; display: grid; gap: 11px; }
        .rc-points li { position: relative; padding-left: 20px; font-size: var(--text-sm);
          color: var(--fg-2); line-height: 1.6; }
        .rc-points li::before { content: ""; position: absolute; left: 0; top: 8px; width: 7px; height: 7px;
          border-radius: 50%; background: var(--accent); }

        /* ---- q&a ----
           Two columns on wide screens so an opened answer fills its own item
           rather than trailing across a 1200px row. rules.md section 6 point 5:
           collapsed content is measured too, so this cannot be skipped. */
        .rc-qa { display: grid; gap: 10px; }
        @media (min-width: 1000px) { .rc-qa { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; align-items: start; } }
        .rc-qa-item { background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 2px 24px; }
        .rc-qa-item summary { display: flex; align-items: flex-start; gap: 14px; cursor: pointer;
          list-style: none; padding: 20px 0; font-weight: 600; color: var(--fg-1); font-size: var(--text-base); }
        .rc-qa-item summary::-webkit-details-marker { display: none; }
        .rc-qa-n { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: 500; flex: none;
          color: color-mix(in srgb, var(--brand) 55%, transparent); padding-top: 2px; }
        .rc-qa-q { flex: 1 1 auto; line-height: 1.45; }
        .rc-qa-item summary svg { flex: none; color: var(--fg-3); margin-top: 3px;
          transition: transform var(--dur-base) var(--ease-out); }
        .rc-qa-item[open] summary svg { transform: rotate(180deg); }
        .rc-qa-body { padding: 0 0 22px 32px; }
        .rc-qa-who { display: block; font-size: var(--text-xs); color: var(--fg-3); margin-bottom: 14px; }
        .rc-qa-a { border-left: 2px solid var(--accent); padding-left: 18px; }
        .rc-qa-by { display: block; font-size: var(--text-2xs); font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--brand); margin-bottom: 8px; }
        [data-theme="dark"] .rc-qa-by { color: var(--lime-300); }
        .rc-qa-a p { margin: 0 0 12px; font-size: var(--text-sm); color: var(--fg-2); line-height: 1.75; }
        .rc-qa-a p:last-child { margin-bottom: 0; }

        /* ---- quotes ---- */
        .rc-quotes { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
        .rc-quote { margin: 0; background: var(--bg-sunken); border-radius: var(--radius-2xl);
          padding: 30px 30px 26px; display: grid; gap: 16px; align-content: start; }
        .rc-quote blockquote { margin: 0; font-family: var(--font-editorial); font-size: var(--text-lg);
          line-height: 1.55; color: var(--fg-1); letter-spacing: -0.012em; }
        .rc-quote figcaption { font-size: var(--text-xs); font-weight: 600; color: var(--fg-3); }

        /* ---- next steps ---- */
        .rc-next { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.65fr); gap: 20px; }
        .rc-next-copy { border-radius: var(--radius-2xl); padding: clamp(38px, 5vw, 60px);
          background: linear-gradient(155deg, var(--forest-600), var(--forest-900)); }
        .rc-next-h { margin: 14px 0 0; color: #fff; font-family: var(--font-editorial); font-weight: 600;
          font-size: clamp(1.7rem, 3.3vw, 2.4rem); line-height: 1.12; letter-spacing: -0.022em; }
        .rc-next-p { margin: 18px 0 30px; color: rgba(234,243,226,0.85); line-height: 1.7; font-size: var(--text-base); }
        .rc-next-p strong { color: var(--lime-300); font-family: var(--font-mono); font-weight: 600; }
        .rc-next-cta { display: flex; flex-wrap: wrap; gap: 13px; }
        .rc-promo { border-radius: var(--radius-2xl); border: 1px dashed var(--border-strong);
          padding: clamp(28px, 3vw, 36px); display: grid; gap: 12px; align-content: center;
          justify-items: start; background: var(--surface); }
        .rc-promo-l { font-size: var(--text-2xs); font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--fg-3); }
        .rc-promo-code { font-family: var(--font-mono); font-size: clamp(1.4rem, 2.6vw, 1.9rem);
          font-weight: 600; letter-spacing: -0.01em; color: var(--forest-700); }
        [data-theme="dark"] .rc-promo-code { color: var(--lime-300); }
        .rc-promo-p { margin: 0; font-size: var(--text-sm); color: var(--fg-2); line-height: 1.65; }
        .rc-promo-btn { margin-top: 6px; }

        /* ---- contact ---- */
        .rc-contact { display: grid; grid-template-columns: minmax(0, 0.62fr) minmax(0, 1fr);
          gap: clamp(28px, 4vw, 56px); align-items: start; }
        .rc-contact-side { background: var(--bg-sunken); border-radius: var(--radius-2xl);
          padding: clamp(24px, 3vw, 34px); display: grid; gap: 20px; align-content: start; }
        .rc-contact-note { margin: 0; font-size: var(--text-sm); color: var(--fg-2); line-height: 1.7; }
        .rc-form-card { background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-2xl); padding: 32px 30px; box-shadow: var(--shadow-md); }
        .rc-done { text-align: center; display: grid; justify-items: center; gap: 14px; padding: 26px 4px; }
        .rc-done-h { margin: 6px 0 0; font-size: var(--text-2xl); font-weight: 700; color: var(--fg-1); letter-spacing: -0.02em; }
        .rc-done-p { margin: 0; font-size: var(--text-sm); color: var(--fg-2); line-height: 1.65; max-width: 40ch; }

        /* ---- disclosures ---- */
        .rc-disc { border-radius: var(--radius-2xl); padding: clamp(30px, 4vw, 46px);
          background: var(--bg-sunken); display: grid; gap: 14px; }
        .rc-disc-h { margin: 0 0 4px; font-size: var(--text-sm); font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--fg-2); }
        .rc-disc p { margin: 0; font-size: var(--text-xs); color: var(--fg-3); line-height: 1.72; }

        /* ---- sticky bar ----
           Centred with auto inline margins, NOT left 50% plus a translate: the
           psb-rise entrance animation ends on "transform: none", which would wipe
           out a centring translate and shunt the bar right by half its width.
           rules.md section 6 point 6. */
        .rc-sticky { position: fixed; left: 0; right: 0; margin-inline: auto; width: fit-content;
          bottom: 20px; z-index: 60; display: flex; align-items: center; gap: 20px;
          padding: 12px 12px 12px 22px; border-radius: var(--radius-pill);
          animation: psb-rise var(--dur-slow) var(--ease-out) both; }
        .rc-sticky-txt { display: flex; flex-direction: column; line-height: 1.25; }
        .rc-sticky-txt strong { font-size: var(--text-sm); color: var(--fg-1); }
        .rc-sticky-txt span { font-size: var(--text-xs); color: var(--fg-3); }

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
        @media (max-width: 1100px) {
          .rc-takeaways { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .rc-quotes { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .rc-room { grid-template-columns: 1fr; }
          .rc-deal { grid-template-columns: 1fr; }
          .rc-next { grid-template-columns: 1fr; }
        }
        @media (max-width: 900px) {
          .rc-contact { grid-template-columns: 1fr; }
          .rc-stats { grid-template-columns: 1fr; }
          .rc-row { grid-template-columns: 1fr; gap: 6px; }
          .rc-player { height: 340px; }
          .rc-player-live { height: 560px; }
        }
        @media (max-width: 860px) {
          .rc-sec { padding-top: 84px; }
          .rc-guest { grid-template-columns: 1fr; justify-items: start; }
          .rc-guest-img { max-width: 180px; }
          .rc-takeaways { grid-template-columns: 1fr; }
          .rc-quotes { grid-template-columns: 1fr; }
          .rc-player-out { margin-left: 0; }
          /* Below this the poster has no room for two columns — the portrait
             goes and the play button and title centre on their own. */
          .rc-poster { grid-template-columns: 1fr; justify-items: center; text-align: center; }
          .rc-poster-body { justify-items: center; }
          .rc-poster-face { display: none; }
        }
        @media (max-width: 560px) {
          .ta-row { grid-template-columns: 1fr; }
          .rc-chapter { grid-template-columns: 1fr; gap: 6px; padding: 20px; }
          .rc-step { grid-template-columns: 1fr; gap: 6px; padding: 20px; }
          .rc-step-top { flex-direction: column; gap: 2px; }
          .rc-qa-body { padding-left: 0; }
          .rc-hero-cta .btn { width: 100%; justify-content: center; }
          .rc-sticky { left: 12px; right: 12px; width: auto; }
          .rc-player { height: 300px; }
          .rc-player-live { height: 520px; }
        }
      `}</style>
    </React.Fragment>
  );
}
