import React from 'react';
import { Ic } from './icons.jsx';
// HomeCalculator.jsx — dynamic investment calculator (sits under the hero)
// Suggests the best bond option from investor status + amount + hold duration.
const { useState: useCalc, useMemo } = React;

// Amount-band bond ladder (aligns to slider marks). Simple-interest model,
// matching the legacy StepInvestmentConfirmation math:
//   annual% = quarterlyRate + maturityRate
//   total%  = annual% × years ; total$ = amount × total%
// Rapid Housing (30% over ~2yr) and Side Letter (45% over ~3yr) are also 15%/yr —
// their headline numbers are TOTAL returns over the hold, not annual rates.
const BANDS = [
  { id: 'b1', name: 'Bond Option 1', min: 20000,   max: 99999,    annual: 0.09, note: '6% paid quarterly + 3% per year at maturity', range: '$20K–$99K' },
  { id: 'b2', name: 'Bond Option 2', min: 100000,  max: 249999,   annual: 0.12, note: '7% paid quarterly + 5% per year at maturity', range: '$100K–$249K' },
  { id: 'b3', name: 'Bond Option 3', min: 250000,  max: 999999,   annual: 0.15, note: '10% paid quarterly + 5% per year at maturity', range: '$250K–$999K' },
  { id: 'rh', name: 'Rapid Housing', min: 1000000, max: 1999999,  annual: 0.15, note: '≈30% total over a 24-month rapid deployment',  range: '$1M–$1.99M' },
  { id: 'sl', name: 'Side Letter',   min: 2000000, max: 100000000, annual: 0.15, note: '≈45% total over a 36-month strategic allocation', range: '$2M+' },
];
const STATUSES = [
  { id: 'accredited', label: 'Accredited investor', ok: true },
  { id: 'family',     label: 'Family office',       ok: true },
  { id: 'institutional', label: 'Institutional',    ok: true },
  { id: 'retail',     label: 'Not yet accredited',  ok: false },
];
const MARKS = [
  { v: 20000, l: '$20K' }, { v: 100000, l: '$100K' }, { v: 250000, l: '$250K' },
  { v: 1000000, l: '$1M' }, { v: 2000000, l: '$2M' }, { v: 10000000, l: '$10M' },
];
const MIN = 20000, MAX = 10000000;
// log mapping between slider 0..1 and amount
const toAmount = (t) => Math.round((MIN * Math.pow(MAX / MIN, t)) / 1000) * 1000;
const toPos = (a) => Math.log(a / MIN) / Math.log(MAX / MIN);
const fmt = (n) => '$' + Math.round(n).toLocaleString();

