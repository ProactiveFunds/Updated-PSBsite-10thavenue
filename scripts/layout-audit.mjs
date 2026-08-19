#!/usr/bin/env node
// Layout audit — catches the two failures that make a page look broken on a big
// monitor but fine on a laptop:
//
//   1. horizontal overflow (the page scrolls sideways)
//   2. a "stranded box": an element that paints a visible box (background,
//      border or shadow), is capped narrower than its container, and is NOT
//      centred — so it sits pinned to the left with a dead gutter on the right
//      that grows with the viewport.
//
// (2) is what a bare `max-width` on a block element does: it does not centre, it
// left-aligns. Either let the box fill its container or give it an auto inline
// margin. See rules.md section 6 "Layout".
//
// Zero dependencies: drives headless Chrome over CDP using Node's built-in
// fetch + WebSocket. Needs a server already running (npm run dev, or preview).
//
//   node scripts/layout-audit.mjs [--base http://localhost:4321] [--widths 1440,1920,2560] [path ...]

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const argv = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? dflt : argv[i + 1];
};
const BASE = opt('base', 'http://localhost:4321').replace(/\/$/, '');
const WIDTHS = opt('widths', '1440,1920,2560').split(',').map(Number);
const PORT = Number(opt('port', 9333));
const paths = argv.filter((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'));
const ROUTES = paths.length ? paths : [
  '/', '/events', '/events/self-directed-ira', '/events/self-directed-ira-recording', '/q3-special',
  '/ira', '/team', '/verified', '/OurProcess', '/accreditation', '/assets', '/digest',
];

const CHROME = process.env.CHROME_PATH
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Elements smaller than this are chips/buttons/avatars, not layout blocks.
const MIN_BLOCK_W = 240;
const MIN_BLOCK_H = 48;
// How much dead gutter counts as "stranded", and how asymmetric it must be.
const GUTTER = 40;

const profile = mkdtempSync(join(tmpdir(), 'layout-audit-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function targetUrl() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(250);
  }
  throw new Error('Chrome did not expose a debugging target');
}

const PROBE = `(() => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  const seen = new Set();

  // Reveal collapsed content first. An accordion answer is laid out only when
  // open, so a closed <details> is a blind spot the audit would otherwise call
  // clean — which is exactly how a stranded FAQ answer shipped.
  for (const d of document.querySelectorAll('details')) d.open = true;

  // A pinned element that means to be centred but is not. The classic cause is
  // an entrance animation ending on \`transform: none\`, which silently wipes out
  // a \`translateX(-50%)\` centring transform and shunts the element right.
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 80 || r.width > vw - 8) continue;
    // Chrome resolves \`right\` to a used px value even when it was never authored,
    // so it cannot be used to tell "pinned to the midpoint" from "stretched".
    // The reliable signature is: left lands on the viewport midpoint and nothing
    // translates the element back by half its width.
    const leftPx = parseFloat(cs.left);
    if (!Number.isFinite(leftPx) || Math.abs(leftPx - vw / 2) > 4) continue;
    const xShift = new DOMMatrixReadOnly(cs.transform).m41;
    if (Math.abs(xShift) > 1) continue;         // a centring translate is present
    const off = Math.round((r.left + r.width / 2) - vw / 2);
    if (Math.abs(off) > 8) {
      out.push({
        kind: 'off-centre pinned element',
        sel: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).trim().split(/\\s+/).join('.') : ''),
        width: Math.round(r.width), avail: vw, gapL: Math.round(r.left), gapR: Math.round(vw - r.right),
        detail: 'off centre by ' + off + 'px — left:' + cs.left + '  transform:' + cs.transform
          + '  (an animation ending on "transform: none" wipes out a centring translate)',
      });
    }
  }

  for (const el of document.querySelectorAll('main *')) {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.position === 'absolute') continue;
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    // Only normal-flow block boxes: an inline/inline-flex element is sized by its
    // content by design, and a grid/flex child is placed by its container, not by
    // its own margins — neither can be "stranded" in the sense we care about.
    if (!/^(block|flow-root|list-item)$/.test(cs.display)) continue;
    const p0 = el.parentElement;
    if (!p0) continue;
    const pd = getComputedStyle(p0).display;
    if (/flex|grid/.test(pd)) continue;

    const r = el.getBoundingClientRect();
    if (r.width < ${MIN_BLOCK_W} || r.height < ${MIN_BLOCK_H}) continue;

    const paints = cs.backgroundColor !== 'rgba(0, 0, 0, 0)'
      || parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0
      || cs.boxShadow !== 'none'
      || cs.backgroundImage !== 'none';
    // A prose block is just as stranded as a box: a paragraph capped at ~64ch in
    // a 1240px container leaves half the row empty and reads as a broken page.
    // Split the head into columns, or let it fill. Check body copy ITSELF as well
    // as wrappers around it — the stranded FAQ answer was a bare <p> with no
    // wrapper, so a container-only check walked straight past it.
    const text = el.innerText ? el.innerText.trim().length : 0;
    const isBodyCopy = /^(P|BLOCKQUOTE)$/.test(el.tagName) && text > 100;
    const isCopyWrapper = !!el.querySelector(':scope > p, :scope > h1, :scope > h2, :scope > h3')
      && text > 140;
    const prose = !paints && (isBodyCopy || isCopyWrapper);
    if (!paints && !prose) continue;

    const p = el.parentElement;
    if (!p) continue;
    const pr = p.getBoundingClientRect();
    const ps = getComputedStyle(p);
    const padL = parseFloat(ps.paddingLeft) || 0;
    const padR = parseFloat(ps.paddingRight) || 0;
    const contentL = pr.left + padL;
    const contentR = pr.right - padR;
    const avail = contentR - contentL;
    if (avail < ${MIN_BLOCK_W}) continue;

    const gapL = Math.round(r.left - contentL);
    const gapR = Math.round(contentR - r.right);
    // Fills its container, or is centred within it => fine.
    if (gapR <= ${GUTTER}) continue;
    if (Math.abs(gapL - gapR) <= ${GUTTER}) continue;
    // Prose is allowed a modest trailing gutter (a measure cap that still uses
    // most of the row); it is "stranded" once it abandons a quarter of it.
    if (prose && gapR / avail < 0.25) continue;

    const key = el.tagName + '.' + el.className;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      kind: paints ? 'box' : 'text',
      sel: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).trim().split(/\\s+/).join('.') : ''),
      width: Math.round(r.width), avail: Math.round(avail), gapL, gapR,
      detail: 'max-width:' + cs.maxWidth + '  margin-left:' + cs.marginLeft + '  margin-right:' + cs.marginRight,
    });
  }
  return {
    vw,
    overflow: document.documentElement.scrollWidth - vw,
    stranded: out.slice(0, 20),
  };
})()`;

let ws;
let id = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((res, rej) => {
  const n = ++id;
  pending.set(n, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result)));
  ws.send(JSON.stringify({ id: n, method, params }));
});

