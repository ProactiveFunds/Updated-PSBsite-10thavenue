// cta.js — shared invest CTA behavior.
// Every "Invest now" / "Start investing" entry point funnels users to the
// on-page investment calculator ("See what your capital returns…"), which is
// where the real modeling + invest modal live. On pages without the calculator
// (assets, about, digest), we navigate to the home page anchor instead.

export function goToCalculator(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  if (typeof document === 'undefined') return;
  const el = document.getElementById('calculator');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try { history.replaceState(null, '', '#calculator'); } catch (_) {}
  } else {
    window.location.href = '/#calculator';
  }
}
