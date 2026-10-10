// Exploration pack (round 2): Lantern Storybook. A painted picture-book room lit by one lantern:
// layered gradient light, soft glows, rim light on the lantern side, rounded forms, natural colours.
import { GEOM, FACE, SCENE, cauldron } from '../../geom.js';

export const id = 'storybook';
export const label = 'Lantern Storybook';
export const exploration = true;
export const round = 2;
export const css = new URL('./style.css', import.meta.url).href;
export const brief = {
  adjectives: ['glowing', 'tender', 'enchanted'],
  inspiration: 'Painted picture books and Ghibli interiors; Spiritfarer and Cozy Grove. A dusk-blue room warmed by a single lantern',
  technique: 'Gradient fills lit from the lantern side, soft radial glows, rim light, rounded silhouettes, one shared paper grain. No outlines heavier than 1.5px.',
};

/** @param {string} gid @param {[number, string, number?][]} stops */
const lin = (gid, stops, x2 = 0, y2 = 1) => `<linearGradient id="${gid}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, v, op]) =>
  `<stop offset="${o}" style="stop-color:var(${v})${op == null ? '' : `;stop-opacity:${op}`}"/>`).join('')}</linearGradient>`;
/** @param {string} gid @param {[number, string, number?][]} stops */
const rad = (gid, stops, cx = 0.4, cy = 0.35, r = 0.75) => `<radialGradient id="${gid}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, v, op]) =>
  `<stop offset="${o}" style="stop-color:var(${v})${op == null ? '' : `;stop-opacity:${op}`}"/>`).join('')}</radialGradient>`;

/** One defs block for the whole pack; the page injects it once (no duplicate ids). */
export const defs = `<defs>
  ${lin('sb-sky', [[0, '--sky-top'], [1, '--sky-bot']])}
  ${lin('sb-wall', [[0, '--wall'], [1, '--wall-dk']])}
  ${lin('sb-wood', [[0, '--wood-hi'], [0.35, '--wood'], [1, '--wood-dk']])}
  ${rad('sb-iron', [[0, '--iron-hi'], [0.45, '--iron'], [1, '--iron-dk']], 0.35, 0.25, 0.85)}
  ${rad('sb-skin', [[0, '--skin-hi'], [0.6, '--skin'], [1, '--skin-sh']], 0.62, 0.42, 0.72)}
  ${lin('sb-petal', [[0, '--petal'], [1, '--petal-sh']])}
  ${rad('sb-yolk', [[0, '--yolk-hi'], [0.55, '--yolk'], [1, '--yolk-dk']], 0.4, 0.3, 0.7)}
  ${lin('sb-leaf', [[0, '--leaf-hi'], [1, '--leaf-dk']])}
  ${rad('sb-root', [[0, '--root-hi'], [0.55, '--root'], [1, '--root-dk']], 0.45, 0.25, 0.85)}
  ${rad('sb-ember', [[0, '--ember-hi'], [0.45, '--ember', 0.9], [1, '--ember', 0]], 0.5, 0.5, 0.5)}
  ${rad('sb-berry', [[0, '--berry-hi'], [0.5, '--berry'], [1, '--berry-dk']], 0.35, 0.3, 0.75)}
  ${rad('sb-coin', [[0, '--coin-hi'], [0.6, '--coin'], [1, '--coin-dk']], 0.38, 0.32, 0.75)}
  ${lin('sb-scarf', [[0, '--scarf'], [1, '--scarf-dk']])}
  ${lin('sb-dress', [[0, '--dress'], [1, '--dress-dk']])}
  ${rad('sb-glow', [[0, '--glow', 0.95], [0.35, '--glow', 0.4], [1, '--glow', 0]], 0.5, 0.5, 0.5)}
  ${rad('sb-vig', [[0.55, '--shadow', 0], [1, '--shadow', 0.55]], 0.5, 0.45, 0.75)}
  ${lin('sb-gem', [[0, '--gem-hi', 0.75], [0.55, '--gem-hi', 0]])}
  <filter id="sb-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>
  <filter id="sb-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 .45  0 0 0 0 .35  0 0 0 0 .3  0 0 0 .1 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
</defs>`;

