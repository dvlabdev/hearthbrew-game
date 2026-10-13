// Hearthlight UI art: trait badges (colour + shape + glyph), the coin, the material swatch.
import { svg, F, SHAPES } from './kit.js';

/** Trait badge: the trait colour as a lit gem with Fable's crisp shadow plane, dark glyph. */
function badge(/** @type {'heat' | 'calm' | 'vigor' | 'clarity'} */ k, /** @type {string} */ glyph, /** @type {string} */ name) {
  return svg('0 0 48 48', `${SHAPES[k].replace('/>', ` style="fill:var(--${k});stroke:var(--trait-rim)" stroke-width="2.5" stroke-linejoin="round"/>`)}
    <path d="M0 48 L48 0 V48 Z" ${F('--on-trait')} opacity=".14" clip-path="url(#hl-tr-${k})"/>${SHAPES[k].replace('/>', ' fill="url(#hl-gem)"/>')}<path d="${glyph}" ${F('--on-trait')}/>`, name);
}

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'trait:heat': () => badge('heat', 'M24 18c4 5 6 8 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3-1-3 0-5 0-8z', 'Heat'),
  'trait:calm': () => badge('calm', 'M24 12c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z', 'Calm'),
  'trait:vigor': () => badge('vigor', 'M14 34c0-12 8-20 22-20 0 14-8 22-20 22z', 'Vigor'),
  'trait:clarity': () => badge('clarity', 'M24 13l2.8 7.7 8.2.3-6.4 5 2.3 7.9L24 29.3l-6.9 4.6 2.3-7.9-6.4-5 8.2-.3z', 'Clarity'),

  'ui:coin': () => svg('0 0 24 24', `<circle cx="12" cy="12" r="10.5" fill="url(#hl-coin)"/><path d="M0 24 L24 0 V24 Z" ${F('--coin-dk')} opacity=".35" clip-path="url(#hl-coinclip)"/>
    <path d="M12 6 L15 12 L12 18 L9 12 Z" ${F('--coin-dk')} opacity=".8"/><path d="M12 6 L15 12 L12 12 Z" ${F('--coin-hi')}/>`, 'Coin'),
  'ui:texture': () => svg('0 0 100 100', `<rect width="100" height="100" rx="12" fill="url(#hl-wall)"/><circle cx="72" cy="28" r="50" fill="url(#hl-glow)" opacity=".7"/>
    <path d="M0 74 L30 66 L60 72 L100 62 V100 H0 Z" ${F('--wood')}/><rect y="62" width="100" height="38" fill="#000" filter="url(#hl-woodgrain)"/><rect width="100" height="100" rx="12" fill="#000" filter="url(#hl-grain)"/>`, 'Lantern light, planes and grain'),
};
