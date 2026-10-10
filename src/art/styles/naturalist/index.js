// Exploration pack (round 2): Naturalist Still-life. Semi-realistic, candlelit: true botanical structure
// (phyllotaxis seed-heads, divided leaves, veins), real materials (wood grain, cast iron, plaster, glass),
// modelled faces, fine sepia linework, chiaroscuro. The most detailed and natural-coloured of the three.
import { GEOM, FACE, SCENE, cauldron } from '../../geom.js';

export const id = 'naturalist';
export const label = 'Naturalist Still-life';
export const exploration = true;
export const round = 2;
export const css = new URL('./style.css', import.meta.url).href;
export const brief = {
  adjectives: ['authentic', 'rich', 'candlelit'],
  inspiration: 'Dutch still-life painting, Strange Horticulture, old botanical plates; the shop as a real place lit by one candle',
  technique: 'Multi-stop gradients plus procedural textures (noise filters for wood grain, iron and plaster), fine sepia linework at 0.6-1px, true plant structure. The most expensive to produce and to render.',
};

/** @param {string} gid @param {[number, string, number?][]} stops */
const lin = (gid, stops, x2 = 0, y2 = 1) => `<linearGradient id="${gid}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, v, op]) =>
  `<stop offset="${o}" style="stop-color:var(${v})${op == null ? '' : `;stop-opacity:${op}`}"/>`).join('')}</linearGradient>`;
/** @param {string} gid @param {[number, string, number?][]} stops */
const rad = (gid, stops, cx = 0.4, cy = 0.35, r = 0.75) => `<radialGradient id="${gid}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, v, op]) =>
  `<stop offset="${o}" style="stop-color:var(${v})${op == null ? '' : `;stop-opacity:${op}`}"/>`).join('')}</radialGradient>`;
/** A noise texture that darkens/lightens whatever shape it is applied to. */
const noise = (/** @type {string} */ fid, /** @type {string} */ freq, /** @type {number} */ oct, /** @type {number} */ alpha, seed = 3, rgb = '0 0 0') =>
  `<filter id="${fid}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" seed="${seed}"/>
   <feColorMatrix type="matrix" values="0 0 0 0 ${rgb.split(' ')[0]}  0 0 0 0 ${rgb.split(' ')[1]}  0 0 0 0 ${rgb.split(' ')[2]}  ${alpha} 0 0 0 ${-alpha * 0.35}"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;

/** Almond eye outline for a mood at (x, y). */
const almond = (/** @type {number} */ x, /** @type {number} */ y, /** @type {string} */ mood) => {
  const [up, lo] = mood === 'happy' ? [3.4, 1.6] : mood === 'tired' ? [2.6, 3.2] : [4.4, 3.4];
  return `M${x - 7} ${y} C${x - 4} ${y - up} ${x + 4} ${y - up} ${x + 7} ${y} C${x + 4} ${y + lo} ${x - 4} ${y + lo} ${x - 7} ${y} Z`;
};
const [hx, hy, hrx, hry] = FACE.head;

/** One defs block for the whole pack; the page injects it once. */
export const defs = `<defs>
  ${lin('nt-sky', [[0, '--sky-top'], [1, '--sky-bot']])}
  ${rad('nt-wall', [[0, '--wall'], [0.7, '--wall-dk'], [1, '--shadow']], 0.6, 0.25, 0.9)}
  ${lin('nt-wood', [[0, '--wood-hi'], [0.3, '--wood'], [1, '--wood-dk']])}
  ${rad('nt-iron', [[0, '--iron-hi'], [0.35, '--iron'], [1, '--iron-dk']], 0.62, 0.22, 0.8)}
  ${rad('nt-skin', [[0, '--skin-hi'], [0.55, '--skin'], [1, '--skin-sh']], 0.64, 0.38, 0.7)}
  ${lin('nt-petal', [[0, '--petal'], [0.7, '--petal'], [1, '--petal-sh']])}
  ${rad('nt-yolk', [[0, '--yolk-hi'], [0.5, '--yolk'], [1, '--yolk-dk']], 0.42, 0.3, 0.72)}
  ${lin('nt-leaf', [[0, '--leaf-hi'], [0.5, '--leaf'], [1, '--leaf-dk']])}
  ${rad('nt-root', [[0, '--root-hi'], [0.5, '--root'], [1, '--root-dk']], 0.5, 0.2, 0.9)}
  ${rad('nt-ember', [[0, '--ember-hi'], [0.4, '--ember', 0.9], [1, '--ember', 0]], 0.5, 0.5, 0.5)}
  ${rad('nt-berry', [[0, '--berry-hi'], [0.35, '--berry'], [1, '--berry-dk']], 0.36, 0.28, 0.78)}
  ${rad('nt-coin', [[0, '--coin-hi'], [0.55, '--coin'], [1, '--coin-dk']], 0.36, 0.3, 0.8)}
  ${lin('nt-scarf', [[0, '--scarf'], [1, '--scarf-dk']], 1, 1)}
  ${lin('nt-dress', [[0, '--dress'], [1, '--dress-dk']], 0.6, 1)}
  ${lin('nt-apron', [[0, '--apron'], [1, '--apron-sh']], 1, 0.4)}
  ${lin('nt-browshade', [[0, '--skin-sh', 0.85], [1, '--skin-sh', 0]])}
  ${lin('nt-glass', [[0, '--gem-hi', 0.05], [0.18, '--gem-hi', 0.55], [0.3, '--gem-hi', 0.05], [1, '--gem-hi', 0]], 1, 0)}
  ${rad('nt-glow', [[0, '--glow', 0.9], [0.3, '--glow', 0.35], [1, '--glow', 0]], 0.5, 0.5, 0.5)}
  ${rad('nt-vig', [[0.45, '--shadow', 0], [1, '--shadow', 0.8]], 0.55, 0.4, 0.75)}
  ${lin('nt-gem', [[0, '--gem-hi', 0.55], [0.5, '--gem-hi', 0]])}
  ${noise('nt-mottle', '.09', 3, 0.55, 5)}
  ${noise('nt-plaster', '.035', 4, 0.5, 11)}
  ${noise('nt-paper', '.75', 2, 0.35, 2, '.35 .25 .1')}
  <filter id="nt-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.35" numOctaves="2" seed="9"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .1  0 0 0 0 .05  0 0 0 0 0  .9 0 0 0 -.25"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <filter id="nt-blur" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>
  <filter id="nt-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>
  <clipPath id="nt-head"><ellipse cx="${hx}" cy="${hy}" rx="${hrx}" ry="${hry}"/></clipPath>
  <clipPath id="nt-root"><path d="${GEOM.fireroot[0]}"/></clipPath>
  ${['tired', 'happy'].map(m => FACE.eyes.map(([x, y], i) => `<clipPath id="nt-eye-${m}-${i}"><path d="${almond(x, y, m)}"/></clipPath>`).join('')).join('')}
