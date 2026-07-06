import React from 'react';
import { MktNav, MktFooter } from './MktChrome.jsx';
import { Ic } from './icons.jsx';
import { initInteractions } from '../lib/interactions.js';

const { useEffect, useState, useRef } = React;

// Scrolls to the on-page IRA request form.
function scrollToIraForm(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  if (typeof document === 'undefined') return;
  const el = document.getElementById('ira-form');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const TA_COUNTRIES = [['US','United States (+1)'],['CA','Canada (+1)'],['GB','United Kingdom (+44)'],['AU','Australia (+61)'],['IN','India (+91)'],['AE','United Arab Emirates (+971)'],['DE','Germany (+49)'],['FR','France (+33)'],['ES','Spain (+34)'],['IT','Italy (+39)'],['NL','Netherlands (+31)'],['IE','Ireland (+353)'],['NZ','New Zealand (+64)'],['SG','Singapore (+65)'],['HK','Hong Kong (+852)'],['ZA','South Africa (+27)'],['NG','Nigeria (+234)'],['KE','Kenya (+254)'],['MX','Mexico (+52)'],['BR','Brazil (+55)'],['AR','Argentina (+54)'],['JP','Japan (+81)'],['CN','China (+86)'],['KR','South Korea (+82)'],['SA','Saudi Arabia (+966)'],['PK','Pakistan (+92)'],['BD','Bangladesh (+880)'],['PH','Philippines (+63)'],['SE','Sweden (+46)'],['CH','Switzerland (+41)']];

const REASONS = [
  {
    icon: 'trending-up',
    title: '9–15% Annual Returns',
    body: 'SD IRA holders typically struggle to find fixed-income alternatives beyond 4–5% CDs or money markets. Proactive Sustainable Bonds offer 9–15.5% annual returns — a compelling yield for tax-advantaged retirement accounts where compounding is maximized.',
  },
  {
    icon: 'shield-check',
    title: 'Real Asset Backing',
    body: 'Unlike stocks or mutual funds, Proactive Sustainable Bonds are backed by real, cash-flowing affordable housing communities. Tangible real estate collateral provides a layer of security that resonates with SD IRA investors who want to know exactly what supports their investment.',
  },
  {
    icon: 'dollar',
    title: 'Fixed-Income Structure',
    body: 'SD IRAs thrive with predictable income. Our bond structure delivers consistent, scheduled payments — making it easy to plan distributions, reinvest earnings tax-deferred, and project your retirement income with confidence.',
  },
  {
    icon: 'leaf',
    title: 'Third-Party Verified Impact',
    body: 'For the growing class of values-driven SD IRA investors, Proactive Sustainable Bonds are verified by Morningstar Sustainalytics, BlueMark, and the Impact Evaluation Lab — ensuring your retirement savings are working for both your financial future and your community.',
  },
  {
    icon: 'users',
    title: 'Aligned with 7 UN SDGs',
    body: 'From No Poverty (SDG 1) to Sustainable Cities (SDG 11), our portfolio directly addresses critical social goals. Investing through your SD IRA means your retirement capital is helping solve the U.S. affordable housing crisis at scale.',
  },
  {
    icon: 'building',
    title: 'Diversification Beyond Wall Street',
    body: 'The whole point of a Self-Directed IRA is to go beyond conventional markets. Our portfolio of 22+ affordable housing communities across multiple states offers geographic and asset-class diversification unavailable through traditional retirement vehicles.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Verify Accredited Investor Status',
    body: 'Proactive Sustainable Bonds are available to accredited investors. Confirm your status based on income, net worth, or professional certification requirements.',
  },
  {
    n: '02',
    title: 'Engage a Qualified SD IRA Custodian',
    body: 'Work with a self-directed IRA custodian (such as Equity Trust, Midland IRA, or similar) who allows alternative investments like private placements and bonds.',
  },
  {
    n: '03',
    title: 'Schedule a Call with Proactive Realty Group',
    body: 'Our team will walk you through the investment structure, available bond tiers, and how to direct your SD IRA custodian to invest on your behalf.',
  },
  {
    n: '04',
    title: 'Direct Investment Through Your Custodian',
    body: 'Your SD IRA custodian will handle the paperwork and fund the investment from your retirement account, keeping all gains tax-advantaged.',
  },
];

// Pulsating IRA teaser — rendered on the homepage just above the calculator.
export function IraCta() {
  return (
    <div style={{ maxWidth: 1240, margin: '52px auto -16px', padding: '0 22px' }}>
      <a href="/ira" className="ira-pill">
        <span className="ira-pill-icon">
          <Ic name="dollar" size={14} />
        </span>
        <span>Did you know you could invest with your IRA?</span>
        <Ic name="arrow-right" size={14} style={{ opacity: 0.6, flex: 'none' }} />
      </a>

      <style>{`
        .ira-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px 10px 10px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--brand) 9%, var(--surface));
          border: 1.5px solid color-mix(in srgb, var(--brand) 50%, transparent);
          color: var(--forest-700);
          font-weight: 600;
          font-size: var(--text-sm);
          text-decoration: none;
          animation: ira-glow 2.8s ease-in-out infinite;
          transition: transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out);
        }
        .ira-pill:hover {
          transform: translateY(-2px);
          text-decoration: none;
        }
        .ira-pill-icon {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--brand);
          color: #fff;
          display: grid;
          place-items: center;
          flex: none;
        }
        @keyframes ira-glow {
          0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--brand) 40%, transparent), var(--shadow-sm); }
          50%       { box-shadow: 0 0 0 10px color-mix(in srgb, var(--brand) 0%, transparent), var(--shadow-md); }
        }
      `}</style>
    </div>
  );
}

function IraHero() {
  return (
    <section style={{ background: 'var(--bg)' }}>
      {/* Hero copy over background video */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--forest-900)' }}>
        <video
          src="/videos/ira.mp4"
          autoPlay muted loop playsInline preload="auto" tabIndex={-1} aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }}
        ></video>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(9,28,17,0.72) 0%, rgba(9,28,17,0.76) 50%, rgba(9,28,17,0.88) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 860, margin: '0 auto', padding: '104px 22px 92px', textAlign: 'center' }}>
          <span className="eyebrow-pill" style={{ marginBottom: 28, display: 'inline-block', background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
            Self-Directed IRAs
          </span>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)',
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
            fontWeight: 800,
            margin: '0 0 26px',
            color: '#fff',
            textShadow: '0 2px 20px rgba(0,0,0,0.38)',
          }}>
            Grow Your Retirement With
            <br />
            <span style={{ color: 'var(--lime-300)' }}>Proactive Sustainable Bonds</span>
          </h1>
          <p className="lead" style={{ maxWidth: '60ch', margin: '0 auto 42px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.65, textShadow: '0 1px 14px rgba(0,0,0,0.34)' }}>
            Self-Directed IRA holders are uniquely positioned to take advantage of one of the most exciting alternative fixed-income opportunities in affordable housing — 9–15% annual returns, third-party verified impact, and real asset backing.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-accent btn-lg" onClick={scrollToIraForm}>
              Request IRA details <Ic name="arrow-right" size={18} />
            </button>
            <a className="btn btn-lg" href="/#calculator" style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)' }}>
              View Investment Tiers
            </a>
          </div>
        </div>
      </div>

      {/* Dark stats band */}
      <div style={{ background: 'var(--forest-700)', padding: '44px 22px' }}>
        <div style={{
          maxWidth: 1000,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 24,
          textAlign: 'center',
        }}>
          {[
            ['$29M+', 'In Affordable Housing Assets'],
            ['22+', 'Communities Managed'],
            ['$4M+', 'In Beneficiary Savings'],
            ['7', 'UN SDGs Addressed'],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="figure" style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--lime-300)',
              }}>{n}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(234,243,226,.7)', marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IraWhat() {
  const checks = [
    'Full control over your investment decisions',
    'Access to alternative assets unavailable in conventional IRAs',
    'Tax-deferred or tax-free growth potential',
    'Ability to invest in impact-driven, mission-aligned opportunities',
  ];
  return (
    <section style={{ maxWidth: 1240, margin: '100px auto 0', padding: '0 22px' }}>
      <h2 style={{
        fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)',
        fontWeight: 800,
        letterSpacing: '-0.025em',
        margin: '0 0 52px',
        color: 'var(--fg-1)',
      }}>
        What Is a Self-Directed IRA?
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
        {/* Left: prose + checklist */}
        <div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-2)', lineHeight: 1.78, margin: '0 0 20px' }}>
            A Self-Directed IRA (SD IRA) is a type of Individual Retirement Account that gives you complete control over where your retirement savings are invested — far beyond the stocks, bonds, and mutual funds available in conventional IRAs.
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-2)', lineHeight: 1.78, margin: '0 0 34px' }}>
            With an SD IRA, you can invest in real estate, private placements, promissory notes, tax liens, precious metals, and more — all within a tax-advantaged structure that allows your gains to grow tax-deferred (Traditional IRA) or tax-free (Roth IRA).
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 15 }}>
            {checks.map((c) => (
              <li key={c} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 'var(--text-base)', color: 'var(--fg-1)', fontWeight: 500 }}>
                <span style={{ flex: 'none', marginTop: 2, color: 'var(--forest-600)' }}>
                  <Ic name="check-circle" size={20} />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: market stats card */}
        <div className="glass" style={{
          borderRadius: 'var(--radius-2xl)',
          padding: '36px 40px',
          borderLeft: '4px solid var(--forest-600)',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--forest-700)', margin: '0 0 24px' }}>
            The SD IRA Market Today
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.72, margin: '0 0 16px' }}>
            <strong style={{ color: 'var(--fg-1)' }}>$50 billion+</strong> is currently held in self-directed IRAs in the U.S., with the market growing rapidly as investors seek alternatives to volatile equity markets.
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.72, margin: '0 0 16px' }}>
            <strong style={{ color: 'var(--fg-1)' }}>Only ~2–5%</strong> of total IRA assets are in self-directed accounts today — representing a massive untapped opportunity for savvy investors who discover alternative asset classes.
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.72, margin: '0 0 16px' }}>
            <strong style={{ color: 'var(--fg-1)' }}>Real estate</strong> is consistently the #1 alternative asset held in SD IRAs, and real estate-backed bonds represent a natural, lower-complexity entry point.
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.72, margin: 0 }}>
            SD IRA investors cite <strong style={{ color: 'var(--fg-1)' }}>higher returns, diversification, and impact alignment</strong> as primary motivations for moving beyond conventional retirement accounts.
          </p>
        </div>
      </div>
    </section>
  );
}

