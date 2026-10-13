// Hearthlight customers: one modelled FACE base, re-proportioned per person; moods change eyes, brows and mouth.
import { FACE } from '../../geom.js';
import { svg, F, ST, lens, almond, hx, hy, hrx, hry } from './kit.js';

/** Modelled eyes (Naturalist detail): white, iris, lid shadow, catchlight; tired adds bags. Shared by every customer. */
function eyePair(/** @type {string} */ mood) {
  return FACE.eyes.map(([x, y], i) => {
    const lidY = mood === 'happy' ? 3.6 : 2.8;
    return `<path d="${almond(x, y, mood)}" ${F('--eye-white')}/>
      <g clip-path="url(#hl-eye-${mood}-${i})"><circle cx="${x + 0.5}" cy="${y + 0.3}" r="3.5" ${F('--iris')}/><circle cx="${x + 0.5}" cy="${y + 0.3}" r="1.7" ${F('--eye')}/>
        <path d="M${x - 8} ${y - 6} H${x + 8} V${y - 1} C${x + 4} ${y - lidY - 0.6} ${x - 4} ${y - lidY - 0.6} ${x - 8} ${y - 1} Z" ${F('--skin-sh')} opacity=".5"/></g>
      <circle cx="${x + 1.8}" cy="${y - 0.8}" r=".9" ${F('--gem-hi')}/>
      <path d="M${x - 7} ${y} C${x - 4} ${y - lidY} ${x + 4} ${y - lidY} ${x + 7} ${y}" ${ST('--ink-line', 1.5)}/>
      <path d="M${x - 6} ${y - lidY - 2.3} C${x - 2} ${y - lidY - 4} ${x + 3} ${y - lidY - 4} ${x + 6} ${y - lidY - 2}" ${ST('--skin-sh', 0.9)}/>
      ${mood === 'tired' ? `<path d="M${x - 6} ${y + 4.5} C${x - 2} ${y + 7} ${x + 3} ${y + 7} ${x + 6} ${y + 4}" ${ST('--skin-sh', 1.1)}/><ellipse cx="${x}" cy="${y + 5.5}" rx="6" ry="2" ${F('--bags')} opacity=".3" filter="url(#hl-soft)"/>`
        : `<path d="M${x - 6} ${y + 3.4} C${x - 2} ${y + 5.4} ${x + 3} ${y + 5.4} ${x + 6} ${y + 3}" ${ST('--skin-sh', 0.9)}/>`}`;
  }).join('');
}