</defs>`;

const svg = (/** @type {string} */ vb, /** @type {string} */ inner, /** @type {string} */ name) =>
  `<svg viewBox="${vb}" role="img" aria-label="${name}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const F = (/** @type {string} */ v) => `style="fill:var(${v})"`;
const ST = (/** @type {string} */ v, /** @type {number} */ w) => `fill="none" style="stroke:var(${v})" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const LINE = (w = 0.7) => `style="stroke:var(--ink-line)" stroke-width="${w}" stroke-linejoin="round"`;
/** Soft cast shadow (candle from the upper right, so shadows fall left). */
const cast = (/** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ rx) =>
  `<ellipse cx="${cx - rx * 0.15}" cy="${cy}" rx="${rx}" ry="${rx * 0.16}" ${F('--shadow')} opacity=".55" filter="url(#nt-blur)"/>`;

/** Chamomile flower, front view: notched ray petals with a vein, a domed disc with florets in a phyllotaxis spiral. */
function flower(/** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ r, n = 17, tilt = 0) {
  const a = r * 0.3, L = r * 0.68, w = r * 0.16;
  const pd = `M0 ${-a} C${w} ${-a - L * 0.3} ${w * 0.95} ${-a - L * 0.85} ${w * 0.5} ${-a - L} L0 ${-a - L * 0.94} L${-w * 0.5} ${-a - L} C${-w * 0.95} ${-a - L * 0.85} ${-w} ${-a - L * 0.3} 0 ${-a} Z`;
  const petals = Array.from({ length: n }, (_, i) => `<g transform="rotate(${((360 / n) * i + tilt).toFixed(1)})"><path d="${pd}" fill="url(#nt-petal)" ${LINE(0.35)}/><path d="M0 ${-a - 1} V${-a - L * 0.8}" ${ST('--petal-sh', 0.4)}/></g>`).join('');
  const c = r * 0.36;
  const florets = Array.from({ length: Math.round(r * 2.2) }, (_, i) => {
    const t = i * 2.39996, rr = c * 0.92 * Math.sqrt(i / (r * 2.2));
    return `<circle cx="${(Math.cos(t) * rr).toFixed(2)}" cy="${(Math.sin(t) * rr).toFixed(2)}" r="${(c * 0.09).toFixed(2)}"/>`;
  }).join('');
  return `<g transform="translate(${cx} ${cy})">${petals}<circle r="${c}" fill="url(#nt-yolk)" ${LINE(0.4)}/><g ${F('--yolk-dk')} opacity=".55">${florets}</g>
    <ellipse cx="${-c * 0.25}" cy="${-c * 0.35}" rx="${c * 0.4}" ry="${c * 0.25}" ${F('--yolk-hi')} opacity=".6"/></g>`;
}
/** Finely divided leaf: a rachis with paired thread-like lobes. */
function frond(/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ ang, /** @type {number} */ len, n = 6) {
  let d = `M0 0 L${len} 0`;
  for (let i = 1; i <= n; i++) {
    const t = (len * i) / (n + 1), l = len * 0.3 * (1 - i / (n + 2));
    d += ` M${t.toFixed(1)} 0 l${(l * 0.6).toFixed(1)} ${(-l).toFixed(1)} M${t.toFixed(1)} 0 l${(l * 0.6).toFixed(1)} ${l.toFixed(1)}`;
  }
  return `<path d="${d}" transform="translate(${x} ${y}) rotate(${ang})" ${ST('--leaf', 1.1)}/>`;
}

/** Trait badge: enamel in the trait colour with a fine dark rim and a soft glaze highlight. */
function badge(/** @type {string} */ shape, /** @type {string} */ glyph, /** @type {string} */ color, /** @type {string} */ name) {
  return svg('0 0 48 48', `${shape.replace('/>', ` style="fill:var(${color});stroke:var(--trait-rim)" stroke-width="2.5" stroke-linejoin="round"/>`)}
    ${shape.replace('/>', ' fill="url(#nt-gem)"/>')}<path d="${glyph}" ${F('--on-trait')}/>`, name);
}

function jar(/** @type {[number, number, number, number, string, string]} */ [x, base, w, h, kind, tok]) {
  const glass = (/** @type {string} */ d) => `<path d="${d}" ${F('--glass')} opacity=".22"/><path d="${d}" fill="url(#nt-glass)"/><path d="${d}" fill="none" ${LINE(0.5)} opacity=".7"/>`;
  const label = (/** @type {number} */ lx, /** @type {number} */ ly, /** @type {number} */ lw, /** @type {number} */ lh) => `<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" ${F('--apron')} ${LINE(0.4)}/>
    <path d="M${lx + 2} ${ly + lh * 0.4} h${lw * 0.6} M${lx + 2} ${ly + lh * 0.7} h${lw * 0.45}" ${ST('--ink-line', 0.5)}/>`;
  if (kind === 'bottle') {
    const d = `M${x} ${base} V${base - h * 0.55} C${x} ${base - h * 0.65} ${x + w * 0.3} ${base - h * 0.66} ${x + w * 0.3} ${base - h * 0.75} V${base - h + 5} H${x + w * 0.7} V${base - h * 0.75} C${x + w * 0.7} ${base - h * 0.66} ${x + w} ${base - h * 0.65} ${x + w} ${base - h * 0.55} V${base} Z`;
    return `<path d="${d}" ${F(tok)} opacity=".85"/>${glass(d)}<rect x="${x + w * 0.27}" y="${base - h}" width="${w * 0.46}" height="6" rx="1" ${F('--cork')} ${LINE(0.4)}/>${label(x + 1.5, base - h * 0.4, w - 3, 7)}`;
  }
  if (kind === 'round') {
    const d = `M${x + w * 0.36} ${base - h} H${x + w * 0.64} V${base - w * 0.92} A${w / 2} ${w / 2} 0 1 1 ${x + w * 0.36} ${base - w * 0.92} Z`;
    return `<circle cx="${x + w / 2}" cy="${base - w / 2}" r="${w / 2 - 1.5}" ${F(tok)} opacity=".9"/>${glass(d)}<rect x="${x + w * 0.33}" y="${base - h - 2}" width="${w * 0.34}" height="5" rx="1" ${F('--cork')}/>`;
  }
  const d = `M${x} ${base} V${base - h + 3} Q${x} ${base - h} ${x + 3} ${base - h} H${x + w - 3} Q${x + w} ${base - h} ${x + w} ${base - h + 3} V${base} Z`;
  return `<rect x="${x + 1.5}" y="${base - h * 0.7}" width="${w - 3}" height="${h * 0.7 - 1}" ${F(tok)} opacity=".9"/><rect x="${x + 1.5}" y="${base - h * 0.7}" width="${w - 3}" height="${h * 0.7 - 1}" fill="#000" filter="url(#nt-mottle)" opacity=".7"/>
    ${glass(d)}<path d="M${x - 1} ${base - h - 1} h${w + 2} v-3.5 h${-(w + 2)} Z" ${F('--wood-dk')}/><path d="M${x - 0.5} ${base - h - 4.5} q${w / 2 + 0.5} -5 ${w + 1} 0" ${F('--apron-sh')} ${LINE(0.4)}/>${label(x + 3, base - h * 0.5, w - 6, 8)}`;
}

function sceneBack() {
  const [ox, oy, or] = SCENE.orb;
  const [lx, ly] = SCENE.lantern;
  return svg('0 0 360 250', `<rect width="360" height="250" fill="url(#nt-wall)"/><rect width="360" height="250" fill="#000" filter="url(#nt-plaster)" opacity=".8"/>
    <path d="M236 150 L192 250 H340 L320 150 Z" style="fill:var(--sky-bot);opacity:var(--beam-o)" filter="url(#nt-soft)"/>
    <path d="${SCENE.window}" fill="url(#nt-sky)"/>
    <g style="fill:var(--star);opacity:var(--star-o)">${SCENE.stars.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r * 0.8}"/>`).join('')}</g>
    <circle cx="${ox}" cy="${oy}" r="${or * 3}" style="fill:var(--orb);opacity:.12" filter="url(#nt-soft)"/><circle cx="${ox}" cy="${oy}" r="${or * 0.9}" ${F('--orb')}/>
    <path d="M236 120 Q248 112 258 116 Q270 104 282 114 Q298 102 320 110 V150 H236 Z" ${F('--hill')}/>
    <g ${F('--hill-dk')}>${[244, 256, 268, 284, 298, 312].map((x, i) => `<path d="M${x} ${132 - (i % 2) * 6} l-5 16 h10 Z"/>`).join('')}<path d="M236 140 H320 V150 H236 Z"/></g>
    <path d="${SCENE.window}" fill="url(#nt-glass)" opacity=".5"/>
    <path d="${SCENE.mullions}" ${ST('--wood-dk', 4)}/><path d="${SCENE.window}" ${ST('--wood-dk', 7)}/><path d="${SCENE.window}" fill="none" ${LINE(0.8)}/>
    <rect x="228" y="147" width="100" height="9" fill="url(#nt-wood)"/><rect x="228" y="147" width="100" height="9" fill="#000" filter="url(#nt-grain)"/>
    <path d="M307 136 C300 124 294 118 287 114 M307 136 C310 122 316 116 323 112 M307 136 C306 124 307 114 309 105" ${ST('--leaf-dk', 1.6)}/>
    ${/** @type {[number, number, number][]} */ ([[288, 114, 30], [322, 112, -35], [309, 105, 90], [296, 122, 50], [316, 121, -50]]).map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="6.5" ry="3" transform="rotate(${r} ${x} ${y})" fill="url(#nt-leaf)" ${LINE(0.4)}/>`).join('')}
    <path d="M297 147 L300 134 H314 L317 147 Z" ${F('--clay')} ${LINE(0.5)}/><path d="M297 147 L300 134 H304 L302 147 Z" ${F('--clay-dk')} opacity=".7"/><rect x="298" y="132" width="18" height="4" rx="1" ${F('--clay-dk')}/>
    ${SCENE.shelves.map(([x, y, w]) => `<rect x="${x}" y="${y + 7}" width="${w}" height="8" ${F('--shadow')} opacity=".45" filter="url(#nt-soft)"/><rect x="${x}" y="${y}" width="${w}" height="7" fill="url(#nt-wood)"/>
      <rect x="${x}" y="${y}" width="${w}" height="7" fill="#000" filter="url(#nt-grain)"/><path d="M${x + 6} ${y + 7} v8 l6 -8" ${F('--wood-dk')}/><path d="M${x + w - 6} ${y + 7} v8 l-6 -8" ${F('--wood-dk')}/>`).join('')}
    ${SCENE.jars.map(jar).join('')}
    <circle cx="${lx}" cy="${ly}" r="110" fill="url(#nt-glow)" style="opacity:var(--glow-o)"/>
    <rect width="360" height="14" fill="url(#nt-wood)"/><rect width="360" height="14" fill="#000" filter="url(#nt-grain)"/><path d="M0 14 H360" ${ST('--shadow', 3)} opacity=".6"/>
    ${SCENE.bundles.map(([x, len]) => `<path d="M${x} 14 V${14 + len}" ${ST('--twine', 1)}/>
      <g ${ST('--leaf-dk', 1)}>${[-7, -4, -1, 2, 5, 8].map((dx, i) => `<path d="M${x + dx * 0.3} ${14 + len} C${x + dx} ${len + 30} ${x + dx * 1.2} ${len + 40} ${x + dx * 0.9} ${len + 50 - (i % 3) * 4}"/>`).join('')}</g>
      <g ${F('--leaf')}>${[-6, 0, 6].map((dx, i) => `<ellipse cx="${x + dx}" cy="${len + 34 + i * 4}" rx="2.2" ry="5" transform="rotate(${dx * 3} ${x + dx} ${len + 34 + i * 4})"/>`).join('')}</g>
      <g ${F('--bloom')}>${[[-5, 44], [3, 40], [6, 48], [-1, 50]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${len + dy}" r="1.3"/>`).join('')}</g>
      <rect x="${x - 6}" y="${12 + len}" width="12" height="4" rx="1" ${F('--twine')}/>`).join('')}
    <path d="M${lx} 14 V${ly - 18}" ${ST('--iron-dk', 1.2)}/>
    <path d="M${lx - 11} ${ly - 13} H${lx + 11} L${lx + 7} ${ly - 20} H${lx - 7} Z" fill="url(#nt-iron)" ${LINE(0.5)}/>
    <rect x="${lx - 9}" y="${ly - 13}" width="18" height="25" ${F('--glow')} opacity=".85"/>
    <ellipse cx="${lx}" cy="${ly - 1}" rx="4" ry="8" fill="url(#nt-ember)"/><path d="M${lx} ${ly + 5} C${lx - 3} ${ly + 1} ${lx - 2} ${ly - 4} ${lx} ${ly - 8} C${lx + 2} ${ly - 4} ${lx + 3} ${ly + 1} ${lx} ${ly + 5} Z" ${F('--ember-hi')}/>
    <path d="M${lx - 9} ${ly - 13} V${ly + 12} M${lx + 9} ${ly - 13} V${ly + 12} M${lx} ${ly - 13} V${ly + 12}" ${ST('--iron-dk', 1.4)}/>
    <rect x="${lx - 11}" y="${ly + 11}" width="22" height="4" fill="url(#nt-iron)"/>
    <rect width="360" height="250" fill="url(#nt-vig)"/>`, 'The shop by candlelight');
}

function sceneFront() {
  const top = SCENE.counterTop;
  return svg('0 0 360 250', `<ellipse cx="210" cy="${top + 2}" rx="130" ry="9" fill="url(#nt-glow)" style="opacity:var(--glow-o)"/>
    <rect y="${top + 10}" width="360" height="${250 - top - 10}" ${F('--wood-dk')}/><rect y="${top + 10}" width="360" height="${250 - top - 10}" fill="#000" filter="url(#nt-grain)"/>
    <path d="M14 ${top + 18} H112 V250 M128 ${top + 18} H232 V250 M248 ${top + 18} H346 V250" ${ST('--wood-hi', 1)} opacity=".35"/>
    <path d="M14 ${top + 18} V250 M128 ${top + 18} V250 M248 ${top + 18} V250" ${ST('--shadow', 1.4)} opacity=".6"/>
    <rect y="${top}" width="360" height="12" fill="url(#nt-wood)"/><rect y="${top}" width="360" height="12" fill="#000" filter="url(#nt-grain)"/>
    <path d="M0 ${top + 0.8} H360" ${ST('--wood-hi', 1.2)}/><rect y="${top + 12}" width="360" height="6" ${F('--shadow')} opacity=".45" filter="url(#nt-soft)"/>
    ${cast(306, top + 1, 22)}
    <path d="M290 ${top - 16} H322 C322 ${top - 5} 316 ${top} 306 ${top} C296 ${top} 290 ${top - 5} 290 ${top - 16} Z" ${F('--stone')} ${LINE(0.6)}/>
    <path d="M290 ${top - 16} H322 C322 ${top - 5} 316 ${top} 306 ${top} C296 ${top} 290 ${top - 5} 290 ${top - 16} Z" fill="#000" filter="url(#nt-mottle)" opacity=".8"/>
    <ellipse cx="306" cy="${top - 16}" rx="16" ry="3.5" ${F('--stone-dk')} ${LINE(0.5)}/>
    <path d="M311 ${top - 14} L326 ${top - 34}" ${ST('--wood', 5)}/><path d="M312 ${top - 15} L326 ${top - 33}" ${ST('--wood-hi', 1.4)}/>
    ${cast(34, top + 1, 14)}
    <path d="M25 ${top} V${top - 18} C25 ${top - 23} 29 ${top - 25} 31 ${top - 29} V${top - 35} H37 V${top - 29} C39 ${top - 25} 43 ${top - 23} 43 ${top - 18} V${top} Z" fill="url(#nt-berry)" opacity=".92"/>
    <path d="M25 ${top} V${top - 18} C25 ${top - 23} 29 ${top - 25} 31 ${top - 29} V${top - 35} H37 V${top - 29} C39 ${top - 25} 43 ${top - 23} 43 ${top - 18} V${top} Z" fill="url(#nt-glass)" ${LINE(0.5)}/>
    <rect x="30" y="${top - 40}" width="8" height="6" rx="1" ${F('--cork')} ${LINE(0.4)}/><rect x="27.5" y="${top - 15}" width="13" height="8" ${F('--apron')} ${LINE(0.4)}/>`, 'The counter');
}

function portrait(/** @type {{ mood?: 'tired' | 'happy', bare?: boolean }} */ o = {}) {
  const mood = o.mood || 'tired';
  const eyes = FACE.eyes.map(([x, y], i) => {
    const d = almond(x, y, mood);
    const lidY = mood === 'happy' ? 3.4 : 2.6;
    return `<path d="${d}" ${F('--eye-white')}/>
      <g clip-path="url(#nt-eye-${mood}-${i})"><circle cx="${x + 0.5}" cy="${y + 0.3}" r="3.4" ${F('--iris')}/><circle cx="${x + 0.5}" cy="${y + 0.3}" r="1.6" ${F('--eye')}/>
        <path d="M${x - 8} ${y - 6} H${x + 8} V${y - 1} C${x + 4} ${y - lidY - 0.6} ${x - 4} ${y - lidY - 0.6} ${x - 8} ${y - 1} Z" ${F('--skin-sh')} opacity=".55"/></g>
      <circle cx="${x + 1.6}" cy="${y - 0.8}" r=".8" ${F('--gem-hi')}/>
      <path d="M${x - 7} ${y} C${x - 4} ${y - lidY} ${x + 4} ${y - lidY} ${x + 7} ${y}" ${ST('--ink-line', 1.4)}/>
      <path d="M${x - 6} ${y - lidY - 2.2} C${x - 2} ${y - lidY - 4} ${x + 3} ${y - lidY - 4} ${x + 6} ${y - lidY - 2}" ${ST('--skin-sh', 0.8)}/>
      ${mood === 'tired' ? `<path d="M${x - 6} ${y + 4.5} C${x - 2} ${y + 7} ${x + 3} ${y + 7} ${x + 6} ${y + 4}" ${ST('--skin-sh', 1.1)}/><ellipse cx="${x}" cy="${y + 5.5}" rx="6" ry="2" ${F('--bags')} opacity=".35" filter="url(#nt-soft)"/>`
        : `<path d="M${x - 6} ${y + 3.5} C${x - 2} ${y + 5.5} ${x + 3} ${y + 5.5} ${x + 6} ${y + 3}" ${ST('--skin-sh', 0.9)}/>`}`;
  }).join('');
  const mouth = mood === 'happy'
    ? `<path d="M71 101.5 Q80 110.5 89 101.5 Q80 104 71 101.5 Z" ${F('--mouth-in')}/><path d="M73.5 102.5 Q80 104.6 86.5 102.5 L86 104 Q80 105.6 74 104 Z" ${F('--eye-white')}/>
       <path d="M71 101.5 Q80 110.5 89 101.5" fill="none" ${LINE(0.8)}/><path d="M74 107.5 Q80 111.5 86 107.5" ${ST('--lips', 2.2)} opacity=".7"/><path d="M69.5 100.5 q1.2 1.4 1.5 3 M90.5 100.5 q-1.2 1.4 -1.5 3" ${ST('--skin-sh', 1)}/>`
    : `<path d="M73 104.5 Q76.5 102.6 80 103.4 Q83.5 102.6 87 104.5 Q80 104.2 73 104.5 Z" ${F('--lips')}/><path d="M73.5 104.6 Q80 109 86.5 104.6 Q80 105 73.5 104.6 Z" ${F('--lips-hi')}/>
       <path d="M73 104.5 Q80 104.8 87 104.5" ${ST('--mouth-in', 1)}/>`;
  const hairStrands = [[54, 74, 50, 96], [56, 78, 54, 100], [106, 74, 110, 96], [104, 78, 106, 100], [52, 70, 47, 88], [108, 70, 113, 88]]
    .map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2 - 2} ${(y1 + y2) / 2} ${x2} ${y2}" ${ST('--hair-hi', 0.6)} opacity=".7"/>`).join('');
  return svg('0 0 160 160', `${o.bare ? '' : `<rect width="160" height="160" rx="10" fill="url(#nt-wall)"/><rect width="160" height="160" rx="10" fill="#000" filter="url(#nt-plaster)" opacity=".7"/><circle cx="140" cy="30" r="80" fill="url(#nt-glow)" opacity=".45"/>`}
    <path d="${FACE.body}" fill="url(#nt-dress)" ${LINE(0.7)}/><path d="M40 128 C46 138 48 150 46 160 M120 128 C114 138 112 150 114 160 M30 140 C34 148 34 154 32 160" ${ST('--dress-dk', 1.2)} opacity=".8"/>
    <path d="${FACE.bib}" fill="url(#nt-apron)" ${LINE(0.6)}/><path d="${FACE.straps}" ${ST('--apron', 5.5)}/><path d="${FACE.straps}" fill="none" ${LINE(0.4)} opacity=".6"/>
    <path d="M70 146 C74 150 80 150 84 147" ${ST('--apron-sh', 0.9)}/><g ${F('--flour')} opacity=".55" filter="url(#nt-soft)"><ellipse cx="78" cy="142" rx="6" ry="3"/><circle cx="88" cy="150" r="2"/></g>
    <path d="${FACE.neck}" ${F('--skin-sh')}/><path d="M69 110 C75 118 85 118 91 110 V104 C85 112 75 112 69 104 Z" ${F('--shadow')} opacity=".35" filter="url(#nt-soft)"/>
    <path d="${FACE.hairL}" ${F('--hair')}/><path d="${FACE.hairR}" ${F('--hair')}/>${hairStrands}
    <ellipse cx="${hx}" cy="${hy}" rx="${hrx}" ry="${hry}" fill="url(#nt-skin)"/>
    <g clip-path="url(#nt-head)"><rect x="40" y="52" width="80" height="16" fill="url(#nt-browshade)"/><path d="M40 40 H60 C54 64 54 92 66 116 H40 Z" ${F('--skin-sh')} opacity=".4" filter="url(#nt-soft)"/>
      <ellipse cx="${hx}" cy="${hy}" rx="${hrx}" ry="${hry}" fill="#000" filter="url(#nt-mottle)" opacity=".15"/></g>
    <ellipse cx="${hx}" cy="${hy}" rx="${hrx}" ry="${hry}" fill="none" ${LINE(0.6)} opacity=".55"/>
    <g ${F('--cheek')} opacity="${mood === 'happy' ? 0.5 : 0.32}" filter="url(#nt-soft)">${FACE.cheeks.map(([x, y]) => `<ellipse cx="${x}" cy="${y - (mood === 'happy' ? 1.5 : 0)}" rx="7" ry="4.5"/>`).join('')}</g>
    <path d="M78.5 80 C77 86 75.5 91 76 94" ${ST('--skin-sh', 1.6)} opacity=".6"/><path d="M76 95.5 Q78 97.5 80 96.5 Q82 97.5 84.5 95.5" ${ST('--ink-line', 0.9)}/>
    <ellipse cx="81.5" cy="92.5" rx="2.4" ry="1.4" ${F('--skin-hi')} opacity=".8"/>
    ${mouth}${eyes}
    <g ${ST('--hair', 1)}>${FACE.brows[mood].map(d => `<path d="${d}" stroke-width="2.6" opacity=".55"/><path d="${d}" transform="translate(0 -0.8)"/><path d="${d}" transform="translate(0 0.8)"/>`).join('')}</g>
    <ellipse cx="${FACE.smudge[0]}" cy="${FACE.smudge[1]}" rx="5" ry="2.2" transform="rotate(-20 ${FACE.smudge[0]} ${FACE.smudge[1]})" ${F('--flour')} opacity=".6" filter="url(#nt-soft)"/>
    <path d="${FACE.scarf}" fill="url(#nt-scarf)" ${LINE(0.7)}/><path d="${FACE.scarf}" fill="#000" filter="url(#nt-mottle)" opacity=".35"/>
    <path d="M56 46 C66 40 78 38 92 40 M52 58 C62 50 76 47 92 48 M98 44 C104 50 108 56 110 64" ${ST('--scarf-dk', 0.9)} opacity=".8"/>
    <path d="M100 37 C108 43 112 53 113 66" ${ST('--glow', 1.6)} opacity=".45"/>
    ${FACE.knot.map(d => `<path d="${d}" fill="url(#nt-scarf)" ${LINE(0.7)}/>`).join('')}<path d="M110 44 C114 41 118 41 121 43 M108 50 C112 54 114 58 113 62" ${ST('--scarf-dk', 0.8)}/>`, `Marla the baker, ${mood}`);
}

