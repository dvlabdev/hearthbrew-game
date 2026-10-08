// Style pack v0-prototype: the placeholder drawings from prototypes A, B, C2 and C3.
// Every asset is a function returning a standalone SVG string; colours come from CSS custom properties (style.css).
// A new style pack implements the same ids. Screens never import a pack directly; they use src/art/registry.js.

export const id = 'v0-prototype';
export const label = 'v0 · prototype placeholders';
export const css = new URL('./style.css', import.meta.url).href;

const INK = 'stroke="var(--ink)"';
/** @param {string} vb @param {string} inner @param {string} label */
const svg = (vb, inner, label) => `<svg viewBox="${vb}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const sq = (/** @type {string} */ inner, /** @type {string} */ label) => svg('0 0 100 100', inner, label);
const petals = (/** @type {number} */ n, /** @type {number} */ rx, /** @type {number} */ ry) =>
  Array.from({ length: n }, (_, i) => `<ellipse rx="${rx}" ry="${ry}" cy="-${ry}" transform="rotate(${(360 / n) * i})"/>`).join('');
const feather = `<g stroke="var(--leaf)" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M50 96 C50 80 48 66 46 52"/><path d="M48 84 l-12 -6 M48 84 l12 -8 M48 74 l-10 -6 M48 72 l11 -7 M47 64 l-9 -5 M47 62 l9 -6"/></g>`;
const nettleLeaves = `<path d="M50 96 V14" stroke="var(--leaf-dk)" stroke-width="3"/><g fill="var(--leaf)" ${INK} stroke-width="1.3" stroke-linejoin="round"><path d="M50 78 L42 76 L44 72 L36 70 L39 66 L30 63 L35 59 L27 54 C42 52 50 64 50 78Z"/><path d="M50 78 L58 76 L56 72 L64 70 L61 66 L70 63 L65 59 L73 54 C58 52 50 64 50 78Z"/><path d="M50 46 L43 44 L45 40 L38 38 L41 34 L34 31 L38 27 L32 22 C44 21 50 32 50 46Z"/><path d="M50 46 L57 44 L55 40 L62 38 L59 34 L66 31 L62 27 L68 22 C56 21 50 32 50 46Z"/></g>`;