function portrait(/** @type {{ mood?: 'tired' | 'happy', bare?: boolean }} */ o = {}) {
  const mood = o.mood || 'tired';
  const eyes = eyePair(mood);
  const mouth = mood === 'happy'
    ? `<path d="M71 101.5 Q80 110.5 89 101.5 Q80 104 71 101.5 Z" ${F('--mouth-in')}/><path d="M73.5 102.5 Q80 104.6 86.5 102.5 L86 104 Q80 105.6 74 104 Z" ${F('--eye-white')}/>
       <path d="M74 107.5 Q80 111.5 86 107.5" ${ST('--lips', 2.2)} opacity=".7"/><path d="M69.5 100.5 q1.2 1.4 1.5 3 M90.5 100.5 q-1.2 1.4 -1.5 3" ${ST('--skin-sh', 1)}/>`
    : `<path d="M73 104.5 Q76.5 102.6 80 103.4 Q83.5 102.6 87 104.5 Q80 104.2 73 104.5 Z" ${F('--lips')}/><path d="M73.5 104.6 Q80 109 86.5 104.6 Q80 105 73.5 104.6 Z" ${F('--lips-hi')}/>
       <path d="M73 104.5 Q80 104.8 87 104.5" ${ST('--mouth-in', 1)}/>`;
  const dots = [[58, 52], [70, 43], [84, 39], [97, 44], [106, 57], [54, 62], [64, 52], [92, 50]];
  return svg('0 0 160 160', `${o.bare ? '' : `<rect width="160" height="160" rx="14" fill="url(#hl-wall)"/><circle cx="134" cy="40" r="72" fill="url(#hl-glow)" opacity=".55"/>`}
    <path d="${FACE.body}" fill="url(#hl-dress)"/><path d="M0 100 L60 100 C56 126 60 146 74 160 H0 Z" ${F('--dress-dk')} opacity=".6" clip-path="url(#hl-body)"/>
    <path d="${FACE.bib}" ${F('--apron')}/><path d="M61 160 L64 131 H71 L69 160 Z" ${F('--apron-sh')}/><path d="${FACE.straps}" ${ST('--apron', 6)} stroke-linecap="butt"/>
    <g ${F('--flour')} opacity=".55" filter="url(#hl-soft)"><ellipse cx="78" cy="143" rx="5" ry="2.6"/><circle cx="88" cy="150" r="1.8"/></g>
    <path d="M140 160 C138 136 124 122 104 116" ${ST('--glow', 2.4)} opacity=".45"/>
    <path d="${FACE.neck}" ${F('--skin-sh')}/><path d="M69 110 C75 118 85 118 91 110 V104 C85 112 75 112 69 104 Z" ${F('--shadow')} opacity=".3" filter="url(#hl-soft)"/>
    <path d="${FACE.hairL}" ${F('--hair')}/><path d="${FACE.hairR}" ${F('--hair')}/>
    <path d="M54 74 Q50 86 50 96 M56 78 Q53 90 54 100 M106 74 Q110 86 110 96" ${ST('--hair-hi', 0.7)} opacity=".7"/>
    <ellipse cx="${hx}" cy="${hy}" rx="${hrx}" ry="${hry}" fill="url(#hl-skin)"/>
    <g clip-path="url(#hl-head)"><rect x="40" y="52" width="80" height="15" fill="url(#hl-browshade)"/><path d="M40 40 H64 C56 62 56 94 68 116 H40 Z" ${F('--skin-sh')} opacity=".4"/></g>
    <path d="M104 58 C112 68 113 86 107 99" ${ST('--glow', 2.2)} opacity=".6"/>
    <g ${F('--cheek')} opacity="${mood === 'happy' ? 0.5 : 0.35}" filter="url(#hl-soft)">${FACE.cheeks.map(([x, y]) => `<ellipse cx="${x}" cy="${y - (mood === 'happy' ? 1.5 : 0)}" rx="7" ry="4.5"/>`).join('')}</g>
    <path d="M79 80 L76.5 93" ${ST('--skin-sh', 1.6)} opacity=".55"/><path d="M76 95.5 Q78 97.5 80 96.5 Q82 97.5 84.5 95.5" ${ST('--ink-line', 1)}/><ellipse cx="81.5" cy="92.5" rx="2.3" ry="1.3" ${F('--skin-hi')} opacity=".8"/>
    ${mouth}${eyes}
    <g ${ST('--hair', 1)}>${FACE.brows[mood].map(d => `<path d="${d}" stroke-width="2.6" opacity=".6"/><path d="${d}" transform="translate(0 -0.8)"/><path d="${d}" transform="translate(0 0.8)"/>`).join('')}</g>
    <ellipse cx="${FACE.smudge[0]}" cy="${FACE.smudge[1]}" rx="5" ry="2.2" transform="rotate(-20 ${FACE.smudge[0]} ${FACE.smudge[1]})" ${F('--flour')} opacity=".7" filter="url(#hl-soft)"/>
    <path d="${FACE.scarf}" fill="url(#hl-scarf)"/><path d="M40 30 H72 C60 40 54 56 54 80 H40 Z" ${F('--scarf-dk')} opacity=".55" clip-path="url(#hl-scarfclip)"/>
    <g ${F('--scarf-dot')} opacity=".85">${dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.7"/>`).join('')}</g>
    <path d="M100 38 C108 44 112 54 113 66" ${ST('--glow', 2)} opacity=".5"/>
    <path d="${FACE.knot[0]}" fill="url(#hl-scarf)"/><path d="${FACE.knot[1]}" ${F('--scarf-dk')}/>
    ${o.bare ? '' : '<rect width="160" height="160" rx="14" fill="#000" filter="url(#hl-grain)"/>'}`, `Marla the baker, ${mood}`);
}

/** Pell the woodcutter: big, gruff, often hurt. Same FACE base, re-proportioned: broad body, beanie, beard. */
function pell(/** @type {{ mood?: 'tired' | 'happy', bare?: boolean }} */ o = {}) {
  const mood = o.mood || 'tired';
  const beard = 'M47 78 C47 102 60 122 80 124 C100 122 113 102 113 78 C107 92 97 97 88 95 C84 93 76 93 72 95 C63 97 53 92 47 78 Z';
  const mouth = mood === 'happy'
    ? `<path d="M70 102 Q80 112 90 102 Q80 105.5 70 102 Z" ${F('--mouth-in')}/><path d="M73 103 Q80 105 87 103 L86.5 104.6 Q80 106 73.5 104.6 Z" ${F('--eye-white')}/>`
    : `<path d="M71 104.5 Q80 101.5 89 104.5" ${ST('--mouth-in', 2)}/><path d="M74 104 H86" ${ST('--eye-white', 1)} opacity=".7"/>`;
  const brows = mood === 'happy' ? ['M57 71 Q65 65.5 73 69', 'M87 69 Q95 65.5 103 71'] : ['M57 70.5 L73 75', 'M87 75 L103 70.5'];
  return svg('0 0 160 160', `${o.bare ? '' : `<rect width="160" height="160" rx="14" fill="url(#hl-wall)"/><circle cx="134" cy="40" r="72" fill="url(#hl-glow)" opacity=".55"/>`}
    <path d="M6 160 C8 128 32 114 58 110 L102 110 C128 114 152 128 154 160 Z" fill="url(#hl-plaid)"/>
    <g clip-path="url(#hl-pellbody)"><path d="M0 100 L60 100 C56 126 60 146 74 160 H0 Z" ${F('--plaid-dk')} opacity=".55"/>
      <path d="${[20, 44, 68, 92, 116, 140].map(x => `M${x} 108 V160`).join(' ')} M0 126 H160 M0 146 H160" ${ST('--plaid-line', 3)} opacity=".45"/>
      <path d="${[32, 56, 80, 104, 128].map(x => `M${x} 108 V160`).join(' ')} M0 136 H160" ${ST('--plaid-hi', 1)} opacity=".35"/></g>
    <path d="M64 110 L80 130 L96 110 Z" ${F('--plaid-dk')}/>
    <g ${F('--wood-hi')}><path d="${lens(7, 2)}" transform="translate(40 122) rotate(70)"/><path d="${lens(5, 1.6)}" transform="translate(120 126) rotate(-60)"/></g>
    <path d="M146 160 C144 134 128 120 106 114" ${ST('--glow', 2.4)} opacity=".45"/>
    <path d="M63 92 L63 114 C72 121 88 121 97 114 L97 92 Z" ${F('--skin2-sh')}/>
    <circle cx="48" cy="84" r="6.5" ${F('--skin2-sh')}/><circle cx="112" cy="84" r="6.5" ${F('--skin2')}/>
    <ellipse cx="80" cy="79" rx="32" ry="34" fill="url(#hl-skin2)"/>
    <g clip-path="url(#hl-head)"><rect x="40" y="58" width="80" height="14" fill="url(#hl-browshade)"/><path d="M40 40 H62 C55 62 55 94 67 116 H40 Z" ${F('--skin2-sh')} opacity=".4"/></g>
    <path d="M106 60 C113 70 114 86 109 98" ${ST('--glow', 2.2)} opacity=".55"/>
    <g ${F('--cheek')} opacity="${mood === 'happy' ? 0.45 : 0.3}" filter="url(#hl-soft)"><ellipse cx="62" cy="90" rx="7" ry="4"/><ellipse cx="98" cy="90" rx="7" ry="4"/></g>
    ${eyePair(mood)}
    <path d="M78.5 80 C76.5 88 72 92 74 95.5 C77 98.5 83 98.5 86 95.5 C88 92 84 88 81.5 80" ${F('--skin2-sh')} opacity=".55"/><path d="M75 95.5 Q77.5 97.5 80 96.5 Q82.5 97.5 85 95.5" ${ST('--ink-line', 1)}/>
    <path d="${beard}" ${F('--beard')}/><path d="M47 78 C47 102 60 122 80 124 C70 116 64 104 62 94 C55 92 50 86 47 78 Z" ${F('--beard-dk')} opacity=".6"/>
    <path d="M58 104 l2 6 M66 112 l1 5 M94 112 l-1 5 M102 104 l-2 6 M80 118 v4" ${ST('--beard-hi', 1.2)} opacity=".7"/>
    ${mouth}
    <path d="M65 99 C71 92.5 77 94 80 96.5 C83 94 89 92.5 95 99 C89 100.5 83 99.5 80 98.5 C77 99.5 71 100.5 65 99 Z" ${F('--beard-dk')}/>
    <g ${ST('--beard-dk', 4)}>${brows.map(d => `<path d="${d}"/>`).join('')}</g>
    <path d="M46 70 C44 42 60 30 80 30 C100 30 116 42 114 70 C104 64 92 62 80 62 C68 62 56 64 46 70 Z" ${F('--cap')}/>
    <g clip-path="url(#hl-beanie)"><path d="M40 28 H70 C60 40 54 52 54 74 H40 Z" ${F('--cap-dk')} opacity=".55"/><path d="${[56, 64, 72, 80, 88, 96, 104].map(x => `M${x} 34 V64`).join(' ')}" ${ST('--cap-dk', 1.2)} opacity=".5"/></g>
    <path d="M44 71 C56 62 104 62 116 71 L115 62 C104 55 56 55 45 62 Z" ${F('--cap-dk')}/>
    <path d="M100 36 C108 42 112 52 114 62" ${ST('--glow', 2)} opacity=".45"/>
    ${o.bare ? '' : '<rect width="160" height="160" rx="14" fill="#000" filter="url(#hl-grain)"/>'}`, `Pell the woodcutter, ${mood === 'happy' ? 'happy' : 'aching'}`);
}

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'portrait:marla': portrait,
  'portrait:pell': pell,
};
