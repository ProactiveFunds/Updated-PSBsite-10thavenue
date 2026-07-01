import React from 'react';
import { MktNav, MktFooter } from './MktChrome.jsx';
import { Ic } from './icons.jsx';
import { goToCalculator } from '../lib/cta.js';
import { initInteractions } from '../lib/interactions.js';

const { useState, useEffect, useRef } = React;

const TIER2_URL = 'https://tier2.sustainablebonds.com';

// ── Returns intro (from the old "Impact Returns" section) ──
const HIGHLIGHTS = [
  {
    icon: 'trending-up',
    title: '9% to 30% Target Annual Returns',
    desc: 'Benefit from strong, consistent performance in a recession-resistant asset class.',
  },
  {
    icon: 'wallet',
    title: 'Monthly Distributions',
    desc: 'Receive regular cash flow directly from stable, long-term rental income.',
  },
  {
    icon: 'leaf',
    title: 'Verified Social Impact',
    desc: 'Your investment directly supports affordable housing and improves communities.',
  },
];

// ── Proven performance stats (from the old "Track Record" section) ──
const METRICS = [
  { icon: 'building', value: '17+', label: 'Communities Acquired', desc: 'Mobile home parks across multiple states.' },
  { icon: 'calendar', value: '5+', label: 'Years Experience', desc: 'Proven track record in affordable housing.' },
  { icon: 'dollar', value: '$25M', label: 'Assets Under Management', desc: 'Total portfolio value across all properties.' },
  { icon: 'trending-up', value: '20%+', label: 'Average Annual Return', desc: 'Consistent performance for our investors.' },
];

// ── The Proactive Flywheel — 4-stage self-reinforcing cycle ──
const STEPS = [
  {
    number: 1, title: 'Deploy', subtitle: 'Acquire & Renovate Affordable Housing',
    description: 'We identify and acquire under-stabilized affordable housing communities, then deploy investor capital into targeted renovations — improving quality of life for residents while positioning each asset for strong operational performance.',
  },
  {
    number: 2, title: 'Improve', subtitle: 'Increase Occupancy & Efficiency',
    description: 'With upgraded properties, we execute lease-up campaigns to fill vacant units, renegotiate vendor contracts, and implement operational improvements — driving occupancy rates up and expenses down to maximize net operating income.',
  },
  {
    number: 3, title: 'Cash Flow', subtitle: 'Distribute Consistent Income',
    description: 'Stabilized properties generate reliable, recurring cash flow. We distribute consistent quarterly income to investors — backed by real, cash-flowing affordable housing communities with third-party verified social impact.',
  },
  {
    number: 4, title: 'Refinance', subtitle: 'Return Capital to Investors',
    description: 'Higher property valuations and improved debt coverage ratios unlock favorable refinancing. We return capital to investors, optimize our balance sheet, and recycle equity into new acquisitions — keeping the flywheel spinning.',
  },
];

