import React from 'react';
import { Ic } from './icons.jsx';
import { PSB } from '../lib/interactions.js';
import { goToCalculator } from '../lib/cta.js';
import { TaFormEmbed } from './TaFormEmbed.jsx';
// HomeSections.jsx — partners slider, before/after, return comparison (animated),
// social proof, investment opportunities, intake form.
const { useState: useH, useEffect: useHE, useRef: useHR } = React;

function useInView(threshold = 0.3) {
  const ref = useHR(null);
  const [seen, setSeen] = useH(false);
  useHE(() => {
    if (!ref.current || seen) return;
    const ob = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) setSeen(true); }); }, { threshold });
    ob.observe(ref.current);
    return () => ob.disconnect();
  }, [seen, threshold]);
  return [ref, seen];
}

function HomeSectionHead({ eyebrow, title, sub, align = 'center', serif }) {
  return (
    <div style={{ textAlign: align, maxWidth: align === 'center' ? '46rem' : '100%', margin: align === 'center' ? '0 auto 44px' : '0 0 36px' }}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className={serif ? 'editorial' : ''} style={{ margin: '14px 0 0', letterSpacing: '-0.02em', lineHeight: 1.08, color: serif ? 'var(--forest-700)' : 'var(--fg-1)', fontWeight: serif ? 600 : 700 }}>{title}</h2>
      {sub && <p className="lead" style={{ margin: '14px auto 0', maxWidth: '34rem' }}>{sub}</p>}
    </div>
  );
}

