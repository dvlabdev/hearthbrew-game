// Exploration pack (round 3): Hearthlight, the product owner's mix of the round 2 directions.
// Construction from Modern Fable (geometric forms, one crisp shadow plane per form), light and palette from
// Lantern Storybook (dusk room, lantern glow, rim light, grain), detail from Naturalist only where the eye goes
// (faces, botanical structure, the counter's grain). Backgrounds stay simple.
import { GEOM, FACE, SCENE, cauldron } from '../../geom.js';

export const id = 'hearthlight';
export const label = 'Hearthlight';
export const exploration = true;
export const round = 3;
export const parents = ['storybook', 'fable', 'naturalist'];
export const css = new URL('./style.css', import.meta.url).href;
export const brief = {
  adjectives: ['warm', 'crafted', 'true-to-life'],
  inspiration: 'Your mix: Lantern Storybook palette and light + Modern Fable geometry + Naturalist detail on faces and plants',
  technique: 'Geometric silhouettes with one clipped shadow plane each; gradient lantern light, rim light and glow; fine detail (iris, florets, veins, grain) only on hero objects; one shared grain.',
};

/** @param {string} gid @param {[number, string, number?][]} stops */
const lin = (gid, stops, x2 = 0, y2 = 1) => `<linearGradient id="${gid}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, v, op]) =>
  `<stop offset="${o}" style="stop-color:var(${v})${op == null ? '' : `;stop-opacity:${op}`}"/>`).join('')}</linearGradient>`;
/** @param {string} gid @param {[number, string, number?][]} stops */
const rad = (gid, stops, cx = 0.4, cy = 0.35, r = 0.75) => `<radialGradient id="${gid}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, v, op]) =>
  `<stop offset="${o}" style="stop-color:var(${v})${op == null ? '' : `;stop-opacity:${op}`}"/>`).join('')}</radialGradient>`;
const [hx, hy, hrx, hry] = FACE.head;
const SHAPES = {
  heat: '<path d="M24 5 L44 41 H4 Z"/>', calm: '<circle cx="24" cy="24" r="19"/>',
  vigor: '<rect x="6" y="6" width="36" height="36" rx="4"/>', clarity: '<path d="M24 3 L45 24 L24 45 L3 24 Z"/>',
};
/** Almond eye outline for a mood at (x, y). */
const almond = (/** @type {number} */ x, /** @type {number} */ y, /** @type {string} */ mood) => {
  const [up, lo] = mood === 'happy' ? [3.6, 1.6] : [2.8, 3.2];
  return `M${x - 7} ${y} C${x - 4} ${y - up} ${x + 4} ${y - up} ${x + 7} ${y} C${x + 4} ${y + lo} ${x - 4} ${y + lo} ${x - 7} ${y} Z`;
};

/** One defs block for the whole pack; the page injects it once. */
export const defs = `<defs>
  ${lin('hl-sky', [[0, '--sky-top'], [1, '--sky-bot']])}
  ${lin('hl-wall', [[0, '--wall'], [1, '--wall-dk']])}
  ${lin('hl-wood', [[0, '--wood-hi'], [0.35, '--wood'], [1, '--wood-dk']])}
  ${rad('hl-iron', [[0, '--iron-hi'], [0.45, '--iron'], [1, '--iron-dk']], 0.62, 0.25, 0.85)}
  ${rad('hl-skin', [[0, '--skin-hi'], [0.6, '--skin'], [1, '--skin-sh']], 0.64, 0.4, 0.72)}
  ${rad('hl-skin2', [[0, '--skin2-hi'], [0.6, '--skin2'], [1, '--skin2-sh']], 0.64, 0.4, 0.72)}
  ${['sun', 'mist', 'rain', 'frost'].map(k => lin(`hl-wx-${k}`, [[0, `--wx-${k}-top`], [1, `--wx-${k}-bot`]])).join('')}
  ${lin('hl-plaid', [[0, '--plaid'], [1, '--plaid-dk']])}
  ${lin('hl-petal', [[0, '--petal'], [0.65, '--petal'], [1, '--petal-sh']])}
  ${rad('hl-yolk', [[0, '--yolk-hi'], [0.55, '--yolk'], [1, '--yolk-dk']], 0.6, 0.3, 0.75)}
  ${lin('hl-leaf', [[0, '--leaf-hi'], [1, '--leaf-dk']])}
  ${['sage', 'mint', 'nettle', 'lav'].map(t => lin(`hl-${t}`, [[0, `--${t}-hi`], [0.45, `--${t}`], [1, `--${t}-dk`]], 1, 1)).join('')}
  ${rad('hl-honey', [[0, '--honey-hi'], [0.55, '--honey'], [1, '--honey-dk']], 0.62, 0.3, 0.8)}
  ${rad('hl-root', [[0, '--root-hi'], [0.55, '--root'], [1, '--root-dk']], 0.55, 0.2, 0.85)}
  ${rad('hl-ember', [[0, '--ember-hi'], [0.45, '--ember', 0.9], [1, '--ember', 0]], 0.5, 0.5, 0.5)}
  ${rad('hl-berry', [[0, '--berry-hi'], [0.45, '--berry'], [1, '--berry-dk']], 0.6, 0.28, 0.8)}
  ${rad('hl-coin', [[0, '--coin-hi'], [0.6, '--coin'], [1, '--coin-dk']], 0.62, 0.32, 0.75)}
  ${lin('hl-scarf', [[0, '--scarf'], [1, '--scarf-dk']])}
  ${lin('hl-dress', [[0, '--dress'], [1, '--dress-dk']])}
  ${lin('hl-browshade', [[0, '--skin-sh', 0.8], [1, '--skin-sh', 0]])}
  ${rad('hl-glow', [[0, '--glow', 0.95], [0.35, '--glow', 0.4], [1, '--glow', 0]], 0.5, 0.5, 0.5)}
  ${rad('hl-vig', [[0.55, '--shadow', 0], [1, '--shadow', 0.55]], 0.5, 0.45, 0.75)}
  ${lin('hl-gem', [[0, '--gem-hi', 0.6], [0.5, '--gem-hi', 0]])}
  ${lin('hl-glass', [[0, '--gem-hi', 0.05], [0.2, '--gem-hi', 0.5], [0.32, '--gem-hi', 0.05], [1, '--gem-hi', 0]], 1, 0)}
  <filter id="hl-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>
  <filter id="hl-blur" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>
  <filter id="hl-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 .45  0 0 0 0 .35  0 0 0 0 .3  0 0 0 .1 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <filter id="hl-paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="2"/><feColorMatrix type="matrix" values="0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .1  .35 0 0 0 -.12"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <filter id="hl-woodgrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.35" numOctaves="2" seed="9"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .1  0 0 0 0 .05  0 0 0 0 0  .9 0 0 0 -.25"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <clipPath id="hl-head"><ellipse cx="${hx}" cy="${hy}" rx="${hrx}" ry="${hry}"/></clipPath>
  <clipPath id="hl-body"><path d="${FACE.body}"/></clipPath>
  <clipPath id="hl-scarfclip"><path d="${FACE.scarf}"/></clipPath>
  <clipPath id="hl-rootclip"><path d="${GEOM.fireroot[0]}"/></clipPath>
  <clipPath id="hl-pot"><path d="${GEOM.pot.body}"/></clipPath>
  <clipPath id="hl-hip"><ellipse rx="12" ry="15"/></clipPath>
  <clipPath id="hl-pellbody"><path d="M6 160 C8 128 32 114 58 110 L102 110 C128 114 152 128 154 160 Z"/></clipPath>
  <clipPath id="hl-beanie"><path d="M46 70 C44 42 60 30 80 30 C100 30 116 42 114 70 C104 64 92 62 80 62 C68 62 56 64 46 70 Z"/></clipPath>
  <clipPath id="hl-card"><rect width="160" height="100" rx="10"/></clipPath>
  <clipPath id="hl-coinclip"><circle cx="12" cy="12" r="10.5"/></clipPath>
  ${Object.entries(SHAPES).map(([k, s]) => `<clipPath id="hl-tr-${k}">${s}</clipPath>`).join('')}
  ${['tired', 'happy'].map(m => FACE.eyes.map(([x, y], i) => `<clipPath id="hl-eye-${m}-${i}"><path d="${almond(x, y, m)}"/></clipPath>`).join('')).join('')}
</defs>`;

