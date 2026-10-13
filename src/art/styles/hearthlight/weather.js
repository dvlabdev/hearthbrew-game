// Hearthlight weather: the morning card (the sky is the day clock) and a flat glyph at mini for the HUD.
import { svg, F, ST, lens } from './kit.js';

/** Morning weather card (the sky is the day clock): Whisperwood edge in geometric planes, lit by the weather.
 * Mini is a glyph for the HUD. Card colours don't follow the theme: it is always morning outside. */
function weather(/** @type {'sun' | 'mist' | 'rain' | 'wind' | 'frost'} */ kind, /** @type {{ lod?: string, fit?: 'slice' }} */ o = {}) {
  if ((o.lod || 'icon') === 'mini') {
    const glyph = {
      sun: `<circle cx="24" cy="24" r="9" ${F('--wx-orb-ink')}/>${Array.from({ length: 8 }, (_, i) => `<path d="M24 6 V12" transform="rotate(${i * 45} 24 24)" ${ST('--wx-orb-ink', 3)}/>`).join('')}`,
      mist: `<path d="M14 22 A10 10 0 0 1 34 22 Z" ${F('--wx-orb-ink')} opacity=".55"/><path d="M8 28 H40 M12 35 H36 M8 42 H30" ${ST('--wx-mist-ink', 3.2)}/>`,
      rain: `<path d="M12 26 A8 8 0 0 1 16 11 A11 11 0 0 1 36 13 A7 7 0 0 1 36 26 Z" ${F('--wx-mist-ink')}/><path d="M16 32 L13 40 M25 32 L22 40 M34 32 L31 40" ${ST('--wx-rain-ink', 3)}/>`,
      wind: `<path d="M6 16 H28 A5 5 0 1 0 23 11 M6 25 H36 A5 5 0 1 1 31 30 M6 34 H22" ${ST('--wx-mist-ink', 3.2)}/>`,
      frost: `<path d="M24 6 V42 M8 15 L40 33 M8 33 L40 15 M19 9 L24 14 L29 9 M19 39 L24 34 L29 39" ${ST('--wx-rain-ink', 3)}/>`,
    }[kind];
    return svg('0 0 48 48', glyph, `Weather: ${kind}`);
  }
  const lean = kind === 'wind' ? 5 : 0;
  const tree = (/** @type {number} */ x, /** @type {number} */ b, /** @type {number} */ h) => {
    const dx = lean * h / 30;
    return `<path d="M${x + dx} ${b - h} L${x + h * 0.32} ${b} H${x - h * 0.32} Z" ${F('--wx-tree')}/><path d="M${x + dx} ${b - h} L${x} ${b} H${x - h * 0.32} Z" ${F('--wx-tree-dk')}/>`;
  };
  const TREES = [[8, 66, 22], [20, 64, 30], [34, 66, 20], [128, 64, 26], [142, 66, 34], [154, 64, 22], [116, 66, 18]];
  const trees = TREES.map(([x, b, h]) => tree(x, b, h)).join('');
  const mistBands = [[30, 54, 70, 5], [110, 60, 80, 6], [60, 74, 90, 5]].map(([x, y, w, h]) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${h * 2}" rx="${h}" ${F('--wx-mist')} opacity=".6" filter="url(#hl-soft)"/>`);
  const sky = kind === 'sun' ? 'sun' : kind === 'mist' ? 'mist' : kind === 'frost' ? 'frost' : 'rain';
  const orbOpacity = { sun: 1, mist: 0.55, rain: 0, wind: 0.8, frost: 0.9 }[kind];
  const clouds = (/** @type {number} */ op) => `<g ${F('--wx-cloud')} opacity="${op}">${[[30, 22, 26], [84, 16, 32], [140, 26, 24]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.42}"/><ellipse cx="${x + r * 0.4}" cy="${y - r * 0.18}" rx="${r * 0.55}" ry="${r * 0.4}"/>`).join('')}</g>`;
  const extra = {
    sun: `<path d="M118 30 L36 100 H70 Z M118 30 L96 100 H122 Z" ${F('--wx-orb')} opacity=".14"/>`,
    mist: '',
    rain: `${clouds(0.95)}<g ${ST('--wx-rain', 1.1)} opacity=".7">${Array.from({ length: 28 }, (_, i) => `<path d="M${(i * 37) % 168 - 4} ${30 + ((i * 53) % 60)} l-3 8"/>`).join('')}</g>`,
    wind: `${clouds(0.6)}<g ${ST('--wx-mist', 1.4)} opacity=".75"><path d="M10 36 H70 Q80 36 80 30 M40 46 H120 Q132 46 132 40 M96 30 H150"/></g>
      <g ${F('--wx-leaf')}>${[[52, 40, 30], [104, 34, -20], [140, 50, 60], [24, 50, 10]].map(([x, y, r]) => `<path d="${lens(5, 1.8)}" transform="translate(${x} ${y}) rotate(${r})"/>`).join('')}</g>`,
    frost: `<g ${F('--wx-frost')} opacity=".9">${Array.from({ length: 14 }, (_, i) => `<circle cx="${(i * 41) % 160}" cy="${8 + ((i * 29) % 52)}" r=".9"/>`).join('')}</g>`,
  }[kind];
  const snowcaps = kind === 'frost' ? `<g ${F('--wx-frost')}>${TREES.map(([x, b, h]) => `<path d="M${x} ${b - h} L${x + h * 0.12} ${b - h * 0.62} H${x - h * 0.12} Z"/>`).join('')}</g>` : '';
  return svg('0 0 160 100', `<g clip-path="url(#hl-card)"><rect width="160" height="100" fill="url(#hl-wx-${sky})"/>
    <circle cx="118" cy="30" r="44" fill="url(#hl-glow)" opacity="${kind === 'sun' ? 0.85 : kind === 'rain' ? 0 : 0.35}"/><circle cx="118" cy="30" r="11" ${F('--wx-orb')} opacity="${orbOpacity}"/>
    ${extra}
    <path d="M0 62 L22 50 L40 56 L62 44 L86 54 L108 46 L130 52 L160 42 V100 H0 Z" ${F('--wx-far')} opacity="${kind === 'mist' ? 0.55 : 1}"/>
    ${kind === 'mist' ? mistBands.slice(0, 2).join('') : ''}${trees}${snowcaps}
    <path d="M0 78 Q40 70 80 76 Q120 82 160 72 V100 H0 Z" ${F(kind === 'frost' ? '--wx-frost' : '--wx-near')}/><path d="M0 78 Q40 70 80 76 L70 100 H0 Z" ${F('--wx-tree-dk')} opacity="${kind === 'frost' ? 0.15 : 0.35}"/>
    <path d="M66 100 Q76 88 90 80 Q100 75 112 75" ${ST(kind === 'rain' ? '--wx-puddle' : '--wx-path', 5)}/>
    ${kind === 'sun' ? `<g ${F('--wx-tree-dk')} opacity=".3">${[[20, 65], [128, 65], [142, 67]].map(([x, b]) => `<path d="M${x} ${b} L${x - 26} ${b + 6} H${x - 18} Z"/>`).join('')}</g>` : kind === 'mist' ? mistBands.slice(2).join('') : ''}
    ${kind === 'mist' ? `<rect width="160" height="100" ${F('--wx-mist')} opacity=".22"/>` : ''}
    <rect width="160" height="100" fill="#000" filter="url(#hl-grain)"/></g>`, `Weather: ${kind}`, undefined, o.fit);
}

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'weather:sun': (o = {}) => weather('sun', o),
  'weather:mist': (o = {}) => weather('mist', o),
  'weather:rain': (o = {}) => weather('rain', o),
  'weather:wind': (o = {}) => weather('wind', o),
  'weather:frost': (o = {}) => weather('frost', o),
};
