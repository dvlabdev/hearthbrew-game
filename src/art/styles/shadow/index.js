// Exploration pack: Shadow Theatre. Cut-paper silhouettes against glowing backlit skies (after Lotte Reiniger).
// Colour comes only from light: the sky, the fire, the potion's glow. Detail lives in outline and cut-outs.
import { GEOM, petals, cauldron } from '../../geom.js';

export const id = 'shadow';
export const label = 'Shadow Theatre';
export const exploration = true;
export const css = new URL('./style.css', import.meta.url).href;
export const brief = {
  adjectives: ['fairy-tale', 'glowing', 'bold'],
  inspiration: "Lotte Reiniger's cut-paper silhouette films (1926), shadow puppetry",
  technique: 'One solid silhouette per asset over a radial backlight; cut-outs (eyes, petal gaps) reveal the light.',
};

const DEFS = `<defs>
  <radialGradient id="sh-sky" cx=".5" cy=".64" r=".78"><stop offset="0" style="stop-color:var(--sky1)"/><stop offset=".48" style="stop-color:var(--sky2)"/><stop offset="1" style="stop-color:var(--sky3)"/></radialGradient>
  <radialGradient id="sh-glow" cx=".5" cy=".5" r=".5"><stop offset="0" style="stop-color:var(--sky1)" stop-opacity=".9"/><stop offset="1" style="stop-color:var(--sky1)" stop-opacity="0"/></radialGradient>
</defs>`;
const S = 'style="fill:var(--shade)"';
const SS = 'style="stroke:var(--shade)"';
const sky = (/** @type {number} */ w = 100) => `<rect width="${w}" height="${w}" rx="${w * 0.1}" fill="url(#sh-sky)"/>`;
const hills = `<path d="M0 100 C20 92 40 96 60 92 C76 89 90 94 100 90 V100Z" ${S}/>`;
const svg = (/** @type {string} */ vb, /** @type {string} */ inner, /** @type {string} */ label) => `<svg viewBox="${vb}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${DEFS}${inner}</svg>`;

