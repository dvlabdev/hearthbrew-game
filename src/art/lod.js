// Level of detail for style packs (design/visual/05-design-system.md, "Detail by size").
// A drawing function receives a painter `p` and asks it, explicitly, how to draw each part at this size.
// Packs never post-process SVG text to simplify it: what's dropped at mini is decided where it's drawn.
//   hero ≥160px: everything, plus hero-only detail (veins, petal lines, outlines)
//   icon ~96px:  the default
//   mini ≤48px:  flat fills, no filtered layers (blur, glow, grain), no hairlines

export const LODS = /** @type {const} */ (['mini', 'icon', 'hero']);
/** @typedef {typeof LODS[number]} Lod */

/**
 * @typedef {object} Painter
 * @property {Lod} lod
 * @property {(l: Lod) => boolean} is              exactly this level
 * @property {(l: Lod) => boolean} atLeast         this level or more detailed
 * @property {(grad: string, flat?: string) => string} paint   a gradient fill; at mini, the flat token (default: same name)
 * @property {(markup: string) => string} soft     filtered layers (blur, glow, grain, embers): dropped at mini
 * @property {(markup: string) => string} fine     hairlines and sub-1px strokes: dropped at mini
 * @property {(markup: string) => string} detail   hero-only extras: drawn at hero only
 */

/**
 * @param {string | undefined} lod @param {{ prefix: string }} pack  the pack's defs id prefix, e.g. 'hl'
 * @returns {Painter}
 */
export function painter(lod, { prefix }) {
  const l = /** @type {Lod} */ (LODS.includes(/** @type {Lod} */ (lod)) ? lod : 'icon');
  const rank = LODS.indexOf(l), mini = l === 'mini';
  return {
    lod: l,
    is: x => l === x,
    atLeast: x => rank >= LODS.indexOf(x),
    paint: (grad, flat = grad) => (mini ? `style="fill:var(--${flat})"` : `fill="url(#${prefix}-${grad})"`),
    soft: m => (mini ? '' : m),
    fine: m => (mini ? '' : m),
    detail: m => (l === 'hero' ? m : ''),
  };
}