function IraReasons() {
  return (
    <section style={{ maxWidth: 1240, margin: '114px auto 0', padding: '0 22px' }}>
      <div style={{ textAlign: 'center', maxWidth: '56rem', margin: '0 auto 64px' }}>
        <span className="eyebrow">Why Proactive</span>
        <h2 style={{
          margin: '16px 0 18px',
          fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)',
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: 'var(--fg-1)',
          lineHeight: 1.08,
        }}>
          6 Reasons SD IRA Investors Choose<br />Proactive Sustainable Bonds
        </h2>
        <p className="lead" style={{ margin: 0, maxWidth: '48rem', color: 'var(--fg-2)' }}>
          The intersection of strong fixed-income returns, real asset backing, and verified social impact makes this an exceptionally well-suited investment for Self-Directed IRAs.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
        {REASONS.map((r) => (
          <div key={r.title} className="glass glass-strong lit" style={{
            borderRadius: 'var(--radius-2xl)',
            padding: '28px 28px 32px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'color-mix(in srgb, var(--brand) 15%, var(--surface))',
              color: 'var(--forest-600)',
              display: 'grid',
              placeItems: 'center',
              flex: 'none',
            }}>
              <Ic name={r.icon} size={22} />
            </div>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--fg-1)', margin: 0, lineHeight: 1.28 }}>{r.title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.67, margin: 0 }}>{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function IraSteps() {
  return (
    <section style={{ maxWidth: 1240, margin: '114px auto 0', padding: '0 22px 120px' }}>
      <div style={{ textAlign: 'center', maxWidth: '46rem', margin: '0 auto 64px' }}>
        <span className="eyebrow">Getting Started</span>
        <h2 style={{
          margin: '16px 0 0',
          fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)',
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: 'var(--fg-1)',
        }}>
          How to Invest Through Your SD IRA
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 880, margin: '0 auto' }}>
        {STEPS.map((s) => (
          <div key={s.n} className="glass glass-strong" style={{
            borderRadius: 'var(--radius-2xl)',
            padding: '28px 40px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 36,
            boxShadow: 'var(--shadow-sm)',
          }}>
            <span style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'color-mix(in srgb, var(--brand) 65%, var(--forest-600))',
              lineHeight: 1,
              flex: 'none',
              minWidth: 48,
              paddingTop: 3,
            }}>{s.n}</span>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--fg-1)', margin: '0 0 10px', lineHeight: 1.3 }}>{s.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.68, margin: 0 }}>{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA footer */}
      <div style={{ textAlign: 'center', marginTop: 68 }}>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-2)', maxWidth: '42ch', margin: '0 auto 28px', lineHeight: 1.6 }}>
          Ready to put your retirement savings to work in impact-driven real estate?
        </p>
        <button className="btn btn-accent btn-lg" onClick={scrollToIraForm}>
          Get Started <Ic name="arrow-right" size={18} />
        </button>
      </div>
    </section>
  );
}

