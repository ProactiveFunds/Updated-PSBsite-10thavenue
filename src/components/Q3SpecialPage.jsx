import React from 'react';
import { MktNav, MktFooter } from './MktChrome.jsx';
import { Ic } from './icons.jsx';
import { initInteractions } from '../lib/interactions.js';

const { useEffect } = React;

const TIER2 = 'https://tier2.sustainablebonds.com';

const TIERS = [
  ['Tier 1', '$100K – $499K', '15%', '6% current + 9% deferred'],
  ['Tier 2', '$500K – $1.49M', '22%', '8% current + 14% deferred'],
  ['Tier 3', '$1.5M – $10M', '30%', '9% current + 21% deferred'],
];

const PERF = [
  ['17+', 'Communities acquired', 'Mobile-home parks across multiple states'],
  ['5+', 'Years experience', 'Proven track record in affordable housing'],
  ['$25M', 'Assets under management', 'Total portfolio value across all properties'],
  ['20%+', 'Average annual return', 'Consistent performance for our investors'],
];

const IMPACT = [
  ['sprout', '4,200', 'Homes funded'],
  ['users', '11,800', 'Residents housed'],
  ['home', '−22%', 'Rents below market'],
];

const TRUST = [
  { src: '/img/sustainalytics.png', alt: 'Morningstar Sustainalytics' },
  { src: '/img/pri.png', alt: 'Principles for Responsible Investment' },
  { src: '/img/partners/impact-evaluation-labs.png', alt: 'Impact Evaluation Lab' },
  { src: '/img/partners/bluemark.png', alt: 'BlueMark' },
  { src: '/img/realleaders-impact-investor.png', alt: 'Real Leaders 2026 Top Impact Investor' },
];

const TEAM = [
  { img: '/img/team/canaan.webp', name: 'Dr. Canaan Van Williams', title: 'Founder & Managing Partner', bio: '25+ years in real estate investment; an industry leader in sourcing, revitalizing, and managing Class B and C value-add properties. Author of Driving Social Impact Investment.' },
  { img: '/img/team/greg.webp', name: 'Greg C. Simonian', title: 'Senior Vice President', bio: '20+ years as an alternative-investment distribution executive, raising over $4.5 billion across hedge funds, private equity, managed futures, and real estate strategies.' },
  { img: '/img/team/tony.webp', name: 'Tony Lawrence', title: 'Director of Operations', bio: 'Operations-focused leader managing investor relations, portfolio operations, and scalable systems that align financial returns with measurable outcomes.' },
  { img: '/img/team/jesse.webp', name: 'Jesse Hollander', title: 'Director', bio: '20+ years in financial services across private equity, venture capital, and mission-driven philanthropy, specializing in values-aligned fund structuring.' },
  { img: '/img/team/alicia.webp', name: 'Alicia Galloway', title: 'Investor Relations Manager', bio: '15+ years working with high-net-worth investors, supporting the raise of tens of millions of dollars across multifamily real estate acquisitions.' },
];

