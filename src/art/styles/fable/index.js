// Exploration pack (round 2): Modern Fable. Crisp flat vector with depth: every form is a lit plane plus a
// shadow plane (light from the window, upper right), banded atmospheric skies, long soft shadows. No outlines, no texture.
import { GEOM, FACE, SCENE, cauldron } from '../../geom.js';

export const id = 'fable';
export const label = 'Modern Fable';
export const exploration = true;
export const round = 2;
export const css = new URL('./style.css', import.meta.url).href;
export const brief = {
  adjectives: ['crisp', 'atmospheric', 'serene'],
  inspiration: "Alto's Odyssey, Monument Valley, Florence: geometric flat illustration where light is drawn as planes",
  technique: 'Flat fills only; each form = lit plane + shadow plane (clipped), banded skies, layered hills for depth, translucent long shadows. Cheapest to produce and scales cleanly to 40px.',
};

/** @param {string} gid @param {[number, string, number?][]} stops */
const lin = (gid, stops, x2 = 0, y2 = 1) => `<linearGradient id="${gid}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, v, op]) =>
  `<stop offset="${o}" style="stop-color:var(${v})${op == null ? '' : `;stop-opacity:${op}`}"/>`).join('')}</linearGradient>`;
const [hx, hy, hrx, hry] = FACE.head;
const SHAPES = {
  heat: '<path d="M24 5 L44 41 H4 Z"/>', calm: '<circle cx="24" cy="24" r="19"/>',
  vigor: '<rect x="6" y="6" width="36" height="36" rx="3"/>', clarity: '<path d="M24 3 L45 24 L24 45 L3 24 Z"/>',
};

/** One defs block for the whole pack; the page injects it once. Clip paths make the shadow planes. */
export const defs = `<defs>
  ${lin('mf-sky', [[0, '--sky-top'], [0.42, '--sky-top'], [0.42, '--sky-mid'], [0.72, '--sky-mid'], [0.72, '--sky-bot'], [1, '--sky-bot']])}
  ${lin('mf-wall', [[0, '--wall'], [1, '--wall-dk']])}
  ${lin('mf-beam', [[0, '--glow', 0.5], [1, '--glow', 0]])}
  <clipPath id="mf-head"><ellipse cx="${hx}" cy="${hy}" rx="${hrx}" ry="${hry}"/></clipPath>
  <clipPath id="mf-body"><path d="${FACE.body}"/></clipPath>
  <clipPath id="mf-scarf"><path d="${FACE.scarf}"/></clipPath>
  <clipPath id="mf-root"><path d="${GEOM.fireroot[0]}"/></clipPath>
  <clipPath id="mf-pot"><path d="${GEOM.pot.body}"/></clipPath>
  <clipPath id="mf-hip"><ellipse rx="12" ry="15"/></clipPath>
  <clipPath id="mf-coin"><circle cx="12" cy="12" r="10.5"/></clipPath>
  ${Object.entries(SHAPES).map(([k, s]) => `<clipPath id="mf-tr-${k}">${s}</clipPath>`).join('')}
</defs>`;

const svg = (/** @type {string} */ vb, /** @type {string} */ inner, /** @type {string} */ name) =>
  `<svg viewBox="${vb}" role="img" aria-label="${name}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const F = (/** @type {string} */ v) => `style="fill:var(${v})"`;
const ST = (/** @type {string} */ v, /** @type {number} */ w) => `fill="none" style="stroke:var(${v})" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
/** Long shadow falling left from a footprint (x1..x2 at y). */
const longShadow = (/** @type {number} */ x1, /** @type {number} */ x2, /** @type {number} */ y, len = 26) =>
  `<path d="M${x1} ${y} H${x2} L${x2 - len} ${y + 7} H${x1 - len} Z" ${F('--shadow')} opacity=".22"/>`;

