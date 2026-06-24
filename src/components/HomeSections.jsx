import React from 'react';
import { Ic } from './icons.jsx';
import { PSB } from '../lib/interactions.js';
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
      <div style={{ textAlign: 'center', marginTop: 26 }}><button className="btn btn-brand btn-lg" onClick={onInvest}>Invest now <Ic name="arrow-right" size={18} /></button></div>
    </section>
  );
}

/* ── Social proof: Third-party verified impact + Proven performance ── */
function SocialProof() {
  const impact = [
    ['sprout', '4,200', 'Homes funded', 'Verified · RSM US'],
    ['users', '11,800', 'Residents housed', 'Verified · RSM US'],
    ['home', '−22%', 'Rents below market', 'Verified · CoStar'],
    ['shield-check', '38', 'Communities audited', 'Verified · Deloitte'],
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

/* ── Investment Opportunities — side-by-side comparison table ── */
function Opportunities2() {
  const rows = [
    { name: '2–4 Year Opportunity', tag: 'Most accessible', desc: 'A flexible vehicle for stable income and positive impact.', annual: '9–15% / yr', total: 'up to ~60%', min: '$20K', term: '2–4 yrs', cap: '$175M', highlight: true },
    { name: 'Rapid Housing', desc: 'Short-term, focused on rapid deployment of affordable housing.', annual: '~15% / yr', total: '~30% over 24 mo', min: '$250K', term: '≤24 mo', cap: '$7M' },
    { name: 'Side Letter', desc: 'An exclusive allocation for strategic partners.', annual: '~15% / yr', total: '~45% over 36 mo', min: '$2M', term: '36 mo', cap: '$25M' },
    { name: 'Proactive QOZ Fund I', tag: 'Tax-advantaged', desc: 'Opportunity-Zone fund with tax advantages and measurable impact.', annual: '8% / yr', total: '10 yrs for max tax benefits', min: 'Contact', term: '10 yrs', cap: '$25M' },
  ];
  return (
    <section id="opportunities" style={{ maxWidth: 1180, margin: '110px auto 0', padding: '0 22px', scrollMarginTop: 100 }}>
      <HomeSectionHead eyebrow="Investment opportunities" title="Compare the opportunities" sub="Yields are similar across our vehicles (~8–15% a year). What changes is the entry point, term, and access — so you can find the one that fits." serif />
      <div className="glass lit" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        <table className="opp-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Annual return</th>
              <th>Total over term</th>
              <th>Minimum</th>
              <th>Term</th>
              <th>Capacity</th>
              <th aria-label="Action"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className={r.highlight ? 'opp-row-hl' : ''}>
                <td data-label="Vehicle" className="opp-vehicle">
                  <div className="opp-name editorial">{r.name}{r.tag && <span className="opp-tag">{r.tag}</span>}</div>
                  <div className="opp-desc">{r.desc}</div>
                </td>
                <td data-label="Annual return" className="figure opp-annual">{r.annual}</td>
                <td data-label="Total over term" className="figure opp-total">{r.total}</td>
                <td data-label="Minimum" className="figure">{r.min}</td>
                <td data-label="Term" className="figure">{r.term}</td>
                <td data-label="Capacity" className="figure">{r.cap}</td>
                <td className="opp-cta"><a href="#opportunities" onClick={(e) => e.preventDefault()}>Learn more <Ic name="arrow-right" size={15} /></a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ maxWidth: '70ch', margin: '16px auto 0', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--fg-3)', lineHeight: 1.5 }}>
        Returns are shown gross of fees and paid quarterly; totals are simple-interest over the hold period. Projected, not guaranteed — investing involves risk, including possible loss of principal.
      </p>
      <style>{`
        .opp-table { width: 100%; border-collapse: collapse; }
        .opp-table th { text-align: left; font-size: var(--text-2xs); letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-3); font-weight: 600; padding: 16px 14px; border-bottom: 1px solid var(--border); }
        .opp-table td { padding: 16px 14px; border-bottom: 1px solid var(--border); color: var(--fg-1); vertical-align: middle; font-size: var(--text-sm); white-space: nowrap; }
        .opp-table tbody tr:last-child td { border-bottom: none; }
        .opp-table tbody tr { transition: background var(--dur-base) var(--ease-out); }
        .opp-table tbody tr:hover { background: var(--surface-2); }
        .opp-row-hl { background: color-mix(in srgb, var(--brand) 7%, transparent); }
        .opp-vehicle { white-space: normal; min-width: 200px; }
        .opp-name { color: var(--forest-700); font-weight: 600; font-size: var(--text-lg); display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .opp-tag { font-family: var(--font-sans); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; color: var(--forest-600); background: var(--lime-100); border-radius: 999px; padding: 3px 9px; }
        .opp-desc { color: var(--fg-2); font-size: var(--text-sm); line-height: 1.5; margin-top: 5px; }
        .opp-annual { color: var(--brand); font-weight: 600; }
        .opp-total { color: var(--fg-2); white-space: normal; min-width: 84px; }
        .opp-cta a { display: inline-flex; align-items: center; gap: 6px; color: var(--brand); font-weight: 600; font-size: var(--text-sm); text-decoration: none; white-space: nowrap; }
        .opp-cta a:hover { text-decoration: underline; }
        [data-theme="dark"] .opp-name { color: var(--lime-300); }
        @media (max-width: 860px) {
          .opp-table thead { display: none; }
          .opp-table, .opp-table tbody, .opp-table tr { display: block; width: 100%; }
          .opp-table tr { padding: 6px 6px 16px; border-bottom: 1px solid var(--border); }
          .opp-table tbody tr:last-child { border-bottom: none; }
          .opp-table td { display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: baseline; padding: 8px 16px; border: none; text-align: right; white-space: normal; box-sizing: border-box; min-width: 0; width: 100%; }
          .opp-table td::before { content: attr(data-label); color: var(--fg-3); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; text-align: left; }
          .opp-table td.opp-vehicle { display: block; text-align: left; padding-top: 16px; }
          .opp-table td.opp-vehicle::before { display: none; }
          .opp-table td.opp-cta { display: block; padding-top: 12px; }
          .opp-table td.opp-cta::before { display: none; }
          .opp-table td.opp-cta a { display: flex; box-sizing: border-box; width: 100%; justify-content: center; padding: 11px; border-radius: var(--radius-md); background: color-mix(in srgb, var(--brand) 12%, transparent); }
        }
      `}</style>
    </section>
  );
}

/* ── Intake form ── */
function IntakeForm() {
  const [frameH, setFrameH] = useH(700);
  useHE(() => {
    const onMsg = (e) => {
      const d = e.data;
      let ht = null;
      if (typeof d === 'number') ht = d;
      else if (d && typeof d === 'object') {
        ht = d.height || d.frameHeight || d.scrollHeight ||
          (typeof d.type === 'string' && /height|resize|size/i.test(d.type) ? (d.height || d.value || (d.payload && d.payload.height)) : null);
      }
      if (ht && ht > 200 && ht < 5000) setFrameH(Math.ceil(ht));
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);
  return (
    <section id="get-started" style={{ maxWidth: 1100, margin: '110px auto 0', padding: '0 22px', scrollMarginTop: 100 }}>
      <style>{`@media (max-width: 760px){.psb-intake-grid{grid-template-columns:1fr !important}}`}</style>
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
        <div style={{ background: 'var(--surface)', padding: 8 }}>
          <iframe
            src="https://tenthavenue.io/api/forms/webform/embed.html"
            title="Request a conversation"
            loading="lazy"
            style={{ width: '100%', height: frameH, minHeight: 560, border: 0, display: 'block', background: 'var(--surface)', borderRadius: 'var(--radius-lg)' }}
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export { Partners, BeforeAfter, ReturnComparison, SocialProof, Opportunities2, IntakeForm, HomeSectionHead };