function scrollToOffering(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  if (typeof document === 'undefined') return;
  const el = document.getElementById('offering');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Hero() {
  return (
    <section className="q3-hero">
      <video className="q3-hero-video" src="/videos/banner.mp4" autoPlay muted loop playsInline preload="auto" tabIndex={-1} aria-hidden="true"></video>
      <div className="q3-hero-overlay" />
      <div className="q3-hero-inner">
        <span className="eyebrow-pill q3-eyebrow">Q3 2026 · Limited Impact Bridge Offering</span>
        <h1 className="editorial q3-hero-h1">Behind every bond is a family that gets to stay.</h1>
        <p className="q3-hero-lead">
          America loses <strong>90,000 affordable homes</strong> a year. Proactive finances the buildings that stop the bleeding — preserving the naturally affordable housing families depend on. This quarter, we've opened a limited bridge offering so your capital can help hold the line.
        </p>
        <div className="q3-hero-cta">
          <a className="btn btn-accent btn-lg" href={TIER2}>Start investing <Ic name="arrow-right" size={18} /></a>
          <a className="btn btn-lg q3-btn-light" href="#offering" onClick={scrollToOffering}>See the offering</a>
        </div>
        <div className="q3-hero-foot">Impact-first private credit, secured by real estate.</div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="q3-sec" style={{ maxWidth: 1040, margin: '96px auto 0', padding: '0 22px' }}>
      <span className="eyebrow">Why this matters</span>
      <h2 className="editorial q3-h2">A housing crisis, met with capital that cares.</h2>
      <div style={{ display: 'grid', gap: 20, marginTop: 22, maxWidth: '62ch' }}>
        <p className="q3-p">The shortage isn't abstract. Every year, tens of thousands of naturally affordable homes — mobile-home communities, workforce apartments, and SRO housing — are lost to neglect or converted out of reach. When they disappear, the families living in them rarely have anywhere comparable to go.</p>
        <p className="q3-p">Proactive acquires and stabilizes these communities, keeping rents attainable while turning distressed, under-managed assets into performing ones. It's a model where doing right by residents and delivering real returns aren't in tension — they're the same act.</p>
      </div>
      <div className="q3-impact">
        {IMPACT.map(([ic, n, l]) => (
          <div key={l} className="q3-impact-item">
            <div className="q3-impact-ic"><Ic name={ic} size={20} /></div>
            <div><div className="figure q3-impact-n">{n}</div><div className="q3-impact-l">{l}</div></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Offering() {
  return (
    <section id="offering" className="q3-sec" style={{ maxWidth: 1180, margin: '110px auto 0', padding: '0 22px', scrollMarginTop: 90 }}>
      <div style={{ textAlign: 'center', maxWidth: '56rem', margin: '0 auto 44px' }}>
        <span className="eyebrow">The Q3 2026 offering</span>
        <h2 className="editorial q3-h2" style={{ textAlign: 'center' }}>The Impact Bridge Debt Offering.</h2>
        <p className="q3-p" style={{ margin: '16px auto 0', maxWidth: '52rem' }}>
          A short, <strong>12-month bridge</strong> ahead of an already-confirmed refinancing event — with current income paid quarterly. Real estate–backed, third-party verified, and limited to the first $50M.
        </p>
      </div>
      <div className="q3-tiers">
        {TIERS.map(([label, range, pct, split]) => (
          <div key={label} className="q3-tier">
            <div className="q3-tier-top" />
            <div className="q3-tier-label">{label}</div>
            <div className="q3-tier-range">{range}</div>
            <div className="q3-tier-pct">{pct}</div>
            <div className="q3-tier-trl">total return</div>
            <div className="q3-tier-div" />
            <div className="q3-tier-split">{split}</div>
          </div>
        ))}
      </div>
      <p className="q3-fine" style={{ textAlign: 'center', margin: '26px auto 34px', maxWidth: '64ch' }}>
        Limited to the first $50M; the offering extends to $50M total. Returns are cumulative over the 12-month bridge term and subject to the Private Placement Memorandum.
      </p>
      <div style={{ textAlign: 'center' }}>
        <a className="btn btn-accent btn-lg" href={TIER2}>Start investing <Ic name="arrow-right" size={18} /></a>
      </div>
    </section>
  );
}

function Performance() {
  return (
    <section className="q3-sec" style={{ maxWidth: 1240, margin: '110px auto 0', padding: '0 22px' }}>
      <div className="q3-perf">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 88% 0%, rgba(149,196,92,.18), transparent 55%)' }} />
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '46rem', margin: '0 auto 42px' }}>
          <span className="eyebrow" style={{ color: 'var(--lime-300)' }}>Proven performance</span>
          <h2 style={{ margin: '14px 0 12px', color: '#fff', fontSize: 'clamp(1.7rem,3.2vw,2.4rem)', letterSpacing: '-0.02em', fontWeight: 700 }}>A track record you can verify.</h2>
          <p style={{ margin: 0, color: 'rgba(234,243,226,.82)', lineHeight: 1.6, fontSize: 'var(--text-base)' }}>Over 17 communities transformed with 20%+ average returns — consistent cash flow alongside lasting social impact across America.</p>
        </div>
        <div className="q3-perf-grid">
          {PERF.map(([n, l, d]) => (
            <div key={l} className="q3-perf-item">
              <div className="figure q3-perf-n">{n}</div>
              <div className="q3-perf-l">{l}</div>
              <div className="q3-perf-d">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Verified() {
  return (
    <section className="q3-sec" style={{ maxWidth: 1040, margin: '110px auto 0', padding: '0 22px', textAlign: 'center' }}>
      <span className="eyebrow">Independently verified</span>
      <h2 className="editorial q3-h2" style={{ textAlign: 'center' }}>Impact that's measured, not claimed.</h2>
      <p className="q3-p" style={{ margin: '16px auto 0', maxWidth: '48rem' }}>
        We don't grade ourselves. Our impact, governance, and reporting are assessed by Morningstar Sustainalytics, the Principles for Responsible Investment, the Impact Evaluation Lab, and BlueMark — and we're a Real Leaders® 2026 Top Impact Investor.
      </p>
      <div className="q3-trust">
        {TRUST.map((t) => (
          <span key={t.alt} className="q3-chip"><img src={t.src} alt={t.alt} /></span>
        ))}
      </div>
      <a className="q3-verify-link" href="/verified">See every certification and report <Ic name="arrow-right" size={15} /></a>
    </section>
  );
}

function Team() {
  return (
    <section className="q3-sec" style={{ maxWidth: 1180, margin: '110px auto 0', padding: '0 22px' }}>
      <div style={{ textAlign: 'center', maxWidth: '46rem', margin: '0 auto 52px' }}>
        <span className="eyebrow">Leadership</span>
        <h2 className="editorial q3-h2" style={{ textAlign: 'center' }}>The people behind the fund.</h2>
        <p className="q3-p" style={{ margin: '16px auto 0', maxWidth: '44rem' }}>Decades of real estate, capital markets, and mission-driven investing — aligned around one goal.</p>
      </div>
      <div className="q3-team">
        {TEAM.map((m) => (
          <div key={m.name} className="q3-team-card">
            <img className="q3-team-photo" src={m.img} alt={m.name} loading="lazy" />
            <div className="q3-team-name">{m.name}</div>
            <div className="q3-team-title">{m.title}</div>
            <p className="q3-team-bio">{m.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="q3-sec" style={{ maxWidth: 1040, margin: '110px auto 0', padding: '0 22px 120px' }}>
      <div className="q3-final">
        <h2 style={{ margin: 0, color: '#fff', fontSize: 'clamp(1.9rem,3.6vw,2.8rem)', letterSpacing: '-0.025em', fontWeight: 800 }}>Be part of the next chapter.</h2>
        <p style={{ margin: '16px auto 28px', color: 'rgba(234,243,226,.85)', maxWidth: '48ch', lineHeight: 1.6, fontSize: 'var(--text-base)' }}>
          The Q3 bridge window is limited to the first $50M. Start your investment today and put your capital to work behind real homes and real returns.
        </p>
        <a className="btn btn-accent btn-lg" href={TIER2}>Start investing <Ic name="arrow-right" size={18} /></a>
        <p className="q3-disc">
          For informational purposes only; not an offer to sell or a solicitation to buy any security. Interests are offered solely under Rule 506(c) of Regulation D to accredited investors via the Fund's Private Placement Memorandum (PPM), which governs. Securities are unregistered, speculative, and illiquid, involve risk including loss of capital, and are not FDIC- or SIPC-insured. Past performance is not indicative of future results; targets are illustrative.
        </p>
      </div>
    </section>
  );
}

export default function Q3SpecialPage() {
  useEffect(() => { initInteractions(); }, []);
  return (
    <React.Fragment>
      <MktNav />
      <main>
        <Hero />
        <Story />
        <Offering />
        <Performance />
        <Verified />
        <Team />
        <FinalCta />
      </main>
      <MktFooter />

      <style>{`
        .q3-h2 { margin: 12px 0 0; font-size: clamp(1.9rem, 3.6vw, 2.7rem); letter-spacing: -0.02em; line-height: 1.08; color: var(--forest-700); font-weight: 600; }
        [data-theme="dark"] .q3-h2 { color: var(--lime-300); }
        .q3-p { color: var(--fg-2); font-size: var(--text-base); line-height: 1.7; margin: 0; }
        .q3-p strong { color: var(--fg-1); font-weight: 600; }

        /* Hero */
        .q3-hero { position: relative; overflow: hidden; background: var(--forest-900); }
        .q3-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; pointer-events: none; }
        .q3-hero-overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(8,26,15,0.68) 0%, rgba(8,26,15,0.74) 45%, rgba(8,26,15,0.9) 100%); }
        .q3-hero-inner { position: relative; z-index: 2; max-width: 900px; margin: 0 auto; padding: 120px 22px 104px; text-align: center; }
        .q3-eyebrow { margin-bottom: 26px; display: inline-block; background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.3); }
        .q3-hero-h1 { margin: 0 0 24px; font-size: clamp(2.4rem, 5.6vw, 4rem); line-height: 1.05; letter-spacing: -0.02em; color: #fff; font-weight: 600; text-shadow: 0 2px 24px rgba(0,0,0,0.4); }
        .q3-hero-lead { max-width: 60ch; margin: 0 auto 38px; color: rgba(255,255,255,0.9); line-height: 1.65; font-size: var(--text-lg); text-shadow: 0 1px 14px rgba(0,0,0,0.34); }
        .q3-hero-lead strong { color: #fff; font-weight: 700; }
        .q3-hero-cta { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .q3-btn-light { color: #fff; border: 1px solid rgba(255,255,255,0.5); background: rgba(255,255,255,0.06); text-decoration: none; }
        .q3-hero-foot { margin-top: 32px; font-size: var(--text-xs); letter-spacing: 0.14em; text-transform: uppercase; color: rgba(234,243,226,0.6); font-weight: 600; }

        /* Story impact stats */
        .q3-impact { display: flex; flex-wrap: wrap; gap: 40px; margin-top: 40px; }
        .q3-impact-item { display: flex; align-items: center; gap: 14px; }
        .q3-impact-ic { width: 46px; height: 46px; border-radius: 13px; background: var(--lime-100); color: var(--forest-600); display: grid; place-items: center; flex: none; }
        .q3-impact-n { font-size: var(--text-2xl); font-weight: 700; color: var(--fg-1); line-height: 1; }
        .q3-impact-l { font-size: var(--text-sm); color: var(--fg-3); margin-top: 3px; }

        /* Offering tiers */
        .q3-tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .q3-tier { position: relative; overflow: hidden; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-2xl); padding: 30px 30px 28px; box-shadow: var(--shadow-sm); }
        .q3-tier-top { position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, var(--forest-600), var(--lime-300)); }
        .q3-tier-label { font-size: var(--text-xs); font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--forest-600); }
        .q3-tier-range { font-size: var(--text-base); color: var(--fg-2); margin-top: 4px; font-weight: 500; }
        .q3-tier-pct { font-size: clamp(2.6rem, 5vw, 3.4rem); font-weight: 800; color: var(--forest-700); letter-spacing: -0.03em; line-height: 1; margin-top: 14px; }
        .q3-tier-trl { font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-3); margin-top: 4px; }
        .q3-tier-div { height: 1px; background: var(--border); margin: 18px 0 14px; }
        .q3-tier-split { font-size: var(--text-sm); color: var(--fg-2); }
        .q3-fine { color: var(--fg-3); font-size: var(--text-xs); line-height: 1.6; }

        /* Performance band */
        .q3-perf { position: relative; overflow: hidden; border-radius: var(--radius-2xl); padding: clamp(40px,5vw,60px) clamp(24px,4vw,56px); background: linear-gradient(155deg, var(--forest-600), var(--forest-800)); color: #eaf3e2; }
        .q3-perf-grid { position: relative; display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
        .q3-perf-item { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-xl); padding: 26px 22px; text-align: center; }
        .q3-perf-n { font-size: clamp(1.9rem,4vw,2.6rem); font-weight: 700; color: #fff; letter-spacing: -0.02em; }
        .q3-perf-l { font-size: var(--text-base); font-weight: 600; color: var(--lime-300); margin: 8px 0 6px; }
        .q3-perf-d { font-size: var(--text-xs); color: rgba(234,243,226,0.72); line-height: 1.5; }

        /* Trust chips */
        .q3-trust { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 16px; margin: 34px 0 22px; }
        .q3-chip { background: #fff; border-radius: 12px; padding: 14px 22px; box-shadow: var(--shadow-sm); display: grid; place-items: center; }
        .q3-chip img { display: block; height: auto; max-height: 46px; width: auto; max-width: min(300px, 60vw); object-fit: contain; }
        .q3-verify-link { display: inline-flex; align-items: center; gap: 6px; color: var(--brand); font-weight: 600; font-size: var(--text-sm); text-decoration: none; }
        .q3-verify-link:hover { text-decoration: underline; }

        /* Team */
        .q3-team { display: grid; grid-template-columns: repeat(5, 1fr); gap: 22px; }
        .q3-team-card { text-align: center; }
        .q3-team-photo { width: 116px; height: 116px; border-radius: 50%; object-fit: cover; margin: 0 auto 14px; box-shadow: 0 0 0 3px var(--surface), 0 0 0 5px var(--lime-300); }
        .q3-team-name { font-size: var(--text-base); font-weight: 700; color: var(--forest-700); line-height: 1.2; }
        .q3-team-title { font-size: var(--text-2xs); font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--lime-600, var(--forest-600)); margin: 6px 0 10px; }
        .q3-team-bio { font-size: var(--text-xs); color: var(--fg-2); line-height: 1.55; margin: 0; }

        /* Final CTA */
        .q3-final { border-radius: var(--radius-2xl); padding: clamp(44px,6vw,72px) clamp(24px,5vw,64px); text-align: center; background: linear-gradient(155deg, var(--forest-600), var(--forest-900)); position: relative; overflow: hidden; }
        .q3-disc { margin: 34px auto 0; max-width: 80ch; color: rgba(234,243,226,0.55); font-size: 11px; line-height: 1.6; }

        @media (max-width: 900px) {
          .q3-tiers { grid-template-columns: 1fr; }
          .q3-perf-grid { grid-template-columns: 1fr 1fr; }
          .q3-team { grid-template-columns: 1fr 1fr; gap: 28px; }
        }
        @media (max-width: 560px) {
          .q3-perf-grid { grid-template-columns: 1fr; }
          .q3-team { grid-template-columns: 1fr; }
          .q3-impact { gap: 24px; }
        }
      `}</style>
    </React.Fragment>
  );
}
