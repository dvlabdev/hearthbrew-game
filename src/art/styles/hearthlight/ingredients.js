// Hearthlight ingredients: geometric silhouettes lit by gradient, botanical detail at hero (design/visual/04d-direction.md).
// Each asset takes { lod: 'mini' | 'icon' | 'hero', at? } and draws through the painter `p`: what changes with size is decided here.
import { GEOM } from '../../geom.js';
import { asset, svg, F, ST, LINE, lens, cast } from './kit.js';

/** @typedef {import('../../lod.js').Painter} Painter */

/** Chamomile head: geometric lens petals lit by gradient (shadow side darker), a domed disc with florets in a spiral. */
export function flower(/** @type {Painter} */ p, /** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ r, n = 15, tilt = 0) {
  const angles = Array.from({ length: n }, (_, i) => ((360 / n) * i + tilt) % 360);
  const petal = (/** @type {number} */ a, /** @type {string} */ paint) => `<path d="${lens(r, r * 0.21)}" transform="rotate(${a.toFixed(1)})" ${paint}/>`;
  const shadowSide = (/** @type {number} */ a) => a > 165 && a < 290;
  const c = r * 0.36;
  if (p.is('mini')) {
    return `<g transform="translate(${cx} ${cy})">${angles.map(a => petal(a, F(shadowSide(a) ? '--petal-sh' : '--petal'))).join('')}<circle r="${c}" ${F('--yolk')}/>
      <path d="M${-c * 0.7} ${c * 0.7} A${c} ${c} 0 0 1 ${c * 0.7} ${-c * 0.7} A${c} ${c} 0 0 0 ${-c * 0.7} ${c * 0.7} Z" ${F('--yolk-dk')}/></g>`;
  }
  const under = angles.map(a => petal(a + 4, F('--petal-sh'))).join('');
  const petals = angles.map(a => petal(a, `fill="url(#hl-petal)"${shadowSide(a) ? ' opacity=".8"' : ''}${p.is('hero') ? ` ${LINE(0.35)}` : ''}`)).join('')
    + (p.is('hero') ? angles.map(a => `<path d="M0 ${-c - 1} V${-r * 0.82}" transform="rotate(${a.toFixed(1)})" ${ST('--petal-sh', 0.45)}/>`).join('') : '');
  const nf = Math.round(r * (p.is('hero') ? 3 : 2));
  const florets = Array.from({ length: nf }, (_, i) => {
    const t = i * 2.39996, rr = c * 0.9 * Math.sqrt(i / nf);
    return `<circle cx="${(Math.cos(t) * rr).toFixed(2)}" cy="${(Math.sin(t) * rr).toFixed(2)}" r="${(c * 0.09).toFixed(2)}"/>`;
  }).join('');
  return `<g transform="translate(${cx} ${cy})">${under}${petals}
    <circle r="${c}" fill="url(#hl-yolk)"/><path d="M${-c * 0.7} ${c * 0.7} A${c} ${c} 0 0 1 ${c * 0.7} ${-c * 0.7} A${c} ${c} 0 0 0 ${-c * 0.7} ${c * 0.7} Z" ${F('--yolk-dk')} opacity=".45"/>
    <g ${F('--yolk-dk')} opacity=".55">${florets}</g></g>`;
}
/** Finely divided leaf (Naturalist structure, crisp strokes). */
export function frond(/** @type {Painter} */ p, /** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ ang, /** @type {number} */ len, n = 5) {
  if (p.is('mini')) return `<path d="${lens(len * 0.8, len * 0.16)}" transform="translate(${x} ${y}) rotate(${ang + 90})" ${F('--leaf')}/>`;
  if (p.is('hero')) n += 2;
  let d = `M0 0 L${len} 0`;
  for (let i = 1; i <= n; i++) {
    const t = (len * i) / (n + 1), l = len * 0.3 * (1 - i / (n + 2));
    d += ` M${t.toFixed(1)} 0 l${(l * 0.6).toFixed(1)} ${(-l).toFixed(1)} M${t.toFixed(1)} 0 l${(l * 0.6).toFixed(1)} ${l.toFixed(1)}`;
  }
  return `<path d="${d}" transform="translate(${x} ${y}) rotate(${ang})" ${ST('--leaf', p.is('hero') ? 1 : 1.2)}/>`;
}

