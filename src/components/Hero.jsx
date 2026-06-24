import React from 'react';
import { Ic } from './icons.jsx';
import { goToCalculator } from '../lib/cta.js';
// MktHero.jsx — homepage hero (Direction A) + impact band
const { useState, useEffect } = React;

// Rotating last word for the headline. Easy to swap the set.
const FLIP_WORDS = ['builds', 'endures', 'pays', 'houses', 'uplifts', 'lasts'];
function FlipWord({ words = FLIP_WORDS }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % words.length), 2300);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className="flip-word-wrap"><span className="flip-word" key={i}>{words[i]}</span></span>
  );
}

// Muted, looping YouTube background that covers the hero visual panel.
function HeroBgVideo({ id }) {
  const src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&iv_load_policy=3`;
  return (
    <div className="hero-video-wrap">
      <iframe src={src} title="Proactive community" allow="autoplay; encrypted-media; picture-in-picture" frameBorder="0" tabIndex={-1}></iframe>
    </div>
  );
}

// Reusable duotone-green "photo" placeholder (used elsewhere).
function Photo({ label, sublabel, h = '100%', radius = 'var(--radius-2xl)', src }) {
  return (
    <div style={{
      position: 'relative', height: h, borderRadius: radius, overflow: 'hidden',
      background: src ? `center/cover url(${src})` : 'linear-gradient(155deg,#3a7a3f,#1f5e2e 58%,#123a1f)',
      boxShadow: 'var(--shadow-lg)',
    }}>
      {!src && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 18% 0%, rgba(149,196,92,.42), transparent 55%)' }} />}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 0.5px, transparent 0.5px)', backgroundSize: '4px 4px' }} />
      {label && (
        <div style={{ position: 'absolute', left: 22, bottom: 20, color: '#eaf3e2', zIndex: 2 }}>
          <div className="data-label" style={{ color: 'rgba(234,243,226,.72)' }}>{sublabel}</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{label}</div>
        </div>
      )}
    </div>
  );
}

function Hero({ onInvest }) {
  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '30px 22px 0' }}>
      <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 46, alignItems: 'center' }}>
        <div className="rise">
          <span className="eyebrow-pill" style={{ marginBottom: 24 }}>
            <span className="badge badge-forest">Open</span> Proactive QOZ Fund · accredited &amp; institutional
          </span>
          <h1 style={{ fontSize: 'var(--text-4xl)', lineHeight: 1.04, letterSpacing: '-0.025em', margin: '0 0 22px', maxWidth: '14ch' }}>
            The bond that <FlipWord />.
          </h1>
          <p className="lead" style={{ maxWidth: '46ch', margin: '0 0 30px' }}>
            America loses <strong style={{ color: 'var(--fg-1)', fontWeight: 600 }}>90,000 affordable homes</strong> a year. We finance the buildings that stop the bleeding — fixed income at <strong style={{ color: 'var(--brand)', fontWeight: 600 }}>15%</strong>, backed by real housing.
          </p>
          <div className="hero-cta" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <button className="btn btn-accent btn-lg" onClick={goToCalculator}>Explore opportunities <Ic name="arrow-right" size={18} /></button>
            <button className="btn btn-ghost btn-lg">View our impact</button>
          </div>
          <div className="hero-stats" style={{ display: 'flex', gap: 38, marginTop: 40 }}>
            {[['15%', 'annual interest', true], ['$26M', 'assets under management'], ['756', 'units across the portfolio']].map(([n, l, hl]) => (
              <div key={l}>
                <div className="figure" style={{ fontSize: 'var(--text-2xl)', color: hl ? 'var(--brand)' : 'var(--fg-1)' }}>{n}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual" style={{ position: 'relative', height: 560 }}>
          <div style={{ position: 'absolute', inset: '0 0 0 11%' }}><HeroBgVideo id="aMWDXp1n9_w" /></div>
          <div className="glass glass-strong lit stat-card rise" style={{ position: 'absolute', top: 32, left: -16, width: 252 }}>
            <span className="data-label">Housing you can verify</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 16 }}>
              <img className="logo-light" src="/img/sustainalytics.png" alt="Morningstar Sustainalytics" style={{ height: 21, alignSelf: 'flex-start' }} />
              <img className="logo-dark" src="/img/sustainalytics-white.png" alt="Morningstar Sustainalytics" style={{ height: 21, alignSelf: 'flex-start' }} />
              <img className="logo-light" src="/img/pri.png" alt="Signatory of the Principles for Responsible Investment" style={{ height: 44, alignSelf: 'flex-start' }} />
              <img className="logo-dark" src="/img/pri-white.png" alt="Signatory of the Principles for Responsible Investment" style={{ height: 44, alignSelf: 'flex-start' }} />
            </div>
          </div>
          <div className="glass glass-strong lit stat-card rise" style={{ position: 'absolute', bottom: 26, right: -14, width: 220 }}>
            <span className="data-label">Distributions on time</span>
            <div className="stat-value" style={{ fontSize: 'var(--text-2xl)', color: 'var(--brand)' }}>100%</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', marginTop: 4 }}>Every distribution, every quarter</div>
          </div>
        </div>
      </div>

      <style>{`
        .flip-word-wrap { display: inline-block; perspective: 600px; }
        .flip-word { display: inline-block; color: var(--brand); transform-origin: 50% 100%; animation: psb-flip 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
        @keyframes psb-flip { 0% { transform: rotateX(-90deg); opacity: 0; } 60% { opacity: 1; } 100% { transform: none; opacity: 1; } }
        .hero-video-wrap { position: absolute; inset: 0; overflow: hidden; border-radius: var(--radius-2xl); box-shadow: var(--shadow-lg); background: linear-gradient(155deg, #3a7a3f, #1f5e2e 58%, #123a1f); }
        .hero-video-wrap iframe { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); height: 100%; width: auto; aspect-ratio: 16 / 9; min-width: 100%; min-height: 100%; border: 0; pointer-events: none; }
        @media (prefers-reduced-motion: reduce) { .flip-word { animation: none; } }
      `}</style>
    </section>
  );
}

function ImpactBand() {
  const items = [
    ['sprout', '4,200', 'Homes funded'],
    ['users', '11,800', 'Residents housed'],
    ['building', '38', 'Communities'],
    ['map-pin', '11', 'States'],
  ];
  return (
    <section style={{ maxWidth: 1240, margin: '64px auto 0', padding: '0 22px' }}>
      <div className="glass lit" style={{ borderRadius: 'var(--radius-2xl)', padding: '34px 44px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
        {items.map(([ic, n, l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'var(--lime-100)', color: 'var(--forest-600)' }}><Ic name={ic} size={24} /></div>
            <div>
              <div className="figure" style={{ fontSize: 'var(--text-2xl)' }}>{n}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)' }}>{l}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export { Hero, ImpactBand, Photo };