const svg = (/** @type {string} */ vb, /** @type {string} */ inner, /** @type {string} */ name) =>
  `<svg viewBox="${vb}" role="img" aria-label="${name}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const F = (/** @type {string} */ v) => `style="fill:var(${v})"`;
const ST = (/** @type {string} */ v, /** @type {number} */ w) => `fill="none" style="stroke:var(${v})" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const LINE = (w = 0.6) => `style="stroke:var(--ink-line)" stroke-width="${w}" stroke-linejoin="round"`;
/** Soft cast shadow: the lantern is upper right, so shadows lean left. */
const cast = (/** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ rx) => lod === 'mini'
  ? `<path d="M${cx - rx * 0.8} ${cy - 2} H${cx + rx * 0.8} L${cx + rx * 0.5} ${cy + 4} H${cx - rx * 1.1} Z" ${F('--shadow')} opacity=".3"/>`
  : `<ellipse cx="${cx - rx * 0.15}" cy="${cy}" rx="${rx}" ry="${rx * 0.17}" ${F('--shadow')} opacity=".45" filter="url(#hl-blur)"/>`;
/** Level of detail for the asset being drawn: 'hero' (>=160px), 'icon' (~96px, default), 'mini' (<=48px). */
let lod = 'icon';
/**
 * Draw an asset at a level of detail. Mini is Modern Fable's treatment: gradients become flat fills, and anything
 * filtered (blur, glow, grain) or hairline (<1px stroke) is dropped. Hero adds Naturalist detail inside the drawing code.
 * @param {{ lod?: string } | undefined} o @param {() => string} draw
 */
function atLod(o, draw) {
  lod = (o && o.lod) || 'icon';
  let out = draw();
  if (lod === 'mini') {
    out = out.replace(/<[^<>]*filter="url\(#hl-[\w-]+\)"[^<>]*\/>/g, '')
      .replace(/<[^<>]*stroke-width="0?\.\d+"[^<>]*\/>/g, '')
      .replace(/fill="url\(#hl-(petal|yolk|root|berry|leaf|coin|sage|mint|nettle|honey|lav)\)"/g, (_, k) => `style="fill:var(--${k})"`)
      .replace(/<[^<>]*fill="url\(#hl-ember\)"[^<>]*\/>/g, '')
      .replace(/<g[^>]*>\s*<\/g>/g, '');
  }
  lod = 'icon';
  return out;
}
/** A lens from the origin out to length L (Fable's petal and leaf unit). */
const lens = (/** @type {number} */ L, /** @type {number} */ w) => `M0 0 Q${w} ${-L / 2} 0 ${-L} Q${-w} ${-L / 2} 0 0 Z`;

/** Chamomile head: geometric lens petals lit by gradient (shadow side darker), a domed disc with florets in a spiral. */
function flower(/** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ r, n = 15, tilt = 0) {
  const angles = Array.from({ length: n }, (_, i) => ((360 / n) * i + tilt) % 360);
  const petal = (/** @type {number} */ a, /** @type {string} */ paint) => `<path d="${lens(r, r * 0.21)}" transform="rotate(${a.toFixed(1)})" ${paint}/>`;
  const shadowSide = (/** @type {number} */ a) => a > 165 && a < 290;
  const c = r * 0.36;
  if (lod === 'mini') {
    return `<g transform="translate(${cx} ${cy})">${angles.map(a => petal(a, F(shadowSide(a) ? '--petal-sh' : '--petal'))).join('')}<circle r="${c}" ${F('--yolk')}/>
      <path d="M${-c * 0.7} ${c * 0.7} A${c} ${c} 0 0 1 ${c * 0.7} ${-c * 0.7} A${c} ${c} 0 0 0 ${-c * 0.7} ${c * 0.7} Z" ${F('--yolk-dk')}/></g>`;
  }
  const under = angles.map(a => petal(a + 4, F('--petal-sh'))).join('');
  const p = angles.map(a => petal(a, `fill="url(#hl-petal)"${shadowSide(a) ? ' opacity=".8"' : ''}${lod === 'hero' ? ` ${LINE(0.35)}` : ''}`)).join('')
    + (lod === 'hero' ? angles.map(a => `<path d="M0 ${-c - 1} V${-r * 0.82}" transform="rotate(${a.toFixed(1)})" ${ST('--petal-sh', 0.45)}/>`).join('') : '');
  const nf = Math.round(r * (lod === 'hero' ? 3 : 2));
  const florets = Array.from({ length: nf }, (_, i) => {
    const t = i * 2.39996, rr = c * 0.9 * Math.sqrt(i / nf);
    return `<circle cx="${(Math.cos(t) * rr).toFixed(2)}" cy="${(Math.sin(t) * rr).toFixed(2)}" r="${(c * 0.09).toFixed(2)}"/>`;
  }).join('');
  return `<g transform="translate(${cx} ${cy})">${under}${p}
    <circle r="${c}" fill="url(#hl-yolk)"/><path d="M${-c * 0.7} ${c * 0.7} A${c} ${c} 0 0 1 ${c * 0.7} ${-c * 0.7} A${c} ${c} 0 0 0 ${-c * 0.7} ${c * 0.7} Z" ${F('--yolk-dk')} opacity=".45"/>
    <g ${F('--yolk-dk')} opacity=".55">${florets}</g></g>`;
}
/** Finely divided leaf (Naturalist structure, crisp strokes). */
function frond(/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ ang, /** @type {number} */ len, n = 5) {
  if (lod === 'mini') return `<path d="${lens(len * 0.8, len * 0.16)}" transform="translate(${x} ${y}) rotate(${ang + 90})" ${F('--leaf')}/>`;
  if (lod === 'hero') n += 2;
  let d = `M0 0 L${len} 0`;
  for (let i = 1; i <= n; i++) {
    const t = (len * i) / (n + 1), l = len * 0.3 * (1 - i / (n + 2));
    d += ` M${t.toFixed(1)} 0 l${(l * 0.6).toFixed(1)} ${(-l).toFixed(1)} M${t.toFixed(1)} 0 l${(l * 0.6).toFixed(1)} ${l.toFixed(1)}`;
  }
  return `<path d="${d}" transform="translate(${x} ${y}) rotate(${ang})" ${ST('--leaf', lod === 'hero' ? 1 : 1.2)}/>`;
}

/** Geometric leaf (Fable lens + shadow half + midrib); `toothed` gives a serrated edge; hero adds veins and a fine outline. */
function leaf(/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ ang, /** @type {number} */ L, /** @type {number} */ w, /** @type {string} */ tone, toothed = 0, shape = 'lens') {
  // each side is one cubic from the base (0,0) to the tip (0,-L); shapes differ by their control points
  const [c1, c2] = /** @type {Record<string, number[][]>} */ ({
    lens: [[0.667, -0.333], [0.667, -0.667]], oval: [[1.3, -0.1], [1.2, -0.95]], heart: [[1.9, 0.25], [0.9, -0.55]],
  })[shape].map(([a, b]) => [a * w, b * L]);
  const pt = (/** @type {number} */ t, /** @type {number} */ sgn, k = 1) => {
    const u = 1 - t, X = 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0], Y = 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * -L;
    return `${(sgn * X * k).toFixed(2)} ${Y.toFixed(2)}`;
  };
  const side = (/** @type {number} */ sgn) => toothed
    ? Array.from({ length: toothed * 2 }, (_, i) => pt((i + 1) / (toothed * 2 + 1), sgn, i % 2 ? 1 : 1.2))
    : Array.from({ length: 10 }, (_, i) => pt((i + 1) / 11, sgn));
  const r = side(1), l = side(-1);
  const d = `M0 0 L${r.join(' L')} L0 ${-L} L${[...l].reverse().join(' L')} Z`;
  const half = `M0 0 L${l.join(' L')} L0 ${-L} Z`;
  const veins = lod === 'hero' ? Array.from({ length: 4 }, (_, i) => { const t = (L * (i + 1)) / 5.5; return `M0 ${-t} l${w * 0.6} ${-L * 0.13} M0 ${-t} l${-w * 0.6} ${-L * 0.13}`; }).join(' ') : '';
  return `<g transform="translate(${x} ${y}) rotate(${ang})"><path d="${d}" fill="url(#hl-${tone})"/><path d="${half}" ${F(`--${tone}-dk`)} opacity=".5"/>
    ${lod === 'mini' ? '' : `<path d="M0 -1 V${(-L * 0.85).toFixed(1)}" ${ST(`--${tone}-hi`, 1)} opacity=".75"/>`}${veins ? `<path d="${veins}" ${ST(`--${tone}-dk`, 0.5)}/><path d="${d}" fill="none" ${LINE(0.45)}/>` : ''}</g>`;
}

/** Trait badge: the trait colour as a lit gem with Fable's crisp shadow plane, dark glyph. */
function badge(/** @type {'heat' | 'calm' | 'vigor' | 'clarity'} */ k, /** @type {string} */ glyph, /** @type {string} */ name) {
  return svg('0 0 48 48', `${SHAPES[k].replace('/>', ` style="fill:var(--${k});stroke:var(--trait-rim)" stroke-width="2.5" stroke-linejoin="round"/>`)}
    <path d="M0 48 L48 0 V48 Z" ${F('--on-trait')} opacity=".14" clip-path="url(#hl-tr-${k})"/>${SHAPES[k].replace('/>', ' fill="url(#hl-gem)"/>')}<path d="${glyph}" ${F('--on-trait')}/>`, name);
}