/** @type {Record<string, (opts?: any) => string>} */
const A = {
  // ---------- traits: colour + shape + glyph ----------
  'trait:heat': () => svg('0 0 48 48', `<path d="M24 4 L45 42 H3 Z" fill="var(--heat)" ${INK} stroke-width="2" stroke-linejoin="round"/><path d="M24 18c4 5 6 8 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3-1-3 0-5 0-8z" fill="var(--on-trait)"/>`, 'Heat'),
  'trait:calm': () => svg('0 0 48 48', `<circle cx="24" cy="24" r="20" fill="var(--calm)" ${INK} stroke-width="2"/><path d="M24 12c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z" fill="var(--on-trait)"/>`, 'Calm'),
  'trait:vigor': () => svg('0 0 48 48', `<rect x="5" y="5" width="38" height="38" rx="5" fill="var(--vigor)" ${INK} stroke-width="2"/><path d="M14 34c0-12 8-20 22-20 0 14-8 22-20 22l-2-2zm2 0 12-12" fill="var(--on-trait)" stroke="var(--vigor)" stroke-width="1.5"/>`, 'Vigor'),
  'trait:clarity': () => svg('0 0 48 48', `<path d="M24 2 L46 24 L24 46 L2 24 Z" fill="var(--clarity)" ${INK} stroke-width="2" stroke-linejoin="round"/><path d="M24 13l2.8 7.7 8.2.3-6.4 5 2.3 7.9L24 29.3l-6.9 4.6 2.3-7.9-6.4-5 8.2-.3z" fill="var(--on-trait)"/>`, 'Clarity'),

  // ---------- ingredients ----------
  'ingredient:chamomile': () => sq(`<path d="M50 52 C48 68 44 80 40 94" fill="none" stroke="var(--moss)" stroke-width="3.5" stroke-linecap="round"/><g transform="translate(50 36)" ${INK} stroke-width="1.6" fill="var(--petal)">${petals(9, 6, 17)}<circle r="10" fill="var(--amber)"/></g>`, 'Chamomile'),
  'ingredient:lavender': () => sq(`<path d="M50 94 C50 70 48 50 46 18 M50 70 C58 56 62 44 66 30" stroke="var(--moss)" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="var(--lav)" ${INK} stroke-width="1.3"><ellipse cx="46" cy="16" rx="5" ry="7"/><ellipse cx="42" cy="28" rx="5" ry="7"/><ellipse cx="50" cy="30" rx="5" ry="7"/><ellipse cx="44" cy="42" rx="5" ry="7"/><ellipse cx="51" cy="44" rx="5" ry="7"/><ellipse cx="66" cy="28" rx="5" ry="7"/><ellipse cx="62" cy="40" rx="5" ry="7"/><ellipse cx="69" cy="41" rx="5" ry="7"/></g>`, 'Lavender'),
  'ingredient:mint': () => sq(`<path d="M50 92 V40" stroke="var(--moss)" stroke-width="3.5" stroke-linecap="round"/><g ${INK} stroke-width="1.6" fill="var(--vigor)"><path d="M50 60 C30 62 18 50 20 38 C34 36 46 46 50 60Z"/><path d="M50 60 C70 62 82 50 80 38 C66 36 54 46 50 60Z"/><path d="M50 38 C40 32 38 20 46 10 C56 16 58 28 50 38Z"/></g>`, 'Mint'),
  'ingredient:sage': () => sq(`<path d="M50 92 C50 70 50 50 52 30" stroke="var(--moss)" stroke-width="3.5" fill="none" stroke-linecap="round"/><g ${INK} stroke-width="1.6" fill="var(--grey-leaf)"><ellipse cx="34" cy="62" rx="9" ry="20" transform="rotate(-40 34 62)"/><ellipse cx="66" cy="54" rx="9" ry="20" transform="rotate(40 66 54)"/><ellipse cx="52" cy="22" rx="8" ry="16"/></g>`, 'Sage'),
  'ingredient:fireroot': () => sq(`<g ${INK} stroke-width="1.8" fill="var(--root)"><ellipse cx="46" cy="58" rx="28" ry="17" transform="rotate(-18 46 58)"/><ellipse cx="26" cy="44" rx="11" ry="15" transform="rotate(-40 26 44)"/><ellipse cx="62" cy="36" rx="10" ry="16" transform="rotate(25 62 36)"/><ellipse cx="76" cy="62" rx="12" ry="9" transform="rotate(10 76 62)"/></g><path d="M30 62c8-2 16-2 26 0M38 52c6 0 12 1 18 3" stroke="var(--root-dk)" stroke-width="1.6" fill="none" stroke-linecap="round"/><ellipse cx="83" cy="63" rx="5" ry="6" fill="var(--heat)" ${INK} stroke-width="1.5"/>`, 'Fireroot'),
  'ingredient:nettle': () => sq(`<path d="M50 94 V30" stroke="var(--moss)" stroke-width="3.5" stroke-linecap="round"/><g fill="var(--moss)" ${INK} stroke-width="1.5" stroke-linejoin="round"><path d="M50 66 L42 64 L44 60 L36 58 L39 54 L30 51 L35 47 L27 42 C40 40 48 50 50 66Z"/><path d="M50 66 L58 64 L56 60 L64 58 L61 54 L70 51 L65 47 L73 42 C60 40 52 50 50 66Z"/><path d="M50 34 L45 31 L47 27 L42 24 L46 21 L43 16 L48 15 L50 8 L52 15 L57 16 L54 21 L58 24 L53 27 L55 31Z"/></g>`, 'Nettle'),
  'ingredient:rosehip': () => sq(`<path d="M50 20 C52 30 56 36 60 38" stroke="var(--moss)" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="62" rx="18" ry="24" fill="var(--berry)" ${INK} stroke-width="1.8" transform="rotate(-12 40 62)"/><ellipse cx="66" cy="58" rx="14" ry="19" fill="var(--berry)" ${INK} stroke-width="1.8" transform="rotate(14 66 58)"/><path d="M36 40 l-6-8 M40 38 l0-10 M44 40 l6-8" stroke="var(--root-dk)" stroke-width="2.4" stroke-linecap="round"/>`, 'Rosehip'),
  'ingredient:honey': () => sq(`<path d="M28 34 H72 V80 C72 88 66 92 50 92 C34 92 28 88 28 80Z" fill="var(--amber)" ${INK} stroke-width="1.8"/><rect x="24" y="22" width="52" height="14" rx="4" fill="var(--plum)" ${INK} stroke-width="1.8"/><rect x="36" y="50" width="28" height="20" rx="3" fill="var(--petal)" ${INK} stroke-width="1.4"/>`, 'Honey'),
  'ingredient:valerian': () => sq(`<path d="M50 70 V30" stroke="var(--leaf)" stroke-width="3"/><g fill="#E8B9C9" ${INK} stroke-width="1.5"><circle cx="40" cy="24" r="7"/><circle cx="52" cy="18" r="7"/><circle cx="62" cy="26" r="7"/><circle cx="50" cy="30" r="6"/></g><path d="M50 70 C40 76 34 86 30 94 M50 70 C52 80 54 88 52 96 M50 70 C60 76 68 84 72 92" stroke="var(--root)" stroke-width="5" fill="none" stroke-linecap="round"/>`, 'Valerian'),
  'ingredient:glowcap': () => sq(`<path d="M44 52 C42 68 40 80 36 92 H62 C58 80 56 68 56 52 Z" fill="var(--petal)" ${INK} stroke-width="1.8"/><path d="M14 54 C14 26 34 14 50 14 C66 14 86 26 86 54 C70 58 30 58 14 54 Z" fill="var(--wisp)" ${INK} stroke-width="1.8"/><g fill="var(--glow)" ${INK} stroke-width="1"><circle cx="38" cy="34" r="4"/><circle cx="60" cy="28" r="3"/><circle cx="70" cy="44" r="3.5"/></g>`, 'Glowcap'),
  'ingredient:pine': () => sq(`<rect x="30" y="8" width="40" height="84" rx="8" fill="var(--root-dk)" ${INK} stroke-width="2"/><path d="M38 20 v20 M50 14 v14 M62 30 v24 M42 60 v22" stroke="#5A3516" stroke-width="3"/><path d="M50 44 C60 56 62 66 50 76 C38 66 40 56 50 44Z" fill="var(--amber)" ${INK} stroke-width="2"/>`, 'Pine resin'),
  'ingredient:bilberry': () => sq(`<g fill="var(--blueberry)" ${INK} stroke-width="2"><circle cx="36" cy="58" r="15"/><circle cx="62" cy="56" r="15"/><circle cx="50" cy="34" r="15"/></g><g fill="var(--petal)" opacity=".5"><circle cx="31" cy="53" r="3"/><circle cx="57" cy="51" r="3"/><circle cx="45" cy="29" r="3"/></g>`, 'Bilberry'),
  'ingredient:angelica': () => sq(`<path d="M50 92 V40 M50 40 L30 24 M50 40 L50 18 M50 40 L70 24" stroke="var(--moss)" stroke-width="3" fill="none"/><g fill="var(--petal)" ${INK} stroke-width="1.5"><circle cx="30" cy="22" r="9"/><circle cx="50" cy="16" r="9"/><circle cx="70" cy="22" r="9"/></g><path d="M44 80 C38 88 36 94 34 98 M56 80 C62 88 64 94 66 98" stroke="var(--root)" stroke-width="4" fill="none" stroke-linecap="round"/>`, 'Angelica root'),
  'ingredient:brimstone': () => sq(`<path d="M18 70 C14 52 26 36 42 36 C48 22 70 24 74 40 C88 44 88 66 76 74 C64 86 30 86 18 70Z" fill="var(--sulfur)" ${INK} stroke-width="2"/><g fill="#B39A1E"><circle cx="40" cy="56" r="4"/><circle cx="60" cy="48" r="3"/><circle cx="64" cy="66" r="4"/></g>`, 'Brimstone'),
  'ingredient:salt': () => sq(`<g fill="var(--salt)" ${INK} stroke-width="2" stroke-linejoin="round"><path d="M20 70 L34 56 L48 70 L34 84 Z"/><path d="M44 62 L58 44 L74 60 L60 78 Z"/><path d="M30 46 L42 34 L54 46 L42 58 Z"/></g>`, 'Salt'),
  'ingredient:quartz': () => sq(`<g ${INK} stroke-width="2" stroke-linejoin="round"><path d="M40 88 L32 44 L44 12 L56 44 L50 88 Z" fill="#CFEFF0"/><path d="M58 90 L56 56 L66 34 L76 56 L70 90 Z" fill="#A9DDE0"/></g>`, 'Quartz dust'),
  'ingredient:sunwort': () => sq(`<path d="M50 94 V50" stroke="var(--moss)" stroke-width="3.5" stroke-linecap="round"/><g transform="translate(50 36)" ${INK} stroke-width="1.5" fill="var(--yolk)">${petals(5, 7, 15)}<circle r="8" fill="var(--amber)"/></g><g stroke="var(--yolk)" stroke-width="2" stroke-linecap="round" opacity=".8"><path d="M50 4v6M20 16l4 4M80 16l-4 4"/></g>`, 'Sunwort'),

  // ---------- look-alike plants (Spot the herb) ----------
  'plant:chamomile': () => sq(`${feather}<g transform="translate(46 34)" ${INK} stroke-width="1.4" fill="var(--petal)">${petals(8, 5, 13)}<ellipse rx="10" ry="12" cy="-3" fill="var(--yolk)"/><ellipse rx="4" ry="5" cx="-3" cy="-8" fill="#FFF3B0" stroke="none"/></g>`, 'Chamomile: domed centre'),
  'plant:mayweed': () => sq(`${feather}<g transform="translate(46 34)" ${INK} stroke-width="1.4" fill="var(--petal)">${petals(9, 4, 14)}<circle r="9" fill="#D9AE3A"/></g>`, 'Mayweed: flat centre'),
  'plant:nettle': () => sq(`${nettleLeaves}<g stroke="#9DBF7A" stroke-width="2.4" stroke-linecap="round"><path d="M50 56 C44 60 40 66 38 74"/><path d="M50 56 C56 60 60 66 62 74"/></g>`, 'Nettle: green catkins'),
  'plant:deadnettle': () => sq(`${nettleLeaves}<g fill="var(--petal)" ${INK} stroke-width="1.2"><path d="M44 58 c-6 -2 -8 -8 -4 -10 c4 0 6 4 4 10z"/><path d="M56 58 c6 -2 8 -8 4 -10 c-4 0 -6 4 -4 10z"/></g>`, 'White dead-nettle: white hooded flowers'),
  'plant:mint': () => A['ingredient:mint'](),
  'plant:groundivy': () => sq(`<path d="M10 88 C30 82 50 86 90 80" stroke="var(--leaf-dk)" stroke-width="3" fill="none"/><g fill="#4E8A5A" ${INK} stroke-width="1.3"><path d="M40 62 c-14 0 -18 -14 -8 -18 c4 -2 8 0 8 4 c0 -4 4 -6 8 -4 c10 4 6 18 -8 18z"/><path d="M70 70 c-12 0 -15 -12 -7 -15 c4 -1 7 1 7 3 c0 -2 3 -4 7 -3 c8 3 5 15 -7 15z"/></g><g fill="#8B6FD0" ${INK} stroke-width="1"><ellipse cx="46" cy="56" rx="3" ry="4"/><ellipse cx="76" cy="62" rx="3" ry="4"/></g>`, 'Ground-ivy: round scalloped leaves'),

  // ---------- props ----------
  'prop:cauldron': (o = {}) => {
    const bub = [[88, 94, 4], [110, 96, 3], [76, 95, 3.5], [124, 95, 4], [100, 92, 5], [116, 92, 3.5]]
      .map(([x, y, r], i) => `<circle class="bub b${i + 1}${i > 1 ? ' boilonly' : ''}" cx="${x}" cy="${y}" r="${r}" fill="var(--petal)"/>`).join('');
    const spl = [[70, 84, -10], [134, 84, 10], [100, 80, -4]]
      .map(([x, y, dx], i) => `<circle class="splash p${i + 1} boilonly" cx="${x}" cy="${y}" r="3" fill="var(--wisp)" style="--dx:${dx}px"/>`).join('');
    return `<svg viewBox="0 0 200 200" class="pot${o.boil ? ' boil' : ''}" role="img" aria-label="Cauldron, ${o.boil ? 'boiling' : 'simmering'}" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="var(--muted)" stroke-linecap="round"><path class="steam" d="M86 70 c-8-10 8-16 0-28"/><path class="steam s2" d="M112 68 c-8-10 8-16 0-30"/></g>
      <rect x="56" y="178" width="88" height="10" rx="5" fill="var(--root-dk)" ${INK} stroke-width="2" transform="rotate(-8 100 183)"/>
      <rect x="56" y="178" width="88" height="10" rx="5" fill="var(--root)" ${INK} stroke-width="2" transform="rotate(8 100 183)"/>
      <g class="flames"><path class="flame" d="M100 186 C78 180 74 160 88 146 C88 158 94 160 96 156 C92 144 100 134 108 128 C106 142 124 150 120 168 C118 180 110 186 100 186Z" fill="var(--heat)"/>
      <path class="flame f2" d="M100 186 C88 182 86 170 94 162 C96 170 100 170 102 166 C102 160 106 154 110 152 C110 162 118 168 114 178 C112 184 106 186 100 186Z" fill="var(--amber)"/></g>
      <g class="potbody"><path d="M54 150 l-8 22 M146 150 l8 22" stroke="var(--iron)" stroke-width="7" stroke-linecap="round"/>
      <path d="M36 92 C34 142 62 166 100 166 C138 166 166 142 164 92 Z" fill="var(--iron)" ${INK} stroke-width="2"/>
      <path d="M48 104 C50 132 64 148 82 154" fill="none" stroke="var(--iron-hi)" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="100" cy="92" rx="68" ry="15" fill="var(--iron-hi)" ${INK} stroke-width="2"/>
      <ellipse class="liquid" cx="100" cy="93" rx="58" ry="10" fill="${o.liquid || 'var(--wisp)'}"/>${bub}
      <path d="M32 92 c-10 0-12 14-2 16 M168 92 c10 0 12 14 2 16" fill="none" stroke="var(--iron)" stroke-width="5" stroke-linecap="round"/></g>${spl}</svg>`;
  },

  // ---------- weather ----------
  'weather:sun': () => svg('0 0 40 40', `<circle cx="20" cy="20" r="8" fill="var(--amber)"/><g stroke="var(--amber)" stroke-width="2.5" stroke-linecap="round"><path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5 32 32M8 32l3.5-3.5M28.5 11.5 32 8"/></g>`, 'Sunny'),
  'weather:rain': () => svg('0 0 40 40', `<path d="M10 22a7 7 0 0 1 2-13.5A9 9 0 0 1 30 10a6 6 0 0 1 0 12z" fill="var(--muted)"/><g stroke="var(--calm)" stroke-width="2.5" stroke-linecap="round"><path d="M13 27l-2 6M21 27l-2 6M29 27l-2 6"/></g>`, 'Rain'),
  'weather:wind': () => svg('0 0 40 40', `<g fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"><path d="M4 14h22a4 4 0 1 0-4-4"/><path d="M4 21h28a4 4 0 1 1-4 4"/><path d="M4 28h14"/></g>`, 'Windy'),
  'weather:mist': () => svg('0 0 40 40', `<g stroke="var(--muted)" stroke-width="3" stroke-linecap="round"><path d="M5 12h30M8 19h24M5 26h30M10 33h20"/></g>`, 'Mist'),
  'weather:frost': () => svg('0 0 40 40', `<g stroke="var(--calm)" stroke-width="2.5" stroke-linecap="round"><path d="M20 4v32M6 12l28 16M6 28l28-16"/><path d="M16 7l4 4 4-4M16 33l4-4 4 4"/></g>`, 'Frost'),

  // ---------- ui ----------
  'ui:coin': () => svg('0 0 24 24', `<circle cx="12" cy="12" r="10" fill="var(--amber)" ${INK} stroke-width="1.5"/><circle cx="12" cy="12" r="6" fill="none" stroke="var(--bg)" stroke-width="1.5" opacity=".6"/>`, 'Coin'),
};