/** Trait badge: trait-coloured shape lit from behind, black cut-paper glyph, thin shade outline. */
function badge(/** @type {string} */ shape, /** @type {string} */ glyph, /** @type {string} */ color, /** @type {string} */ label) {
  return svg('0 0 48 48', `${shape.replace('/>', ` style="fill:var(${color})" ${SS} stroke-width="2.6" stroke-linejoin="round"/>`)}<path d="${glyph}" ${S}/>`, label);
}
const head = (/** @type {{x:number,y:number,s:number}} */ h) =>
  `<g transform="translate(${h.x} ${h.y}) scale(${h.s})" ${S}>${petals(8, 5, 14)}<circle r="7" style="fill:var(--sky1)"/><circle r="4.5" ${S}/></g>`;

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'trait:heat': () => badge('<path d="M24 4 L45 42 H3 Z"/>', 'M24 18c4 5 6 8 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3-1-3 0-5 0-8z', '--heat', 'Heat'),
  'trait:calm': () => badge('<circle cx="24" cy="24" r="20"/>', 'M24 12c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z', '--calm', 'Calm'),
  'trait:vigor': () => badge('<rect x="5" y="5" width="38" height="38" rx="4"/>', 'M14 34c0-12 8-20 22-20 0 14-8 22-20 22z', '--vigor', 'Vigor'),
  'trait:clarity': () => badge('<path d="M24 2 L46 24 L24 46 L2 24 Z"/>', 'M24 13l2.8 7.7 8.2.3-6.4 5 2.3 7.9L24 29.3l-6.9 4.6 2.3-7.9-6.4-5 8.2-.3z', '--clarity', 'Clarity'),

  'ingredient:chamomile': () => svg('0 0 100 100', `${sky()}<g fill="none" ${SS} stroke-width="2.4" stroke-linecap="round"><path d="${GEOM.stem}"/><path d="${GEOM.feather}" stroke-width="2.2"/></g>${GEOM.heads.map(head).join('')}${hills}`, 'Chamomile'),
  'ingredient:fireroot': () => svg('0 0 100 100', `${sky()}<path d="${GEOM.fireroot[0]}" ${S}/>
    <g fill="none" ${SS} stroke-width="4" stroke-linecap="round"><path d="${GEOM.fireroot[1]}"/><path d="${GEOM.fireroot[2]}"/></g>
    <path d="${GEOM.firerootRings}" fill="none" style="stroke:var(--sky2)" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="80" cy="60" r="4" style="fill:var(--heat)"/>`, 'Fireroot'),

  'plant:chamomile': () => svg('0 0 100 100', `${sky()}<g fill="none" ${SS} stroke-width="2.6" stroke-linecap="round"><path d="${GEOM.sideStem}"/><path d="${GEOM.sideLeaves}"/><path d="${GEOM.chamomileSide.petals}" stroke-width="4"/></g>
    <path d="${GEOM.chamomileSide.dome}" ${S}/><circle cx="50" cy="35" r="17" fill="none" style="stroke:var(--highlight)" stroke-width="2" stroke-dasharray="4 3"/>${hills}`, 'Chamomile: domed centre'),
  'plant:mayweed': () => svg('0 0 100 100', `${sky()}<g fill="none" ${SS} stroke-width="2.6" stroke-linecap="round"><path d="${GEOM.sideStem}"/><path d="${GEOM.sideLeaves}"/><path d="${GEOM.mayweedSide.petals}" stroke-width="4"/></g>
    <path d="${GEOM.mayweedSide.disc}" ${S}/><circle cx="50" cy="38" r="17" fill="none" style="stroke:var(--highlight)" stroke-width="2" stroke-dasharray="4 3"/>${hills}`, 'Mayweed: flat centre'),

  'prop:cauldron': (o = {}) => cauldron({
    boil: o.boil, label: 'Cauldron in silhouette', liquid: o.liquid || 'var(--calm)',
    before: `<rect width="200" height="200" rx="18" fill="url(#sh-sky)"/><ellipse cx="100" cy="150" rx="80" ry="50" fill="url(#sh-glow)"/>`,
    body: S, rim: `${S}`, legs: `${SS} stroke-width="7"`, handles: `${SS} stroke-width="5"`,
    bodyExtra: `<path d="M60 120 h80 M70 134 h60" ${SS} stroke-width="0"/><circle cx="100" cy="128" r="6" style="fill:var(--sky1)" opacity=".85"/><circle cx="100" cy="128" r="3" ${S}/>`,
    flames: ['var(--heat)', 'var(--sky1)'], steam: 'var(--shade)', bubble: 'var(--sky1)', splash: 'var(--sky1)',
    after: `<path d="M0 200 C40 188 80 194 110 188 C150 182 180 192 200 186 V200Z" ${S}/>`,
  }).replace('xmlns="http://www.w3.org/2000/svg">', `xmlns="http://www.w3.org/2000/svg">${DEFS}`),

  'portrait:marla': () => {
    const [bx, by, br] = GEOM.marlaBun;
    return svg('0 0 160 160', `<rect width="160" height="160" rx="16" fill="url(#sh-sky)"/>
      <path d="${GEOM.marlaProfile}" ${S}/><circle cx="${bx}" cy="${by}" r="${br}" ${S}/>
      <path d="${GEOM.marlaScarf}" fill="none" ${SS} stroke-width="7" stroke-linecap="round"/>
      <path d="M44 52 l-10 -4 l3 10 z" ${S}/>
      <path d="${GEOM.marlaEye}" fill="none" style="stroke:var(--sky1)" stroke-width="2" stroke-linecap="round"/>
      <g style="fill:var(--sky1)" opacity=".9"><circle cx="70" cy="132" r="2.2"/><circle cx="80" cy="138" r="2.2"/><circle cx="90" cy="132" r="2.2"/><circle cx="80" cy="126" r="2.2"/></g>`, 'Marla in silhouette');
  },

  'ui:coin': () => svg('0 0 24 24', `<circle cx="12" cy="12" r="10.5" style="fill:var(--accent)"/><circle cx="12" cy="12" r="6.5" fill="none" ${SS} stroke-width="1.6"/>`, 'Coin'),
  'ui:texture': () => svg('0 0 100 100', `<rect width="100" height="100" fill="url(#sh-sky)"/><path d="M0 70 C14 62 22 66 30 58 C40 48 52 60 62 52 C74 42 86 56 100 50 V100 H0Z" ${S}/><path d="M10 64 l2 -10 l2 10 M80 52 l3 -14 l3 14" ${SS} stroke-width="2"/>`, 'Shadow-theatre backdrop'),
};
export const scope = Object.keys(ASSETS);