function jar(/** @type {[number, number, number, number, string, string]} */ [x, base, w, h, kind, tok]) {
  const shade = (/** @type {number} */ y0, /** @type {number} */ hh) => `<rect x="${x}" y="${y0}" width="${w * 0.36}" height="${hh}" ${F('--shadow')} opacity=".2"/>`;
  const hi = `<rect x="${x + w - 4.5}" y="${base - h + 5}" width="2" height="${h - 10}" ${F('--gem-hi')} opacity=".35"/>`;
  if (kind === 'bottle') return `<rect x="${x}" y="${base - h * 0.62}" width="${w}" height="${h * 0.62}" rx="2" ${F(tok)}/><rect x="${x + w * 0.3}" y="${base - h + 4}" width="${w * 0.4}" height="${h * 0.4}" ${F(tok)}/>
    ${shade(base - h * 0.62, h * 0.62)}<rect x="${x + w * 0.27}" y="${base - h}" width="${w * 0.46}" height="5" rx="1" ${F('--cork')}/>${hi}`;
  if (kind === 'round') return `<rect x="${x + w * 0.35}" y="${base - h}" width="${w * 0.3}" height="${h - w + 3}" ${F(tok)}/><circle cx="${x + w / 2}" cy="${base - w / 2}" r="${w / 2}" ${F(tok)}/>
    <path d="M${x + w / 2} ${base - w} A${w / 2} ${w / 2} 0 0 0 ${x + w / 2} ${base} Z" ${F('--shadow')} opacity=".2"/><circle cx="${x + w * 0.66}" cy="${base - w * 0.66}" r="${w * 0.1}" ${F('--gem-hi')} opacity=".5"/>`;
  return `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" rx="2" ${F('--glass')} opacity=".3"/><rect x="${x + 2}" y="${base - h * 0.72}" width="${w - 4}" height="${h * 0.72 - 2}" ${F(tok)}/>
    ${shade(base - h, h)}<rect x="${x - 1}" y="${base - h - 4}" width="${w + 2}" height="5" rx="1" ${F('--wood-dk')}/>
    <rect x="${x + 3}" y="${base - h * 0.52}" width="${w - 6}" height="${h * 0.24}" ${F('--apron')}/><path d="M${x + 5} ${base - h * 0.42} h${(w - 10) * 0.8}" ${ST('--ink-line', 0.6)}/>${hi}`;
}

