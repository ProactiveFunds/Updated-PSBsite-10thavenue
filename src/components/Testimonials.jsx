import React from 'react';
import { Ic } from './icons.jsx';

const { useEffect, useRef } = React;

const VIDEOS = [
  { id: 'q-EmTAAp-2g', name: 'A resident’s story' },
  { id: '7xQiUeu2eY8', name: 'A resident’s story' },
  { id: 'rrf1FLn-M3g', name: 'Jackie & Corey’s story' },
  { id: 'a5psuKxi7Ow', name: 'Resident testimonials' },
];

const YT_CHANNEL = 'https://www.youtube.com/@ProActiveSustainableBonds';

export default function Testimonials() {
  const frames = useRef([]);

  useEffect(() => {
    const cmd = (iframe, func) => {
      try { iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*'); } catch (e) {}
    };
    const ratios = new Map();
    const apply = () => {
      // Unmute only the single most-visible video; mute the rest (no overlapping audio).
      let best = null, bestR = 0;
      ratios.forEach((r, el) => { if (r > bestR) { bestR = r; best = el; } });
      frames.current.forEach((f) => {
        if (!f) return;
        if (f === best && bestR >= 0.55) cmd(f, 'unMute'); else cmd(f, 'mute');
      });
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => ratios.set(e.target, e.intersectionRatio));
      apply();
    }, { threshold: [0, 0.2, 0.4, 0.55, 0.7, 0.85, 1] });
    frames.current.forEach((f) => f && io.observe(f));
    return () => io.disconnect();
  }, []);

  return (
    <section style={{ maxWidth: 1240, margin: '110px auto 0', padding: '0 22px' }}>
      <div style={{ textAlign: 'center', maxWidth: '46rem', margin: '0 auto 36px' }}>
        <span className="eyebrow">Real tenant testimonials</span>
        <h2 className="editorial" style={{ margin: '14px 0 0', letterSpacing: '-0.02em', lineHeight: 1.08, color: 'var(--forest-700)', fontWeight: 600 }}>The return that moves in.</h2>
        <p className="lead" style={{ margin: '14px auto 0', maxWidth: '34rem' }}>Behind every quarterly distribution is a door that opens — and a family that gets to stay. Hear it from the people who live it.</p>
        <a className="yt-channel" href={YT_CHANNEL} target="_blank" rel="noreferrer">
          <Ic name="youtube" size={20} style={{ color: '#FF0000' }} /> Visit our YouTube channel <Ic name="arrow-up-right" size={15} />
        </a>
      </div>
      <div className="tvid-grid">
        {VIDEOS.map((v, i) => (
          <div className="tvid" key={v.id}>
            <iframe
              ref={(el) => (frames.current[i] = el)}
              src={`https://www.youtube.com/embed/${v.id}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
              title={`Tenant testimonial — ${v.name}`}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 'var(--text-xs)', color: 'var(--fg-3)' }}>
        Sound turns on for whichever video is in view; tap any player to control it.
      </p>

      <style>{`
        .yt-channel { display: inline-flex; align-items: center; gap: 9px; margin-top: 22px; padding: 9px 18px; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--fg-1); font-weight: 600; font-size: var(--text-sm); text-decoration: none; transition: border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out); }
        .yt-channel:hover { border-color: color-mix(in srgb, #FF0000 40%, var(--border)); box-shadow: var(--shadow-sm); transform: translateY(-1px); }
        .tvid-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .tvid { position: relative; aspect-ratio: 16 / 9; border-radius: var(--radius-2xl); overflow: hidden; box-shadow: var(--shadow-xl); background: #000; }
        .tvid iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
        @media (max-width: 760px) { .tvid-grid { grid-template-columns: 1fr; gap: 18px; } }
      `}</style>
    </section>
  );
}
