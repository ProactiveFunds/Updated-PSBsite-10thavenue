import React from 'react';
import { Ic } from './icons.jsx';
import { PSB } from '../lib/interactions.js';
import { Photo } from './Hero.jsx';
// MktSections.jsx — opportunities, process, testimonial, insights, invest modal
const { useState: useS, useEffect: useE } = React;

function SectionHead({ eyebrow, title, sub, align = 'left' }) {
  return (
    <div style={{ textAlign: align, maxWidth: align === 'center' ? '46ch' : '100%', margin: align === 'center' ? '0 auto 38px' : '0 0 34px' }}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 style={{ margin: '14px 0 0', letterSpacing: '-0.02em' }}>{title}</h2>
      {sub && <p className="lead" style={{ margin: '14px 0 0' }}>{sub}</p>}
    </div>
  );
}

function Opportunities() {
  const all = [
    { nm: 'Cedar Grove Community', loc: 'Austin, TX', type: 'QOZ', occ: '96%', yield: '8.5%', raise: '$18M', filled: 72, status: 'Open' },
    { nm: 'Willowbrook Commons', loc: 'Columbus, OH', type: 'SDIRA', occ: '94%', yield: '8.2%', raise: '$12M', filled: 88, status: 'Open' },
    { nm: 'Magnolia Trace', loc: 'Savannah, GA', type: 'QOZ', occ: '98%', yield: '7.9%', raise: '$22M', filled: 41, status: 'Open' },
    { nm: 'Riverside Meadows', loc: 'Boise, ID', type: 'Rapid', occ: '92%', yield: '9.1%', raise: '$15M', filled: 100, status: 'Funded' },
  ];
  const filters = ['All', 'QOZ', 'SDIRA', 'Rapid'];
  const [f, setF] = useS('All');
  const list = all.filter((x) => f === 'All' || x.type === f);
  return (
    <section style={{ maxWidth: 1240, margin: '96px auto 0', padding: '0 22px' }}>
      <span className="eyebrow">Open opportunities</span>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, margin: '14px 0 34px' }}>
        <div style={{ minWidth: 0, maxWidth: '52ch' }}>
          <h2 style={{ margin: 0, letterSpacing: '-0.02em' }}>Communities accepting capital</h2>
          <p className="lead" style={{ margin: '14px 0 0' }}>Each fund finances a portfolio of income-producing affordable communities.</p>
        </div>
        <div className="tabs">
          {filters.map((x) => <button key={x} aria-selected={f === x} onClick={() => setF(x)}>{x}</button>)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
        {list.map((p) => (
          <article key={p.nm} className="card card-hover" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ position: 'relative', height: 130 }}>
              <Photo h="130px" radius="0" />
              <span className={'badge ' + (p.status === 'Open' ? 'badge-open' : 'badge-neutral')} style={{ position: 'absolute', top: 12, left: 12 }}>
                {p.status === 'Open' && <span className="dot" />}{p.status}
              </span>
              <span className="badge badge-soft" style={{ position: 'absolute', top: 12, right: 12 }}>{p.type}</span>
            </div>
            <div style={{ padding: '16px 18px 18px' }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>{p.nm}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}><Ic name="map-pin" size={13} />{p.loc}</div>
              <div style={{ display: 'flex', gap: 18, margin: '14px 0' }}>
                <div><div className="figure" style={{ fontSize: 'var(--text-lg)', color: 'var(--brand)' }}>{p.yield}</div><div style={{ fontSize: 10, color: 'var(--fg-3)' }}>Target yield</div></div>
                <div><div className="figure" style={{ fontSize: 'var(--text-lg)' }}>{p.occ}</div><div style={{ fontSize: 10, color: 'var(--fg-3)' }}>Occupied</div></div>
                <div><div className="figure" style={{ fontSize: 'var(--text-lg)' }}>{p.raise}</div><div style={{ fontSize: 10, color: 'var(--fg-3)' }}>Raise</div></div>
              </div>
              <div className="progress" style={{ marginBottom: 6 }}><i style={{ width: p.filled + '%' }} /></div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{p.filled}% subscribed</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    ['eye', 'Explore', 'Browse open communities, yields, and full impact data — no account needed.'],
    ['shield-check', 'Qualify', 'Verify accreditation or SDIRA eligibility in minutes through our secure flow.'],
    ['wallet', 'Invest', 'Commit capital, sign your side letter, and fund — all tracked in your portal.'],
    ['trending-up', 'Earn & track', 'Receive quarterly distributions and watch your impact compound.'],
  ];
  return (
    <section style={{ maxWidth: 1240, margin: '100px auto 0', padding: '0 22px' }}>
      <SectionHead eyebrow="How it works" title="From capital to keys, in four steps" align="center" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
        {steps.map(([ic, t, d], i) => (
          <div key={t} className="card" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, display: 'grid', placeItems: 'center', background: 'var(--lime-100)', color: 'var(--forest-600)' }}><Ic name={ic} size={22} /></div>
              <span className="figure" style={{ color: 'var(--stone-300)', fontSize: 'var(--text-2xl)' }}>0{i + 1}</span>
            </div>
            <h4 style={{ margin: '18px 0 8px', fontSize: 'var(--text-lg)' }}>{t}</h4>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.55 }}>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section style={{ maxWidth: 1240, margin: '100px auto 0', padding: '0 22px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 0, borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        <Photo h="100%" radius="0" label="Rosa M." sublabel="WILLOWBROOK COMMONS · RESIDENT" />
        <div style={{ background: 'var(--surface)', padding: '56px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="editorial editorial-italic" style={{ fontSize: 'var(--text-3xl)', color: 'var(--forest-700)', lineHeight: 1.28 }}>
            "A return measured not only in yield, but in keys handed to families."
          </span>
          <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--forest-600)' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>James Okafor</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)' }}>Investor since 2021 · $1.2M committed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Insights() {
  const posts = [
    { tag: 'Housing', t: 'Why manufactured housing is the most overlooked affordable asset', d: '6 min read', dt: 'May 2026' },
    { tag: 'Tax', t: 'How Qualified Opportunity Zones defer (and reduce) capital gains', d: '8 min read', dt: 'Apr 2026' },
    { tag: 'Impact', t: 'Our 2025 Impact Report: 4,200 homes and counting', d: '4 min read', dt: 'Mar 2026' },
  ];
  return (
    <section style={{ maxWidth: 1240, margin: '100px auto 0', padding: '0 22px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <SectionHead eyebrow="Insights" title="Thinking on housing & yield" />
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 34 }}>All articles <Ic name="arrow-right" size={15} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
        {posts.map((p) => (
          <article key={p.t} className="card card-hover" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            <Photo h="160px" radius="0" />
            <div style={{ padding: '18px 20px 22px' }}>
              <span className="badge badge-neutral">{p.tag}</span>
              <h4 style={{ margin: '12px 0 0', fontSize: 'var(--text-lg)', lineHeight: 1.25, letterSpacing: '-0.01em' }}>{p.t}</h4>
              <div style={{ marginTop: 16, fontSize: 'var(--text-xs)', color: 'var(--fg-3)', display: 'flex', gap: 14 }}>
                <span>{p.dt}</span><span>·</span><span>{p.d}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// Invest flow modal — demonstrates micro-delay + confirmation animation
function InvestModal({ open, onClose }) {
  const [stage, setStage] = useS('form'); // form | done
  const [amt, setAmt] = useS('250,000');
  useE(() => { if (open) setStage('form'); }, [open]);
  if (!open) return null;
  const submit = (e) => {
    const btn = e.currentTarget;
    PSB.withPending(btn, async () => {}, { ms: 800, pending: 'Reserving…', done: 'Reserved', hold: 900 }).then(() => setStage('done'));
  };
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(12,20,16,.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div className="rise" onClick={(e) => e.stopPropagation()} style={{ width: 440, maxWidth: '100%', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', padding: 34, position: 'relative' }}>
        <button className="btn btn-icon btn-quiet" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16 }} aria-label="Close"><Ic name="x" size={18} /></button>
        {stage === 'form' ? (
          <React.Fragment>
            <span className="badge badge-forest">Proactive QOZ Fund</span>
            <h3 style={{ margin: '16px 0 6px', fontSize: 'var(--text-2xl)' }}>Reserve your allocation</h3>
            <p style={{ margin: '0 0 24px', fontSize: 'var(--text-sm)', color: 'var(--fg-2)' }}>Indicate interest — no commitment yet. We'll open your dataroom next.</p>
            <label className="field-label">Amount (USD)</label>
            <div style={{ position: 'relative', marginBottom: 18 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>$</span>
              <input className="field" style={{ paddingLeft: 28, fontFamily: 'var(--font-mono)' }} value={amt} onChange={(e) => setAmt(e.target.value)} />
            </div>
            <label className="field-label">Account type</label>
            <select className="field" style={{ marginBottom: 26 }}><option>Self-directed IRA (SDIRA)</option><option>Individual / joint</option><option>Entity / trust</option></select>
            <button className="btn btn-accent btn-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={submit}>Reserve allocation</button>
          </React.Fragment>
        ) : (
          <div style={{ textAlign: 'center', padding: '14px 0 6px' }}>
            <div style={{ display: 'inline-block' }}><CheckRing /></div>
            <h3 style={{ margin: '20px 0 6px', fontSize: 'var(--text-2xl)' }}>Allocation reserved</h3>
            <p style={{ margin: '0 0 26px', fontSize: 'var(--text-sm)', color: 'var(--fg-2)' }}>We've reserved <b className="figure">${amt}</b> in the Proactive QOZ Fund. Your dataroom invite is on its way.</p>
            <button className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>Open my portal</button>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckRing() {
  return (
    <div className="check-ring" style={{ width: 64, height: 64, margin: '0 auto' }}>
      <span className="ripple" />
      <Ic name="check" size={32} stroke={2.6} />
    </div>
  );
}

export { SectionHead, Opportunities, Process, Testimonial, Insights, InvestModal };