function sceneBack() {
  const [ox, oy, or] = SCENE.orb;
  const [lx, ly] = SCENE.lantern;
  return svg('0 0 360 250', `<rect width="360" height="250" fill="url(#hl-wall)"/>
    <path d="M236 150 L186 250 H316 L320 150 Z" style="fill:var(--sky-bot);opacity:var(--beam-o)"/>
    <path d="${SCENE.window}" fill="url(#hl-sky)"/>
    <g style="fill:var(--star);opacity:var(--star-o)">${SCENE.stars.map(([x, y, r]) => `<rect x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" transform="rotate(45 ${x} ${y})"/>`).join('')}</g>
    <circle cx="${ox}" cy="${oy}" r="${or * 2.6}" style="fill:var(--orb);opacity:.16"/><circle cx="${ox}" cy="${oy}" r="${or}" ${F('--orb')}/>
    <path d="M236 116 L256 100 L272 112 L292 92 L320 114 V150 H236 Z" ${F('--hill-far')}/>
    <path d="${SCENE.hills}" ${F('--hill')}/><path d="M236 138 L262 128 L290 138 L320 130 V150 H236 Z" ${F('--hill-dk')}/>
    <path d="${SCENE.window}" fill="url(#hl-glass)" opacity=".45"/>
    <path d="${SCENE.mullions}" ${ST('--wood-dk', 4)} stroke-linecap="butt"/><path d="${SCENE.window}" ${ST('--wood-dk', 7)}/>
    <rect x="228" y="147" width="100" height="4" ${F('--wood-hi')}/><rect x="228" y="151" width="100" height="6" ${F('--wood-dk')}/>
    <path d="M307 134 L296 112 M307 134 L320 110 M307 134 L308 102" ${ST('--leaf-dk', 2)}/>
    ${/** @type {[number, number, number][]} */ ([[296, 112, -60], [320, 110, 50], [308, 104, 0]]).map(([x, y, r]) => `<path d="${lens(12, 4)}" transform="translate(${x} ${y}) rotate(${r})" fill="url(#hl-leaf)"/>`).join('')}
    <path d="M297 147 L300 134 H314 L317 147 Z" ${F('--clay')}/><path d="M297 147 L300 134 H305 L304 147 Z" ${F('--clay-dk')}/>
    ${SCENE.shelves.map(([x, y, w]) => `<path d="M${x} ${y + 8} H${x + w} L${x + w - 14} ${y + 16} H${x - 14} Z" ${F('--shadow')} opacity=".18"/>
      <rect x="${x}" y="${y}" width="${w}" height="3" ${F('--wood-hi')}/><rect x="${x}" y="${y + 3}" width="${w}" height="5" ${F('--wood-dk')}/>`).join('')}
    ${SCENE.jars.map(jar).join('')}
    <circle cx="${lx}" cy="${ly + 2}" r="100" fill="url(#hl-glow)" style="opacity:var(--glow-o)"/>
    <rect width="360" height="10" ${F('--wood-hi')}/><rect y="10" width="360" height="5" ${F('--wood-dk')}/>
    ${SCENE.bundles.map(([x, len]) => `<path d="M${x} 15 V${14 + len}" ${ST('--twine', 1.3)}/>
      <path d="M${x - 8} ${14 + len} L${x} ${len + 54} L${x + 8} ${14 + len} Z" ${F('--leaf')}/><path d="M${x - 8} ${14 + len} L${x} ${len + 54} L${x} ${14 + len} Z" ${F('--leaf-dk')}/>
      <rect x="${x - 8}" y="${12 + len}" width="16" height="4" rx="1" ${F('--twine')}/><g ${F('--bloom')}><circle cx="${x + 2.5}" cy="${len + 32}" r="1.6"/><circle cx="${x - 3}" cy="${len + 39}" r="1.5"/><circle cx="${x + 1}" cy="${len + 45}" r="1.3"/></g>`).join('')}
    <path d="M${lx} 15 V${ly - 19}" ${ST('--iron-dk', 1.5)}/>
    <path d="M${lx - 11} ${ly - 13} H${lx + 11} L${lx + 6} ${ly - 19} H${lx - 6} Z" ${F('--iron')}/>
    <rect x="${lx - 9}" y="${ly - 13}" width="18" height="25" ${F('--glow')}/><rect x="${lx - 9}" y="${ly - 13}" width="6" height="25" ${F('--ember')} opacity=".3"/>
    <path d="M${lx} ${ly + 6} C${lx - 5} ${ly + 1} ${lx - 3} ${ly - 5} ${lx} ${ly - 9} C${lx + 3} ${ly - 5} ${lx + 5} ${ly + 1} ${lx} ${ly + 6} Z" ${F('--ember-hi')}/>
    <path d="M${lx - 9} ${ly - 13} V${ly + 12} M${lx + 9} ${ly - 13} V${ly + 12}" ${ST('--iron', 1.6)}/>
    <rect x="${lx - 11}" y="${ly + 11}" width="22" height="4" ${F('--iron')}/>
    <rect width="360" height="250" fill="url(#hl-vig)" opacity=".8"/><rect width="360" height="250" fill="#000" filter="url(#hl-grain)"/>`, 'The shop at dusk');
}

function sceneFront() {
  const top = SCENE.counterTop;
  return svg('0 0 360 250', `<ellipse cx="200" cy="${top + 2}" rx="125" ry="10" fill="url(#hl-glow)" style="opacity:var(--glow-o)"/>
    <rect y="${top + 12}" width="360" height="${250 - top - 12}" ${F('--wood-dk')}/>
    <path d="M14 ${top + 22} H112 V250 H14 Z M128 ${top + 22} H232 V250 H128 Z M248 ${top + 22} H346 V250 H248 Z" ${F('--wood')} opacity=".4"/>
    <rect y="${top}" width="360" height="12" fill="url(#hl-wood)"/><rect y="${top}" width="360" height="12" fill="#000" filter="url(#hl-woodgrain)"/>
    <path d="M0 ${top + 0.8} H360" ${ST('--wood-hi', 1.4)}/><path d="M0 ${top + 12} H360 V${top + 19} H0 Z" ${F('--shadow')} opacity=".3"/>
    ${cast(306, top + 1, 22)}
    <path d="M290 ${top - 16} H322 L317 ${top} H295 Z" ${F('--stone')}/><path d="M290 ${top - 16} H303 L301 ${top} H295 Z" ${F('--stone-dk')}/><rect x="289" y="${top - 19}" width="34" height="4" rx="1" ${F('--stone-dk')}/>
    <path d="M311 ${top - 14} L326 ${top - 34}" ${ST('--wood', 5)}/><path d="M312 ${top - 15} L326 ${top - 33}" ${ST('--wood-hi', 1.4)}/>
    ${cast(34, top + 1, 13)}
    <path d="M25 ${top} V${top - 18} L31 ${top - 28} V${top - 35} H37 V${top - 28} L43 ${top - 18} V${top} Z" fill="url(#hl-berry)"/><path d="M25 ${top} V${top - 18} L31 ${top - 28} V${top} Z" ${F('--berry-dk')} opacity=".45"/>
    <path d="M38 ${top - 3} V${top - 17}" ${ST('--gem-hi', 1.6)} opacity=".45"/><rect x="30" y="${top - 40}" width="8" height="6" rx="1" ${F('--cork')}/><rect x="28" y="${top - 15}" width="12" height="8" ${F('--apron')}/>`, 'The counter');
}

/** Modelled eyes (Naturalist detail): white, iris, lid shadow, catchlight; tired adds bags. Shared by every customer. */
function eyePair(/** @type {string} */ mood) {
  return FACE.eyes.map(([x, y], i) => {
    const lidY = mood === 'happy' ? 3.6 : 2.8;
    return `<path d="${almond(x, y, mood)}" ${F('--eye-white')}/>
      <g clip-path="url(#hl-eye-${mood}-${i})"><circle cx="${x + 0.5}" cy="${y + 0.3}" r="3.5" ${F('--iris')}/><circle cx="${x + 0.5}" cy="${y + 0.3}" r="1.7" ${F('--eye')}/>
        <path d="M${x - 8} ${y - 6} H${x + 8} V${y - 1} C${x + 4} ${y - lidY - 0.6} ${x - 4} ${y - lidY - 0.6} ${x - 8} ${y - 1} Z" ${F('--skin-sh')} opacity=".5"/></g>
      <circle cx="${x + 1.8}" cy="${y - 0.8}" r=".9" ${F('--gem-hi')}/>
      <path d="M${x - 7} ${y} C${x - 4} ${y - lidY} ${x + 4} ${y - lidY} ${x + 7} ${y}" ${ST('--ink-line', 1.5)}/>
      <path d="M${x - 6} ${y - lidY - 2.3} C${x - 2} ${y - lidY - 4} ${x + 3} ${y - lidY - 4} ${x + 6} ${y - lidY - 2}" ${ST('--skin-sh', 0.9)}/>
      ${mood === 'tired' ? `<path d="M${x - 6} ${y + 4.5} C${x - 2} ${y + 7} ${x + 3} ${y + 7} ${x + 6} ${y + 4}" ${ST('--skin-sh', 1.1)}/><ellipse cx="${x}" cy="${y + 5.5}" rx="6" ry="2" ${F('--bags')} opacity=".3" filter="url(#hl-soft)"/>`
        : `<path d="M${x - 6} ${y + 3.4} C${x - 2} ${y + 5.4} ${x + 3} ${y + 5.4} ${x + 6} ${y + 3}" ${ST('--skin-sh', 0.9)}/>`}`;
  }).join('');
}

function portrait(/** @type {{ mood?: 'tired' | 'happy', bare?: boolean }} */ o = {}) {
  const mood = o.mood || 'tired';
  const eyes = eyePair(mood);
  const mouth = mood === 'happy'
    ? `<path d="M71 101.5 Q80 110.5 89 101.5 Q80 104 71 101.5 Z" ${F('--mouth-in')}/><path d="M73.5 102.5 Q80 104.6 86.5 102.5 L86 104 Q80 105.6 74 104 Z" ${F('--eye-white')}/>
       <path d="M74 107.5 Q80 111.5 86 107.5" ${ST('--lips', 2.2)} opacity=".7"/><path d="M69.5 100.5 q1.2 1.4 1.5 3 M90.5 100.5 q-1.2 1.4 -1.5 3" ${ST('--skin-sh', 1)}/>`
    : `<path d="M73 104.5 Q76.5 102.6 80 103.4 Q83.5 102.6 87 104.5 Q80 104.2 73 104.5 Z" ${F('--lips')}/><path d="M73.5 104.6 Q80 109 86.5 104.6 Q80 105 73.5 104.6 Z" ${F('--lips-hi')}/>
       <path d="M73 104.5 Q80 104.8 87 104.5" ${ST('--mouth-in', 1)}/>`;
  const dots = [[58, 52], [70, 43], [84, 39], [97, 44], [106, 57], [54, 62], [64, 52], [92, 50]];
  return svg('0 0 160 160', `${o.bare ? '' : `<rect width="160" height="160" rx="14" fill="url(#hl-wall)"/><circle cx="134" cy="40" r="72" fill="url(#hl-glow)" opacity=".55"/>`}
    <path d="${FACE.body}" fill="url(#hl-dress)"/><path d="M0 100 L60 100 C56 126 60 146 74 160 H0 Z" ${F('--dress-dk')} opacity=".6" clip-path="url(#hl-body)"/>
    <path d="${FACE.bib}" ${F('--apron')}/><path d="M61 160 L64 131 H71 L69 160 Z" ${F('--apron-sh')}/><path d="${FACE.straps}" ${ST('--apron', 6)} stroke-linecap="butt"/>
    <g ${F('--flour')} opacity=".55" filter="url(#hl-soft)"><ellipse cx="78" cy="143" rx="5" ry="2.6"/><circle cx="88" cy="150" r="1.8"/></g>
    <path d="M140 160 C138 136 124 122 104 116" ${ST('--glow', 2.4)} opacity=".45"/>
    <path d="${FACE.neck}" ${F('--skin-sh')}/><path d="M69 110 C75 118 85 118 91 110 V104 C85 112 75 112 69 104 Z" ${F('--shadow')} opacity=".3" filter="url(#hl-soft)"/>
    <path d="${FACE.hairL}" ${F('--hair')}/><path d="${FACE.hairR}" ${F('--hair')}/>
    <path d="M54 74 Q50 86 50 96 M56 78 Q53 90 54 100 M106 74 Q110 86 110 96" ${ST('--hair-hi', 0.7)} opacity=".7"/>
    <ellipse cx="${hx}" cy="${hy}" rx="${hrx}" ry="${hry}" fill="url(#hl-skin)"/>
    <g clip-path="url(#hl-head)"><rect x="40" y="52" width="80" height="15" fill="url(#hl-browshade)"/><path d="M40 40 H64 C56 62 56 94 68 116 H40 Z" ${F('--skin-sh')} opacity=".4"/></g>
    <path d="M104 58 C112 68 113 86 107 99" ${ST('--glow', 2.2)} opacity=".6"/>
    <g ${F('--cheek')} opacity="${mood === 'happy' ? 0.5 : 0.35}" filter="url(#hl-soft)">${FACE.cheeks.map(([x, y]) => `<ellipse cx="${x}" cy="${y - (mood === 'happy' ? 1.5 : 0)}" rx="7" ry="4.5"/>`).join('')}</g>
    <path d="M79 80 L76.5 93" ${ST('--skin-sh', 1.6)} opacity=".55"/><path d="M76 95.5 Q78 97.5 80 96.5 Q82 97.5 84.5 95.5" ${ST('--ink-line', 1)}/><ellipse cx="81.5" cy="92.5" rx="2.3" ry="1.3" ${F('--skin-hi')} opacity=".8"/>
    ${mouth}${eyes}
    <g ${ST('--hair', 1)}>${FACE.brows[mood].map(d => `<path d="${d}" stroke-width="2.6" opacity=".6"/><path d="${d}" transform="translate(0 -0.8)"/><path d="${d}" transform="translate(0 0.8)"/>`).join('')}</g>
    <ellipse cx="${FACE.smudge[0]}" cy="${FACE.smudge[1]}" rx="5" ry="2.2" transform="rotate(-20 ${FACE.smudge[0]} ${FACE.smudge[1]})" ${F('--flour')} opacity=".7" filter="url(#hl-soft)"/>
    <path d="${FACE.scarf}" fill="url(#hl-scarf)"/><path d="M40 30 H72 C60 40 54 56 54 80 H40 Z" ${F('--scarf-dk')} opacity=".55" clip-path="url(#hl-scarfclip)"/>
    <g ${F('--scarf-dot')} opacity=".85">${dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.7"/>`).join('')}</g>
    <path d="M100 38 C108 44 112 54 113 66" ${ST('--glow', 2)} opacity=".5"/>
    <path d="${FACE.knot[0]}" fill="url(#hl-scarf)"/><path d="${FACE.knot[1]}" ${F('--scarf-dk')}/>
    ${o.bare ? '' : '<rect width="160" height="160" rx="14" fill="#000" filter="url(#hl-grain)"/>'}`, `Marla the baker, ${mood}`);
}

/** A paper sheet (light in both themes: a physical page). Shared by Spot the herb and the Notebook. */
const paper = (/** @type {number} */ w, /** @type {number} */ h) => `<rect width="${w}" height="${h}" rx="4" ${F('--paper')}/><rect width="${w}" height="${h}" rx="4" fill="#000" filter="url(#hl-paper)"/>
  <rect x="3.5" y="3.5" width="${w - 7}" height="${h - 7}" rx="2" fill="none" style="stroke:var(--paper-line)" stroke-width=".6"/><rect x="5" y="5" width="${w - 10}" height="${h - 10}" rx="1.5" fill="none" style="stroke:var(--paper-line)" stroke-width=".3"/>`;

/** Pell the woodcutter: big, gruff, often hurt. Same FACE base, re-proportioned: broad body, beanie, beard. */
function pell(/** @type {{ mood?: 'tired' | 'happy', bare?: boolean }} */ o = {}) {
  const mood = o.mood || 'tired';
  const beard = 'M47 78 C47 102 60 122 80 124 C100 122 113 102 113 78 C107 92 97 97 88 95 C84 93 76 93 72 95 C63 97 53 92 47 78 Z';
  const mouth = mood === 'happy'
    ? `<path d="M70 102 Q80 112 90 102 Q80 105.5 70 102 Z" ${F('--mouth-in')}/><path d="M73 103 Q80 105 87 103 L86.5 104.6 Q80 106 73.5 104.6 Z" ${F('--eye-white')}/>`
    : `<path d="M71 104.5 Q80 101.5 89 104.5" ${ST('--mouth-in', 2)}/><path d="M74 104 H86" ${ST('--eye-white', 1)} opacity=".7"/>`;
  const brows = mood === 'happy' ? ['M57 71 Q65 65.5 73 69', 'M87 69 Q95 65.5 103 71'] : ['M57 70.5 L73 75', 'M87 75 L103 70.5'];
  return svg('0 0 160 160', `${o.bare ? '' : `<rect width="160" height="160" rx="14" fill="url(#hl-wall)"/><circle cx="134" cy="40" r="72" fill="url(#hl-glow)" opacity=".55"/>`}
    <path d="M6 160 C8 128 32 114 58 110 L102 110 C128 114 152 128 154 160 Z" fill="url(#hl-plaid)"/>
    <g clip-path="url(#hl-pellbody)"><path d="M0 100 L60 100 C56 126 60 146 74 160 H0 Z" ${F('--plaid-dk')} opacity=".55"/>
      <path d="${[20, 44, 68, 92, 116, 140].map(x => `M${x} 108 V160`).join(' ')} M0 126 H160 M0 146 H160" ${ST('--plaid-line', 3)} opacity=".45"/>
      <path d="${[32, 56, 80, 104, 128].map(x => `M${x} 108 V160`).join(' ')} M0 136 H160" ${ST('--plaid-hi', 1)} opacity=".35"/></g>
    <path d="M64 110 L80 130 L96 110 Z" ${F('--plaid-dk')}/>
    <g ${F('--wood-hi')}><path d="${lens(7, 2)}" transform="translate(40 122) rotate(70)"/><path d="${lens(5, 1.6)}" transform="translate(120 126) rotate(-60)"/></g>
    <path d="M146 160 C144 134 128 120 106 114" ${ST('--glow', 2.4)} opacity=".45"/>
    <path d="M63 92 L63 114 C72 121 88 121 97 114 L97 92 Z" ${F('--skin2-sh')}/>
    <circle cx="48" cy="84" r="6.5" ${F('--skin2-sh')}/><circle cx="112" cy="84" r="6.5" ${F('--skin2')}/>
    <ellipse cx="80" cy="79" rx="32" ry="34" fill="url(#hl-skin2)"/>
    <g clip-path="url(#hl-head)"><rect x="40" y="58" width="80" height="14" fill="url(#hl-browshade)"/><path d="M40 40 H62 C55 62 55 94 67 116 H40 Z" ${F('--skin2-sh')} opacity=".4"/></g>
    <path d="M106 60 C113 70 114 86 109 98" ${ST('--glow', 2.2)} opacity=".55"/>
    <g ${F('--cheek')} opacity="${mood === 'happy' ? 0.45 : 0.3}" filter="url(#hl-soft)"><ellipse cx="62" cy="90" rx="7" ry="4"/><ellipse cx="98" cy="90" rx="7" ry="4"/></g>
    ${eyePair(mood)}
    <path d="M78.5 80 C76.5 88 72 92 74 95.5 C77 98.5 83 98.5 86 95.5 C88 92 84 88 81.5 80" ${F('--skin2-sh')} opacity=".55"/><path d="M75 95.5 Q77.5 97.5 80 96.5 Q82.5 97.5 85 95.5" ${ST('--ink-line', 1)}/>
    <path d="${beard}" ${F('--beard')}/><path d="M47 78 C47 102 60 122 80 124 C70 116 64 104 62 94 C55 92 50 86 47 78 Z" ${F('--beard-dk')} opacity=".6"/>
    <path d="M58 104 l2 6 M66 112 l1 5 M94 112 l-1 5 M102 104 l-2 6 M80 118 v4" ${ST('--beard-hi', 1.2)} opacity=".7"/>
    ${mouth}
    <path d="M65 99 C71 92.5 77 94 80 96.5 C83 94 89 92.5 95 99 C89 100.5 83 99.5 80 98.5 C77 99.5 71 100.5 65 99 Z" ${F('--beard-dk')}/>
    <g ${ST('--beard-dk', 4)}>${brows.map(d => `<path d="${d}"/>`).join('')}</g>
    <path d="M46 70 C44 42 60 30 80 30 C100 30 116 42 114 70 C104 64 92 62 80 62 C68 62 56 64 46 70 Z" ${F('--cap')}/>
    <g clip-path="url(#hl-beanie)"><path d="M40 28 H70 C60 40 54 52 54 74 H40 Z" ${F('--cap-dk')} opacity=".55"/><path d="${[56, 64, 72, 80, 88, 96, 104].map(x => `M${x} 34 V64`).join(' ')}" ${ST('--cap-dk', 1.2)} opacity=".5"/></g>
    <path d="M44 71 C56 62 104 62 116 71 L115 62 C104 55 56 55 45 62 Z" ${F('--cap-dk')}/>
    <path d="M100 36 C108 42 112 52 114 62" ${ST('--glow', 2)} opacity=".45"/>
    ${o.bare ? '' : '<rect width="160" height="160" rx="14" fill="#000" filter="url(#hl-grain)"/>'}`, `Pell the woodcutter, ${mood === 'happy' ? 'happy' : 'aching'}`);
}

/** Morning weather card (the sky is the day clock): Whisperwood edge in geometric planes, lit by the weather.
 * Mini is a glyph for the HUD. Card colours don't follow the theme: it is always morning outside. */
function weather(/** @type {'sun' | 'mist' | 'rain' | 'wind' | 'frost'} */ kind, /** @type {{ lod?: string }} */ o = {}) {
  if ((o.lod || 'icon') === 'mini') {
    const glyph = {
      sun: `<circle cx="24" cy="24" r="9" ${F('--wx-orb-ink')}/>${Array.from({ length: 8 }, (_, i) => `<path d="M24 6 V12" transform="rotate(${i * 45} 24 24)" ${ST('--wx-orb-ink', 3)}/>`).join('')}`,
      mist: `<path d="M14 22 A10 10 0 0 1 34 22 Z" ${F('--wx-orb-ink')} opacity=".55"/><path d="M8 28 H40 M12 35 H36 M8 42 H30" ${ST('--wx-mist-ink', 3.2)}/>`,
      rain: `<path d="M12 26 A8 8 0 0 1 16 11 A11 11 0 0 1 36 13 A7 7 0 0 1 36 26 Z" ${F('--wx-mist-ink')}/><path d="M16 32 L13 40 M25 32 L22 40 M34 32 L31 40" ${ST('--wx-rain-ink', 3)}/>`,
      wind: `<path d="M6 16 H28 A5 5 0 1 0 23 11 M6 25 H36 A5 5 0 1 1 31 30 M6 34 H22" ${ST('--wx-mist-ink', 3.2)}/>`,
      frost: `<path d="M24 6 V42 M8 15 L40 33 M8 33 L40 15 M19 9 L24 14 L29 9 M19 39 L24 34 L29 39" ${ST('--wx-rain-ink', 3)}/>`,
    }[kind];
    return svg('0 0 48 48', glyph, `Weather: ${kind}`);
  }
  const lean = kind === 'wind' ? 5 : 0;
  const tree = (/** @type {number} */ x, /** @type {number} */ b, /** @type {number} */ h) => {
    const dx = lean * h / 30;
    return `<path d="M${x + dx} ${b - h} L${x + h * 0.32} ${b} H${x - h * 0.32} Z" ${F('--wx-tree')}/><path d="M${x + dx} ${b - h} L${x} ${b} H${x - h * 0.32} Z" ${F('--wx-tree-dk')}/>`;
  };
  const TREES = [[8, 66, 22], [20, 64, 30], [34, 66, 20], [128, 64, 26], [142, 66, 34], [154, 64, 22], [116, 66, 18]];
  const trees = TREES.map(([x, b, h]) => tree(x, b, h)).join('');
  const mistBands = [[30, 54, 70, 5], [110, 60, 80, 6], [60, 74, 90, 5]].map(([x, y, w, h]) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${h * 2}" rx="${h}" ${F('--wx-mist')} opacity=".6" filter="url(#hl-soft)"/>`);
  const sky = kind === 'sun' ? 'sun' : kind === 'mist' ? 'mist' : kind === 'frost' ? 'frost' : 'rain';
  const orbOpacity = { sun: 1, mist: 0.55, rain: 0, wind: 0.8, frost: 0.9 }[kind];
  const clouds = (/** @type {number} */ op) => `<g ${F('--wx-cloud')} opacity="${op}">${[[30, 22, 26], [84, 16, 32], [140, 26, 24]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.42}"/><ellipse cx="${x + r * 0.4}" cy="${y - r * 0.18}" rx="${r * 0.55}" ry="${r * 0.4}"/>`).join('')}</g>`;
  const extra = {
    sun: `<path d="M118 30 L36 100 H70 Z M118 30 L96 100 H122 Z" ${F('--wx-orb')} opacity=".14"/>`,
    mist: '',
    rain: `${clouds(0.95)}<g ${ST('--wx-rain', 1.1)} opacity=".7">${Array.from({ length: 28 }, (_, i) => `<path d="M${(i * 37) % 168 - 4} ${30 + ((i * 53) % 60)} l-3 8"/>`).join('')}</g>`,
    wind: `${clouds(0.6)}<g ${ST('--wx-mist', 1.4)} opacity=".75"><path d="M10 36 H70 Q80 36 80 30 M40 46 H120 Q132 46 132 40 M96 30 H150"/></g>
      <g ${F('--wx-leaf')}>${[[52, 40, 30], [104, 34, -20], [140, 50, 60], [24, 50, 10]].map(([x, y, r]) => `<path d="${lens(5, 1.8)}" transform="translate(${x} ${y}) rotate(${r})"/>`).join('')}</g>`,
    frost: `<g ${F('--wx-frost')} opacity=".9">${Array.from({ length: 14 }, (_, i) => `<circle cx="${(i * 41) % 160}" cy="${8 + ((i * 29) % 52)}" r=".9"/>`).join('')}</g>`,
  }[kind];
  const snowcaps = kind === 'frost' ? `<g ${F('--wx-frost')}>${TREES.map(([x, b, h]) => `<path d="M${x} ${b - h} L${x + h * 0.12} ${b - h * 0.62} H${x - h * 0.12} Z"/>`).join('')}</g>` : '';
  return svg('0 0 160 100', `<g clip-path="url(#hl-card)"><rect width="160" height="100" fill="url(#hl-wx-${sky})"/>
    <circle cx="118" cy="30" r="44" fill="url(#hl-glow)" opacity="${kind === 'sun' ? 0.85 : kind === 'rain' ? 0 : 0.35}"/><circle cx="118" cy="30" r="11" ${F('--wx-orb')} opacity="${orbOpacity}"/>
    ${extra}
    <path d="M0 62 L22 50 L40 56 L62 44 L86 54 L108 46 L130 52 L160 42 V100 H0 Z" ${F('--wx-far')} opacity="${kind === 'mist' ? 0.55 : 1}"/>
    ${kind === 'mist' ? mistBands.slice(0, 2).join('') : ''}${trees}${snowcaps}
    <path d="M0 78 Q40 70 80 76 Q120 82 160 72 V100 H0 Z" ${F(kind === 'frost' ? '--wx-frost' : '--wx-near')}/><path d="M0 78 Q40 70 80 76 L70 100 H0 Z" ${F('--wx-tree-dk')} opacity="${kind === 'frost' ? 0.15 : 0.35}"/>
    <path d="M66 100 Q76 88 90 80 Q100 75 112 75" ${ST(kind === 'rain' ? '--wx-puddle' : '--wx-path', 5)}/>
    ${kind === 'sun' ? `<g ${F('--wx-tree-dk')} opacity=".3">${[[20, 65], [128, 65], [142, 67]].map(([x, b]) => `<path d="M${x} ${b} L${x - 26} ${b + 6} H${x - 18} Z"/>`).join('')}</g>` : kind === 'mist' ? mistBands.slice(2).join('') : ''}
    ${kind === 'mist' ? `<rect width="160" height="100" ${F('--wx-mist')} opacity=".22"/>` : ''}
    <rect width="160" height="100" fill="#000" filter="url(#hl-grain)"/></g>`, `Weather: ${kind}`);
}

/**
 * Notebook page (hero, paper). Holds the ingredient twice: a pencil sketch (the same drawing, restyled by CSS) and
 * the full plate. Adding the class `developed` to any ancestor develops it (CSS in style.css; instant under reduced motion).
 */
function notebookPage(/** @type {{ ingredient?: string }} */ o = {}) {
  const ing = o.ingredient || 'chamomile';
  const hero = ASSETS[`ingredient:${ing}`]({ lod: 'hero' }).replace(/^<svg[^>]*>/, '<svg x="10" y="10" width="100" height="100" viewBox="0 0 100 100">');
  return svg('0 0 120 150', `${paper(120, 150)}
    <g class="nb-sketch">${hero}</g><g class="nb-full">${hero}</g>
    <path d="M14 120 H106 M14 130 H106 M14 140 H80" ${ST('--paper-line', 0.5)} opacity=".6"/>`, `Notebook page: ${ing}`);
}

/** Spot-the-herb card: a specimen sheet with the plant drawn at hero detail. */
function sideView(/** @type {'chamomile' | 'mayweed'} */ kind) {
  lod = 'hero';
  const g = kind === 'chamomile' ? GEOM.chamomileSide : GEOM.mayweedSide;
  const centre = kind === 'chamomile' ? /** @type {any} */ (g).dome : /** @type {any} */ (g).disc;
  const shade = kind === 'chamomile' ? 'M39 45 C39 31 44 28.5 50 28.5 V45 Z' : 'M37 41 Q43.5 39 50 38.8 V45 H37 Z';
  const florets = kind === 'chamomile'
    ? Array.from({ length: 14 }, (_, i) => `<circle cx="${42 + (i % 4) * 5 + (Math.floor(i / 4) % 2) * 2.5}" cy="${42 - Math.floor(i / 4) * 4}" r=".9"/>`).join('')
    : Array.from({ length: 8 }, (_, i) => `<circle cx="${39 + i * 3.2}" cy="41.6" r=".8"/>`).join('');
  const out = svg('0 0 100 100', `${paper(100, 100)}
    <ellipse cx="48" cy="95" rx="20" ry="2.4" ${F('--paper-sh')} opacity=".7"/>
    <path d="${GEOM.sideStem}" ${ST('--leaf-dk', 2)}/>
    ${[[50, 84, 205, 18], [50, 84, -25, 18], [50, 71, 210, 14], [50, 71, -30, 14]].map(([x, y, a, l]) => frond(x, y, a, l)).join('')}
    <path d="${g.petals}" ${ST('--paper-ink', 4.6)} opacity=".55"/><path d="${g.petals}" ${ST('--petal', 3.4)}/>
    <path d="${centre}" fill="url(#hl-yolk)" ${LINE(0.6)}/><path d="${shade}" ${F('--yolk-dk')} opacity=".45"/><g ${F('--yolk-dk')} opacity=".6">${florets}</g>
    <path d="M70 90 C74 92 80 92 84 89" ${ST('--paper-line', 0.6)}/><rect x="66" y="86" width="20" height="6" rx="1" fill="none" style="stroke:var(--paper-line)" stroke-width=".5" transform="rotate(-8 76 89)"/>
    <circle cx="50" cy="${kind === 'chamomile' ? 36 : 40}" r="17" ${ST('--paper-mark', 1.8)} stroke-dasharray="4 3"/>`, kind === 'chamomile' ? 'Chamomile: domed centre' : 'Mayweed: flat centre');
  lod = 'icon';
  return out;
}

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'trait:heat': () => badge('heat', 'M24 18c4 5 6 8 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3-1-3 0-5 0-8z', 'Heat'),
  'trait:calm': () => badge('calm', 'M24 12c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z', 'Calm'),
  'trait:vigor': () => badge('vigor', 'M14 34c0-12 8-20 22-20 0 14-8 22-20 22z', 'Vigor'),
  'trait:clarity': () => badge('clarity', 'M24 13l2.8 7.7 8.2.3-6.4 5 2.3 7.9L24 29.3l-6.9 4.6 2.3-7.9-6.4-5 8.2-.3z', 'Clarity'),

  'ingredient:chamomile': (o = {}) => atLod(o, () => svg('0 0 100 100', `${cast(52, 92, 25)}
    <path d="M50 90 L38 42 M50 90 L71 54 M50 90 L24 66" ${ST('--leaf-dk', 2.2)} stroke-linecap="butt"/>
    ${frond(45, 74, 200, 15)}${frond(47, 70, -40, 14)}${frond(42, 60, 215, 11)}${frond(58, 69, -10, 12)}
    <rect x="41" y="80" width="18" height="5" rx="1" ${F('--twine')}/><path d="M41 82.5 H59" ${ST('--twine-dk', 0.8)}/><path d="M50 85 L45 93 M50 85 L55 93" ${ST('--twine', 1.8)} stroke-linecap="butt"/>
    ${flower(71, 52, 13, 13, 10)}${flower(24, 64, 9, 11)}${flower(38, 38, 19, 15, 4)}`, 'Chamomile')),

  'ingredient:fireroot': (o = {}) => atLod(o, () => svg('0 0 100 100', `${cast(54, 77, 34)}
    ${[GEOM.fireroot[1], GEOM.fireroot[2]].map(d => `<path d="${d}" ${ST('--root-dk', 9.5)}/><path d="${d}" ${ST('--root', 7)}/>`).join('')}
    <path d="${GEOM.fireroot[0]}" fill="url(#hl-root)"/>
    <g clip-path="url(#hl-rootclip)"><path d="M10 60 L90 56 V80 H10 Z" ${F('--root-dk')} opacity=".55"/><path d="M20 40 L76 34 L80 46 L26 52 Z" ${F('--root-hi')} opacity=".55"/>
      <path d="M28 48 C26 56 27 64 31 70 M40 46 C37 56 38 66 42 73 M56 42 C53 52 54 62 58 70 M68 42 C66 50 66 60 70 70" ${ST('--root-dk', 0.9)}/></g>
    <path d="M30 70 c-2 3 -1 6 -4 9 M44 72 c1 3 -1 6 0 9 M66 71 c2 3 1 5 3 8" ${ST('--root-dk', 0.9)}/>
    <circle cx="82" cy="58" r="17" fill="url(#hl-ember)" opacity=".85"/>
    <path d="M34 63 l6 -3 l4 4 l7 -2 M60 59 l5 3 l6 -2" ${ST('--ember', 1.5)}/>
    <path d="M82.5 49.5 L87.5 58 L82.5 66.5 L78.5 58 Z" ${F('--ember-hi')}/>${lod === 'mini' ? '' : `<path d="M82.5 58 L80 53 M82.5 58 L85 53 M82.5 58 L80 63 M82.5 58 L85 63" ${ST('--ember', 0.6)}/>`}
    ${lod === 'hero' ? `<path d="${GEOM.fireroot[0]}" fill="none" ${LINE(0.7)}/><g clip-path="url(#hl-rootclip)" ${ST('--root-dk', 0.5)}><path d="M24 56 C30 52 36 52 40 56 M46 50 C52 47 58 48 62 52 M64 56 C70 53 76 54 80 58"/></g>` : ''}`, 'Fireroot')),

  'ingredient:rosehip': (o = {}) => atLod(o, () => svg('0 0 100 100', `${cast(52, 89, 27)}
    <path d="M14 22 C34 26 48 36 57 48 M30 26 C38 36 40 46 38 54" ${ST('--twig', 2.4)}/>
    <g ${F('--twig')}><path d="M24 23 l-1 -4 l3 3 Z"/><path d="M40 30 l1 -4 l2 4 Z"/></g>
    ${/** @type {[number, number, number, number][]} */ ([[36, 19, -50, 16], [22, 23, -140, 13]]).map(([x, y, r, l]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="${lens(l, l * 0.34)}" transform="rotate(90)" fill="url(#hl-leaf)"/>
      <path d="M0 0 H${l * 0.9} M${l * 0.3} 0 l${l * 0.12} ${-l * 0.14} M${l * 0.3} 0 l${l * 0.12} ${l * 0.14} M${l * 0.55} 0 l${l * 0.12} ${-l * 0.12} M${l * 0.55} 0 l${l * 0.12} ${l * 0.12}" ${ST('--vein', 0.5)}/></g>`).join('')}
    ${/** @type {[number, number, number][]} */ ([[64, 60, -30], [36, 68, 10]]).map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">
      <ellipse rx="12" ry="15" fill="url(#hl-berry)"/><path d="M-14 -16 C-2 -6 -2 6 -8 18 H-14 Z" ${F('--berry-dk')} opacity=".45" clip-path="url(#hl-hip)"/>
      <ellipse cx="4.5" cy="-6" rx="2.2" ry="4" ${F('--gem-hi')} opacity=".6" filter="url(#hl-soft)"/><circle cx="4" cy="-8" r="1" ${F('--gem-hi')}/>
      <g ${F('--berry-dk')} opacity=".5"><circle cx="-4" cy="2" r=".6"/><circle cx="-2" cy="7" r=".5"/><circle cx="3" cy="4" r=".5"/></g>
      <path d="M0 14 L-5 21 M0 14 L5 21 M0 14 V22 M0 14 L-8 17 M0 14 L8 17" ${ST('--sepal', 1.2)}/>${lod === 'hero' ? `<ellipse rx="12" ry="15" fill="none" ${LINE(0.6)}/>` : ''}</g>`).join('')}`, 'Rosehip')),

  // ---- validation spike (timed: design/visual/05-spike-log.md) ----
  'ingredient:sage': (o = {}) => atLod(o, () => svg('0 0 100 100', `${cast(50, 93, 22)}
    <path d="M50 92 C50 76 50 58 51 34" ${ST('--sage-dk', 3)}/>
    ${[[82, 28, 82], [66, 25, 74], [51, 20, 62]].map(([y, L, a]) => leaf(50, y, -a, L, L * 0.4, 'sage', 0, 'oval') + leaf(50, y, a, L, L * 0.4, 'sage', 0, 'oval')).join('')}
    ${leaf(51, 38, -28, 15, 6, 'sage', 0, 'oval')}${leaf(51, 38, 28, 15, 6, 'sage', 0, 'oval')}${leaf(51, 36, 0, 14, 5.5, 'sage', 0, 'oval')}
    ${lod === 'hero' ? `<g ${F('--sage-hi')} opacity=".6">${[[38, 70], [62, 70], [40, 55], [60, 55], [42, 41], [58, 41]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7"/>`).join('')}</g>` : ''}`, 'Sage')),

  'ingredient:mint': (o = {}) => atLod(o, () => svg('0 0 100 100', `${cast(50, 93, 22)}
    <path d="M50 92 C51 74 50 54 50 34" ${ST('--mint-stem', 2.6)}/>
    ${[[84, 19, 80], [71, 18, 72], [59, 16, 62], [48, 14, 54]].map(([y, L, a]) => leaf(50, y, -a, L, L * 0.38, 'mint', 4, 'oval') + leaf(50, y, a, L, L * 0.38, 'mint', 4, 'oval')).join('')}
    ${[[-58, 13], [58, 13], [-24, 15], [24, 15], [0, 15]].map(([a, L]) => leaf(50, 40, a, L, L * 0.4, 'mint', 3, 'oval')).join('')}`, 'Mint')),

  'ingredient:nettle': (o = {}) => atLod(o, () => svg('0 0 100 100', `${cast(50, 93, 24)}
    <path d="M50 92 C49 70 51 44 50 16" ${ST('--nettle-dk', 2.8)}/>
    ${/** @type {[number, number][]} */ ([[72, 1], [50, -1], [72, -1], [50, 1]]).map(([y, s]) => `<path d="M50 ${y} q${s * 4} 6 ${s * 7} 16 M50 ${y} q${s * 7} 4 ${s * 12} 12" ${ST('--nettle-hi', 1.8)}/>
      <g ${F('--nettle-hi')}>${[0.35, 0.6, 0.85].map(t => `<circle cx="${50 + s * 7 * t}" cy="${y + 16 * t}" r="1.4"/><circle cx="${50 + s * 12 * t}" cy="${y + 12 * t}" r="1.3"/>`).join('')}</g>`).join('')}
    ${[[70, 30, 122], [48, 26, 112], [30, 19, 96]].map(([y, L, a]) => leaf(50, y, -a, L, L * 0.36, 'nettle', 6, 'heart') + leaf(50, y, a, L, L * 0.36, 'nettle', 6, 'heart')).join('')}
    ${leaf(50, 18, -36, 11, 4, 'nettle', 3, 'heart')}${leaf(50, 18, 36, 11, 4, 'nettle', 3, 'heart')}${leaf(50, 16, 0, 9, 3.4, 'nettle', 2, 'heart')}
    ${lod === 'hero' ? `<path d="${Array.from({ length: 14 }, (_, i) => { const y = 88 - i * 5.2, sd = i % 2 ? 1 : -1; return `M${50 + sd * 0.8} ${y} l${sd * 3} -2`; }).join(' ')}" ${ST('--nettle-hi', 0.5)}/>` : ''}`, 'Nettle')),

  'ingredient:honey': (o = {}) => atLod(o, () => svg('0 0 100 100', `${cast(50, 91, 26)}
    <path d="M30 46 C30 40 34 38 38 38 H62 C66 38 70 40 70 46 V82 C70 88 66 90 60 90 H40 C34 90 30 88 30 82 Z" ${F('--glass')} opacity=".35"/>
    <path d="M32 52 H68 V82 C68 86 65 88 60 88 H40 C35 88 32 86 32 82 Z" fill="url(#hl-honey)"/>
    <path d="M32 52 H44 C40 62 40 78 46 88 H40 C35 88 32 86 32 82 Z" ${F('--honey-dk')} opacity=".45"/>
    <path d="M32 52 Q40 49 50 52 Q60 55 68 52" fill="none" ${ST('--honey-hi', 1.4)}/>
    <path d="M63 42 V84" ${ST('--gem-hi', 2.4)} opacity=".45"/>
    <path d="M24 40 Q50 28 76 40 L72 47 Q50 39 28 47 Z" ${F('--cloth')}/><path d="M24 40 Q37 34 50 33 L50 41 Q38 42 28 47 Z" ${F('--cloth-dk')} opacity=".5"/>
    ${lod === 'mini' ? '' : `<g ${F('--apron')} opacity=".75">${[[34, 40], [44, 37], [56, 37], [66, 40]].map(([x, y]) => `<rect x="${x}" y="${y}" width="3" height="3"/>`).join('')}</g>`}
    <path d="M28 46 Q50 41 72 46" ${ST('--twine', 2.6)}/>
    <path d="M38 62 H62 V76 H38 Z" ${F('--apron')}/>
    ${lod === 'mini' ? '' : `<path d="M50 65 l3 1.8 v3.5 l-3 1.8 l-3 -1.8 v-3.5 Z" ${F('--honey-dk')}/>`}
    ${lod === 'hero' ? `<path d="M41 62 V76 M59 62 V76" ${ST('--paper-line', 0.5)}/><path d="M44 74 h12" ${ST('--ink-line', 0.6)}/><path d="M38 62 H62 V76 H38 Z" fill="none" ${LINE(0.5)}/>` : ''}
    <path d="M70 58 C73 58 73 64 72 68 C71 72 69 72 69 68 Z" fill="url(#hl-honey)"/>`, 'Honey')),

  'ingredient:lavender': (o = {}) => atLod(o, () => {
    const tops = [[30, 20], [41, 12], [52, 10], [63, 13], [72, 22]];
    const spike = (/** @type {number} */ x, /** @type {number} */ y) => {
      const a = Math.atan2(x - 50, 80 - y) * 180 / Math.PI;
      if (lod === 'mini') return `<g transform="translate(${x} ${y}) rotate(${a.toFixed(1)})"><path d="${lens(22, 4.2)}" transform="rotate(180)" ${F('--lav')}/><path d="M0 0 Q-4.2 11 0 22 Z" ${F('--lav-dk')}/></g>`;
      const n = lod === 'hero' ? 9 : 7;
      return `<g transform="translate(${x} ${y}) rotate(${a.toFixed(1)})">${Array.from({ length: n }, (_, i) => {
        const yy = 2 + i * (20 / n), r = 2.9 - i * 0.12, sd = i % 2 ? 1.6 : -1.6;
        return `<ellipse cx="${sd}" cy="${yy}" rx="${r * 0.8}" ry="${r}" fill="url(#hl-lav)"/>${lod === 'hero' ? `<path d="M${sd} ${yy + r} l${sd * 0.4} 1.4" ${ST('--lav-dk', 0.5)}/>` : ''}`;
      }).join('')}<ellipse cx="0" cy="0" rx="1.6" ry="2.2" ${F('--lav-hi')}/></g>`;
    };
    return svg('0 0 100 100', `${cast(50, 93, 20)}
      <g ${ST('--sage-dk', 1.8)}>${tops.map(([x, y]) => `<path d="M50 92 L50 80 L${x} ${y + 20}"/>`).join('')}</g>
      ${leaf(46, 84, -150, 16, 3, 'sage')}${leaf(54, 84, 150, 16, 3, 'sage')}
      ${tops.map(([x, y]) => spike(x, y)).join('')}
      <rect x="43" y="77" width="14" height="6" rx="1" ${F('--twine')}/><path d="M50 83 l-5 7 M50 83 l4 7" ${ST('--twine', 1.8)}/>`, 'Lavender');
  }),

  'plant:chamomile': () => sideView('chamomile'),
  'plant:mayweed': () => sideView('mayweed'),

  'prop:cauldron': (o = {}) => cauldron({
    boil: o.boil, label: 'Cauldron, hearthlight', liquid: o.liquid || 'var(--calm)',
    before: `<ellipse cx="100" cy="168" rx="80" ry="48" fill="url(#hl-glow)" opacity=".7"/><path d="M50 166 H150 L122 186 H22 Z" style="fill:var(--shadow)" opacity=".25" filter="url(#hl-soft)"/>`,
    body: 'fill="url(#hl-iron)"', rim: 'style="fill:var(--iron-dk)"',
    bodyExtra: `<path d="M20 80 H86 C68 110 70 140 92 172 H20 Z" style="fill:var(--iron-dk)" opacity=".55" clip-path="url(#hl-pot)"/><path d="M148 108 C146 136 130 156 106 162" fill="none" style="stroke:var(--glow)" stroke-width="3" stroke-linecap="round" opacity=".5"/>`,
    legs: 'style="stroke:var(--iron-dk)" stroke-width="8"', handles: 'style="stroke:var(--iron-hi)" stroke-width="5"',
    flames: ['var(--ember)', 'var(--glow)'], steam: 'var(--steam)', bubble: 'var(--steam)', splash: 'var(--steam)',
    after: `<ellipse cx="100" cy="91" rx="66" ry="13" fill="none" style="stroke:var(--iron-hi)" stroke-width="1.5" opacity=".6"/>`,
  }),

  'portrait:marla': portrait,
  'portrait:pell': pell,
  'notebook:page': notebookPage,
  'weather:sun': (o = {}) => weather('sun', o),
  'weather:mist': (o = {}) => weather('mist', o),
  'weather:rain': (o = {}) => weather('rain', o),
  'weather:wind': (o = {}) => weather('wind', o),
  'weather:frost': (o = {}) => weather('frost', o),
  'scene:shop': (o = {}) => (o.layer === 'front' ? sceneFront() : sceneBack()),

  'ui:coin': () => svg('0 0 24 24', `<circle cx="12" cy="12" r="10.5" fill="url(#hl-coin)"/><path d="M0 24 L24 0 V24 Z" ${F('--coin-dk')} opacity=".35" clip-path="url(#hl-coinclip)"/>
    <path d="M12 6 L15 12 L12 18 L9 12 Z" ${F('--coin-dk')} opacity=".8"/><path d="M12 6 L15 12 L12 12 Z" ${F('--coin-hi')}/>`, 'Coin'),
  'ui:texture': () => svg('0 0 100 100', `<rect width="100" height="100" rx="12" fill="url(#hl-wall)"/><circle cx="72" cy="28" r="50" fill="url(#hl-glow)" opacity=".7"/>
    <path d="M0 74 L30 66 L60 72 L100 62 V100 H0 Z" ${F('--wood')}/><rect y="62" width="100" height="38" fill="#000" filter="url(#hl-woodgrain)"/><rect width="100" height="100" rx="12" fill="#000" filter="url(#hl-grain)"/>`, 'Lantern light, planes and grain'),
};
export const scope = Object.keys(ASSETS);