/** Spot-the-herb card: an aged specimen sheet with the plant drawn finely. */
function sideView(/** @type {'chamomile' | 'mayweed'} */ kind) {
  const g = kind === 'chamomile' ? GEOM.chamomileSide : GEOM.mayweedSide;
  const centre = kind === 'chamomile' ? /** @type {any} */ (g).dome : /** @type {any} */ (g).disc;
  const florets = kind === 'chamomile'
    ? Array.from({ length: 16 }, (_, i) => `<circle cx="${41 + (i % 4) * 6 + (Math.floor(i / 4) % 2) * 3}" cy="${42 - Math.floor(i / 4) * 4}" r=".9"/>`).join('')
    : Array.from({ length: 8 }, (_, i) => `<circle cx="${39 + i * 3.2}" cy="${41.6}" r=".8"/>`).join('');
  return svg('0 0 100 100', `<rect width="100" height="100" rx="6" ${F('--plate')}/><rect width="100" height="100" rx="6" fill="#000" filter="url(#nt-paper)"/>
    <rect x="3" y="3" width="94" height="94" rx="4" fill="none" ${LINE(0.5)} opacity=".5"/>
    <path d="${GEOM.sideStem}" ${ST('--leaf-dk', 2)}/>
    ${[[50, 84, 205, 18], [50, 84, -25, 18], [50, 71, 210, 14], [50, 71, -30, 14]].map(([x, y, a, l]) => frond(x, y, a, l, 5)).join('')}
    <path d="${g.petals}" ${ST('--petal-sh', 4.6)}/><path d="${g.petals}" ${ST('--petal', 3.4)}/>
    <path d="${centre}" fill="url(#nt-yolk)" ${LINE(0.6)}/><g ${F('--yolk-dk')} opacity=".6">${florets}</g>
    <circle cx="50" cy="${kind === 'chamomile' ? 36 : 40}" r="17" ${ST('--highlight', 1.8)} stroke-dasharray="4 3"/>`, kind === 'chamomile' ? 'Chamomile: domed centre' : 'Mayweed: flat centre');
}

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'trait:heat': () => badge('<path d="M24 5 L44 41 H4 Z"/>', 'M24 18c4 5 6 8 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3-1-3 0-5 0-8z', '--heat', 'Heat'),
  'trait:calm': () => badge('<circle cx="24" cy="24" r="19"/>', 'M24 12c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z', '--calm', 'Calm'),
  'trait:vigor': () => badge('<rect x="6" y="6" width="36" height="36" rx="4"/>', 'M14 34c0-12 8-20 22-20 0 14-8 22-20 22z', '--vigor', 'Vigor'),
  'trait:clarity': () => badge('<path d="M24 3 L45 24 L24 45 L3 24 Z"/>', 'M24 13l2.8 7.7 8.2.3-6.4 5 2.3 7.9L24 29.3l-6.9 4.6 2.3-7.9-6.4-5 8.2-.3z', '--clarity', 'Clarity'),

  'ingredient:chamomile': () => svg('0 0 100 100', `${cast(52, 93, 26)}
    <g ${ST('--leaf-dk', 1.6)}><path d="M50 91 C48 74 44 58 38 44"/><path d="M50 91 C54 75 62 64 70 56"/><path d="M50 91 C46 79 35 71 25 67"/></g>
    ${frond(45, 74, 200, 16)}${frond(47, 70, -40, 15)}${frond(42, 60, 215, 12)}${frond(57, 70, -10, 13)}${frond(38, 74, 160, 11)}
    <path d="M42 81.5 Q50 86 58 81.5" ${ST('--twine', 3.2)}/><path d="M42 81.5 Q50 86 58 81.5" fill="none" ${LINE(0.4)}/><path d="M50 84 l-6 8 M50 84 l5 8" ${ST('--twine', 1.6)}/>
    ${flower(70, 54, 13, 15, 10)}${flower(25, 66, 8.5, 13)}${flower(38, 39, 19, 17, 4)}`, 'Chamomile'),

  'ingredient:fireroot': () => svg('0 0 100 100', `${cast(54, 77, 36)}
    ${[GEOM.fireroot[1], GEOM.fireroot[2]].map(d => `<path d="${d}" style="stroke:var(--ink-line)" stroke-width="9.4" fill="none" stroke-linecap="round" opacity=".6"/><path d="${d}" style="stroke:var(--root)" stroke-width="8" fill="none" stroke-linecap="round"/>`).join('')}
    <path d="${GEOM.fireroot[0]}" fill="url(#nt-root)"/><path d="${GEOM.fireroot[0]}" fill="#000" filter="url(#nt-mottle)" opacity=".6"/>
    <g clip-path="url(#nt-root)" ${ST('--root-dk', 0.8)}><path d="M28 48 C26 56 27 64 31 70 M40 46 C37 56 38 66 42 73 M56 42 C53 52 54 62 58 70 M68 42 C66 50 66 60 70 70"/></g>
    <path d="${GEOM.fireroot[0]}" fill="none" ${LINE(0.8)}/>
    <path d="M26 53 C30 46 40 44 46 48 M58 41 C62 38 67 38 70 41" ${ST('--root-hi', 1.6)} opacity=".9"/>
    <path d="M30 70 c-2 3 -1 6 -4 9 M44 72 c1 3 -1 6 0 9 M66 71 c2 3 1 5 3 8 M54 70 c-1 2 0 4 -2 6" ${ST('--root-dk', 0.8)}/>
    <circle cx="82" cy="58" r="18" fill="url(#nt-ember)" opacity=".8"/>
    <ellipse cx="83" cy="58" rx="5" ry="8" ${F('--ember')}/><g ${ST('--ember-hi', 0.7)}><path d="M83 58 l-3 -5 M83 58 l3 -5 M83 58 l-3.5 4 M83 58 l3.5 4 M83 58 V50 M83 58 V66"/></g>
    <path d="M36 62 l5 -2 l3 3 l6 -2" ${ST('--ember', 1.2)} opacity=".85"/>`, 'Fireroot'),

  'ingredient:rosehip': () => svg('0 0 100 100', `${cast(52, 89, 28)}
    <path d="M14 22 C34 26 48 36 57 48 M30 26 C38 36 40 46 38 54" ${ST('--twig', 2.2)}/><path d="M14 22 C34 26 48 36 57 48" fill="none" ${LINE(0.4)} opacity=".6"/>
    <g ${F('--twig')}><path d="M24 23 l-1 -4 l3 3 Z"/><path d="M40 30 l1 -4 l2 4 Z"/><path d="M36 43 l-4 0 l3 2 Z"/></g>
    ${/** @type {[number, number, number, number][]} */ ([[34, 18, -40, 16], [22, 22, -150, 13]]).map(([x, y, r, l]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 C${l * 0.3} ${-l * 0.32} ${l * 0.75} ${-l * 0.3} ${l} 0 C${l * 0.75} ${l * 0.3} ${l * 0.3} ${l * 0.32} 0 0 Z" fill="url(#nt-leaf)" ${LINE(0.5)}/>
      <path d="M0 0 H${l * 0.92} ${Array.from({ length: 3 }, (_, i) => `M${l * (0.25 + i * 0.22)} 0 l${l * 0.12} ${-l * 0.14} M${l * (0.25 + i * 0.22)} 0 l${l * 0.12} ${l * 0.14}`).join(' ')}" ${ST('--vein', 0.5)}/></g>`).join('')}
    ${/** @type {[number, number, number][]} */ ([[64, 60, -30], [36, 68, 10]]).map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">
      <ellipse rx="12" ry="15" fill="url(#nt-berry)" ${LINE(0.6)}/><ellipse rx="12" ry="15" fill="#000" filter="url(#nt-mottle)" opacity=".3"/>
      <ellipse cx="-4.5" cy="-6" rx="2.4" ry="4.2" ${F('--gem-hi')} opacity=".75" filter="url(#nt-soft)"/><circle cx="-4" cy="-8" r="1.1" ${F('--gem-hi')}/>
      <g ${F('--berry-dk')} opacity=".5"><circle cx="4" cy="2" r=".6"/><circle cx="2" cy="7" r=".5"/><circle cx="6" cy="-4" r=".5"/></g>
      <path d="M0 14 c-2 3 -5 4 -7 8 M0 14 c2 3 5 4 7 8 M0 14 c-1 3 0 6 -1 9 M0 14 c-3 1 -6 1 -9 3 M0 14 c3 1 6 1 9 3" ${ST('--sepal', 1)}/></g>`).join('')}`, 'Rosehip'),

  'plant:chamomile': () => sideView('chamomile'),
  'plant:mayweed': () => sideView('mayweed'),

  'prop:cauldron': (o = {}) => cauldron({
    boil: o.boil, label: 'Cauldron, naturalist', liquid: o.liquid || 'var(--calm)',
    before: `<ellipse cx="100" cy="166" rx="84" ry="50" fill="url(#nt-glow)" opacity=".75"/><ellipse cx="94" cy="178" rx="66" ry="7" style="fill:var(--shadow)" opacity=".6" filter="url(#nt-blur)"/>`,
    body: 'fill="url(#nt-iron)" style="stroke:var(--ink-line)" stroke-width="1"', rim: 'fill="url(#nt-iron)" style="stroke:var(--ink-line)" stroke-width="1"',
    bodyExtra: `<path d="${GEOM.pot.body}" fill="#000" filter="url(#nt-mottle)" opacity=".55"/><path d="M146 104 C146 134 132 154 108 162" fill="none" style="stroke:var(--ember)" stroke-width="3" stroke-linecap="round" opacity=".45"/>
      <path d="M58 100 C56 118 62 134 74 146" fill="none" style="stroke:var(--iron-hi)" stroke-width="2.5" stroke-linecap="round" opacity=".5"/><path d="M40 98 C70 110 130 110 160 98" fill="none" style="stroke:var(--iron-dk)" stroke-width="3" opacity=".7"/>`,
    legs: 'style="stroke:var(--iron-dk)" stroke-width="8"', handles: 'style="stroke:var(--iron)" stroke-width="5"',
    flames: ['var(--ember)', 'var(--ember-hi)'], steam: 'var(--steam)', bubble: 'var(--steam)', splash: 'var(--steam)',
    after: `<ellipse cx="100" cy="91" rx="65" ry="12.5" fill="none" style="stroke:var(--iron-hi)" stroke-width="1" opacity=".7"/>`,
  }),

  'portrait:marla': portrait,
  'scene:shop': (o = {}) => (o.layer === 'front' ? sceneFront() : sceneBack()),

  'ui:coin': () => svg('0 0 24 24', `<circle cx="12" cy="12" r="10.5" fill="url(#nt-coin)" style="stroke:var(--coin-dk)" stroke-width=".8"/><circle cx="12" cy="12" r="8" fill="none" style="stroke:var(--coin-dk)" stroke-width=".6" stroke-dasharray="1 1.2"/>
    <path d="M12 6.8 C14.6 9 14.6 14 12 17.2 C9.4 14 9.4 9 12 6.8 Z M12 7.5 V16.5" fill="none" style="stroke:var(--coin-dk)" stroke-width=".9"/>`, 'Coin'),
  'ui:texture': () => svg('0 0 100 100', `<rect width="100" height="50" fill="url(#nt-wall)"/><rect width="100" height="50" fill="#000" filter="url(#nt-plaster)"/>
    <rect y="50" width="100" height="50" fill="url(#nt-wood)"/><rect y="50" width="100" height="50" fill="#000" filter="url(#nt-grain)"/>`, 'Plaster and wood grain'),
};
export const scope = Object.keys(ASSETS);
