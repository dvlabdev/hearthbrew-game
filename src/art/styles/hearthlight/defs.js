// Hearthlight's shared <defs> (gradients, filters, clip paths): the page injects them once; assets reference them by id.
import { GEOM, FACE } from '../../geom.js';
import { lin, rad, SHAPES, almond, hx, hy, hrx, hry } from './kit.js';

/** One defs block for the whole pack; the page injects it once. */
export const defs = `<defs>
  ${lin('hl-sky', [[0, '--sky-top'], [1, '--sky-bot']])}
  ${lin('hl-wall', [[0, '--wall'], [1, '--wall-dk']])}
  ${lin('hl-wood', [[0, '--wood-hi'], [0.35, '--wood'], [1, '--wood-dk']])}
  ${rad('hl-iron', [[0, '--iron-hi'], [0.45, '--iron'], [1, '--iron-dk']], 0.62, 0.25, 0.85)}
  ${rad('hl-skin', [[0, '--skin-hi'], [0.6, '--skin'], [1, '--skin-sh']], 0.64, 0.4, 0.72)}
  ${rad('hl-skin2', [[0, '--skin2-hi'], [0.6, '--skin2'], [1, '--skin2-sh']], 0.64, 0.4, 0.72)}
  ${['sun', 'mist', 'rain', 'frost'].map(k => lin(`hl-wx-${k}`, [[0, `--wx-${k}-top`], [1, `--wx-${k}-bot`]])).join('')}
  ${lin('hl-plaid', [[0, '--plaid'], [1, '--plaid-dk']])}
  ${lin('hl-petal', [[0, '--petal'], [0.65, '--petal'], [1, '--petal-sh']])}
  ${rad('hl-yolk', [[0, '--yolk-hi'], [0.55, '--yolk'], [1, '--yolk-dk']], 0.6, 0.3, 0.75)}
  ${lin('hl-leaf', [[0, '--leaf-hi'], [1, '--leaf-dk']])}
  ${['sage', 'mint', 'nettle', 'lav'].map(t => lin(`hl-${t}`, [[0, `--${t}-hi`], [0.45, `--${t}`], [1, `--${t}-dk`]], 1, 1)).join('')}
  ${rad('hl-honey', [[0, '--honey-hi'], [0.55, '--honey'], [1, '--honey-dk']], 0.62, 0.3, 0.8)}
  ${rad('hl-root', [[0, '--root-hi'], [0.55, '--root'], [1, '--root-dk']], 0.55, 0.2, 0.85)}
  ${rad('hl-ember', [[0, '--ember-hi'], [0.45, '--ember', 0.9], [1, '--ember', 0]], 0.5, 0.5, 0.5)}
  ${rad('hl-berry', [[0, '--berry-hi'], [0.45, '--berry'], [1, '--berry-dk']], 0.6, 0.28, 0.8)}
  ${rad('hl-coin', [[0, '--coin-hi'], [0.6, '--coin'], [1, '--coin-dk']], 0.62, 0.32, 0.75)}
  ${lin('hl-scarf', [[0, '--scarf'], [1, '--scarf-dk']])}
  ${lin('hl-dress', [[0, '--dress'], [1, '--dress-dk']])}
  ${lin('hl-browshade', [[0, '--skin-sh', 0.8], [1, '--skin-sh', 0]])}
  ${rad('hl-glow', [[0, '--glow', 0.95], [0.35, '--glow', 0.4], [1, '--glow', 0]], 0.5, 0.5, 0.5)}
  ${rad('hl-vig', [[0.55, '--shadow', 0], [1, '--shadow', 0.55]], 0.5, 0.45, 0.75)}
  ${lin('hl-gem', [[0, '--gem-hi', 0.6], [0.5, '--gem-hi', 0]])}
  ${lin('hl-glass', [[0, '--gem-hi', 0.05], [0.2, '--gem-hi', 0.5], [0.32, '--gem-hi', 0.05], [1, '--gem-hi', 0]], 1, 0)}
  <filter id="hl-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>
  <filter id="hl-blur" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>
  <filter id="hl-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 .45  0 0 0 0 .35  0 0 0 0 .3  0 0 0 .1 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <filter id="hl-paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="2"/><feColorMatrix type="matrix" values="0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .1  .35 0 0 0 -.12"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <filter id="hl-woodgrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.35" numOctaves="2" seed="9"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .1  0 0 0 0 .05  0 0 0 0 0  .9 0 0 0 -.25"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <clipPath id="hl-head"><ellipse cx="${hx}" cy="${hy}" rx="${hrx}" ry="${hry}"/></clipPath>
  <clipPath id="hl-body"><path d="${FACE.body}"/></clipPath>
  <clipPath id="hl-scarfclip"><path d="${FACE.scarf}"/></clipPath>
  <clipPath id="hl-rootclip"><path d="${GEOM.fireroot[0]}"/></clipPath>
  <clipPath id="hl-pot"><path d="${GEOM.pot.body}"/></clipPath>
  <clipPath id="hl-hip"><ellipse rx="12" ry="15"/></clipPath>
  <clipPath id="hl-pellbody"><path d="M6 160 C8 128 32 114 58 110 L102 110 C128 114 152 128 154 160 Z"/></clipPath>
  <clipPath id="hl-beanie"><path d="M46 70 C44 42 60 30 80 30 C100 30 116 42 114 70 C104 64 92 62 80 62 C68 62 56 64 46 70 Z"/></clipPath>
  <clipPath id="hl-card"><rect width="160" height="100" rx="10"/></clipPath>
  <clipPath id="hl-coinclip"><circle cx="12" cy="12" r="10.5"/></clipPath>
  ${Object.entries(SHAPES).map(([k, s]) => `<clipPath id="hl-tr-${k}">${s}</clipPath>`).join('')}
  ${['tired', 'happy'].map(m => FACE.eyes.map(([x, y], i) => `<clipPath id="hl-eye-${m}-${i}"><path d="${almond(x, y, m)}"/></clipPath>`).join('')).join('')}
</defs>`;