/** Geometric leaf (Fable lens + shadow half + midrib); `toothed` gives a serrated edge; hero adds veins and a fine outline. */
export function leaf(/** @type {Painter} */ p, /** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ ang, /** @type {number} */ L, /** @type {number} */ w, /** @type {string} */ tone, toothed = 0, shape = 'lens') {
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
  const veins = p.is('hero') ? Array.from({ length: 4 }, (_, i) => { const t = (L * (i + 1)) / 5.5; return `M0 ${-t} l${w * 0.6} ${-L * 0.13} M0 ${-t} l${-w * 0.6} ${-L * 0.13}`; }).join(' ') : '';
  return `<g transform="translate(${x} ${y}) rotate(${ang})"><path d="${d}" ${p.paint(tone)}/><path d="${half}" ${F(`--${tone}-dk`)} opacity=".5"/>
    ${p.is('mini') ? '' : `<path d="M0 -1 V${(-L * 0.85).toFixed(1)}" ${ST(`--${tone}-hi`, 1)} opacity=".75"/>`}${veins ? `<path d="${veins}" ${ST(`--${tone}-dk`, 0.5)}/><path d="${d}" fill="none" ${LINE(0.45)}/>` : ''}</g>`;
}

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'ingredient:chamomile': (o = {}) => asset(o, p => svg('0 0 100 100', `${cast(p, 52, 92, 25)}
    <path d="M50 90 L38 42 M50 90 L71 54 M50 90 L24 66" ${ST('--leaf-dk', 2.2)} stroke-linecap="butt"/>
    ${frond(p, 45, 74, 200, 15)}${frond(p, 47, 70, -40, 14)}${frond(p, 42, 60, 215, 11)}${frond(p, 58, 69, -10, 12)}
    <rect x="41" y="80" width="18" height="5" rx="1" ${F('--twine')}/>${p.fine(`<path d="M41 82.5 H59" ${ST('--twine-dk', 0.8)}/>`)}<path d="M50 85 L45 93 M50 85 L55 93" ${ST('--twine', 1.8)} stroke-linecap="butt"/>
    ${flower(p, 71, 52, 13, 13, 10)}${flower(p, 24, 64, 9, 11)}${flower(p, 38, 38, 19, 15, 4)}`, 'Chamomile', o.at)),

  'ingredient:fireroot': (o = {}) => asset(o, p => svg('0 0 100 100', `${cast(p, 54, 77, 34)}
    ${[GEOM.fireroot[1], GEOM.fireroot[2]].map(d => `<path d="${d}" ${ST('--root-dk', 9.5)}/><path d="${d}" ${ST('--root', 7)}/>`).join('')}
    <path d="${GEOM.fireroot[0]}" ${p.paint('root')}/>
    <g clip-path="url(#hl-rootclip)"><path d="M10 60 L90 56 V80 H10 Z" ${F('--root-dk')} opacity=".55"/><path d="M20 40 L76 34 L80 46 L26 52 Z" ${F('--root-hi')} opacity=".55"/>
      ${p.fine(`<path d="M28 48 C26 56 27 64 31 70 M40 46 C37 56 38 66 42 73 M56 42 C53 52 54 62 58 70 M68 42 C66 50 66 60 70 70" ${ST('--root-dk', 0.9)}/>`)}</g>
    ${p.fine(`<path d="M30 70 c-2 3 -1 6 -4 9 M44 72 c1 3 -1 6 0 9 M66 71 c2 3 1 5 3 8" ${ST('--root-dk', 0.9)}/>`)}
    ${p.soft('<circle cx="82" cy="58" r="17" fill="url(#hl-ember)" opacity=".85"/>')}
    <path d="M34 63 l6 -3 l4 4 l7 -2 M60 59 l5 3 l6 -2" ${ST('--ember', 1.5)}/>
    <path d="M82.5 49.5 L87.5 58 L82.5 66.5 L78.5 58 Z" ${F('--ember-hi')}/>${p.is('mini') ? '' : `<path d="M82.5 58 L80 53 M82.5 58 L85 53 M82.5 58 L80 63 M82.5 58 L85 63" ${ST('--ember', 0.6)}/>`}
    ${p.is('hero') ? `<path d="${GEOM.fireroot[0]}" fill="none" ${LINE(0.7)}/><g clip-path="url(#hl-rootclip)" ${ST('--root-dk', 0.5)}><path d="M24 56 C30 52 36 52 40 56 M46 50 C52 47 58 48 62 52 M64 56 C70 53 76 54 80 58"/></g>` : ''}`, 'Fireroot', o.at)),

  'ingredient:rosehip': (o = {}) => asset(o, p => svg('0 0 100 100', `${cast(p, 52, 89, 27)}
    <path d="M14 22 C34 26 48 36 57 48 M30 26 C38 36 40 46 38 54" ${ST('--twig', 2.4)}/>
    <g ${F('--twig')}><path d="M24 23 l-1 -4 l3 3 Z"/><path d="M40 30 l1 -4 l2 4 Z"/></g>
    ${/** @type {[number, number, number, number][]} */ ([[36, 19, -50, 16], [22, 23, -140, 13]]).map(([x, y, r, l]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="${lens(l, l * 0.34)}" transform="rotate(90)" ${p.paint('leaf')}/>
      ${p.fine(`<path d="M0 0 H${l * 0.9} M${l * 0.3} 0 l${l * 0.12} ${-l * 0.14} M${l * 0.3} 0 l${l * 0.12} ${l * 0.14} M${l * 0.55} 0 l${l * 0.12} ${-l * 0.12} M${l * 0.55} 0 l${l * 0.12} ${l * 0.12}" ${ST('--vein', 0.5)}/>`)}</g>`).join('')}
    ${/** @type {[number, number, number][]} */ ([[64, 60, -30], [36, 68, 10]]).map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">
      <ellipse rx="12" ry="15" ${p.paint('berry')}/><path d="M-14 -16 C-2 -6 -2 6 -8 18 H-14 Z" ${F('--berry-dk')} opacity=".45" clip-path="url(#hl-hip)"/>
      ${p.soft(`<ellipse cx="4.5" cy="-6" rx="2.2" ry="4" ${F('--gem-hi')} opacity=".6" filter="url(#hl-soft)"/>`)}<circle cx="4" cy="-8" r="1" ${F('--gem-hi')}/>
      <g ${F('--berry-dk')} opacity=".5"><circle cx="-4" cy="2" r=".6"/><circle cx="-2" cy="7" r=".5"/><circle cx="3" cy="4" r=".5"/></g>
      <path d="M0 14 L-5 21 M0 14 L5 21 M0 14 V22 M0 14 L-8 17 M0 14 L8 17" ${ST('--sepal', 1.2)}/>${p.is('hero') ? `<ellipse rx="12" ry="15" fill="none" ${LINE(0.6)}/>` : ''}</g>`).join('')}`, 'Rosehip', o.at)),

  // ---- validation spike (timed: design/visual/05-spike-log.md) ----
  'ingredient:sage': (o = {}) => asset(o, p => svg('0 0 100 100', `${cast(p, 50, 93, 22)}
    <path d="M50 92 C50 76 50 58 51 34" ${ST('--sage-dk', 3)}/>
    ${[[82, 28, 82], [66, 25, 74], [51, 20, 62]].map(([y, L, a]) => leaf(p, 50, y, -a, L, L * 0.4, 'sage', 0, 'oval') + leaf(p, 50, y, a, L, L * 0.4, 'sage', 0, 'oval')).join('')}
    ${leaf(p, 51, 38, -28, 15, 6, 'sage', 0, 'oval')}${leaf(p, 51, 38, 28, 15, 6, 'sage', 0, 'oval')}${leaf(p, 51, 36, 0, 14, 5.5, 'sage', 0, 'oval')}
    ${p.is('hero') ? `<g ${F('--sage-hi')} opacity=".6">${[[38, 70], [62, 70], [40, 55], [60, 55], [42, 41], [58, 41]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7"/>`).join('')}</g>` : ''}`, 'Sage', o.at)),

  'ingredient:mint': (o = {}) => asset(o, p => svg('0 0 100 100', `${cast(p, 50, 93, 22)}
    <path d="M50 92 C51 74 50 54 50 34" ${ST('--mint-stem', 2.6)}/>
    ${[[84, 19, 80], [71, 18, 72], [59, 16, 62], [48, 14, 54]].map(([y, L, a]) => leaf(p, 50, y, -a, L, L * 0.38, 'mint', 4, 'oval') + leaf(p, 50, y, a, L, L * 0.38, 'mint', 4, 'oval')).join('')}
    ${[[-58, 13], [58, 13], [-24, 15], [24, 15], [0, 15]].map(([a, L]) => leaf(p, 50, 40, a, L, L * 0.4, 'mint', 3, 'oval')).join('')}`, 'Mint', o.at)),

  'ingredient:nettle': (o = {}) => asset(o, p => svg('0 0 100 100', `${cast(p, 50, 93, 24)}
    <path d="M50 92 C49 70 51 44 50 16" ${ST('--nettle-dk', 2.8)}/>
    ${/** @type {[number, number][]} */ ([[72, 1], [50, -1], [72, -1], [50, 1]]).map(([y, s]) => `<path d="M50 ${y} q${s * 4} 6 ${s * 7} 16 M50 ${y} q${s * 7} 4 ${s * 12} 12" ${ST('--nettle-hi', 1.8)}/>
      <g ${F('--nettle-hi')}>${[0.35, 0.6, 0.85].map(t => `<circle cx="${50 + s * 7 * t}" cy="${y + 16 * t}" r="1.4"/><circle cx="${50 + s * 12 * t}" cy="${y + 12 * t}" r="1.3"/>`).join('')}</g>`).join('')}
    ${[[70, 30, 122], [48, 26, 112], [30, 19, 96]].map(([y, L, a]) => leaf(p, 50, y, -a, L, L * 0.36, 'nettle', 6, 'heart') + leaf(p, 50, y, a, L, L * 0.36, 'nettle', 6, 'heart')).join('')}
    ${leaf(p, 50, 18, -36, 11, 4, 'nettle', 3, 'heart')}${leaf(p, 50, 18, 36, 11, 4, 'nettle', 3, 'heart')}${leaf(p, 50, 16, 0, 9, 3.4, 'nettle', 2, 'heart')}
    ${p.is('hero') ? `<path d="${Array.from({ length: 14 }, (_, i) => { const y = 88 - i * 5.2, sd = i % 2 ? 1 : -1; return `M${50 + sd * 0.8} ${y} l${sd * 3} -2`; }).join(' ')}" ${ST('--nettle-hi', 0.5)}/>` : ''}`, 'Nettle', o.at)),

  'ingredient:honey': (o = {}) => asset(o, p => svg('0 0 100 100', `${cast(p, 50, 91, 26)}
    <path d="M30 46 C30 40 34 38 38 38 H62 C66 38 70 40 70 46 V82 C70 88 66 90 60 90 H40 C34 90 30 88 30 82 Z" ${F('--glass')} opacity=".35"/>
    <path d="M32 52 H68 V82 C68 86 65 88 60 88 H40 C35 88 32 86 32 82 Z" ${p.paint('honey')}/>
    <path d="M32 52 H44 C40 62 40 78 46 88 H40 C35 88 32 86 32 82 Z" ${F('--honey-dk')} opacity=".45"/>
    <path d="M32 52 Q40 49 50 52 Q60 55 68 52" fill="none" ${ST('--honey-hi', 1.4)}/>
    <path d="M63 42 V84" ${ST('--gem-hi', 2.4)} opacity=".45"/>
    <path d="M24 40 Q50 28 76 40 L72 47 Q50 39 28 47 Z" ${F('--cloth')}/><path d="M24 40 Q37 34 50 33 L50 41 Q38 42 28 47 Z" ${F('--cloth-dk')} opacity=".5"/>
    ${p.is('mini') ? '' : `<g ${F('--apron')} opacity=".75">${[[34, 40], [44, 37], [56, 37], [66, 40]].map(([x, y]) => `<rect x="${x}" y="${y}" width="3" height="3"/>`).join('')}</g>`}
    <path d="M28 46 Q50 41 72 46" ${ST('--twine', 2.6)}/>
    <path d="M38 62 H62 V76 H38 Z" ${F('--apron')}/>
    ${p.is('mini') ? '' : `<path d="M50 65 l3 1.8 v3.5 l-3 1.8 l-3 -1.8 v-3.5 Z" ${F('--honey-dk')}/>`}
    ${p.is('hero') ? `<path d="M41 62 V76 M59 62 V76" ${ST('--paper-line', 0.5)}/><path d="M44 74 h12" ${ST('--ink-line', 0.6)}/><path d="M38 62 H62 V76 H38 Z" fill="none" ${LINE(0.5)}/>` : ''}
    <path d="M70 58 C73 58 73 64 72 68 C71 72 69 72 69 68 Z" ${p.paint('honey')}/>`, 'Honey', o.at)),

  'ingredient:lavender': (o = {}) => asset(o, p => {
    const tops = [[30, 20], [41, 12], [52, 10], [63, 13], [72, 22]];
    const spike = (/** @type {number} */ x, /** @type {number} */ y) => {
      const a = Math.atan2(x - 50, 80 - y) * 180 / Math.PI;
      if (p.is('mini')) return `<g transform="translate(${x} ${y}) rotate(${a.toFixed(1)})"><path d="${lens(22, 4.2)}" transform="rotate(180)" ${F('--lav')}/><path d="M0 0 Q-4.2 11 0 22 Z" ${F('--lav-dk')}/></g>`;
      const n = p.is('hero') ? 9 : 7;
      return `<g transform="translate(${x} ${y}) rotate(${a.toFixed(1)})">${Array.from({ length: n }, (_, i) => {
        const yy = 2 + i * (20 / n), r = 2.9 - i * 0.12, sd = i % 2 ? 1.6 : -1.6;
        return `<ellipse cx="${sd}" cy="${yy}" rx="${r * 0.8}" ry="${r}" ${p.paint('lav')}/>${p.is('hero') ? `<path d="M${sd} ${yy + r} l${sd * 0.4} 1.4" ${ST('--lav-dk', 0.5)}/>` : ''}`;
      }).join('')}<ellipse cx="0" cy="0" rx="1.6" ry="2.2" ${F('--lav-hi')}/></g>`;
    };
    return svg('0 0 100 100', `${cast(p, 50, 93, 20)}
      <g ${ST('--sage-dk', 1.8)}>${tops.map(([x, y]) => `<path d="M50 92 L50 80 L${x} ${y + 20}"/>`).join('')}</g>
      ${leaf(p, 46, 84, -150, 16, 3, 'sage')}${leaf(p, 54, 84, 150, 16, 3, 'sage')}
      ${tops.map(([x, y]) => spike(x, y)).join('')}
      <rect x="43" y="77" width="14" height="6" rx="1" ${F('--twine')}/><path d="M50 83 l-5 7 M50 83 l4 7" ${ST('--twine', 1.8)}/>`, 'Lavender', o.at);
  }),
};
