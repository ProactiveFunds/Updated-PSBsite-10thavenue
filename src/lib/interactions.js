/* =====================================================================
   PROACTIVE SUSTAINABLE BONDS — Calm interactions
   interactions.js  (vanilla, no deps)

   Provides:
   • Cursor-tracked gradient lighting on any .lit panel
   • Theme toggle (data-theme on <html>, persisted)
   • Success ripple + drawn checkmark helper  (PSB.confirm)
   • Micro-delay async helper                 (PSB.withPending)
   Drop <script src="interactions.js"></script> at end of <body>.
   ===================================================================== */

  const PSB = {};

  /* ---- 1. Cursor-tracked lighting ------------------------------------ */
  function trackLighting() {
    let raf = null, lastE = null;
    const apply = () => {
      raf = null;
      if (!lastE) return;
      const e = lastE;
      document.querySelectorAll('.lit').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        if (x >= -8 && x <= 108 && y >= -8 && y <= 108) {
          el.style.setProperty('--mx', x.toFixed(1) + '%');
          el.style.setProperty('--my', y.toFixed(1) + '%');
          el.classList.add('lit-on');
        } else {
          el.classList.remove('lit-on');
        }
      });
    };
    window.addEventListener('pointermove', (e) => {
      lastE = e;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
  }

  /* ---- 2. Theme toggle ----------------------------------------------- */
  PSB.setTheme = function (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('psb-theme', theme); } catch (e) {}
    document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
      b.setAttribute('aria-pressed', String(theme === 'dark'));
    });
  };
  PSB.toggleTheme = function () {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    PSB.setTheme(cur === 'dark' ? 'light' : 'dark');
  };
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('psb-theme'); } catch (e) {}
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
      b.addEventListener('click', PSB.toggleTheme);
    });
  }

  /* ---- 3. Success ripple + checkmark --------------------------------- */
  // Splash a confirming ripple + drawn check over a target element.
  PSB.confirm = function (target, opts) {
    opts = opts || {};
    const host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) return;
    const ring = document.createElement('span');
    ring.className = 'ripple';
    const cs = getComputedStyle(host);
    if (cs.position === 'static') host.style.position = 'relative';
    host.appendChild(ring);
    setTimeout(() => ring.remove(), 950);
  };

  // Build a standalone check-ring node (for success states)
  PSB.checkRing = function () {
    const d = document.createElement('div');
    d.className = 'check-ring';
    d.innerHTML = '<span class="ripple"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>';
    return d;
  };

  /* ---- 4. Micro-delay async helper ----------------------------------- */
  // Run a button into a pending state, wait (acknowledge input), then settle.
  // PSB.withPending(btn, async () => {...}, { ms: 700, done: 'Saved' })
  PSB.withPending = function (btn, task, opts) {
    opts = opts || {};
    const ms = opts.ms != null ? opts.ms : 650;
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.dataset.pending = '1';
    btn.innerHTML = '<span class="spinner" style="width:1em;height:1em;border-width:2px"></span>' + (opts.pending || 'Working…');
    return new Promise((resolve) => {
      setTimeout(async () => {
        if (task) { try { await task(); } catch (e) {} }
        if (opts.done) {
          btn.innerHTML = '<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>' + opts.done;
          PSB.confirm(btn);
          setTimeout(() => { btn.innerHTML = original; btn.disabled = false; delete btn.dataset.pending; resolve(); }, opts.hold || 1300);
        } else {
          btn.innerHTML = original; btn.disabled = false; delete btn.dataset.pending; resolve();
        }
      }, ms);
    });
  };

  /* ---- 5. Reveal sparkline bars on view ------------------------------ */
  function revealSparks() {
    document.querySelectorAll('.spark').forEach((s) => {
      s.querySelectorAll('i').forEach((bar) => {
        const h = bar.style.getPropertyValue('--h') || bar.dataset.h;
        if (h) { bar.style.height = '0%'; requestAnimationFrame(() => { bar.style.height = h; }); }
      });
    });
  }

  /* ---- 6. Soft scroll reveal ----------------------------------------- */
  // Fade each section up as it enters view. Skips the hero (first section,
  // already animated) and degrades to "always visible" without IO support.
  function initReveal() {
    const sections = Array.from(document.querySelectorAll('main > section')).slice(1);
    if (!('IntersectionObserver' in window) || !sections.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('psb-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    sections.forEach((sec) => { sec.classList.add('psb-reveal'); io.observe(sec); });
  }

  function init() {
    trackLighting();
    initTheme();
    revealSparks();
    initReveal();
  }
  let _inited = false;
  function initInteractions() {
    if (_inited || typeof window === 'undefined') return;
    _inited = true;
    init();
  }

  export { PSB, initInteractions };