function HomeCalculator({ onStart }) {
  const [status, setStatus] = useCalc('accredited');
  const [amount, setAmount] = useCalc(100000);
  const [years, setYears] = useCalc(2);

  const band = useMemo(() => BANDS.find((b) => amount >= b.min && amount <= b.max) || BANDS[BANDS.length - 1], [amount]);
  const st = STATUSES.find((s) => s.id === status);
  const annual = band.annual;
  const totalPct = annual * years;
  const totalUsd = amount * totalPct;

  const metrics = [
    ['Annual return', (annual * 100).toFixed(0) + '%', 'var(--lime-300)'],
    ['Total return %', (totalPct * 100).toFixed(0) + '%', '#e7c982'],
    ['Total return $', fmt(totalUsd), '#e7c982'],
    ['On investment', fmt(amount), '#fff'],
  ];

  return (
    <section id="calculator" style={{ maxWidth: 1240, margin: '64px auto 0', padding: '0 22px', scrollMarginTop: 90 }}>
      <div style={{ textAlign: 'center', maxWidth: '80ch', margin: '0 auto 22px' }}>
        <span className="eyebrow">Model your investment</span>
        <h2 style={{ margin: '10px 0 0', fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', color: 'var(--fg-1)', fontWeight: 700 }}>See what your capital returns — before you commit.</h2>
        <p className="lead" style={{ margin: '8px auto 0', maxWidth: '78ch', fontSize: 'var(--text-sm)', lineHeight: 1.55, color: 'var(--fg-2)' }}>Every tier pays differently. Set your amount, investor type, and hold period to preview your projected income — and find the bond option matched to your profile.</p>
      </div>
      <div className="glass glass-strong lit" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>

        {/* ── metrics band ── */}
        <div style={{ background: 'linear-gradient(100deg, var(--forest-700), var(--forest-600))', color: '#eaf3e2', padding: '20px 32px', display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 20, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(234,243,226,.6)' }}>Best available</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.01em', marginTop: 2 }}>{band.name}</div>
          </div>
          {metrics.map(([l, v, c]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(234,243,226,.6)' }}>{l}</div>
              <div className="figure" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: c, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* ── controls (2-row config) ── */}
        <div style={{ padding: '26px 32px 30px', display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: 30, alignItems: 'start' }}>

          {/* status */}
          <div>
            <div className="data-label" style={{ marginBottom: 12 }}>I am a…</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {STATUSES.map((s) => {
                const on = status === s.id;
                return (
                  <button key={s.id} onClick={() => setStatus(s.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    font: 'inherit', fontSize: 'var(--text-sm)', fontWeight: 500, textAlign: 'left',
                    border: '1px solid ' + (on ? 'var(--accent)' : 'var(--border)'),
                    background: on ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'var(--surface)',
                    color: 'var(--fg-1)', transition: 'all var(--dur-base) var(--ease-out)',
                  }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid ' + (on ? 'var(--accent)' : 'var(--border-strong)'), display: 'grid', placeItems: 'center', flex: 'none' }}>
                      {on && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />}
                    </span>
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* amount + slider */}
          <div>
            <div className="data-label" style={{ marginBottom: 12 }}>Investment amount</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, borderBottom: '2px solid var(--border-strong)', paddingBottom: 8 }}>
              <span className="figure" style={{ fontSize: 'var(--text-2xl)', color: 'var(--brand)', fontWeight: 600 }}>$</span>
              <input className="figure" inputMode="numeric" value={amount.toLocaleString()}
                onChange={(e) => { const n = +e.target.value.replace(/[^0-9]/g, ''); if (!isNaN(n)) setAmount(Math.min(MAX, Math.max(MIN, n))); }}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 'var(--text-2xl)', color: 'var(--fg-1)', fontWeight: 600, width: '100%' }} />
            </div>
            <input type="range" min="0" max="1000" value={Math.round(toPos(amount) * 1000)}
              onChange={(e) => setAmount(toAmount(+e.target.value / 1000))}
              style={{ width: '100%', margin: '18px 0 6px', accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {MARKS.map((m) => <span key={m.l} style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{m.l}</span>)}
            </div>
            <div className="badge badge-open" style={{ marginTop: 14, textTransform: 'none', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>
              <Ic name="check-circle" size={13} /> {band.name} available ({band.range})
            </div>
          </div>

          {/* duration + result */}
          <div>
            <div className="data-label" style={{ marginBottom: 12 }}>Preferred hold duration</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[2, 3, 4].map((y) => (
                <button key={y} onClick={() => setYears(y)} style={{
                  flex: 1, padding: '12px 0', borderRadius: 'var(--radius-md)', cursor: 'pointer', font: 'inherit', fontWeight: 600, fontSize: 'var(--text-sm)',
                  border: '1px solid ' + (years === y ? 'var(--brand)' : 'var(--border)'),
                  background: years === y ? 'var(--brand)' : 'var(--surface)', color: years === y ? 'var(--fg-on-forest)' : 'var(--fg-1)',
                  transition: 'all var(--dur-base) var(--ease-out)',
                }}>{y} yr{y > 1 ? 's' : ''}</button>
              ))}
            </div>
            <div className="card" style={{ marginTop: 16, borderRadius: 'var(--radius-md)', padding: 16, boxShadow: 'none', background: 'var(--surface-2)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-2)', lineHeight: 1.5 }}>{band.note}</div>
              {!st.ok && <div style={{ marginTop: 8, fontSize: 'var(--text-xs)', color: 'var(--amber-500)', display: 'flex', gap: 6, alignItems: 'flex-start' }}><Ic name="shield-check" size={14} /> Most options require accreditation — we'll help you check eligibility.</div>}
            </div>
            <button className="btn btn-accent btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={st.ok ? () => { window.location.href = 'https://tier2.sustainablebonds.com'; } : () => { window.location.href = '/accreditation'; }}>
              {st.ok ? 'Start investing' : 'Check my eligibility'} <Ic name="arrow-right" size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { HomeCalculator };