function FlywheelDiagram({ activeStep }) {
  const cx = 200, cy = 200, outerR = 155, innerR = 68;
  const total = STEPS.length;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const slicePath = (i) => {
    const sliceAngle = 360 / total;
    const gap = 4;
    const startAngle = toRad(i * sliceAngle - 90 - sliceAngle / 2 + gap / 2);
    const endAngle = toRad(i * sliceAngle - 90 + sliceAngle / 2 - gap / 2);
    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);
    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);
    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;
  };
  const arrowPos = (i) => {
    const sliceAngle = 360 / total;
    const angle = toRad(i * sliceAngle - 90 + sliceAngle / 2);
    const r = (outerR + innerR) / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), angle: (i * sliceAngle + sliceAngle / 2 - 90) };
  };
  const labelPos = (i) => {
    const sliceAngle = 360 / total;
    const angle = toRad(i * sliceAngle - 90);
    const r = outerR + 32;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  return (
    <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }} preserveAspectRatio="xMidYMid meet">
      <circle cx={cx} cy={cy} r={outerR + 44} fill="none" stroke="var(--brand)" strokeWidth="1" strokeDasharray="5 4" opacity="0.25" />

      {STEPS.map((step, i) => (
        <path
          key={i}
          d={slicePath(i)}
          fill={activeStep === i ? 'var(--brand)' : 'color-mix(in srgb, var(--brand) 16%, var(--surface))'}
          stroke="var(--bg)"
          strokeWidth="3"
          style={{ transition: 'fill 0.5s var(--ease-out)' }}
        />
      ))}

      {STEPS.map((step, i) => {
        const p = labelPos(i);
        return (
          <text key={`lbl-${i}`} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill={activeStep === i ? 'var(--forest-700)' : 'var(--fg-3)'}
            fontSize="13" fontWeight="700" style={{ transition: 'fill 0.5s var(--ease-out)' }}>
            {step.title}
          </text>
        );
      })}

      {STEPS.map((_, i) => {
        const pos = arrowPos(i);
        return (
          <text key={`arrow-${i}`} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
            fill={activeStep === i ? '#fff' : 'var(--brand)'} fontSize="11" opacity="0.8"
            transform={`rotate(${pos.angle}, ${pos.x}, ${pos.y})`} style={{ transition: 'fill 0.5s var(--ease-out)' }}>
            ▶
          </text>
        );
      })}

      <circle cx={cx} cy={cy} r={innerR} fill="var(--forest-700)" stroke="var(--bg)" strokeWidth="3" />
      <text x={cx} y={cy - 15} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold" fontFamily="var(--font-editorial)">REPEAT</text>
      <text x={cx} y={cy + 1} textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="8">Current Portfolio:</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fill="var(--lime-300)" fontSize="8.5" fontWeight="bold">Stabilized</text>
      <text x={cx} y={cy + 24} textAnchor="middle" fill="var(--lime-300)" fontSize="8.5" fontWeight="bold">Properties</text>
    </svg>
  );
}