/** A lens petal from the origin out to length L. */
const lens = (/** @type {number} */ L, /** @type {number} */ w) => `M0 0 Q${w} ${-L / 2} 0 ${-L} Q${-w} ${-L / 2} 0 0 Z`;
/** Flat flower: petals in two tones (shadow side lower-left), centre as a lit half + shadow half. */
function daisy(/** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ r, n = 14, tilt = 0) {
  const p = Array.from({ length: n }, (_, i) => {
    const a = ((360 / n) * i + tilt) % 360;
    return `<path d="${lens(r, r * 0.22)}" transform="rotate(${a.toFixed(1)})" ${F(a > 165 && a < 290 ? '--petal-sh' : '--petal')}/>`;
  }).join('');
  const c = r * 0.36;
  return `<g transform="translate(${cx} ${cy})">${p}<circle r="${c}" ${F('--yolk')}/>
    <path d="M${-c * 0.7} ${c * 0.7} A${c} ${c} 0 0 1 ${c * 0.7} ${-c * 0.7} A${c} ${c} 0 0 0 ${-c * 0.7} ${c * 0.7} Z" ${F('--yolk-dk')}/><circle cx="${c * 0.3}" cy="${-c * 0.3}" r="${c * 0.28}" ${F('--yolk-hi')}/></g>`;
}

/** Trait badge: flat colour with a crisp shadow plane, dark glyph. */
function badge(/** @type {'heat' | 'calm' | 'vigor' | 'clarity'} */ k, /** @type {string} */ glyph, /** @type {string} */ name) {
  return svg('0 0 48 48', `${SHAPES[k].replace('/>', ` style="fill:var(--${k})"/>`)}
    <path d="M0 48 L48 0 V48 Z" ${F('--on-trait')} opacity=".16" clip-path="url(#mf-tr-${k})"/><path d="${glyph}" ${F('--on-trait')}/>`, name);
}

function jar(/** @type {[number, number, number, number, string, string]} */ [x, base, w, h, kind, tok]) {
  const half = (/** @type {number} */ y0, /** @type {number} */ hh) => `<rect x="${x}" y="${y0}" width="${w * 0.38}" height="${hh}" ${F('--shadow')} opacity=".18"/>`;
  if (kind === 'bottle') return `<rect x="${x}" y="${base - h * 0.62}" width="${w}" height="${h * 0.62}" ${F(tok)}/><rect x="${x + w * 0.3}" y="${base - h + 4}" width="${w * 0.4}" height="${h * 0.4}" ${F(tok)}/>
    ${half(base - h * 0.62, h * 0.62)}<rect x="${x + w * 0.27}" y="${base - h}" width="${w * 0.46}" height="5" ${F('--wood-hi')}/><rect x="${x + w - 4}" y="${base - h * 0.55}" width="2" height="${h * 0.4}" ${F('--gem-hi')} opacity=".5"/>`;
  if (kind === 'round') return `<rect x="${x + w * 0.35}" y="${base - h}" width="${w * 0.3}" height="${h - w + 3}" ${F(tok)}/><circle cx="${x + w / 2}" cy="${base - w / 2}" r="${w / 2}" ${F(tok)}/>
    <path d="M${x + w / 2} ${base - w} A${w / 2} ${w / 2} 0 0 0 ${x + w / 2} ${base} Z" ${F('--shadow')} opacity=".18"/>`;
  return `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" ${F('--glass')} opacity=".35"/><rect x="${x + 2}" y="${base - h * 0.72}" width="${w - 4}" height="${h * 0.72 - 2}" ${F(tok)}/>
    ${half(base - h, h)}<rect x="${x - 1}" y="${base - h - 4}" width="${w + 2}" height="5" ${F('--wood-dk')}/><rect x="${x + 4}" y="${base - h * 0.52}" width="${w - 8}" height="${h * 0.22}" ${F('--apron')}/>`;
}

function sceneBack() {
  const [ox, oy, or] = SCENE.orb;
  const [lx, ly] = SCENE.lantern;
  return svg('0 0 360 250', `<rect width="360" height="250" fill="url(#mf-wall)"/>
    <path d="M236 150 L176 250 H300 L320 150 Z" fill="url(#mf-beam)" style="opacity:var(--beam-o)"/>
    <path d="${SCENE.window}" fill="url(#mf-sky)"/>
    <g style="fill:var(--star);opacity:var(--star-o)">${SCENE.stars.map(([x, y, r]) => `<rect x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" transform="rotate(45 ${x} ${y})"/>`).join('')}</g>
    <circle cx="${ox}" cy="${oy}" r="${or * 1.9}" style="fill:var(--orb);opacity:.16"/><circle cx="${ox}" cy="${oy}" r="${or}" ${F('--orb')}/>
    <path d="M236 116 L256 100 L272 112 L292 92 L320 114 V150 H236 Z" ${F('--hill-far')}/>
    <path d="${SCENE.hills}" ${F('--hill')}/><path d="M236 138 L262 128 L290 138 L320 130 V150 H236 Z" ${F('--hill-dk')}/>
    <path d="${SCENE.mullions}" ${ST('--wood-dk', 4)} stroke-linecap="butt"/><path d="${SCENE.window}" ${ST('--wood-dk', 7)}/>
    <rect x="228" y="147" width="100" height="5" ${F('--wood-hi')}/><rect x="228" y="152" width="100" height="5" ${F('--wood-dk')}/>
    <path d="M307 134 L296 112 M307 134 L320 110 M307 134 L308 102" ${ST('--leaf-dk', 2.2)}/>
    <g transform="translate(296 112)"><path d="${lens(12, 4)}" transform="rotate(-60)" ${F('--leaf')}/></g>
    <g transform="translate(320 110)"><path d="${lens(12, 4)}" transform="rotate(50)" ${F('--leaf-dk')}/></g>
    <g transform="translate(308 104)"><path d="${lens(12, 4)}" ${F('--leaf')}/></g>
    <path d="M297 147 L300 134 H314 L317 147 Z" ${F('--clay')}/><path d="M297 147 L300 134 H305 L304 147 Z" ${F('--clay-dk')}/>
    ${SCENE.shelves.map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="3" ${F('--wood-hi')}/><rect x="${x}" y="${y + 3}" width="${w}" height="5" ${F('--wood-dk')}/>
      <path d="M${x} ${y + 8} H${x + w} L${x + w - 14} ${y + 16} H${x - 14} Z" ${F('--shadow')} opacity=".14"/>`).join('')}
    ${SCENE.jars.map(jar).join('')}
    <circle cx="${lx}" cy="${ly}" r="64" style="fill:var(--glow);opacity:calc(var(--glow-o) * .35)"/><circle cx="${lx}" cy="${ly}" r="38" style="fill:var(--glow);opacity:calc(var(--glow-o) * .45)"/>
    <rect width="360" height="10" ${F('--wood-hi')}/><rect y="10" width="360" height="5" ${F('--wood-dk')}/>
    ${SCENE.bundles.map(([x, len]) => `<path d="M${x} 15 V${14 + len}" ${ST('--twine', 1.4)}/>
      <path d="M${x - 8} ${14 + len} L${x} ${len + 54} L${x + 8} ${14 + len} Z" ${F('--leaf')}/><path d="M${x - 8} ${14 + len} L${x} ${len + 54} L${x} ${14 + len} Z" ${F('--leaf-dk')}/>
      <rect x="${x - 8}" y="${12 + len}" width="16" height="4" ${F('--twine')}/><g ${F('--bloom')}><rect x="${x + 1}" y="${len + 30}" width="3" height="3"/><rect x="${x - 4}" y="${len + 38}" width="3" height="3"/></g>`).join('')}
    <path d="M${lx} 15 V${ly - 18}" ${ST('--iron-dk', 1.6)}/>
    <path d="M${lx - 11} ${ly - 13} H${lx + 11} L${lx + 6} ${ly - 19} H${lx - 6} Z" ${F('--iron')}/>
    <rect x="${lx - 9}" y="${ly - 13}" width="18" height="25" ${F('--glow')}/><rect x="${lx - 9}" y="${ly - 13}" width="7" height="25" ${F('--ember')} opacity=".35"/>
    <path d="M${lx} ${ly + 6} L${lx - 4} ${ly - 1} L${lx} ${ly - 9} L${lx + 4} ${ly - 1} Z" ${F('--ember-hi')}/>
    <rect x="${lx - 11}" y="${ly + 11}" width="22" height="4" ${F('--iron')}/>`, 'The shop at dusk');
}

function sceneFront() {
  const top = SCENE.counterTop;
  return svg('0 0 360 250', `${longShadow(290, 322, top, 30)}${longShadow(25, 43, top, 22)}
    <rect y="${top}" width="360" height="5" ${F('--wood-hi')}/><rect y="${top + 5}" width="360" height="7" ${F('--wood')}/><rect y="${top + 12}" width="360" height="${250 - top - 12}" ${F('--wood-dk')}/>
    <path d="M0 ${top + 12} H360 V${top + 20} H0 Z" ${F('--shadow')} opacity=".25"/>
    <path d="M14 ${top + 24} H112 V250 H14 Z M128 ${top + 24} H232 V250 H128 Z M248 ${top + 24} H346 V250 H248 Z" ${F('--wood')} opacity=".45"/>
    <path d="M290 ${top - 16} H322 L316 ${top} H296 Z" ${F('--stone')}/><path d="M290 ${top - 16} H303 L301 ${top} H296 Z" ${F('--stone-dk')}/><rect x="289" y="${top - 19}" width="34" height="4" ${F('--stone-dk')}/>
    <path d="M311 ${top - 14} L326 ${top - 34}" ${ST('--wood-hi', 5)} stroke-linecap="butt"/>
    <path d="M25 ${top} V${top - 18} L31 ${top - 28} V${top - 35} H37 V${top - 28} L43 ${top - 18} V${top} Z" ${F('--berry')}/><path d="M25 ${top} V${top - 18} L31 ${top - 28} V${top} Z" ${F('--berry-dk')}/>
    <rect x="30" y="${top - 40}" width="8" height="6" ${F('--wood-hi')}/><rect x="28" y="${top - 15}" width="12" height="8" ${F('--apron')}/>`, 'The counter');
}

function portrait(/** @type {{ mood?: 'tired' | 'happy', bare?: boolean }} */ o = {}) {
  const mood = o.mood || 'tired';
  const eyes = FACE.eyes.map(([x, y]) => mood === 'happy'
    ? `<path d="M${x - 5} ${y + 1} Q${x} ${y - 5} ${x + 5} ${y + 1}" ${ST('--eye', 2.6)}/>`
    : `<path d="M${x - 4.5} ${y - 0.5} A4.5 4.5 0 0 0 ${x + 4.5} ${y - 0.5} Z" ${F('--eye')}/><path d="M${x - 6} ${y - 0.5} H${x + 6}" ${ST('--eye', 2)}/>
       <path d="M${x - 4} ${y + 7} H${x + 4}" ${ST('--skin-sh', 1.4)}/>`).join('');
  const mouth = mood === 'happy' ? `<path d="M71 101 Q80 112 89 101 Z" ${F('--mouth')}/>` : `<path d="M74 105 H86" ${ST('--mouth', 2.4)}/>`;
  return svg('0 0 160 160', `${o.bare ? '' : `<rect width="160" height="160" rx="14" fill="url(#mf-wall)"/><circle cx="130" cy="36" r="46" ${F('--glow')} opacity=".18"/>`}
    <path d="${FACE.body}" ${F('--dress')}/><path d="M0 100 L60 100 C56 126 60 146 74 160 H0 Z" ${F('--dress-dk')} clip-path="url(#mf-body)"/>
    <path d="${FACE.bib}" ${F('--apron')}/><path d="M61 160 L64 131 H72 L70 160 Z" ${F('--apron-sh')}/><path d="${FACE.straps}" ${ST('--apron', 6)} stroke-linecap="butt"/>
    <rect x="73" y="140" width="4" height="4" transform="rotate(45 75 142)" ${F('--flour')} opacity=".7"/><rect x="83" y="146" width="3" height="3" transform="rotate(45 84.5 147.5)" ${F('--flour')} opacity=".7"/>
    <path d="${FACE.neck}" ${F('--skin-sh')}/><path d="${FACE.hairL}" ${F('--hair')}/><path d="${FACE.hairR}" ${F('--hair')}/>
    <ellipse cx="${hx}" cy="${hy}" rx="${hrx}" ry="${hry}" ${F('--skin')}/>
    <path d="M40 40 H66 C58 62 58 94 70 116 H40 Z" ${F('--skin-sh')} opacity=".55" clip-path="url(#mf-head)"/>
    <g ${F('--cheek')} opacity=".55">${FACE.cheeks.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g>
    <path d="M80 85 L76 95 H83" ${ST('--skin-sh', 1.8)}/>${mouth}${eyes}
    <g ${ST('--hair', 2.8)} stroke-linecap="butt">${FACE.brows[mood].map(d => `<path d="${d}"/>`).join('')}</g>
    <rect x="${FACE.smudge[0] - 4}" y="${FACE.smudge[1] - 1.5}" width="8" height="3" rx="1.5" transform="rotate(-20 ${FACE.smudge[0]} ${FACE.smudge[1]})" ${F('--flour')} opacity=".8"/>
    <path d="${FACE.scarf}" ${F('--scarf')}/><path d="M40 30 H72 C60 40 54 56 54 80 H40 Z" ${F('--scarf-dk')} clip-path="url(#mf-scarf)"/>
    <g ${F('--scarf-dot')}>${[[62, 46], [76, 40], [90, 40], [102, 48], [107, 60], [70, 52], [88, 50]].map(([x, y]) => `<rect x="${x - 1.4}" y="${y - 1.4}" width="2.8" height="2.8" transform="rotate(45 ${x} ${y})"/>`).join('')}</g>
    <path d="${FACE.knot[0]}" ${F('--scarf')}/><path d="${FACE.knot[1]}" ${F('--scarf-dk')}/>`, `Marla the baker, ${mood}`);
}

function sideView(/** @type {'chamomile' | 'mayweed'} */ kind) {
  const g = kind === 'chamomile' ? GEOM.chamomileSide : GEOM.mayweedSide;
  const centre = kind === 'chamomile' ? /** @type {any} */ (g).dome : /** @type {any} */ (g).disc;
  return svg('0 0 100 100', `<rect width="100" height="100" rx="8" ${F('--plate')}/><path d="M0 74 L30 66 L60 72 L100 62 V100 H0 Z" ${F('--plate-dk')}/>
    <path d="${GEOM.sideStem}" ${ST('--leaf-dk', 2.8)} stroke-linecap="butt"/><path d="${GEOM.sideLeaves}" ${ST('--leaf', 2.4)}/>
    <path d="${g.petals}" ${ST('--petal', 4)}/><path d="${centre}" ${F('--yolk')}/>
    <path d="${kind === 'chamomile' ? 'M39 45 C39 31 44 28.5 50 28.5 V45 Z' : 'M37 41 Q43.5 39 50 38.8 V45 H37 Z'}" ${F('--yolk-dk')}/>
    <circle cx="50" cy="${kind === 'chamomile' ? 36 : 40}" r="17" ${ST('--highlight', 1.8)} stroke-dasharray="4 3"/>`, kind === 'chamomile' ? 'Chamomile: domed centre' : 'Mayweed: flat centre');
}

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'trait:heat': () => badge('heat', 'M24 18c4 5 6 8 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3-1-3 0-5 0-8z', 'Heat'),
  'trait:calm': () => badge('calm', 'M24 12c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z', 'Calm'),
  'trait:vigor': () => badge('vigor', 'M14 34c0-12 8-20 22-20 0 14-8 22-20 22z', 'Vigor'),
  'trait:clarity': () => badge('clarity', 'M24 13l2.8 7.7 8.2.3-6.4 5 2.3 7.9L24 29.3l-6.9 4.6 2.3-7.9-6.4-5 8.2-.3z', 'Clarity'),

  'ingredient:chamomile': () => svg('0 0 100 100', `${longShadow(38, 62, 90, 20)}
    <path d="M50 90 L38 42 M50 90 L71 54 M50 90 L24 66" ${ST('--leaf-dk', 2.4)} stroke-linecap="butt"/>
    ${/** @type {[number, number, number][]} */ ([[44, 66, -70], [46, 70, 40], [43, 58, -65], [57, 70, 75], [60, 64, 30], [38, 72, -100]]).map(([x, y, r]) => `<path d="${lens(9, 2.6)}" transform="translate(${x} ${y}) rotate(${r})" ${F('--leaf')}/>`).join('')}
    <rect x="41" y="80" width="18" height="5" ${F('--twine')}/><path d="M50 85 L45 93 M50 85 L55 93" ${ST('--twine', 2)} stroke-linecap="butt"/>
    ${daisy(71, 52, 13, 12, 10)}${daisy(24, 64, 9, 10)}${daisy(38, 38, 19, 14, 4)}`, 'Chamomile'),

  'ingredient:fireroot': () => svg('0 0 100 100', `${longShadow(22, 84, 72, 18)}
    ${[GEOM.fireroot[1], GEOM.fireroot[2]].map(d => `<path d="${d}" ${ST('--root', 8)}/>`).join('')}
    <path d="${GEOM.fireroot[0]}" ${F('--root')}/>
    <path d="M10 60 L90 56 V80 H10 Z" ${F('--root-dk')} clip-path="url(#mf-root)"/><path d="M20 40 L76 34 L80 46 L26 52 Z" ${F('--root-hi')} clip-path="url(#mf-root)"/>
    <path d="M34 62 L40 59 L44 63 L51 61 M60 58 L65 61 L71 59" ${ST('--ember', 2)} stroke-linecap="butt"/>
    <circle cx="82" cy="58" r="13" ${F('--ember')} opacity=".22"/><path d="M82 50 L87 58 L82 66 L78 58 Z" ${F('--ember-hi')}/>`, 'Fireroot'),

  'ingredient:rosehip': () => svg('0 0 100 100', `${longShadow(28, 76, 88, 18)}
    <path d="M14 22 C34 26 48 36 57 48 M30 26 C38 36 40 46 38 54" ${ST('--twig', 2.6)}/>
    <g transform="translate(36 19) rotate(-50)"><path d="${lens(16, 6)}" ${F('--leaf')}/></g><g transform="translate(22 23) rotate(-140)"><path d="${lens(14, 5)}" ${F('--leaf-dk')}/></g>
    ${/** @type {[number, number, number][]} */ ([[64, 60, -30], [36, 68, 10]]).map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">
      <ellipse rx="12" ry="15" ${F('--berry')}/><path d="M-14 -16 C-2 -6 -2 6 -8 18 H-14 Z" ${F('--berry-dk')} clip-path="url(#mf-hip)"/>
      <path d="M4 -10 Q8 -4 8 2" ${ST('--berry-hi', 2.2)}/><path d="M0 14 L-5 21 M0 14 L5 21 M0 14 V22" ${ST('--leaf-dk', 1.8)} stroke-linecap="butt"/></g>`).join('')}`, 'Rosehip'),

  'plant:chamomile': () => sideView('chamomile'),
  'plant:mayweed': () => sideView('mayweed'),

  'prop:cauldron': (o = {}) => cauldron({
    boil: o.boil, label: 'Cauldron, modern fable', liquid: o.liquid || 'var(--calm)',
    before: `<path d="M50 166 H150 L118 188 H18 Z" style="fill:var(--shadow)" opacity=".2"/>`,
    body: 'style="fill:var(--iron)"', rim: 'style="fill:var(--iron-hi)"',
    bodyExtra: `<path d="M20 80 H86 C68 110 70 140 92 172 H20 Z" style="fill:var(--iron-dk)" clip-path="url(#mf-pot)"/><path d="M136 108 L142 112 C138 134 128 148 114 156 L110 150 C122 142 132 128 136 108 Z" style="fill:var(--iron-hi)" opacity=".7"/>`,
    legs: 'style="stroke:var(--iron-dk)" stroke-width="8"', handles: 'style="stroke:var(--iron-hi)" stroke-width="5"',
    flames: ['var(--ember)', 'var(--glow)'], steam: 'var(--steam)', bubble: 'var(--steam)', splash: 'var(--steam)',
  }).replace(/stroke-linecap="round"/g, 'stroke-linecap="butt"'),

  'portrait:marla': portrait,
  'scene:shop': (o = {}) => (o.layer === 'front' ? sceneFront() : sceneBack()),

  'ui:coin': () => svg('0 0 24 24', `<circle cx="12" cy="12" r="10.5" ${F('--coin')}/><path d="M0 24 L24 0 V24 Z" ${F('--coin-dk')} opacity=".5" clip-path="url(#mf-coin)"/>
    <path d="M12 6 L15 12 L12 18 L9 12 Z" ${F('--coin-hi')}/>`, 'Coin'),
  'ui:texture': () => svg('0 0 100 100', `<rect width="100" height="100" rx="10" fill="url(#mf-sky)"/><path d="M0 70 L22 58 L44 66 L70 52 L100 64 V100 H0 Z" ${F('--hill')}/>
    <path d="M0 84 L30 76 L64 84 L100 76 V100 H0 Z" ${F('--hill-dk')}/>`, 'Banded sky and layered hills'),
};
export const scope = Object.keys(ASSETS);