let failures = 0;
try {
  ws = new WebSocket(await targetUrl());
  await new Promise((r) => { ws.onopen = r; });
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  await send('Page.enable');
  await send('Runtime.enable');

  for (const route of ROUTES) {
    const problems = [];
    for (const w of WIDTHS) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: 1000, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: BASE + route });
      await sleep(1500);
      // Scroll past the fold so reveal-on-scroll sections lay out and any
      // scroll-triggered pinned bars actually exist before we measure.
      await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 1200)' });
      await sleep(700);
      const { result } = await send('Runtime.evaluate', { expression: PROBE, returnByValue: true });
      const r = result.value;
      if (!r) continue;
      if (r.overflow > 1) problems.push(`  @${w}px  HORIZONTAL OVERFLOW by ${r.overflow}px`);
      for (const s of r.stranded) {
        const label = s.kind.includes(' ') ? s.kind : `stranded ${s.kind}`;
        problems.push(`  @${w}px  ${label}  ${s.sel}\n`
          + `           width ${s.width} of ${s.avail} available — left gap ${s.gapL}, right gap ${s.gapR}\n`
          + `           ${s.detail}`);
      }
    }
    if (problems.length) {
      failures += 1;
      console.log(`\nFAIL  ${route}`);
      console.log(problems.join('\n'));
    } else {
      console.log(`ok    ${route}`);
    }
  }
} finally {
  try { ws?.close(); } catch { /* already closed */ }
  chrome.kill();
  // Chrome keeps writing to its profile for a moment after SIGTERM; removing it
  // too early throws ENOTEMPTY. Wait for exit, then clean up best-effort.
  await new Promise((r) => { chrome.once('exit', r); setTimeout(r, 3000); });
  try { rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch { /* temp dir */ }
}

if (failures) {
  console.log(`\n${failures} route(s) with layout problems.`);
  console.log('Fix: let the box fill its container, or give it an auto inline margin so it centres.');
  console.log('See rules.md section 6 "Layout".');
  process.exit(1);
}
console.log('\nAll routes fill their containers cleanly.');