function Flywheel() {
  const outerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = -rect.top;
      const totalScrollable = el.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;
      if (scrolled < 0 || scrolled > totalScrollable) return;
      const pct = Math.min(1, Math.max(0, scrolled / totalScrollable));
      setProgress(pct);
      setActiveStep(Math.min(STEPS.length - 1, Math.floor(pct * STEPS.length)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const step = STEPS[activeStep];
  const isLast = activeStep === STEPS.length - 1;

  return (
    <div ref={outerRef} className="fw-outer">
      <div className="fw-sticky">
        <div className="fw-head">
          <span className="eyebrow">Our strategy</span>
          <h2 className="editorial fw-title">The Proactive Flywheel</h2>
          <p className="fw-sub">A self-reinforcing 4-stage cycle that compounds both financial returns and social impact.</p>
        </div>

        <div className="fw-progress-wrap">
          <div className="fw-progress-track">
            <div className="fw-progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="fw-progress-labels">
            <span style={{ color: 'var(--brand)', fontWeight: 600 }}>Stage {activeStep + 1} of {STEPS.length}</span>
            <span style={{ color: 'var(--fg-3)' }}>Scroll to advance ↓</span>
          </div>
        </div>

        <div className="fw-grid">
          <div className="fw-diagram">
            <div style={{ width: '100%', maxWidth: 400, aspectRatio: '1 / 1' }}>
              <FlywheelDiagram activeStep={activeStep} />
            </div>
          </div>

          <div className="fw-detail">
            <div key={activeStep} className="fw-card glass glass-strong">
              <div className="fw-card-head">
                <div className="fw-num">{step.number}</div>
                <div>
                  <h3 className="editorial fw-card-title">Stage {step.number}: {step.title}</h3>
                  <p className="fw-card-subtitle">{step.subtitle}</p>
                </div>
              </div>
              <p className="fw-card-desc">{step.description}</p>
              <div className="fw-dots">
                {STEPS.map((_, i) => (
                  <div key={i} className="fw-dot" style={{ width: i === activeStep ? 24 : 8, background: i === activeStep ? 'var(--brand)' : 'color-mix(in srgb, var(--brand) 24%, var(--surface-2))' }} />
                ))}
              </div>
            </div>

            {isLast && (
              <div className="fw-repeat">
                <span style={{ fontSize: 24, lineHeight: 1 }}>🔄</span>
                <div>
                  <p style={{ fontWeight: 700, margin: 0 }}>The Flywheel Repeats</p>
                  <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', opacity: 0.85 }}>With our current portfolio of stabilized properties, the cycle reinvests and scales — compounding impact and returns.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessHero() {
  return (
    <section style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '84px 22px 64px', textAlign: 'center' }}>
        <span className="eyebrow-pill" style={{ marginBottom: 26, display: 'inline-block' }}>Our Process</span>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)', lineHeight: 1.06, letterSpacing: '-0.03em', fontWeight: 800, margin: '0 0 24px', color: 'var(--fg-1)' }}>
          How your capital becomes
          <br />
          <span style={{ color: 'var(--forest-700)' }}>lasting returns — and homes.</span>
        </h1>
        <p className="lead" style={{ maxWidth: '58ch', margin: '0 auto 40px', color: 'var(--fg-2)', lineHeight: 1.65 }}>
          Our model is designed to deliver competitive financial returns while creating lasting, positive social change. Here’s the full picture — from the returns you can expect, to our track record, to the self-reinforcing cycle that powers it all.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a className="btn btn-accent btn-lg" href={TIER2_URL}>Start investing <Ic name="arrow-right" size={18} /></a>
          <button className="btn btn-ghost btn-lg" onClick={goToCalculator}>Model my returns</button>
        </div>
      </div>
    </section>
  );
}

function ReturnsIntro() {
  return (
    <section style={{ maxWidth: 1000, margin: '96px auto 0', padding: '0 22px' }}>
      <div style={{ textAlign: 'center', maxWidth: '56rem', margin: '0 auto 48px' }}>
        <span className="eyebrow">Strong returns with purpose</span>
        <h2 className="editorial" style={{ margin: '14px 0 0', fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', letterSpacing: '-0.02em', color: 'var(--forest-700)', fontWeight: 600, lineHeight: 1.1 }}>
          Returns and impact, by design.
        </h2>
        <p className="lead" style={{ margin: '16px auto 0', maxWidth: '52rem', color: 'var(--fg-2)', lineHeight: 1.65 }}>
          Our model is designed to deliver competitive financial returns while creating lasting, positive social change.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 780, margin: '0 auto' }}>
        {HIGHLIGHTS.map((h) => (
          <div key={h.title} className="glass glass-strong lit" style={{ borderRadius: 'var(--radius-2xl)', padding: '24px 28px', display: 'flex', gap: 20, alignItems: 'flex-start', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'color-mix(in srgb, var(--brand) 15%, var(--surface))', color: 'var(--forest-600)', display: 'grid', placeItems: 'center', flex: 'none' }}>
              <Ic name={h.icon} size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--forest-700)', margin: '0 0 6px', lineHeight: 1.25 }}>{h.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.6, margin: 0 }}>{h.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProvenPerformance() {
  return (
    <section style={{ maxWidth: 1240, margin: '110px auto 0', padding: '0 22px' }}>
      <div style={{ borderRadius: 'var(--radius-2xl)', padding: 'clamp(40px, 5vw, 64px) clamp(24px, 4vw, 56px)', background: 'linear-gradient(155deg, var(--forest-600), var(--forest-800))', color: '#eaf3e2', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 88% 0%, rgba(149,196,92,.18), transparent 55%)' }} />
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '46rem', margin: '0 auto 44px' }}>
          <span className="eyebrow" style={{ color: 'var(--lime-300)' }}>Proven performance</span>
          <h2 style={{ margin: '14px 0 12px', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', letterSpacing: '-0.02em', color: '#fff', fontWeight: 700 }}>
            Proven Performance You Can Trust
          </h2>
          <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'rgba(234,243,226,.82)', lineHeight: 1.6 }}>
            Over 17 communities transformed with 20%+ average returns — delivering consistent cash flow while creating lasting social impact across America.
          </p>
        </div>

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }} className="pp-grid">
          {METRICS.map((m) => (
            <div key={m.label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-xl)', padding: '28px 24px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.1)', color: 'var(--lime-300)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
                <Ic name={m.icon} size={26} />
              </div>
              <div className="figure" style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{m.value}</div>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--lime-300)', margin: '6px 0 6px' }}>{m.label}</div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(234,243,226,.72)', lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessCta() {
  return (
    <section style={{ maxWidth: 1000, margin: '40px auto 0', padding: '0 22px 120px' }}>
      <div className="glass glass-strong lit" style={{ borderRadius: 'var(--radius-2xl)', padding: 'clamp(40px, 6vw, 72px)', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--fg-1)' }}>
          Ready to put the flywheel to work?
        </h2>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-2)', maxWidth: '48ch', margin: '0 auto 30px', lineHeight: 1.65 }}>
          Model your projected income, find the bond option matched to your profile, and start investing in real, cash-flowing affordable housing.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a className="btn btn-accent btn-lg" href={TIER2_URL}>Start investing <Ic name="arrow-right" size={18} /></a>
          <button className="btn btn-ghost btn-lg" onClick={goToCalculator}>Model my returns</button>
        </div>
      </div>
    </section>
  );
}

export default function ProcessPage() {
  useEffect(() => { initInteractions(); }, []);
  return (
    <React.Fragment>
      <MktNav />
      <main>
        <ProcessHero />
        <ReturnsIntro />
        <ProvenPerformance />
        <Flywheel />
        <ProcessCta />
      </main>
      <MktFooter />

      <style>{`
        .fw-outer { height: 500vh; margin-top: 110px; }
        .fw-sticky { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }
        .fw-head { text-align: center; flex-shrink: 0; padding-top: 32px; }
        .fw-title { margin: 12px 0 0; font-size: clamp(1.8rem, 3.4vw, 2.6rem); letter-spacing: -0.02em; color: var(--fg-1); font-weight: 600; }
        .fw-sub { margin: 10px auto 0; max-width: 40rem; padding: 0 16px; color: var(--fg-2); font-size: var(--text-sm); line-height: 1.55; }
        .fw-progress-wrap { max-width: 640px; width: 100%; margin: 18px auto 0; padding: 0 22px; flex-shrink: 0; }
        .fw-progress-track { height: 6px; border-radius: 999px; overflow: hidden; background: color-mix(in srgb, var(--brand) 18%, var(--surface-2)); }
        .fw-progress-fill { height: 100%; border-radius: 999px; background: var(--brand); transition: width 0.3s var(--ease-out); }
        .fw-progress-labels { display: flex; justify-content: space-between; margin-top: 7px; font-size: var(--text-xs); }
        .fw-grid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center; max-width: 1180px; margin: 0 auto; width: 100%; padding: 0 22px 24px; min-height: 0; }
        .fw-diagram { display: flex; align-items: center; justify-content: center; min-height: 0; height: 100%; }
        .fw-detail { display: flex; flex-direction: column; justify-content: center; min-height: 0; }
        .fw-card { border-radius: var(--radius-2xl); padding: 28px 32px; border-left: 5px solid var(--brand); animation: fw-card-in 0.4s var(--ease-out); }
        @keyframes fw-card-in { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: none; } }
        .fw-card-head { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
        .fw-num { width: 48px; height: 48px; border-radius: 50%; background: var(--brand); color: var(--fg-on-accent, #fff); display: grid; place-items: center; font-weight: 700; font-size: var(--text-lg); flex: none; }
        .fw-card-title { font-size: clamp(1.05rem, 2.2vw, 1.35rem); font-weight: 700; color: var(--fg-1); margin: 0; line-height: 1.2; }
        .fw-card-subtitle { font-size: var(--text-sm); font-weight: 600; color: var(--brand); margin: 3px 0 0; }
        .fw-card-desc { font-size: var(--text-sm); color: var(--fg-2); line-height: 1.65; margin: 0; }
        .fw-dots { display: flex; gap: 8px; margin-top: 22px; align-items: center; }
        .fw-dot { height: 8px; border-radius: 999px; transition: all 0.5s var(--ease-out); }
        .fw-repeat { margin-top: 16px; border-radius: var(--radius-lg); padding: 14px 20px; display: flex; align-items: center; gap: 14px; background: var(--forest-700); color: #fff; }
        .pp-grid { }
        @media (max-width: 900px) {
          .fw-grid { grid-template-columns: 1fr; gap: 16px; align-content: center; }
          .fw-diagram { max-height: 38vh; }
          .pp-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .pp-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </React.Fragment>
  );
}
