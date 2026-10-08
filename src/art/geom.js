// Shared drawing geometry. Style packs render these same shapes with their own treatment
// (gold engraving, silhouette, photogram, riso inks), so style tiles compare style, not drawing skill.

/** Flower head with n elliptic petals around the origin. @param {number} n @param {number} rx @param {number} ry */
export const petals = (n, rx, ry) =>
  Array.from({ length: n }, (_, i) => `<ellipse rx="${rx}" ry="${ry}" cy="-${ry}" transform="rotate(${((360 / n) * i).toFixed(1)})"/>`).join('');

export const GEOM = {
  // chamomile sprig: two heads on a feathery stem (viewBox 0 0 100 100)
  stem: 'M50 96 C49 80 46 66 42 52 M47 76 C56 70 62 62 66 52',
  feather: 'M47 86 l-11 -5 M47 86 l10 -7 M46 74 l-9 -6 M46 72 l10 -6 M44 63 l-8 -5 M55 68 l6 -4',
  heads: [{ x: 42, y: 36, s: 1 }, { x: 68, y: 48, s: 0.55 }],

  // look-alike plants in side view (viewBox 0 0 100 100), drawn as the real plants differ:
  // chamomile = tall DOMED cone with petals drooping down; mayweed = FLAT disc with petals spread out level.
  sideStem: 'M50 96 C50 80 50 66 50 48',
  sideLeaves: 'M50 84 C44 80 38 80 31 75 M50 84 C56 80 62 80 69 74 M50 71 C45 67 40 67 35 63 M50 71 C55 67 60 66 65 62 M38 79 l-2 -4 M44 81 l-1 -4 M62 79 l2 -4 M56 81 l1 -4',
  chamomileSide: { dome: 'M39 45 C39 22 61 22 61 45 Z', petals: 'M40 45 C34 48 28 54 25 62 M43 46 C40 51 37 57 36 64 M57 46 C60 51 63 57 64 64 M60 45 C66 48 72 54 75 62' },
  mayweedSide: { disc: 'M37 41 Q50 38 63 41 V45 H37 Z', petals: 'M37 43 C30 43 24 42 17 42 M39 44 C33 47 27 50 21 52 M61 44 C67 47 73 50 79 52 M63 43 C70 43 76 42 83 42' },

  // fireroot: a knobbly rhizome (viewBox 0 0 100 100)
  fireroot: [
    'M20 62 C18 48 32 40 44 46 C50 36 66 34 72 44 C84 42 90 56 82 64 C76 74 60 72 52 68 C42 76 24 74 20 62 Z',
    'M40 46 C38 38 42 30 48 28 C54 30 54 38 50 44',
    'M70 46 C72 38 78 34 84 36',
  ],
  firerootRings: 'M32 58 C38 54 46 54 52 58 M58 52 C64 50 70 52 74 56',

  // cauldron parts (viewBox 0 0 200 200), same class names everywhere so src/art/anim.css drives every pack
  pot: {
    body: 'M36 92 C34 142 62 166 100 166 C138 166 166 142 164 92 Z',
    legs: 'M54 150 l-8 22 M146 150 l8 22',
    handles: 'M32 92 c-10 0-12 14-2 16 M168 92 c10 0 12 14 2 16',
    flame: 'M100 186 C78 180 74 160 88 146 C88 158 94 160 96 156 C92 144 100 134 108 128 C106 142 124 150 120 168 C118 180 110 186 100 186Z',
    flame2: 'M100 186 C88 182 86 170 94 162 C96 170 100 170 102 166 C102 160 106 154 110 152 C110 162 118 168 114 178 C112 184 106 186 100 186Z',
    steam: ['M86 70 c-8-10 8-16 0-28', 'M112 68 c-8-10 8-16 0-30'],
    bubbles: [[88, 94, 4], [110, 96, 3], [76, 95, 3.5], [124, 95, 4], [100, 92, 5], [116, 92, 3.5]],
    splashes: [[70, 84, -10], [134, 84, 10], [100, 80, -4]],
  },

  // Marla in profile, facing right (viewBox 0 0 160 160): one silhouette path + bun + headscarf knot + closed eye
  marlaProfile: 'M22 160 C24 132 40 116 60 110 L60 96 C46 92 40 78 42 64 C44 44 58 32 78 32 C96 32 108 42 110 56 L112 62 C113 66 116 70 120 72 L124 80 C121 82 117 83 116 85 C117 88 116 90 114 91 C116 93 115 96 112 97 C110 101 104 103 100 103 L98 110 C112 114 126 126 134 160 Z',
  marlaBun: [48, 40, 14],
  marlaScarf: 'M50 50 C64 40 92 38 108 50',
  marlaEye: 'M96 64 q5 4 10 0',
};

/** Standard cauldron markup with the shared animation classes. Packs pass their own fills/strokes/extras. */
export function cauldron(/** @type {{ boil?: boolean, label: string, body: string, rim: string, liquid: string, flames: [string, string], steam: string, bubble: string, splash: string, legs?: string, handles?: string, before?: string, after?: string, bodyExtra?: string }} */ o) {
  const P = GEOM.pot;
  const bub = P.bubbles.map(([x, y, r], i) => `<circle class="bub b${i + 1}${i > 1 ? ' boilonly' : ''}" cx="${x}" cy="${y}" r="${r}" fill="${o.bubble}"/>`).join('');
  const spl = P.splashes.map(([x, y, dx], i) => `<circle class="splash p${i + 1} boilonly" cx="${x}" cy="${y}" r="3" fill="${o.splash}" style="--dx:${dx}px"/>`).join('');
  return `<svg viewBox="0 0 200 200" class="pot${o.boil ? ' boil' : ''}" role="img" aria-label="${o.label}, ${o.boil ? 'boiling' : 'simmering'}" xmlns="http://www.w3.org/2000/svg">
    ${o.before || ''}
    <g fill="none" stroke="${o.steam}" stroke-linecap="round">${P.steam.map((d, i) => `<path class="steam${i ? ' s2' : ''}" d="${d}"/>`).join('')}</g>
    <g class="flames"><path class="flame" d="${P.flame}" fill="${o.flames[0]}"/><path class="flame f2" d="${P.flame2}" fill="${o.flames[1]}"/></g>
    <g class="potbody">
      <path d="${P.legs}" ${o.legs || 'stroke="currentColor" stroke-width="7"'} stroke-linecap="round" fill="none"/>
      <path d="${P.body}" ${o.body}/>
      ${o.bodyExtra || ''}
      <ellipse cx="100" cy="92" rx="68" ry="15" ${o.rim}/>
      <ellipse class="liquid" cx="100" cy="93" rx="58" ry="10" fill="${o.liquid}"/>${bub}
      <path d="${P.handles}" ${o.handles || 'stroke="currentColor" stroke-width="5"'} fill="none" stroke-linecap="round"/>
    </g>${spl}
    ${o.after || ''}
  </svg>`;
}
