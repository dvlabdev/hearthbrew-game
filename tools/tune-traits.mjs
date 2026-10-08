// Put the four trait colours on a lightness ladder so they differ in greyscale and under colour-blindness,
// keeping each pack's hues. Rewrites --heat/--calm/--vigor/--clarity in the exploration packs' style.css.
// Usage: node tools/tune-traits.mjs [pack]
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const STYLES = fileURLToPath(new URL('../src/art/styles/', import.meta.url));
const PACKS = process.argv[2] ? [process.argv[2]] : ['gilded', 'shadow', 'cyanotype', 'riso'];
// CIE L* targets. Night: light colours on dark grounds. Day: dark colours on light grounds. Gaps >= 9 L*.
const LADDER = { Candlelit: { heat: 60, vigor: 70, calm: 80, clarity: 90 }, Day: { clarity: 30, heat: 39, calm: 48, vigor: 57 } };

const lin = (/** @type {number} */ c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (/** @type {number} */ c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function toLab(/** @type {string} */ hex) {
  const c = [1, 3, 5].map(i => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
  const X = (0.4124 * c[0] + 0.3576 * c[1] + 0.1805 * c[2]) / 0.95047, Y = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2], Z = (0.0193 * c[0] + 0.1192 * c[1] + 0.9505 * c[2]) / 1.08883;
  const f = (/** @type {number} */ t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
function fromLab(/** @type {number[]} */ [L, a, b]) {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
  const inv = (/** @type {number} */ t) => (t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787);
  const X = inv(fx) * 0.95047, Y = inv(fy), Z = inv(fz) * 1.08883;
  const r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z, g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z, bl = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
  return { rgb: [r, g, bl].map(gam), inGamut: [r, g, bl].every(v => v >= -0.001 && v <= 1.001) };
}
/** Same hue, target lightness; shrink chroma until it fits in sRGB. */
function setL(/** @type {string} */ hex, /** @type {number} */ L) {
  const [, a, b] = toLab(hex);
  for (let k = 1; k >= 0; k -= 0.02) {
    const { rgb, inGamut } = fromLab([L, a * k, b * k]);
    if (inGamut) return '#' + rgb.map(v => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  return hex;
}

for (const pack of PACKS) {
  const file = `${STYLES}${pack}/style.css`;
  let css = readFileSync(file, 'utf8');
  const blocks = [['Candlelit', /:root\s*\{[\s\S]*?\}/], ['Day', /:root\[data-theme="day"\]\s*\{[\s\S]*?\}/]];
  for (const [theme, re] of /** @type {[keyof typeof LADDER, RegExp][]} */ (blocks)) {
    css = css.replace(re, block => block.replace(/--(heat|calm|vigor|clarity):(#[0-9A-Fa-f]{6})/g,
      (_, k, hex) => `--${k}:${setL(hex, LADDER[theme][/** @type {'heat'} */ (k)])}`));
  }
  writeFileSync(file, css);
  console.log(`tuned ${pack}`);
}
