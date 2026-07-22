// design-sync buildCmd — prepares the two CSS inputs the converter needs.
//
// The site loads three separate stylesheets (see src/pages/index.astro) with no
// @import chain between them, and its @font-face rules point at absolute
// /fonts/*.woff2 URLs that only resolve when Astro serves public/. The converter
// takes a SINGLE cssEntry and resolves font url()s relative to that file, so we
// derive both inputs here rather than duplicating CSS into the repo.
//
// Emits (both gitignored, regenerated on every sync):
//   .cache/psb-styles.css — global + responsive + motion, concatenated in the
//                           same order index.astro loads them. -> cfg.cssEntry
//   .cache/psb-fonts.css  — global.css with /fonts/ rewritten to a path that
//                           resolves from .cache/, so the converter can find and
//                           copy the woff2 files.          -> cfg.extraFonts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const CACHE = join(HERE, '.cache');

// Same order as src/pages/index.astro. global.css carries the tokens, the type
// scale and the component layer; responsive.css carries the breakpoint
// collapses AND the .logo-light/.logo-dark theme swap; motion.css is additive.
const SHEETS = ['global.css', 'responsive.css', 'motion.css'];

mkdirSync(CACHE, { recursive: true });

// @font-face blocks are stripped here and supplied ONLY via cfg.extraFonts
// (psb-fonts.css below). If they stayed, the converter would scrape them a
// second time out of this file, where the absolute /fonts/ urls don't resolve
// from .cache/ — producing a fonts.css that carries both the working rules and
// dead duplicates of the same families. A dead face declared after a working
// one shadows it (browsers don't fall back to an earlier duplicate), so the
// brand fonts would silently degrade to system fonts.
const stripFontFaces = (css) => css.replace(/@font-face\s*\{[^}]*\}\s*/g, '');

const parts = SHEETS.map((f) => {
  const css = readFileSync(join(ROOT, 'src/styles', f), 'utf8');
  return `/* ===== src/styles/${f} ===== */\n${stripFontFaces(css)}`;
});

// Brand imagery, inlined as data URIs by prepare-assets.py (runs first). Last
// so its content: rules win over anything the sheets above set.
const assets = join(CACHE, 'psb-assets.css');
if (existsSync(assets)) {
  parts.push(`/* ===== inlined brand assets ===== */\n${readFileSync(assets, 'utf8')}`);
} else {
  console.error('prepare-css: WARNING — no psb-assets.css; /img/ references will render broken');
}

writeFileSync(join(CACHE, 'psb-styles.css'), parts.join('\n\n'));

// extractFonts only reads @font-face blocks, so passing the whole rewritten
// stylesheet is harmless — everything else in it is ignored.
const global = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8');
const fonts = global.replace(/url\((['"]?)\/fonts\//g, 'url($1../../public/fonts/');
writeFileSync(join(CACHE, 'psb-fonts.css'), fonts);

const faces = (global.match(/@font-face/g) ?? []).length;
console.error(`prepare-css: ${SHEETS.length} sheets concatenated, ${faces} @font-face rules rewritten`);
