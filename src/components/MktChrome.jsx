import React from 'react';
import { Ic } from './icons.jsx';
import { PSB } from '../lib/interactions.js';
// MktChrome.jsx — marketing nav + footer + theme toggle
const { useState, useEffect } = React;

// Nav links: `id` = on-page section anchor (HomeSections.jsx / Hero.jsx);
// `href` = a separate page. Anchors fall back to /#id when off the home page.
const NAV_LINKS = [
  { label: 'Opportunities', id: 'opportunities' },
  { label: 'Our Impact', id: 'impact' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Assets', href: '/assets' },
  { label: 'Team', href: '/about' },
  { label: 'Digest', href: '/digest' },
];

function ThemeToggle() {
  const [dark, setDark] = useState(typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');
  const toggle = () => { const n = !dark; setDark(n); PSB.setTheme(n ? 'dark' : 'light'); };
  return (
    <button className="btn btn-icon btn-glass" onClick={toggle} aria-label="Toggle theme" title="Toggle theme">
      <Ic name={dark ? 'sun' : 'moon'} size={18} />
    </button>
  );
}

function MktNav({ onInvest }) {
  const [active, setActive] = useState('opportunities');
  const [menuOpen, setMenuOpen] = useState(false);
  const [path, setPath] = useState('/');
  useEffect(() => { setPath(window.location.pathname); }, []);

  // Anchor links scroll on the home page; off-page they navigate to /#id.
  const go = (link) => (e) => {
    setMenuOpen(false);
    if (link.href) return; // real page link — let the browser navigate
    e.preventDefault();
    setActive(link.id);
    const el = document.getElementById(link.id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.location.assign('/#' + link.id);
  };
  const renderLink = (link) => {
    const isActive = link.href ? path === link.href : (path === '/' && active === link.id);
    return (
      <a key={link.label} href={link.href || ('#' + link.id)} aria-current={isActive ? 'page' : undefined} onClick={go(link)}>{link.label}</a>
    );
  };

  // Close the mobile menu on Escape and when the viewport grows past mobile.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [menuOpen]);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '18px 22px' }}>
      <div className="nav-pill glass lit" style={{ maxWidth: 1240, margin: '0 auto' }}>
        <a href="/" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }} style={{ display: 'inline-flex', flex: 'none' }} aria-label="Proactive Sustainable Bonds — home">
          <img src={"/img/logo.png"} alt="Proactive Sustainable Bonds" style={{ height: 30 }} />
        </a>
        <nav className="nav-links" style={{ marginLeft: 24 }}>
          {NAV_LINKS.map(renderLink)}
        </nav>
        <div className="nav-actions" style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <ThemeToggle />
          <button className="btn btn-ghost btn-sm nav-signin">Sign in</button>
          <button className="btn btn-accent btn-sm" onClick={onInvest}>Start investing</button>
          <button className="btn btn-icon btn-glass nav-burger" aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            <Ic name={menuOpen ? 'x' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-mobile glass" role="dialog" aria-label="Menu">
          {NAV_LINKS.map(renderLink)}
          <div className="nav-mobile-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Sign in</button>
            <button className="btn btn-accent btn-sm" onClick={() => { setMenuOpen(false); onInvest && onInvest(); }}>Start investing</button>
          </div>
        </div>
      )}
    </header>
  );
}

function MktFooter() {
  const cols = [
    ['Invest', ['Opportunities', 'Proactive QOZ Fund', 'SDIRA', 'Investment scenarios']],
    ['Company', ['Our mission', 'The housing crisis', 'Team', 'Partnerships']],
    ['Learn', ['Insights', 'Investor testimonials', 'FAQ', 'Video library']],
  ];
  return (
    <footer style={{ marginTop: 40, padding: '56px 22px 30px' }}>
      <div className="glass lit" style={{ maxWidth: 1240, margin: '0 auto', borderRadius: 'var(--radius-2xl)', padding: '48px 52px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 36 }}>
          <div>
            <img src={"/img/logo.png"} alt="Proactive" style={{ height: 32 }} />
            <p className="lead" style={{ fontSize: 'var(--text-base)', maxWidth: '32ch', marginTop: 18 }}>
              Stable returns, rooted in real homes. Affordable housing, done responsibly.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button className="btn btn-accent btn-sm">Start investing</button>
              <button className="btn btn-ghost btn-sm"><Ic name="mail" size={16} />Newsletter</button>
            </div>
          </div>
          {cols.map(([h, items]) => (
            <div key={h}>
              <div className="data-label" style={{ marginBottom: 14 }}>{h}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {items.map((i) => <li key={i}><a href="#" style={{ color: 'var(--fg-2)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>{i}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <hr className="hairline" style={{ margin: '36px 0 20px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 'var(--text-xs)', color: 'var(--fg-3)' }}>
          <span>© 2026 Proactive Sustainable Bonds. Investing involves risk, including possible loss of principal.</span>
          <span style={{ display: 'flex', gap: 18 }}><a href="#" style={{ color: 'inherit' }}>Privacy</a><a href="#" style={{ color: 'inherit' }}>Terms</a><a href="#" style={{ color: 'inherit' }}>Disclosures</a></span>
        </div>
      </div>
    </footer>
  );
}

export { MktNav, MktFooter, ThemeToggle };