const svg = (/** @type {string} */ vb, /** @type {string} */ inner, /** @type {string} */ name) =>
  `<svg viewBox="${vb}" role="img" aria-label="${name}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const F = (/** @type {string} */ v) => `style="fill:var(${v})"`;
const ST = (/** @type {string} */ v, /** @type {number} */ w) => `fill="none" style="stroke:var(${v})" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const shadow = (/** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.18}" ${F('--shadow')} opacity=".35"/>`;

/** Front-view flower head: shaded petals around a domed, lit centre. */
function daisy(/** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ r, n = 14, tilt = 0) {
  const p = Array.from({ length: n }, (_, i) => `<ellipse cy="${(-r * 0.6).toFixed(1)}" rx="${(r * 0.19).toFixed(1)}" ry="${(r * 0.42).toFixed(1)}" transform="rotate(${((360 / n) * i + tilt).toFixed(1)})"/>`).join('');
  return `<g transform="translate(${cx} ${cy})"><g fill="url(#sb-petal)" style="stroke:var(--petal-sh)" stroke-width=".5">${p}</g>
    <circle r="${r * 0.37}" fill="url(#sb-yolk)"/><circle cx="${-r * 0.1}" cy="${-r * 0.13}" r="${r * 0.12}" ${F('--yolk-hi')} opacity=".85"/></g>`;
}

/** Trait badge: a lit gem in the trait colour, white highlight, dark glyph. */
function badge(/** @type {string} */ shape, /** @type {string} */ glyph, /** @type {string} */ color, /** @type {string} */ name) {
  return svg('0 0 48 48', `${shape.replace('/>', ` style="fill:var(${color});stroke:var(--trait-rim)" stroke-width="2.5" stroke-linejoin="round"/>`)}
    ${shape.replace('/>', ' fill="url(#sb-gem)"/>')}<path d="${glyph}" ${F('--on-trait')}/>`, name);
}

function jar(/** @type {[number, number, number, number, string, string]} */ [x, base, w, h, kind, tok]) {
  const hi = `<rect x="${x + 2.5}" y="${base - h + 4}" width="2.5" height="${h - 9}" rx="1.2" ${F('--gem-hi')} opacity=".35"/>`;
  if (kind === 'bottle') return `<rect x="${x}" y="${base - h * 0.62}" width="${w}" height="${h * 0.62}" rx="4" ${F(tok)}/>
    <rect x="${x + w * 0.3}" y="${base - h + 4}" width="${w * 0.4}" height="${h * 0.4}" ${F(tok)}/><rect x="${x + w * 0.27}" y="${base - h}" width="${w * 0.46}" height="6" rx="2" ${F('--wood-hi')}/>${hi}`;
  if (kind === 'round') return `<circle cx="${x + w / 2}" cy="${base - w / 2}" r="${w / 2}" ${F(tok)}/><rect x="${x + w * 0.35}" y="${base - h}" width="${w * 0.3}" height="${h - w + 3}" ${F(tok)}/>
    <circle cx="${x + w * 0.35}" cy="${base - w * 0.65}" r="${w * 0.12}" ${F('--gem-hi')} opacity=".45"/>`;
  return `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" rx="5" ${F('--glass')} opacity=".4"/><rect x="${x + 2}" y="${base - h * 0.72}" width="${w - 4}" height="${h * 0.72 - 2}" rx="3.5" ${F(tok)}/>
    <rect x="${x - 1}" y="${base - h - 4}" width="${w + 2}" height="5.5" rx="2" ${F('--wood-dk')}/><rect x="${x + 3}" y="${base - h * 0.52}" width="${w - 6}" height="${h * 0.24}" rx="1" ${F('--apron')} opacity=".9"/>${hi}`;
}

function sceneBack() {
  const [ox, oy, or] = SCENE.orb;
  const [lx, ly] = SCENE.lantern;
  return svg('0 0 360 250', `<rect width="360" height="250" fill="url(#sb-wall)"/>
    <path d="M236 150 L196 250 H344 L320 150 Z" style="fill:var(--sky-bot);opacity:var(--beam-o)"/>
    <path d="${SCENE.window}" fill="url(#sb-sky)"/>
    <g style="fill:var(--star);opacity:var(--star-o)">${SCENE.stars.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
    <circle cx="${ox}" cy="${oy}" r="${or * 2.6}" style="fill:var(--orb);opacity:.18"/><circle cx="${ox}" cy="${oy}" r="${or}" ${F('--orb')}/>
    <path d="${SCENE.hills}" ${F('--hill')}/><path d="M236 138 Q266 126 296 136 Q310 132 320 134 V150 H236 Z" ${F('--hill-dk')}/>
    <path d="${SCENE.mullions}" ${ST('--wood-dk', 4)}/><path d="${SCENE.window}" ${ST('--wood-dk', 7)}/>
    <rect x="228" y="147" width="100" height="9" rx="3" fill="url(#sb-wood)"/>
    <g ${ST('--leaf-dk', 2.5)}><path d="M307 136 C300 124 294 118 288 114 M307 136 C310 122 316 116 322 112 M307 136 C306 124 307 114 309 106"/></g>
    <g fill="url(#sb-leaf)"><ellipse cx="289" cy="113" rx="6" ry="3.4" transform="rotate(30 289 113)"/><ellipse cx="321" cy="111" rx="6" ry="3.4" transform="rotate(-35 321 111)"/><ellipse cx="309" cy="104" rx="3.4" ry="6"/></g>
    <path d="M297 147 L300 134 H314 L317 147 Z" ${F('--clay')}/><rect x="298" y="133" width="18" height="4" rx="1.5" ${F('--clay-dk')}/>
    ${SCENE.shelves.map(([x, y, w]) => `<rect x="${x}" y="${y + 6}" width="${w}" height="5" ${F('--shadow')} opacity=".22"/><rect x="${x}" y="${y}" width="${w}" height="7" rx="2" fill="url(#sb-wood)"/>`).join('')}
    ${SCENE.jars.map(jar).join('')}
    <circle cx="${lx}" cy="${ly + 2}" r="96" fill="url(#sb-glow)" style="opacity:var(--glow-o)"/>
    <rect width="360" height="14" fill="url(#sb-wood)"/><path d="M0 14 H360" ${ST('--wood-dk', 2)}/>
    ${SCENE.bundles.map(([x, len]) => `<path d="M${x} 14 V${14 + len}" ${ST('--twine', 1.4)}/>
      <path d="M${x - 8} ${14 + len} C${x - 9} ${len + 34} ${x - 3} ${len + 46} ${x} ${len + 52} C${x + 3} ${len + 46} ${x + 9} ${len + 34} ${x + 8} ${14 + len} Z" fill="url(#sb-leaf)"/>
      <g ${F('--bloom')}><circle cx="${x - 3}" cy="${len + 40}" r="1.8"/><circle cx="${x + 3}" cy="${len + 34}" r="1.6"/><circle cx="${x}" cy="${len + 46}" r="1.5"/></g>
      <rect x="${x - 8}" y="${12 + len}" width="16" height="4.5" rx="2" ${F('--twine')}/>`).join('')}
    <path d="M${lx} 14 V${ly - 18}" ${ST('--iron-dk', 1.6)}/>
    <path d="M${lx - 11} ${ly - 13} H${lx + 11} L${lx + 7} ${ly - 19} H${lx - 7} Z" ${F('--iron')}/>
    <rect x="${lx - 9}" y="${ly - 13}" width="18" height="25" rx="4" ${F('--glow')}/>
    <path d="M${lx} ${ly + 6} C${lx - 5} ${ly + 1} ${lx - 3} ${ly - 5} ${lx} ${ly - 9} C${lx + 3} ${ly - 5} ${lx + 5} ${ly + 1} ${lx} ${ly + 6} Z" ${F('--ember-hi')}/>
    <path d="M${lx - 9} ${ly - 5} H${lx + 9} M${lx - 9} ${ly + 3} H${lx + 9} M${lx} ${ly - 13} V${ly + 12}" ${ST('--iron', 1.6)}/>
    <rect x="${lx - 11}" y="${ly + 11}" width="22" height="4.5" rx="2" ${F('--iron')}/>
    <rect width="360" height="250" fill="url(#sb-vig)" opacity=".8"/><rect width="360" height="250" fill="#000" filter="url(#sb-grain)"/>`, 'The shop at dusk');
}

function sceneFront() {
  const top = SCENE.counterTop;
  return svg('0 0 360 250', `<ellipse cx="200" cy="${top + 2}" rx="120" ry="10" fill="url(#sb-glow)" style="opacity:var(--glow-o)"/>
    <rect y="${top + 10}" width="360" height="${250 - top - 10}" ${F('--wood-dk')}/>
    <path d="M14 ${top + 18} H112 V244 H14 Z M128 ${top + 18} H232 V244 H128 Z M248 ${top + 18} H346 V244 H248 Z" ${ST('--wood', 2)} opacity=".8"/>
    <rect y="${top}" width="360" height="12" rx="3" fill="url(#sb-wood)"/><path d="M4 ${top + 1.5} H356" ${ST('--wood-hi', 1.5)} opacity=".9"/>
    ${shadow(306, top + 1, 20)}
    <path d="M290 ${top - 16} H322 C322 ${top - 5} 316 ${top} 306 ${top} C296 ${top} 290 ${top - 5} 290 ${top - 16} Z" ${F('--stone')}/><ellipse cx="306" cy="${top - 16}" rx="16" ry="3.5" ${F('--stone-dk')}/>
    <path d="M311 ${top - 14} L326 ${top - 34}" ${ST('--wood-hi', 5)}/>
    ${shadow(34, top + 1, 12)}
    <path d="M25 ${top} V${top - 18} C25 ${top - 23} 29 ${top - 25} 31 ${top - 29} V${top - 35} H37 V${top - 29} C39 ${top - 25} 43 ${top - 23} 43 ${top - 18} V${top} Z" fill="url(#sb-berry)"/>
    <rect x="30" y="${top - 40}" width="8" height="6" rx="2" ${F('--wood-hi')}/><rect x="28" y="${top - 16}" width="12" height="8" rx="1" ${F('--apron')} opacity=".9"/>`, 'The counter');
}

function portrait(/** @type {{ mood?: 'tired' | 'happy', bare?: boolean }} */ o = {}) {
  const mood = o.mood || 'tired';
  const [hx, hy, rx, ry] = FACE.head;
  const eyes = FACE.eyes.map(([x, y]) => mood === 'happy'
    ? `<path d="M${x - 5} ${y + 1} Q${x} ${y - 5} ${x + 5} ${y + 1}" ${ST('--eye', 2.4)}/>`
    : `<ellipse cx="${x}" cy="${y + 0.5}" rx="3.4" ry="3.8" ${F('--eye')}/><circle cx="${x + 1.2}" cy="${y - 0.2}" r="1" ${F('--gem-hi')}/>
       <path d="M${x - 6} ${y - 4.5} H${x + 6} V${y - 0.4} Q${x} ${y - 2.6} ${x - 6} ${y - 0.4} Z" ${F('--skin')}/>
       <path d="M${x - 6} ${y - 0.4} Q${x} ${y - 2.6} ${x + 6} ${y - 0.4}" ${ST('--line-art', 1.6)}/>
       <path d="M${x - 5} ${y + 6.5} Q${x} ${y + 9} ${x + 5} ${y + 6.5}" ${ST('--skin-sh', 1.3)}/>`).join('');
  const mouth = mood === 'happy' ? `<path d="${FACE.mouth.happy} Q80 104.5 70.5 101.5 Z" ${F('--mouth')}/>` : `<path d="${FACE.mouth.tired}" ${ST('--mouth', 2.4)}/>`;
  const dots = [[58, 52], [70, 43], [84, 39], [97, 44], [106, 57], [54, 62], [64, 52], [92, 50]];
  return svg('0 0 160 160', `${o.bare ? '' : `<rect width="160" height="160" rx="18" fill="url(#sb-wall)"/><circle cx="132" cy="44" r="70" fill="url(#sb-glow)" opacity=".55"/>`}
    <path d="${FACE.body}" fill="url(#sb-dress)"/><path d="${FACE.bib}" ${F('--apron')}/><path d="${FACE.straps}" ${ST('--apron', 6)}/>
    <g ${F('--flour')} opacity=".6"><circle cx="74" cy="142" r="2.2"/><circle cx="84" cy="148" r="1.6"/><circle cx="80" cy="138" r="1.2"/></g>
    <path d="M140 160 C138 136 124 122 104 116" ${ST('--glow', 2.4)} opacity=".45"/>
    <path d="${FACE.neck}" ${F('--skin-sh')}/><path d="${FACE.hairL}" ${F('--hair')}/><path d="${FACE.hairR}" ${F('--hair')}/>
    <ellipse cx="${hx}" cy="${hy}" rx="${rx}" ry="${ry}" fill="url(#sb-skin)"/>
    <path d="M104 58 C112 68 113 86 107 99" ${ST('--glow', 2.2)} opacity=".6"/>
    <g ${F('--cheek')} opacity=".5" filter="url(#sb-soft)">${FACE.cheeks.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4.5"/>`).join('')}</g>
    <path d="${FACE.nose}" ${ST('--skin-sh', 1.7)}/>${mouth}${eyes}
    <g ${ST('--hair', 2.6)}>${FACE.brows[mood].map(d => `<path d="${d}"/>`).join('')}</g>
    <ellipse cx="${FACE.smudge[0]}" cy="${FACE.smudge[1]}" rx="5" ry="2.2" transform="rotate(-20 ${FACE.smudge[0]} ${FACE.smudge[1]})" ${F('--flour')} opacity=".75"/>
    <path d="${FACE.scarf}" fill="url(#sb-scarf)"/><g ${F('--scarf-dot')} opacity=".85">${dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8"/>`).join('')}</g>
    <path d="M100 38 C108 44 112 54 113 66" ${ST('--glow', 2)} opacity=".5"/>
    ${FACE.knot.map(d => `<path d="${d}" fill="url(#sb-scarf)" style="stroke:var(--scarf-dk)" stroke-width="1"/>`).join('')}
    ${o.bare ? '' : '<rect width="160" height="160" rx="18" fill="#000" filter="url(#sb-grain)"/>'}`, `Marla the baker, ${mood}`);
}

/** Spot-the-herb card: side view on a twilight meadow plate. */
function sideView(/** @type {'chamomile' | 'mayweed'} */ kind) {
  const g = kind === 'chamomile' ? GEOM.chamomileSide : GEOM.mayweedSide;
  const centre = kind === 'chamomile' ? /** @type {any} */ (g).dome : /** @type {any} */ (g).disc;
  return svg('0 0 100 100', `<rect width="100" height="100" rx="10" ${F('--plate')}/><rect width="100" height="100" rx="10" fill="url(#sb-vig)" opacity=".5"/>
    <ellipse cx="50" cy="99" rx="44" ry="8" ${F('--leaf-dk')} opacity=".55"/>
    <path d="${GEOM.sideStem}" ${ST('--leaf-dk', 2.8)}/><path d="${GEOM.sideLeaves}" ${ST('--leaf', 2.3)}/>
    <path d="${g.petals}" ${ST('--petal-sh', 5.2)}/><path d="${g.petals}" ${ST('--petal', 3.6)}/>
    <path d="${centre}" fill="url(#sb-yolk)" style="stroke:var(--yolk-dk)" stroke-width=".8"/>
    <circle cx="50" cy="${kind === 'chamomile' ? 36 : 40}" r="17" ${ST('--highlight', 1.8)} stroke-dasharray="4 3"/>`, kind === 'chamomile' ? 'Chamomile: domed centre' : 'Mayweed: flat centre');
}

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'trait:heat': () => badge('<path d="M24 5 L44 41 H4 Z"/>', 'M24 18c4 5 6 8 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3-1-3 0-5 0-8z', '--heat', 'Heat'),
  'trait:calm': () => badge('<circle cx="24" cy="24" r="19"/>', 'M24 12c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z', '--calm', 'Calm'),
  'trait:vigor': () => badge('<rect x="6" y="6" width="36" height="36" rx="6"/>', 'M14 34c0-12 8-20 22-20 0 14-8 22-20 22z', '--vigor', 'Vigor'),
  'trait:clarity': () => badge('<path d="M24 3 L45 24 L24 45 L3 24 Z"/>', 'M24 13l2.8 7.7 8.2.3-6.4 5 2.3 7.9L24 29.3l-6.9 4.6 2.3-7.9-6.4-5 8.2-.3z', '--clarity', 'Clarity'),

  'ingredient:chamomile': () => svg('0 0 100 100', `${shadow(50, 93, 24)}
    <g ${ST('--leaf-dk', 2.4)}><path d="M50 90 C48 74 44 58 38 42"/><path d="M50 90 C54 74 62 64 71 54"/><path d="M50 90 C46 78 34 70 24 66"/></g>
    <g ${ST('--leaf', 1.6)}><path d="M46 72 l-8 -4 M46 70 l6 -6 M44 60 l-7 -3 M43 58 l5 -6 M57 70 l7 -2 M59 66 l3 -7 M38 72 l-6 0"/></g>
    <path d="M42 81 Q50 86 58 81" ${ST('--twine', 3.6)}/><path d="M50 84 l-6 8 M50 84 l5 8" ${ST('--twine', 2)}/>
    ${daisy(71, 52, 13, 12, 10)}${daisy(24, 64, 9, 10)}${daisy(38, 38, 19, 14, 4)}`, 'Chamomile'),

  'ingredient:fireroot': () => svg('0 0 100 100', `${shadow(52, 80, 34)}
    <g fill="none" stroke-linecap="round">${[GEOM.fireroot[1], GEOM.fireroot[2]].map(d => `<path d="${d}" style="stroke:var(--root-dk)" stroke-width="10"/><path d="${d}" style="stroke:var(--root)" stroke-width="7"/>`).join('')}</g>
    <path d="${GEOM.fireroot[0]}" fill="url(#sb-root)" style="stroke:var(--root-dk)" stroke-width="1.4"/>
    <path d="${GEOM.firerootRings}" ${ST('--root-dk', 1.4)} opacity=".75"/><path d="M26 54 C30 46 40 44 46 48 M56 42 C60 38 66 38 70 42" ${ST('--root-hi', 2.4)} opacity=".85"/>
    <path d="M30 70 l-4 8 M44 72 l0 8 M66 71 l2 8" ${ST('--root-dk', 1.3)}/>
    <circle cx="82" cy="58" r="17" fill="url(#sb-ember)" opacity=".85"/>
    <path d="M34 63 l6 -3 l4 4 l7 -2 M60 59 l5 3 l6 -2" ${ST('--ember', 1.8)}/>
    <ellipse cx="83" cy="58" rx="4.5" ry="7.5" ${F('--ember-hi')}/>`, 'Fireroot'),

  'ingredient:rosehip': () => svg('0 0 100 100', `${shadow(52, 90, 28)}
    <path d="M14 22 C34 26 48 36 57 48 M30 26 C38 36 40 46 38 54" ${ST('--twig', 2.6)}/>
    <path d="M28 25 C27 15 37 10 44 14 C42 22 36 27 28 25 Z" fill="url(#sb-leaf)"/><path d="M22 23 C14 18 12 10 16 6 C22 9 24 16 22 23 Z" fill="url(#sb-leaf)"/>
    ${/** @type {[number, number, number][]} */ ([[64, 60, -30], [36, 68, 10]]).map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">
      <ellipse rx="12" ry="15" fill="url(#sb-berry)"/><ellipse cx="-4.5" cy="-5.5" rx="3" ry="5" ${F('--gem-hi')} opacity=".55"/>
      <path d="M0 14 l-5 7 M0 14 l5 7 M0 14 l0 8 M0 14 l-7 3 M0 14 l7 3" ${ST('--leaf-dk', 1.6)}/></g>`).join('')}`, 'Rosehip'),

  'plant:chamomile': () => sideView('chamomile'),
  'plant:mayweed': () => sideView('mayweed'),

  'prop:cauldron': (o = {}) => cauldron({
    boil: o.boil, label: 'Cauldron, storybook', liquid: o.liquid || 'var(--calm)',
    before: `<ellipse cx="100" cy="168" rx="80" ry="48" fill="url(#sb-glow)" opacity=".7"/>`,
    body: 'fill="url(#sb-iron)" style="stroke:var(--iron-dk)" stroke-width="1.5"', rim: 'style="fill:var(--iron-dk)"',
    bodyExtra: `<path d="M52 104 C52 130 66 148 84 156" fill="none" style="stroke:var(--iron-hi)" stroke-width="4" stroke-linecap="round" opacity=".55"/><path d="M148 108 C146 136 130 156 106 162" fill="none" style="stroke:var(--glow)" stroke-width="3" stroke-linecap="round" opacity=".5"/>`,
    legs: 'style="stroke:var(--iron-dk)" stroke-width="8"', handles: 'style="stroke:var(--iron-hi)" stroke-width="5"',
    flames: ['var(--ember)', 'var(--glow)'], steam: 'var(--steam)', bubble: 'var(--steam)', splash: 'var(--steam)',
    after: `<ellipse cx="100" cy="91" rx="66" ry="13" fill="none" style="stroke:var(--iron-hi)" stroke-width="1.5" opacity=".6"/>`,
  }),

  'portrait:marla': portrait,
  'scene:shop': (o = {}) => (o.layer === 'front' ? sceneFront() : sceneBack()),

  'ui:coin': () => svg('0 0 24 24', `<circle cx="12" cy="12" r="10.5" fill="url(#sb-coin)" style="stroke:var(--coin-dk)" stroke-width="1"/><path d="M12 6.5 C15 9 15 14 12 17.5 C9 14 9 9 12 6.5 Z" ${F('--coin-dk')} opacity=".7"/>`, 'Coin'),
  'ui:texture': () => svg('0 0 100 100', `<rect width="100" height="100" rx="12" fill="url(#sb-wall)"/><circle cx="70" cy="30" r="50" fill="url(#sb-glow)" opacity=".7"/>
    <rect width="100" height="100" rx="12" fill="#000" filter="url(#sb-grain)"/>`, 'Lantern light on a painted wall'),
};
export const scope = Object.keys(ASSETS);
