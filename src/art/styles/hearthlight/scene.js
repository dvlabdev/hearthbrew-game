// Hearthlight shop scene (back and front layers, so customers stand between them) and the cauldron.
import { SCENE, cauldron } from '../../geom.js';
import { painter } from '../../lod.js';
import { svg, F, ST, lens, cast } from './kit.js';

/** The scene is drawn at icon detail (its counter-top cast shadows). */
const ICON = painter('icon', { prefix: 'hl' });

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
    ${cast(ICON, 306, top + 1, 22)}
    <path d="M290 ${top - 16} H322 L317 ${top} H295 Z" ${F('--stone')}/><path d="M290 ${top - 16} H303 L301 ${top} H295 Z" ${F('--stone-dk')}/><rect x="289" y="${top - 19}" width="34" height="4" rx="1" ${F('--stone-dk')}/>
    <path d="M311 ${top - 14} L326 ${top - 34}" ${ST('--wood', 5)}/><path d="M312 ${top - 15} L326 ${top - 33}" ${ST('--wood-hi', 1.4)}/>
    ${cast(ICON, 34, top + 1, 13)}
    <path d="M25 ${top} V${top - 18} L31 ${top - 28} V${top - 35} H37 V${top - 28} L43 ${top - 18} V${top} Z" fill="url(#hl-berry)"/><path d="M25 ${top} V${top - 18} L31 ${top - 28} V${top} Z" ${F('--berry-dk')} opacity=".45"/>
    <path d="M38 ${top - 3} V${top - 17}" ${ST('--gem-hi', 1.6)} opacity=".45"/><rect x="30" y="${top - 40}" width="8" height="6" rx="1" ${F('--cork')}/><rect x="28" y="${top - 15}" width="12" height="8" ${F('--apron')}/>`, 'The counter');
}

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'prop:cauldron': (o = {}) => cauldron({
    boil: o.boil, label: 'Cauldron, hearthlight', liquid: o.liquid || 'var(--calm)',
    before: `<ellipse cx="100" cy="168" rx="80" ry="48" fill="url(#hl-glow)" opacity=".7"/><path d="M50 166 H150 L122 186 H22 Z" style="fill:var(--shadow)" opacity=".25" filter="url(#hl-soft)"/>`,
    body: 'fill="url(#hl-iron)"', rim: 'style="fill:var(--iron-dk)"',
    bodyExtra: `<path d="M20 80 H86 C68 110 70 140 92 172 H20 Z" style="fill:var(--iron-dk)" opacity=".55" clip-path="url(#hl-pot)"/><path d="M148 108 C146 136 130 156 106 162" fill="none" style="stroke:var(--glow)" stroke-width="3" stroke-linecap="round" opacity=".5"/>`,
    legs: 'style="stroke:var(--iron-dk)" stroke-width="8"', handles: 'style="stroke:var(--iron-hi)" stroke-width="5"',
    flames: ['var(--ember)', 'var(--glow)'], steam: 'var(--steam)', bubble: 'var(--steam)', splash: 'var(--steam)',
    after: `<ellipse cx="100" cy="91" rx="66" ry="13" fill="none" style="stroke:var(--iron-hi)" stroke-width="1.5" opacity=".6"/>`,
  }),
  'scene:shop': (o = {}) => (o.layer === 'front' ? sceneFront() : sceneBack()),
};
