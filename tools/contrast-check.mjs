// Contrast and colour-vision check for every style pack (WCAG 2.x). Usage: node tools/contrast-check.mjs
// Text pairs need >= 4.5:1, UI/graphic pairs >= 3:1, in both themes (Candlelit = :root, Day = [data-theme="day"]).
// Also reports how far apart the four trait colours stay under protan/deutan/tritan simulation and in greyscale
// (advisory: traits always carry shape + glyph too).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const STYLES = fileURLToPath(new URL('../src/art/styles/', import.meta.url));

/** Parse custom properties from the :root block and the [data-theme="day"] block. @param {string} css */
function themes(css) {
  /** @param {string} block */
  const vars = block => Object.fromEntries([...block.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\b/g)].map(m => [m[1], m[2]]));
  const night = css.match(/:root\s*\{([\s\S]*?)\}/);
  const day = css.match(/:root\[data-theme="day"\]\s*\{([\s\S]*?)\}/);
  const n = night ? vars(night[1]) : {};
  return { Candlelit: n, Day: day ? { ...n, ...vars(day[1]) } : null };
}

/** @param {string} hex */
const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
/** @param {number} c */
const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
/** @param {number[]} c */
const lum = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
/** WCAG contrast ratio. @param {string} a @param {string} b */
const ratio = (a, b) => { const [x, y] = [lum(rgb(a)), lum(rgb(b))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// Colour-vision simulation (Machado et al. 2009, severity 1.0), applied in linear RGB.
const CVD = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
};
/** sRGB hex -> CIE Lab, optionally through a CVD matrix. @param {string} hex @param {number[][] | null} m */
function lab(hex, m) {
  let c = rgb(hex).map(lin);
  if (m) c = m.map(r => Math.min(1, Math.max(0, r[0] * c[0] + r[1] * c[1] + r[2] * c[2])));
  const X = (0.4124 * c[0] + 0.3576 * c[1] + 0.1805 * c[2]) / 0.95047, Y = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2], Z = (0.0193 * c[0] + 0.1192 * c[1] + 0.9505 * c[2]) / 1.08883;
  const f = (/** @type {number} */ t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
/** @param {number[]} a @param {number[]} b */
const dE = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

const TEXT = [['ink', 'bg'], ['ink', 'surface'], ['muted', 'bg'], ['muted', 'surface'], ['on-accent', 'accent']];
const UI = [['accent', 'bg'], ['accent', 'surface'], ['heat', 'surface'], ['calm', 'surface'], ['vigor', 'surface'], ['clarity', 'surface'],
  ['on-trait', 'heat'], ['on-trait', 'calm'], ['on-trait', 'vigor'], ['on-trait', 'clarity']];
const TRAITS = ['heat', 'calm', 'vigor', 'clarity'];

let failures = 0;
const only = process.argv[2];
for (const pack of readdirSync(STYLES)) {
  if (only && pack !== only) continue;
  const file = join(STYLES, pack, 'style.css');
  if (!existsSync(file)) continue;
  console.log(`\n${pack}`);
  for (const [theme, t] of Object.entries(themes(readFileSync(file, 'utf8')))) {
    if (!t) continue;
    const fails = [];
    let worstText = Infinity, worstUi = Infinity;
    for (const [fg, bg] of TEXT) {
      if (!t[fg] || !t[bg]) continue;
      const r = ratio(t[fg], t[bg]); worstText = Math.min(worstText, r);
      if (r < 4.5) fails.push(`text ${fg}/${bg} ${r.toFixed(2)}`);
    }
    for (const [fg, bg] of UI) {
      if (!t[fg] || !t[bg]) continue;
      const r = ratio(t[fg], t[bg]); worstUi = Math.min(worstUi, r);
      if (r < 3) fails.push(`ui ${fg}/${bg} ${r.toFixed(2)}`);
    }
    const sep = Object.fromEntries([['normal', null], ...Object.entries(CVD)].map(([k, m]) => {
      let min = Infinity;
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (t[TRAITS[i]] && t[TRAITS[j]]) min = Math.min(min, dE(lab(t[TRAITS[i]], /** @type {any} */ (m)), lab(t[TRAITS[j]], /** @type {any} */ (m))));
      return [k, min];
    }));
    const greys = TRAITS.filter(k => t[k]).map(k => lab(t[k], null)[0]).sort((a, b) => a - b);
    const greyGap = Math.min(...greys.slice(1).map((g, i) => g - greys[i]));
    failures += fails.length;
    console.log(`  ${theme.padEnd(9)} ${fails.length ? 'FAIL' : 'PASS'}  worst text ${worstText.toFixed(2)}:1, worst UI ${worstUi.toFixed(2)}:1` +
      `  | trait separation ΔE min: normal ${sep.normal.toFixed(0)}, protan ${sep.protan.toFixed(0)}, deutan ${sep.deutan.toFixed(0)}, tritan ${sep.tritan.toFixed(0)}; grey gap ${greyGap.toFixed(0)} L`);
    for (const f of fails) console.log(`     - ${f}`);
  }
}
console.log(`\n${failures ? `${failures} contrast failure(s)` : 'All packs pass WCAG AA (text 4.5:1, UI 3:1) in both themes.'}`);
process.exitCode = failures ? 1 : 0;