// IRA-specific request form — posts to the Tenth Avenue "ira" form endpoint.
function IraForm() {
  const [done, setDone] = useState(false);
  const submitted = useRef(false);
  const onSink = () => { if (submitted.current) setDone(true); };
  return (
    <section id="ira-form" style={{ maxWidth: 1100, margin: '114px auto 0', padding: '0 22px 120px', scrollMarginTop: 90 }}>
      <style>{`@media (max-width: 760px){.ira-intake-grid{grid-template-columns:1fr !important}}`}</style>
      <div className="glass lit ira-intake-grid" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1.1fr' }}>
        <div style={{ padding: '48px 44px', background: 'linear-gradient(160deg, var(--forest-600), var(--forest-800))', color: '#eaf3e2', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(110% 80% at 0% 100%, rgba(149,196,92,.2), transparent 55%)' }} />
          <div style={{ position: 'relative' }}>
            <span className="eyebrow" style={{ color: 'var(--lime-300)' }}>Invest with your IRA</span>
            <h2 style={{ margin: '14px 0 14px', color: '#fff', fontSize: 'var(--text-3xl)', letterSpacing: '-0.02em' }}>Start your Self-Directed IRA investment.</h2>
            <p style={{ margin: 0, color: 'rgba(234,243,226,.8)', lineHeight: 1.6, maxWidth: '34ch' }}>Tell us about your retirement goals. A Proactive advisor will walk you through using your SD IRA to invest — within one business day, no obligation.</p>
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['dollar', 'Tax-advantaged growth on 9–15% returns'], ['clock', 'Reply within 1 business day'], ['lock', 'Your details stay confidential']].map(([ic, t]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--text-sm)', color: 'rgba(234,243,226,.9)' }}><Ic name={ic} size={17} style={{ color: 'var(--lime-300)' }} />{t}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--surface)', padding: '40px 38px' }}>
          {done ? (
            <div style={{ height: '100%', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
              <div>
                <div className="check-ring" style={{ width: 64, height: 64, margin: '0 auto' }}><span className="ripple" /><Ic name="check" size={32} stroke={2.6} /></div>
                <h3 style={{ margin: '20px 0 6px', fontSize: 'var(--text-2xl)' }}>Thank you</h3>
                <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 'var(--text-sm)' }}>We've received your details and will be in touch within one business day about investing through your IRA.</p>
              </div>
            </div>
          ) : (
            <form action="https://tenthavenue.io/api/forms/ira/submit" method="POST" className="ta-form" target="ta_sink_ira" onSubmit={() => { submitted.current = true; }}>
              <div style={{ position: 'absolute', left: -9999 }} aria-hidden="true"><label>Leave this field empty<input type="text" name="_hp" tabIndex={-1} autoComplete="off" /></label></div>
              <div className="ta-row">
                <div className="ta-form__field"><label className="ta-form__label" htmlFor="ira_first">First name *</label><input id="ira_first" type="text" name="first_name" required /></div>
                <div className="ta-form__field"><label className="ta-form__label" htmlFor="ira_last">Last name *</label><input id="ira_last" type="text" name="last_name" required /></div>
              </div>
              <div className="ta-form__field"><label className="ta-form__label" htmlFor="ira_email">Email *</label><input id="ira_email" type="email" name="email" required /></div>
              <div className="ta-form__field"><label className="ta-form__label" htmlFor="ira_phone">Phone *</label>
                <div className="ta-form__phone">
                  <select name="phone__country" className="ta-form__phone-country" aria-label="Country code">{TA_COUNTRIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                  <input id="ira_phone" type="tel" inputMode="tel" name="phone" placeholder="Phone number" required />
                </div>
              </div>
              <div className="ta-form__field"><label className="ta-form__label" htmlFor="ira_msg">Tell us about your retirement goals</label><textarea id="ira_msg" name="message" rows={3}></textarea></div>
              <div className="ta-form__field"><label className="ta-form__label" htmlFor="ira_acc">Are you an Accredited Investor? *</label>
                <select id="ira_acc" name="field_9zklv" required defaultValue=""><option value="" disabled>Select one…</option><option value="Yes">Yes</option><option value="No">No</option><option value="Not sure">Not sure</option></select>
                <small className="ta-form__helper">Accredited investors earn $200K+/year, have $1M+ net worth (excluding primary home), or hold a Series 7, 65, or 82 license.</small>
              </div>
              <label className="ta-form__check"><input type="checkbox" name="field_yapu2" /><span>I consent to receive marketing and promotional messages from Proactive Sustainable Bonds at the phone number provided. Frequency may vary; message &amp; data rates may apply. Text HELP for help, STOP to opt out. <a href="https://tenthavenue.io/legal/proactive/privacy" target="_blank" rel="noreferrer">Privacy</a> · <a href="https://tenthavenue.io/legal/proactive/terms" target="_blank" rel="noreferrer">SMS Terms</a></span></label>
              <button type="submit" className="ta-form__submit">Request IRA details <Ic name="arrow-right" size={18} /></button>
            </form>
          )}
          <iframe name="ta_sink_ira" title="form submission" onLoad={onSink} style={{ display: 'none' }}></iframe>
        </div>
      </div>

      <style>{`
        .ta-form { display: grid; gap: 16px; font-family: inherit; }
        .ta-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .ta-form__field { display: grid; gap: 6px; }
        .ta-form__label { font-size: var(--text-sm); font-weight: 600; color: var(--fg-2); }
        .ta-form__helper { font-size: var(--text-xs); color: var(--fg-3); line-height: 1.45; }
        .ta-form input[type=text], .ta-form input[type=email], .ta-form input[type=tel], .ta-form select, .ta-form textarea {
          font: inherit; width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius-md);
          background: var(--surface); color: var(--fg-1); box-sizing: border-box; transition: border-color .15s var(--ease-out), box-shadow .15s var(--ease-out); }
        .ta-form input:focus, .ta-form select:focus, .ta-form textarea:focus {
          outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
        .ta-form input::placeholder, .ta-form textarea::placeholder { color: var(--fg-3); }
        .ta-form textarea { resize: vertical; min-height: 78px; }
        .ta-form__phone { display: flex; gap: 8px; }
        .ta-form__phone-country { flex: 0 0 auto; max-width: 44%; }
        .ta-form__phone input[type=tel] { flex: 1 1 auto; }
        .ta-form__check { display: flex; align-items: flex-start; gap: 10px; font-size: var(--text-xs); color: var(--fg-2); line-height: 1.5; }
        .ta-form__check input { margin-top: 2px; flex: none; accent-color: var(--accent); }
        .ta-form a { color: var(--brand); }
        .ta-form__submit { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font: inherit; font-weight: 600;
          font-size: var(--text-base); padding: 14px 18px; border: 0; border-radius: 999px; background: var(--accent); color: #fff; cursor: pointer; width: 100%;
          transition: background .15s var(--ease-out), transform .1s var(--ease-out); }
        .ta-form__submit:hover { background: color-mix(in srgb, var(--accent) 86%, #000); }
        .ta-form__submit:active { transform: scale(.98); }
        @media (max-width: 560px) { .ta-row { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

export default function IraPage() {
  useEffect(() => { initInteractions(); }, []);
  return (
    <React.Fragment>
      <MktNav />
      <main>
        <IraHero />
        <IraWhat />
        <IraReasons />
        <IraSteps />
        <IraForm />
      </main>
      <MktFooter />
    </React.Fragment>
  );
}