// ---------- portraits: one construction (head ellipse, hair shape, simple eyes) ----------
const PEOPLE = {
  marla: { skin: 'var(--skin)', hair: 'var(--hair)', style: 'bun', cloth: 'var(--moss)', eyes: 'sleepy', band: 1, apron: 1 },
  pell: { skin: 'var(--skin2)', hair: 'var(--root-dk)', style: 'short', cloth: 'var(--berry)', eyes: 'open', beard: 1, big: 1 },
  fennick: { skin: 'var(--skin)', hair: 'var(--hair)', style: 'messy', cloth: 'var(--plum)', eyes: 'worried', glasses: 1 },
  tamsin: { skin: 'var(--skin)', hair: 'var(--grey-hair)', style: 'bun', cloth: 'var(--moss)', eyes: 'smile', hat: 1 },
  traveller: { skin: 'var(--skin2)', hair: 'var(--hair)', style: 'hood', cloth: 'var(--muted)', eyes: 'open' },
};
/** @param {string} who */
function portrait(who) {
  const o = `${INK} stroke-width="2"`;
  if (who === 'bramble') return svg('0 0 160 160', `<circle cx="80" cy="80" r="78" fill="var(--sunk)"/><path d="M34 160 C36 128 56 116 80 116 C104 116 124 128 126 160Z" fill="var(--root-dk)" ${o}/><path d="M44 76 L8 54 L40 92Z M116 76 L152 54 L120 92Z" fill="#8A6A4A" ${o} stroke-linejoin="round"/><ellipse cx="80" cy="82" rx="38" ry="36" fill="#8A6A4A" ${o}/><path d="M42 62 C46 30 114 30 118 62 C100 52 60 52 42 62Z" fill="var(--moss)" ${o}/><circle cx="66" cy="82" r="11" fill="var(--petal)" ${o}/><circle cx="94" cy="82" r="11" fill="var(--petal)" ${o}/><circle cx="68" cy="84" r="5" fill="var(--amber)"/><circle cx="96" cy="84" r="5" fill="var(--amber)"/><path d="M70 102 q10 8 20 0" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>`, 'Bramble the hob');
  const P = /** @type {any} */ (PEOPLE)[who];
  const sh = P.big ? 'M14 160 C16 118 46 104 80 104 C114 104 144 118 146 160Z' : 'M24 160 C26 122 52 108 80 108 C108 108 134 122 136 160Z';
  const hair = {
    bun: `<circle cx="80" cy="30" r="14" fill="${P.hair}" ${o}/><path d="M48 70 C46 44 62 36 80 36 C98 36 114 44 112 70 C104 56 92 50 80 50 C68 50 56 56 48 70Z" fill="${P.hair}" ${o}/>`,
    short: `<path d="M46 66 C44 40 60 32 80 32 C100 32 116 40 114 66 C106 52 94 46 80 46 C66 46 54 52 46 66Z" fill="${P.hair}" ${o}/>`,
    messy: `<path d="M46 70 C40 40 56 28 80 30 C104 28 122 40 114 70 L108 56 L100 62 L94 50 L84 58 L76 48 L68 58 L60 50 L52 62Z" fill="${P.hair}" ${o}/>`,
    hood: `<path d="M38 100 C30 60 48 30 80 28 C112 30 130 60 122 100 C114 70 100 56 80 56 C60 56 46 70 38 100Z" fill="${P.cloth}" ${o}/>`,
  }[/** @type {'bun'|'short'|'messy'|'hood'} */ (P.style)];
  const eyes = {
    sleepy: '<path d="M60 74 q7 5 14 0 M86 74 q7 5 14 0" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>',
    open: '<circle cx="67" cy="74" r="3.5" fill="var(--ink)"/><circle cx="93" cy="74" r="3.5" fill="var(--ink)"/>',
    worried: '<circle cx="67" cy="76" r="3.5" fill="var(--ink)"/><circle cx="93" cy="76" r="3.5" fill="var(--ink)"/><path d="M58 66 l14 -4 M102 66 l-14 -4" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>',
    smile: '<path d="M60 76 q7 -6 14 0 M86 76 q7 -6 14 0" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>',
  }[/** @type {'sleepy'|'open'|'worried'|'smile'} */ (P.eyes)];
  return svg('0 0 160 160', `<circle cx="80" cy="80" r="78" fill="var(--sunk)"/><path d="${sh}" fill="${P.cloth}" ${o}/>
    ${P.apron ? `<path d="M56 160 C58 132 66 118 80 118 C94 118 102 132 104 160Z" fill="var(--petal)" ${o}/>` : ''}
    <path d="M70 104 h20 v12 c-6 4 -14 4 -20 0z" fill="${P.skin}" ${o}/><ellipse cx="80" cy="72" rx="32" ry="36" fill="${P.skin}" ${o}/>${hair}
    ${P.band ? '<path d="M50 52 C62 40 98 40 110 52" fill="none" stroke="var(--amber)" stroke-width="6" stroke-linecap="round"/>' : ''}
    ${P.hat ? `<ellipse cx="80" cy="44" rx="48" ry="9" fill="var(--amber)" ${o}/><path d="M56 44 C58 24 102 24 104 44Z" fill="var(--amber)" ${o}/>` : ''}${eyes}
    ${P.glasses ? '<circle cx="67" cy="75" r="9" fill="none" stroke="var(--ink)" stroke-width="2"/><circle cx="93" cy="75" r="9" fill="none" stroke="var(--ink)" stroke-width="2"/>' : ''}
    ${P.beard ? `<path d="M50 80 C52 112 66 118 80 118 C94 118 108 112 110 80 C102 96 92 100 80 100 C68 100 58 96 50 80Z" fill="${P.hair}" ${o}/>` : '<path d="M72 94 q8 5 16 0" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>'}`, who[0].toUpperCase() + who.slice(1));
}
for (const who of [...Object.keys(PEOPLE), 'bramble']) A[`portrait:${who}`] = () => portrait(who);

export const ASSETS = A;