/* ── Partners & Certifications — auto-scrolling marquee ── */
function Partners() {
  const logos = [
    ['morningstar-sustainalytics.jpg', 'Morningstar Sustainalytics'],
    ['bluemark.png', 'BlueMark'],
    ['impact-evaluation-labs.png', 'Impact Evaluation Lab'],
    ['thrivent.png', 'Thrivent'],
    ['alterna.png', 'Alterna Sin Fronteras'],
    ['nbh.png', 'NBH'],
    ['liberty-wellness.png', 'Liberty Wellness'],
    ['kore-transfer.png', 'Kore Transfer'],
  ];
  const certs = [['shield-check', 'SOC 2 Type II'], ['file-text', 'SEC Reg D 506(c)'], ['check-circle', 'QOZ Certified'], ['lock', 'Third-Party Audited']];
  const Row = ({ labelled }) => (
    <React.Fragment>
      {logos.map(([file, alt], i) => (
        <span key={file + i} aria-hidden={labelled ? undefined : true} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 34px', flex: 'none' }}>
          <img src={'/img/partners/' + file} alt={labelled ? alt : ''} loading="lazy" style={{ maxHeight: 44, maxWidth: 150, width: 'auto', objectFit: 'contain' }} />
        </span>
      ))}
    </React.Fragment>
  );
  return (
    <section style={{ margin: '90px 0 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 22px' }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}><span className="eyebrow">Our partners &amp; certifications</span></div>
        {/* White "logo wall" so the partner marks (mostly dark-on-transparent) read in both themes */}
        <div style={{ position: 'relative', background: '#fff', borderRadius: 'var(--radius-2xl)', padding: '26px 0', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'inline-flex', animation: 'psb-marquee 34s linear infinite' }}>
            <Row labelled /><Row />
          </div>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 64, background: 'linear-gradient(90deg, #fff, transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 64, background: 'linear-gradient(270deg, #fff, transparent)', pointerEvents: 'none' }} />
        </div>
      </div>
      <div style={{ maxWidth: 1240, margin: '30px auto 0', padding: '0 22px', display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        {certs.map(([ic, c]) => (
          <span key={c} className="badge badge-soft" style={{ textTransform: 'none', fontSize: 'var(--text-sm)', padding: '0.55em 1em', gap: '0.55em' }}>
            <Ic name={ic} size={15} style={{ color: 'var(--brand)' }} />{c}
          </span>
        ))}
      </div>
      <style>{`@keyframes psb-marquee { to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}

/* ── Before & After — 3 rows (photos added later) ── */
function BeforeAfter() {
  const rows = [
    ['Maple Court · Toledo, OH', 'Vacant, code-violation lot', '128 affordable homes, 97% occupied'],
    ['Cedar Grove · Austin, TX', 'Aging, under-maintained park', 'Renovated community, +22% below market'],
    ['Birchwood · Asheville, NC', 'Distressed acquisition', 'Stabilized, 144 families housed'],
  ];
  const Slot = ({ tag, src }) => (
    <div style={{ position: 'relative', flex: 1, borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: 200,
      background: tag === 'Before' ? 'linear-gradient(150deg,#6b6f64,#3f433c)' : 'linear-gradient(150deg,#3a7a3f,#1f5e2e 60%,#123a1f)' }}>
      {tag === 'After' && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 18% 0%, rgba(149,196,92,.4), transparent 55%)' }} />}
      <span className="badge" style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(8,25,14,.5)', color: '#eaf3e2', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>{tag}</span>
      <span style={{ position: 'absolute', bottom: 14, left: 14, color: 'rgba(255,255,255,.7)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>Photo coming soon</span>
    </div>
  );
  return (
    <section id="how-it-works" style={{ maxWidth: 1240, margin: '96px auto 0', padding: '0 22px', scrollMarginTop: 100 }}>
      <HomeSectionHead eyebrow="The Proactive difference" title={<>See the <strong style={{ fontWeight: 800 }}>IMPACT</strong> your investments make.</>} sub="Every community we acquire is transformed into safe, attainable housing — and a performing asset." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {rows.map(([loc, before, after]) => (
          <div key={loc} className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Slot tag="Before" />
              <div style={{ flex: 'none', color: 'var(--fg-3)' }}><Ic name="arrow-right" size={24} /></div>
              <Slot tag="After" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 14, padding: '0 4px' }}>
              <div style={{ flex: 1 }}><div className="data-label">Before</div><div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)' }}>{before}</div></div>
              <div style={{ flex: 'none', fontWeight: 600, fontSize: 'var(--text-sm)' }}>{loc}</div>
              <div style={{ flex: 1, textAlign: 'right' }}><div className="data-label">After</div><div style={{ fontSize: 'var(--text-sm)', color: 'var(--brand)', fontWeight: 600 }}>{after}</div></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Investment Return Comparison — animated horizontal bars ── */
function ReturnComparison({ onInvest }) {
  const [ref, seen] = useInView(0.25);
  const SCALE = 50; // 0–50%
  const trad = [['Treasury Bonds', 4.5], ['2-Year CD', 3.5], ['Annuities', 3], ['Mutual Funds', 7]];
  const ours = [['2–4 Year Opportunity', 9, 15, 'var(--lime-300)', 'var(--forest-700)'], ['Rapid Housing', 30, 45, 'var(--forest-600)', '#fff']];
  const pct = (v) => (v / SCALE) * 100;
  return (
    <section id="insights" ref={ref} style={{ maxWidth: 1100, margin: '110px auto 0', padding: '0 22px', scrollMarginTop: 100 }}>
      <HomeSectionHead eyebrow="Why investors choose us" title="Investment return comparison" serif />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {trad.map(([l, v]) => (
          <div key={l} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: 18 }}>
            <div style={{ textAlign: 'right', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--fg-2)' }}>{l}</div>
            <div style={{ position: 'relative', height: 44, background: 'var(--bg-sunken)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: seen ? pct(v) + '%' : '0%', minWidth: 38, background: 'var(--stone-300)', borderRadius: 'var(--radius-md)', transition: 'width 1.1s var(--ease-out)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 12 }}>
                <span className="figure" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-2)', fontWeight: 600, opacity: seen ? 1 : 0, transition: 'opacity .4s .7s' }}>{v}%</span>
              </div>
            </div>
          </div>
        ))}
        {ours.map(([l, lo, hi, bg, fg], i) => (
          <div key={l} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: 18, padding: 12, borderRadius: 'var(--radius-lg)', border: '1px solid var(--lime-200)', background: 'color-mix(in srgb, var(--lime-100) 45%, transparent)' }}>
            <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--forest-700)' }}>{l}</div>
            <div style={{ position: 'relative', height: 44, background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: pct(lo) + '%', width: seen ? (pct(hi) - pct(lo)) + '%' : '0%', background: bg, borderRadius: 'var(--radius-md)', transition: 'width 1.2s var(--ease-out) ' + (0.3 + i * 0.2) + 's', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', boxShadow: 'var(--shadow-sm)' }}>
                <span className="figure" style={{ fontWeight: 700, color: fg, fontSize: 'var(--text-sm)', opacity: seen ? 1 : 0, transition: 'opacity .4s 1s' }}>{lo}%</span>
                <span className="figure" style={{ fontWeight: 700, color: fg, fontSize: 'var(--text-sm)', opacity: seen ? 1 : 0, transition: 'opacity .4s 1s' }}>{hi}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* axis */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 18, marginTop: 10 }}>
        <div></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
          {[0, 10, 20, 30, 40, 50].map((n) => <span key={n}>{n}%</span>)}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 26, justifyContent: 'center', marginTop: 24, fontSize: 'var(--text-sm)', color: 'var(--fg-2)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 16, height: 16, borderRadius: 5, background: 'var(--lime-300)' }} /> Proactive Bonds</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 16, height: 16, borderRadius: 5, background: 'var(--stone-300)' }} /> Traditional investments</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: 26 }}><button className="btn btn-brand btn-lg" onClick={goToCalculator}>Invest now <Ic name="arrow-right" size={18} /></button></div>
    </section>
  );
}

/* ── Social proof: Third-party verified impact + Proven performance ── */
function SocialProof() {
  const impact = [
    ['sprout', '4,200', 'Homes funded', 'Verified · RSM US'],
    ['users', '11,800', 'Residents housed', 'Verified · RSM US'],
    ['home', '−22%', 'Rents below market', 'Verified · CoStar'],
  ];
  const perf = [
    ['100%', 'Distributions paid on time'],
    ['8.2%', 'Avg. net investor yield'],
    ['0', 'Principal losses to date'],
    ['12 yrs', 'Operating track record'],
  ];
  return (
    <section id="impact" style={{ maxWidth: 1240, margin: '110px auto 0', padding: '0 22px', scrollMarginTop: 100 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <div className="glass lit" style={{ borderRadius: 'var(--radius-2xl)', padding: '36px 38px' }}>
          <span className="eyebrow">Third-party verified</span>
          <h3 style={{ margin: '12px 0 24px', fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em' }}>Social impact you can audit</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {impact.map(([ic, n, l, v]) => (
              <div key={l} style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--lime-100)', color: 'var(--forest-600)', display: 'grid', placeItems: 'center', flex: 'none' }}><Ic name={ic} size={20} /></div>
                <div><div className="figure" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{n}</div><div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-1)', fontWeight: 500 }}>{l}</div><div style={{ fontSize: 10, color: 'var(--brand)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}><Ic name="check-circle" size={11} />{v}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderRadius: 'var(--radius-2xl)', padding: '36px 38px', background: 'linear-gradient(155deg, var(--forest-600), var(--forest-800))', color: '#eaf3e2', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 90% 0%, rgba(149,196,92,.18), transparent 55%)' }} />
          <span className="eyebrow" style={{ color: 'var(--lime-300)', position: 'relative' }}>Proven performance</span>
          <h3 style={{ margin: '12px 0 24px', fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', color: '#fff', position: 'relative' }}>Performance you can trust</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, position: 'relative' }}>
            {perf.map(([n, l]) => (
              <div key={l}><div className="figure" style={{ fontSize: 'var(--text-3xl)', fontWeight: 600, color: '#fff' }}>{n}</div><div style={{ fontSize: 'var(--text-sm)', color: 'rgba(234,243,226,.78)', marginTop: 2 }}>{l}</div></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Investment Opportunities — expandable comparison + full details ── */
const OPP_RISK = [
  'TigerMark insurance policy covering maleficence.',
  'Backed by tangible real estate assets.',
  'A-rated property insurers to protect against fraud, maleficence and loss-of-use insurance.',
  'Properties purchased well below market replacement costs for added value.',
];

const OPP_ROWS = [
  {
    name: 'Impact Bridge Debt Offering', tag: 'Limited · Q3 2026', highlight: true,
    desc: 'Bridge debt ahead of a confirmed refinancing — current quarterly income.',
    annual: '15–30% / yr', total: '15–30% over 12 mo', min: '$100K', term: '12 mo', cap: '$50M',
    details: {
      investHref: '/q3-special',
      blurb: 'A limited capital raise bridging a short-term gap ahead of an already-confirmed refinancing event — offering accredited investors above-market return potential, backed by real estate assets in supply-constrained markets with durable demand.',
      tiers: [['$100,000', '15%'], ['$500,000', '22%'], ['$1,500,000', '30%']],
      risk: OPP_RISK,
      holding: { value: '12 months', note: 'A short-duration bridge with income paid quarterly, ahead of an already-confirmed refinancing event.' },
      capacity: { value: '$50 million', note: 'Limited to the first $50M; the offering extends to $50M total.' },
      impact: { label: 'Affordable housing', note: 'Backed by real estate assets in supply-constrained markets with durable demand.' },
    },
  },
  {
    name: '2–4 Year Opportunity', tag: 'Most accessible',
    desc: 'A flexible vehicle for stable income and positive impact.',
    annual: '9–15% / yr', total: 'up to ~60%', min: '$20K', term: '2–4 yrs', cap: '$175M',
    details: {
      blurb: 'A flexible, high-yield investment vehicle designed for stable returns and positive social impact.',
      tiers: [['$20,000', '9.0%'], ['$100,000', '12.0%'], ['$1,000,000', '15.0%']],
      risk: OPP_RISK,
      holding: { value: '2 to 4 years', note: 'Combines flexibility with structured long-term growth. Investors can invest for a period between 2 and 4 years.' },
      capacity: { value: '$175 million', note: 'Total investment scope, demonstrating the scalability and strength of the portfolio.' },
      impact: { label: 'ESG focused', note: 'Supports affordable housing, renewable energy retrofits, and resilient community infrastructure.' },
    },
  },
  {
    name: 'Rapid Housing',
    desc: 'Short-term, focused on rapid deployment of affordable housing.',
    annual: '~15% / yr', total: '~30% over 24 mo', min: '$250K', term: '≤24 mo', cap: '$7M',
    details: {
      blurb: 'A high-yield, short-term investment opportunity focused on rapid deployment of affordable housing solutions.',
      tiers: [['$250,000', '30%']],
      risk: OPP_RISK,
      holding: { value: '24 months', note: 'Maximum holding period.' },
      capacity: { value: '$7 million', note: 'Capped for exclusivity and focus.' },
      impact: { label: 'Rapid housing', note: 'Rapid housing delivered within 2 to 10 weeks.' },
    },
  },
  {
    name: 'Side Letter',
    desc: 'An exclusive allocation for strategic partners.',
    annual: '~15% / yr', total: '~45% over 36 mo', min: '$2M', term: '36 mo', cap: '$25M',
    details: {
      blurb: 'An exclusive, high-yield investment opportunity for strategic partners.',
      tiers: [['$2,000,000', '45%']],
      risk: OPP_RISK,
      holding: { value: '36 months', note: 'Minimum holding period.' },
      capacity: { value: '$25 million', note: 'Capped for exclusivity and focus.' },
      impact: { label: 'ESG focused', note: 'Supports affordable housing, renewable energy retrofits, and resilient community infrastructure.' },
    },
  },
  {
    name: 'Proactive QOZ Fund I', tag: 'Tax-advantaged',
    desc: 'Opportunity-Zone fund with tax advantages and measurable impact.',
    annual: '8% / yr', total: '10 yrs for max tax benefits', min: 'Contact', term: '10 yrs', cap: '$25M',
    details: {
      badge: 'Qualified Opportunity Zone Fund',
      blurb: 'Transforming underserved communities with measurable impact and above-market returns.',
      cards: [
        { icon: 'trending-up', label: 'Target returns', value: '8%', note: 'Annually, paid quarterly.' },
        { icon: 'clock', label: 'Holding period', value: '10 years', note: 'To maximize QOZ tax benefits.' },
        { icon: 'dollar', label: 'Tax advantages', value: '', note: 'Defer and reduce capital gains taxes, and eliminate gains on fund appreciation.' },
      ],
      opportunity: [
        'The Proactive Realty Group, LLC is a mission-driven investment firm delivering affordable housing solutions in Opportunity Zones (OZs): federally designated underserved areas ripe for revitalization. Through our Impact Housing Fund, we redevelop manufactured home parks, multifamily properties, SROs, and obsolete commercial spaces into deeply affordable, high-performing assets.',
        'Recent changes at the Department of the Treasury and the Internal Revenue Service are intended to offer enhanced QOZ tax incentives for investing in underserved rural areas. There are currently 8,764 QOZs in the United States, with 3,309 comprised entirely of rural areas.',
      ],
      strategy: [
        'Install new and used energy-efficient manufactured homes from Clayton, Cavco, Legacy, Fleetwood, and Champion across OZ-based mobile home parks.',
        'Perform LEED-certified renovations of distressed motels, apartments, and commercial buildings to create affordable multifamily and SRO housing.',
        'Offer homes for sale at 30% below retail value and deliver 20 to 30% monthly rental savings to residents (across all rental units).',
        'Create local and induced jobs via construction, maintenance, and vendor partnerships.',
      ],
      valueProp: [
        'Attractive risk-adjusted returns in overlooked real estate segments.',
        'Immediate income generation with stabilized, cash-flowing properties.',
        'Deep social impact tracked through SDG-aligned metrics and third-party reporting.',
        'Significant tax advantages through Opportunity Zone investing.',
      ],
    },
  },
];

function OppActions({ href }) {
  if (href) {
    return (
      <div className="opp-actions">
        <a className="btn btn-accent btn-lg" href={href}>Invest now <Ic name="arrow-right" size={18} /></a>
        <span className="opp-actions-note">Opens the Q3 Special offering page.</span>
      </div>
    );
  }
  return (
    <div className="opp-actions">
      <button className="btn btn-accent btn-lg" onClick={goToCalculator}>Invest now <Ic name="arrow-right" size={18} /></button>
      <span className="opp-actions-note">Opens the investment calculator, where you can model your returns.</span>
    </div>
  );
}

function OppDetail({ d }) {
  if (d.cards) {
    return (
      <div className="opp-panel">
        {d.badge && <span className="opp-qoz-badge">{d.badge}</span>}
        {d.blurb && <p className="opp-blurb">{d.blurb}</p>}
        <div className="opp-cards opp-cards-3">
          {d.cards.map((c) => (
            <div className="opp-card" key={c.label}>
              <div className="opp-card-h"><Ic name={c.icon} size={18} /> {c.label}</div>
              {c.value && <div className="opp-big">{c.value}</div>}
              <p className="opp-note">{c.note}</p>
            </div>
          ))}
        </div>
        <div className="opp-prose">
          <h4>The opportunity</h4>
          {d.opportunity.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="opp-prose-2col">
          <div><h4>Our strategy</h4><ul className="opp-bullets">{d.strategy.map((b) => <li key={b}>{b}</li>)}</ul></div>
          <div><h4>Investor value proposition</h4><ul className="opp-bullets">{d.valueProp.map((b) => <li key={b}>{b}</li>)}</ul></div>
        </div>
        <OppActions href={d.investHref} />
      </div>
    );
  }
  return (
    <div className="opp-panel">
      {d.blurb && <p className="opp-blurb">{d.blurb}</p>}
      <div className="opp-cards">
        <div className="opp-card">
          <div className="opp-card-h"><Ic name="trending-up" size={18} /> Minimum investment &amp; preferred returns</div>
          <table className="opp-tiers">
            <thead><tr><th>Minimum investment</th><th>Pref. targeted returns</th></tr></thead>
            <tbody>{d.tiers.map(([m, p]) => <tr key={m}><td>{m}</td><td>{p}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="opp-card">
          <div className="opp-card-h"><Ic name="shield-check" size={18} /> Fully risk-managed*</div>
          <ul className="opp-bullets">{d.risk.map((b) => <li key={b}>{b}</li>)}</ul>
        </div>
        <div className="opp-card">
          <div className="opp-card-h"><Ic name="clock" size={18} /> Holding period</div>
          <div className="opp-big">{d.holding.value}</div>
          <p className="opp-note">{d.holding.note}</p>
        </div>
        <div className="opp-card">
          <div className="opp-card-h"><Ic name="layers" size={18} /> Capacity</div>
          <div className="opp-big">{d.capacity.value}</div>
          <p className="opp-note">{d.capacity.note}</p>
        </div>
        <div className="opp-card opp-card-wide">
          <div className="opp-card-h"><Ic name="leaf" size={18} /> Impact beyond financial returns</div>
          <div className="opp-big">{d.impact.label}</div>
          <p className="opp-note">{d.impact.note}</p>
        </div>
      </div>
      <OppActions href={d.investHref} />
    </div>
  );
}

function Opportunities2() {
  const [open, setOpen] = useH(null);
  const toggle = (i) => setOpen((o) => (o === i ? null : i));
  return (
    <section id="opportunities" style={{ maxWidth: 1180, margin: '110px auto 0', padding: '0 22px', scrollMarginTop: 100 }}>
      <HomeSectionHead eyebrow="Investment opportunities" title="Compare the opportunities" sub="Yields are similar across our vehicles (~8–15% a year). What changes is the entry point, term, and access — so you can find the one that fits. Open any row for the full details." serif />
      <div className="glass lit opp-wrap">
        <div className="opp-head" aria-hidden="true">
          <div>Vehicle</div><div>Annual return</div><div>Total over term</div><div>Minimum</div><div>Term</div><div>Capacity</div><div></div>
        </div>
        {OPP_ROWS.map((r, i) => {
          const isOpen = open === i;
          return (
            <div className={`opp-item${r.highlight ? ' hl' : ''}${isOpen ? ' open' : ''}`} key={r.name}>
              <button type="button" className="opp-summary" aria-expanded={isOpen} aria-controls={`opp-panel-${i}`} onClick={() => toggle(i)}>
                <div className="opp-vehicle">
                  <div className="opp-name editorial">{r.name}{r.tag && <span className="opp-tag">{r.tag}</span>}</div>
                  <div className="opp-desc">{r.desc}</div>
                </div>
                <div className="opp-cell" data-label="Annual return"><span className="figure opp-annual">{r.annual}</span></div>
                <div className="opp-cell" data-label="Total over term"><span className="figure opp-total">{r.total}</span></div>
                <div className="opp-cell" data-label="Minimum"><span className="figure">{r.min}</span></div>
                <div className="opp-cell" data-label="Term"><span className="figure">{r.term}</span></div>
                <div className="opp-cell" data-label="Capacity"><span className="figure">{r.cap}</span></div>
                <div className="opp-chev-cell"><span className="opp-chevron" aria-hidden="true"><Ic name="chevron-down" size={18} stroke={2.2} /></span></div>
              </button>
              <div className="opp-detail" id={`opp-panel-${i}`} role="region" aria-label={`${r.name} details`}>
                <div className="opp-detail-inner"><OppDetail d={r.details} /></div>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ maxWidth: '74ch', margin: '16px auto 0', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--fg-3)', lineHeight: 1.5 }}>
        *Risk-managed, not risk-free. Returns are targeted/projected, shown gross of fees and paid quarterly; totals are simple-interest over the hold period. Not guaranteed — investing involves risk, including possible loss of principal. This is not an offer to sell securities; any offering is made only to verified accredited investors via the fund's private placement memorandum.
      </p>
      <style>{`
        .opp-wrap { border-radius: var(--radius-2xl); overflow: hidden; box-shadow: var(--shadow-lg); }
        .opp-head, .opp-summary { display: grid; grid-template-columns: minmax(220px, 1.7fr) .85fr 1.15fr .8fr .72fr .8fr 46px; gap: 14px; align-items: center; }
        .opp-head { padding: 15px 22px; border-bottom: 1px solid var(--border); }
        .opp-head > div { font-size: var(--text-2xs); letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-3); font-weight: 600; }
        .opp-item { border-bottom: 1px solid var(--border); }
        .opp-item:last-child { border-bottom: none; }
        .opp-item.hl { background: color-mix(in srgb, var(--brand) 7%, transparent); }
        .opp-summary { width: 100%; text-align: left; background: transparent; border: 0; font: inherit; color: var(--fg-1); padding: 18px 22px; cursor: pointer; transition: background var(--dur-base) var(--ease-out); }
        .opp-summary:hover { background: var(--surface-2); }
        .opp-item.hl .opp-summary:hover { background: color-mix(in srgb, var(--brand) 11%, transparent); }
        .opp-summary:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
        .opp-cell { font-size: var(--text-sm); color: var(--fg-1); min-width: 0; }
        .opp-name { color: var(--forest-700); font-weight: 600; font-size: var(--text-lg); display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .opp-tag { font-family: var(--font-sans); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; color: var(--forest-600); background: var(--lime-100); border-radius: 999px; padding: 3px 9px; }
        .opp-desc { color: var(--fg-2); font-size: var(--text-sm); line-height: 1.5; margin-top: 5px; max-width: 44ch; }
        .opp-annual { color: var(--brand); font-weight: 600; }
        .opp-total { color: var(--fg-2); }
        [data-theme="dark"] .opp-name { color: var(--lime-300); }
        .opp-chev-cell { display: flex; justify-content: flex-end; }
        .opp-chevron { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; color: var(--brand); background: color-mix(in srgb, var(--accent) 16%, transparent); transition: transform .38s var(--ease-out), background .2s; animation: opp-pulse 2s ease-in-out infinite; }
        .opp-summary:hover .opp-chevron { background: color-mix(in srgb, var(--accent) 26%, transparent); }
        .opp-item.open .opp-chevron { transform: rotate(180deg); animation: none; }
        @keyframes opp-pulse { 0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent); } 70% { box-shadow: 0 0 0 9px transparent; } }
        .opp-detail { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .42s var(--ease-out); }
        .opp-item.open .opp-detail { grid-template-rows: 1fr; }
        .opp-detail-inner { overflow: hidden; visibility: hidden; transition: visibility .42s; }
        .opp-item.open .opp-detail-inner { visibility: visible; }
        .opp-panel { padding: 4px 22px 30px; }
        .opp-blurb { color: var(--fg-2); font-size: var(--text-base); line-height: 1.6; max-width: 72ch; margin: 0 0 20px; }
        .opp-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .opp-cards-3 { grid-template-columns: repeat(3, 1fr); }
        .opp-card { background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 22px; }
        .opp-card-wide { grid-column: 1 / -1; }
        .opp-card-h { display: flex; align-items: center; gap: 10px; font-weight: 600; color: var(--forest-700); font-size: var(--text-base); margin-bottom: 14px; }
        [data-theme="dark"] .opp-card-h { color: var(--lime-300); }
        .opp-card-h svg { color: var(--brand); }
        .opp-big { font-size: var(--text-xl); font-weight: 700; color: var(--forest-700); letter-spacing: -0.01em; }
        [data-theme="dark"] .opp-big { color: var(--lime-300); }
        .opp-note { color: var(--fg-2); font-size: var(--text-sm); line-height: 1.55; margin: 6px 0 0; }
        .opp-tiers { width: 100%; border-collapse: collapse; }
        .opp-tiers th { text-align: left; font-size: var(--text-2xs); letter-spacing: 0.06em; text-transform: uppercase; color: var(--fg-3); font-weight: 600; padding: 0 0 8px; border-bottom: 1px solid var(--border); }
        .opp-tiers th:last-child, .opp-tiers td:last-child { text-align: right; }
        .opp-tiers td { padding: 10px 0; border-bottom: 1px solid var(--border); font-size: var(--text-sm); color: var(--fg-1); }
        .opp-tiers tr:last-child td { border-bottom: none; }
        .opp-tiers td:last-child { color: var(--brand); font-weight: 600; }
        .opp-bullets { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .opp-bullets li { position: relative; padding-left: 22px; color: var(--fg-2); font-size: var(--text-sm); line-height: 1.5; }
        .opp-bullets li::before { content: ''; position: absolute; left: 4px; top: 7px; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
        .opp-qoz-badge { display: inline-block; font-size: var(--text-2xs); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700; color: #fff; background: var(--forest-600); border-radius: 999px; padding: 5px 12px; margin: 0 0 14px; }
        .opp-prose { margin-top: 20px; }
        .opp-prose h4, .opp-prose-2col h4 { font-size: var(--text-base); font-weight: 600; color: var(--forest-700); margin: 0 0 10px; }
        [data-theme="dark"] .opp-prose h4, [data-theme="dark"] .opp-prose-2col h4 { color: var(--lime-300); }
        .opp-prose p { color: var(--fg-2); font-size: var(--text-sm); line-height: 1.6; margin: 0 0 10px; max-width: 86ch; }
        .opp-prose-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 18px; }
        .opp-actions { display: flex; align-items: center; gap: 16px; margin-top: 24px; flex-wrap: wrap; }
        .opp-actions-note { font-size: var(--text-xs); color: var(--fg-3); }
        @media (max-width: 1024px) {
          .opp-head { display: none; }
          .opp-summary { grid-template-columns: 1fr 1fr; gap: 12px 16px; padding: 18px; position: relative; }
          .opp-vehicle { grid-column: 1 / -1; padding-right: 42px; }
          .opp-cell { display: flex; flex-direction: column; gap: 2px; }
          .opp-cell::before { content: attr(data-label); font-size: var(--text-2xs); text-transform: uppercase; letter-spacing: 0.06em; color: var(--fg-3); font-weight: 600; }
          .opp-chev-cell { position: absolute; top: 18px; right: 18px; }
          .opp-panel { padding: 2px 18px 26px; }
          .opp-cards, .opp-cards-3, .opp-prose-2col { grid-template-columns: 1fr; }
        }
        @media (max-width: 520px) {
          .opp-summary { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .opp-chevron { animation: none; }
          .opp-detail { transition: none; }
        }
      `}</style>
    </section>
  );
}

/* ── Intake form ──
   The right-hand panel is Tenth Avenue's own `webform` embed, so the fields and the
   SMS consent wording are whatever is set in Tenth Avenue. The left panel is ours. */
function IntakeForm() {
  return (
    <section id="get-started" style={{ maxWidth: 1100, margin: '110px auto 0', padding: '0 22px', scrollMarginTop: 100 }}>
      <style>{`
        @media (max-width: 760px){.psb-intake-grid{grid-template-columns:1fr !important}}
        .psb-intake-embed { background: var(--surface-2); padding: 28px 22px; display: flex; flex-direction: column; justify-content: center; }
        @media (max-width: 560px){.psb-intake-embed{padding:18px 6px}}
      `}</style>
      <div className="glass lit psb-intake-grid" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1.1fr' }}>
        <div style={{ padding: '48px 44px', background: 'linear-gradient(160deg, var(--forest-600), var(--forest-800))', color: '#eaf3e2', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(110% 80% at 0% 100%, rgba(149,196,92,.2), transparent 55%)' }} />
          <div style={{ position: 'relative' }}>
            <span className="eyebrow" style={{ color: 'var(--lime-300)' }}>Get started</span>
            <h2 style={{ margin: '14px 0 14px', color: '#fff', fontSize: 'var(--text-3xl)', letterSpacing: '-0.02em' }}>Tell us about your goals.</h2>
            <p style={{ margin: 0, color: 'rgba(234,243,226,.8)', lineHeight: 1.6, maxWidth: '34ch' }}>A Proactive advisor will reach out within one business day — no obligation, just a conversation about your goals and eligibility.</p>
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['shield-check', 'Accredited & institutional welcome'], ['clock', 'Reply within 1 business day'], ['lock', 'Your details stay confidential']].map(([ic, t]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--text-sm)', color: 'rgba(234,243,226,.9)' }}><Ic name={ic} size={17} style={{ color: 'var(--lime-300)' }} />{t}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="psb-intake-embed">
          <TaFormEmbed formKey="webform" title="Tell us about your goals" initialHeight={900} />
        </div>
      </div>
    </section>
  );
}

export { Partners, BeforeAfter, ReturnComparison, SocialProof, Opportunities2, IntakeForm, HomeSectionHead };
