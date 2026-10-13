import React from 'react';
import { Ic } from './icons.jsx';
import { PSB } from '../lib/interactions.js';
import { goToCalculator } from '../lib/cta.js';
import { FOOTER_COLS, FOOTER_LEGAL } from '../data/footerLinks.js';
import { NAV_GROUPS, NAV_TOP } from '../data/navLinks.js';
// MktChrome.jsx — marketing nav + footer + theme toggle
const { useState, useEffect } = React;

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
  const [openGroup, setOpenGroup] = useState(null);
  const [atTop, setAtTop] = useState(true);
  const [path, setPath] = useState('/');
  const barRef = React.useRef(null);
  useEffect(() => { setPath(window.location.pathname); }, []);
  // At the very top the pill drops its shadow, border and fill so it blends into the page.
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Anchor links scroll on the home page; off-page they navigate to /#id.
  const go = (link) => (e) => {
    setMenuOpen(false);
    setOpenGroup(null);
    if (link.href) return; // real page link: let the browser navigate
    e.preventDefault();
    setActive(link.id);
    const el = document.getElementById(link.id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.location.assign('/#' + link.id);
  };
  // Sub-pages (e.g. /events/self-directed-ira) keep their section's link lit.
  const isCurrent = (link) => (link.href
    ? (path === link.href || path.startsWith(link.href + '/'))
    : (path === '/' && active === link.id));
  const groupCurrent = (g) => g.items.some((l) => l.href && isCurrent(l));
  const renderLink = (link, withDesc) => (
    <a key={link.label} href={link.href || ('#' + link.id)} aria-current={isCurrent(link) ? 'page' : undefined} onClick={go(link)}>
      {withDesc && link.icon && <span className="nav-ico" aria-hidden="true"><Ic name={link.icon} size={18} /></span>}
      {withDesc ? <span className="nav-txt"><span className="nav-name">{link.label}</span><small>{link.desc}</small></span> : <span>{link.label}</span>}
    </a>
  );

  // Close the desktop dropdown on Escape or a click elsewhere.
  useEffect(() => {
    if (!openGroup) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpenGroup(null); };
    const onDown = (e) => { if (barRef.current && !barRef.current.contains(e.target)) setOpenGroup(null); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onDown); };
  }, [openGroup]);

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
      <div className={'nav-pill glass lit' + (atTop ? ' nav-pill-top' : '')} style={{ maxWidth: 1240, margin: '0 auto' }}>
        <a href="/" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }} style={{ display: 'inline-flex', flex: 'none' }} aria-label="Proactive Sustainable Bonds home">
          <img src={"/img/logo.png"} alt="Proactive Sustainable Bonds" style={{ height: 42 }} />
        </a>
        <nav className="nav-links" ref={barRef} aria-label="Main">
          {NAV_GROUPS.map((g) => {
            const open = openGroup === g.label;
            return (
              <div key={g.label} className="nav-group" data-open={open ? 'true' : undefined}
                   onMouseEnter={() => setOpenGroup(g.label)} onMouseLeave={() => setOpenGroup(null)}>
                <button type="button" className="nav-trigger" aria-expanded={open} aria-haspopup="true"
                        aria-current={groupCurrent(g) ? 'true' : undefined}
                        onClick={() => setOpenGroup(open ? null : g.label)}>
                  {g.label}<Ic name="chevron-down" size={16} />
                </button>
                {open && (
                  <div className={'nav-panel' + (g.feature ? ' nav-panel-wide' : '')} role="menu">
                    <div className="nav-panel-links">{g.items.map((l) => renderLink(l, true))}</div>
                    {g.feature && (
                      <a className="nav-feature" href={g.feature.href} onClick={go(g.feature)}>
                        <span className="nav-feature-eyebrow">{g.feature.eyebrow}</span>
                        <span className="nav-feature-title">{g.feature.title}</span>
                        <span className="nav-feature-desc">{g.feature.desc}</span>
                        <span className="nav-feature-cta">{g.feature.cta} <Ic name="arrow-right" size={16} /></span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="nav-actions" style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'flex-end' }}>
          <ThemeToggle />
          {NAV_TOP.map((l) => (
            <a key={l.label} href={l.href || ('#' + l.id)} className="btn nav-cta nav-cta-contact" onClick={go(l)}>{l.label}</a>
          ))}
          <button className="btn btn-accent nav-cta nav-cta-start" onClick={goToCalculator}>Start investing</button>
          <button className="btn btn-icon btn-glass nav-burger" aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            <Ic name={menuOpen ? 'x' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-mobile glass" role="dialog" aria-label="Menu">
          {NAV_GROUPS.map((g) => (
            <details key={g.label} open={groupCurrent(g) || undefined}>
              <summary>{g.label}<Ic name="chevron-down" size={16} /></summary>
              {g.items.map((l) => renderLink(l, false))}
            </details>
          ))}
          {NAV_TOP.map((l) => renderLink(l, false))}
          <div className="nav-mobile-actions">
            <button className="btn btn-accent btn-sm" onClick={() => { setMenuOpen(false); goToCalculator(); }}>Start investing</button>
          </div>
        </div>
      )}
    </header>
  );
}

function MktFooter() {
  const cols = FOOTER_COLS;
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
              <button className="btn btn-accent btn-sm" onClick={goToCalculator}>Start investing</button>
              <a className="btn btn-ghost btn-sm" href="/digest"><Ic name="mail" size={16} />Newsletter</a>
            </div>
          </div>
          {cols.map(([h, items]) => (
            <div key={h}>
              <div className="data-label" style={{ marginBottom: 14 }}>{h}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {items.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="footer-link" style={{ color: 'var(--fg-2)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr className="hairline" style={{ margin: '36px 0 20px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 'var(--text-xs)', color: 'var(--fg-3)' }}>
          <span>© 2026 Proactive Sustainable Bonds. Investing involves risk, including possible loss of principal.</span>
          <span style={{ display: 'flex', gap: 18 }}>
            {FOOTER_LEGAL.map(([label, href]) => (
              <a key={label} href={href} className="footer-link" style={{ color: 'inherit' }}
                 {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{label}</a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}

export { MktNav, MktFooter, ThemeToggle };
