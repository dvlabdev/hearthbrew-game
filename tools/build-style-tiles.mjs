// Builds prototypes/style-tiles.html: one designed style tile per exploration pack + a compare view + a rating panel.
// Self-contained (inline SVG + CSS), so it publishes as a single Artifact.
// Usage: node tools/build-style-tiles.mjs [round]   (round 1 -> style-tiles.html, round N -> style-tiles-rN.html; default 2)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { STYLES } from '../src/art/registry.js';

const root = new URL('..', import.meta.url);
const ROUND = Number(process.argv[2] || 2);
const packs = Object.values(STYLES).filter(p => p.exploration && (p.round || 1) === ROUND);
const OUT = ROUND === 1 ? 'prototypes/style-tiles.html' : `prototypes/style-tiles-r${ROUND}.html`;
const read = (/** @type {string} */ rel) => readFileSync(fileURLToPath(new URL(rel, root)), 'utf8');

/** Rescope a pack's :root tokens to .pack-<id> (Candlelit) and .pack-<id>.day (Day). */
const scoped = packs.map(p => read(`src/art/styles/${p.id}/style.css`)
  .replace(/:root\[data-theme="day"\]/g, `.pack-${p.id}.day`).replace(/:root/g, `.pack-${p.id}`)).join('\n');
const anim = read('src/art/anim.css');

const A = (/** @type {any} */ p, /** @type {string} */ id, /** @type {any} */ o) => p.ASSETS[id](o);
const TRAITS = [['heat', 'Heat'], ['calm', 'Calm'], ['vigor', 'Vigor'], ['clarity', 'Clarity']];
const METER = { heat: 0, calm: 6, vigor: 1, clarity: 0 };

/** The shop scene with the customer standing behind the counter. */
const scene = (/** @type {any} */ p, mood = 'tired') => `<div class="g-scene">${A(p, 'scene:shop', {})}<div class="g-cust">${A(p, 'portrait:marla', { bare: true, mood })}</div>${A(p, 'scene:shop', { layer: 'front' })}</div>`;

/** Round 2: lead with the game itself, a 360px brewing screen built from the pack's art and chrome. */
function gameScreen(/** @type {any} */ p) {
  const chip = (/** @type {string} */ k, /** @type {number} */ n) => `<span class="chip">${A(p, `ingredient:${k}`)}<b>${n}</b></span>`;
  return `<section class="t-block"><p class="t-label">In the game · the shop (switch Candlelit / Day above)</p>
  <div class="g-screen">
    <div class="g-top">${scene(p)}
      <div class="g-hud"><span class="hud-pill">Day 3 <small>of 20</small></span><span class="hud-pill">${A(p, 'ui:coin')}24</span></div></div>
    <div class="g-panel">
      <div class="g-bubble"><p class="t-who">Marla <span>the baker</span></p>
        <p>“The baby's had me up <span class="int">all week</span>. I just need to <span class="kw">sleep</span>.”</p></div>
      <div class="t-bench">
        <div class="t-pot">${A(p, 'prop:cauldron', { boil: false })}</div>
        <div class="t-slots"><span class="slot full">${A(p, 'ingredient:chamomile')}</span><span class="slot full">${A(p, 'ingredient:chamomile')}</span><span class="slot"></span></div>
      </div>
      <div class="g-shelf">${chip('chamomile', 3)}${chip('fireroot', 1)}${chip('rosehip', 2)}</div>
      <div class="t-meter">${TRAITS.map(([k, n]) => `<div class="m-row" style="--c:var(--${k})"><span class="m-ic">${A(p, `trait:${k}`)}</span><span class="m-n">${n}</span>
        <span class="m-bar">${Array.from({ length: 10 }, (_, i) => `<i class="${i < /** @type {any} */ (METER)[k] ? 'on' : ''}"></i>`).join('')}</span><span class="m-v">${/** @type {any} */ (METER)[k]}</span></div>`).join('')}</div>
      <div class="t-actions"><button class="b-ghost" type="button">Notebook</button><button class="b-primary" type="button">Brew and serve</button></div>
    </div>
  </div></section>`;
}

/** The full style tile for one pack. */
function tile(/** @type {any} */ p) {
  const sw = (/** @type {string} */ v, /** @type {string} */ name) => `<div class="sw"><i style="background:var(--${v})"></i><span>${name}</span></div>`;
  const r2 = !!p.ASSETS['scene:shop'];
  return `<article class="pack pack-${p.id}" id="tile-${p.id}" data-pack="${p.id}">
  <header class="t-head">
    <p class="t-eyebrow">Direction · ${p.label}</p>
    <h2 class="t-title">Hearthbrew</h2>
    <div class="t-chips">${p.brief.adjectives.map((/** @type {string} */ a) => `<span>${a}</span>`).join('')}</div>
    <p class="t-insp">${p.brief.inspiration}</p>
  </header>

  ${r2 ? gameScreen(p) : ''}
  ${r2 ? `<section class="t-block"><p class="t-label">Expressions · reading the customer (pillar 1)</p>
    <div class="t-pair"><figure>${A(p, 'portrait:marla', { mood: 'tired' })}<figcaption>Asking: tired</figcaption></figure>
      <figure>${A(p, 'portrait:marla', { mood: 'happy' })}<figcaption>Served well: relieved</figcaption></figure></div></section>` : `<section class="t-block"><p class="t-label">Riddle card · brew screen</p>
    <div class="t-card">
      <div class="t-portrait">${A(p, 'portrait:marla')}</div>
      <div class="t-quote"><p class="t-who">Marla <span>the baker</span></p>
        <p>“The baby's had me up <span class="int">all week</span>. I just need to <span class="kw">sleep</span>.”</p></div>
    </div>
    <div class="t-bench">
      <div class="t-pot">${A(p, 'prop:cauldron', { boil: false })}</div>
      <div class="t-slots"><span class="slot full">${A(p, 'ingredient:chamomile')}</span><span class="slot full">${A(p, 'ingredient:chamomile')}</span><span class="slot"></span></div>
    </div>
    <div class="t-meter">${TRAITS.map(([k, n]) => `<div class="m-row" style="--c:var(--${k})"><span class="m-ic">${A(p, `trait:${k}`)}</span><span class="m-n">${n}</span>
      <span class="m-bar">${Array.from({ length: 10 }, (_, i) => `<i class="${i < /** @type {any} */ (METER)[k] ? 'on' : ''}"></i>`).join('')}</span><span class="m-v">${/** @type {any} */ (METER)[k]}</span></div>`).join('')}</div>
    <div class="t-actions"><button class="b-ghost" type="button">Notebook</button><button class="b-primary" type="button">Brew and serve</button></div>
  </section>`}

  <section class="t-block"><p class="t-label">Palette</p>
    <div class="t-swatches">${sw('bg', 'Ground')}${sw('surface', 'Surface')}${sw('ink', 'Ink')}${sw('accent', 'Accent')}${sw('secondary', 'Secondary')}</div>
    <div class="t-swatches">${TRAITS.map(([k, n]) => sw(k, n)).join('')}</div>
  </section>

  <section class="t-block"><p class="t-label">Type</p>
    <p class="ty-display">Midsummer Eve</p>
    <p class="ty-h">Wren's Notebook</p>
    <p class="ty-body">Atkinson Hyperlegible carries every riddle and button: 16px minimum, built for low vision. <span class="num">◉ 24 · ★★★ · Day 3</span></p>
    <p class="ty-hand">Boil a flower and its sweetness flies off with the steam. — W.</p>
  </section>

  <section class="t-block"><p class="t-label">Traits: colour + shape + glyph</p>
    <div class="t-traits">${TRAITS.map(([k, n]) => `<div><span class="tr-big">${A(p, `trait:${k}`)}</span><span>${n}</span></div>`).join('')}</div>
  </section>

  <section class="t-block"><p class="t-label">Ingredients · 96 / 48 px</p>
    <div class="t-ings">${(r2 ? ['chamomile', 'fireroot', 'rosehip'] : ['chamomile', 'fireroot']).map(k => `<div class="ing">${A(p, `ingredient:${k}`)}<span class="ing-s">${A(p, `ingredient:${k}`)}</span><span>${k[0].toUpperCase() + k.slice(1)}</span></div>`).join('')}</div>
  </section>

  <section class="t-block"><p class="t-label">Spot the herb · the difference must be visible</p>
    <div class="t-pair"><figure>${A(p, 'plant:chamomile')}<figcaption>Chamomile · domed centre</figcaption></figure>
      <figure>${A(p, 'plant:mayweed')}<figcaption>Mayweed · flat centre</figcaption></figure></div>
  </section>

  <section class="t-block"><p class="t-label">Cauldron · tap Simmer / Boil above</p>
    <div class="t-bigpot">${A(p, 'prop:cauldron', { boil: false })}</div>
  </section>

  <section class="t-block"><p class="t-label">Texture · technique</p>
    <div class="t-tex">${A(p, 'ui:texture')}<p>${p.brief.technique}</p></div>
  </section>
</article>`;
}

/** Compare view: the same asset across all four directions. */
function compare() {
  const r2 = packs.every(p => p.ASSETS['scene:shop']);
  const rows = [
    ...(r2 ? [['Shop scene', (/** @type {any} */ p) => scene(p)], ['Expressions', (/** @type {any} */ p) => `<span class="cmp-pair">${A(p, 'portrait:marla', { mood: 'tired' })}${A(p, 'portrait:marla', { mood: 'happy' })}</span>`]] : []),
    ['Riddle portrait', (/** @type {any} */ p) => A(p, 'portrait:marla')],
    ['Chamomile', (/** @type {any} */ p) => A(p, 'ingredient:chamomile')],
    ['Spot the herb', (/** @type {any} */ p) => `<span class="cmp-pair">${A(p, 'plant:chamomile')}${A(p, 'plant:mayweed')}</span>`],
    ['Cauldron', (/** @type {any} */ p) => A(p, 'prop:cauldron', { boil: false })],
    ['Traits', (/** @type {any} */ p) => `<span class="cmp-traits">${TRAITS.map(([k]) => A(p, `trait:${k}`)).join('')}</span>`],
  ];
  return `<div class="compare">${rows.map(([name, fn]) => `<section><h3>${name}</h3><div class="cmp-grid">${packs.map(p =>
    `<div class="pack pack-${p.id} cmp-cell"><div class="cmp-art">${/** @type {Function} */ (fn)(p)}</div><span class="cmp-name">${p.label}</span></div>`).join('')}</div></section>`).join('')}</div>`;
}

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Hearthbrew Style Tiles</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@600;700&family=Limelight&family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital@0;1&family=Alfa+Slab+One&family=Caveat:wght@500;600&family=Gochi+Hand&family=Fraunces:opsz,wght@9..144,600&family=DM+Serif+Display&family=Cormorant+Garamond:wght@600;700&display=swap">
<style>
/* Page chrome is deliberately neutral so it doesn't favour a direction. */
:root{--c-bg:#17171A;--c-fg:#EDEDED;--c-muted:#A6A6AD;--c-line:#FFFFFF24;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:var(--c-bg);color:var(--c-fg);font:16px/1.5 "Atkinson Hyperlegible",system-ui,sans-serif;padding-inline:12px;padding-block:0 40px}
.wrap{max-width:440px;margin:0 auto;display:grid;gap:16px}
.bar{position:sticky;top:0;z-index:5;background:var(--c-bg);padding:calc(env(safe-area-inset-top,0px) + 10px) 0 10px;display:grid;gap:8px;border-bottom:1px solid var(--c-line)}
.bar h1{font-size:1.1rem;margin:0}
.tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}
.tabs button,.seg button{flex:0 0 auto;font:inherit;font-size:.92rem;min-height:40px;padding:6px 12px;border-radius:999px;border:1px solid var(--c-line);background:transparent;color:var(--c-fg);cursor:pointer}
.tabs button[aria-pressed="true"],.seg button[aria-pressed="true"]{background:var(--c-fg);color:var(--c-bg)}
.row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.seg{display:flex;gap:4px}
select{font:inherit;font-size:.92rem;min-height:40px;border-radius:999px;background:transparent;color:var(--c-fg);border:1px solid var(--c-line);padding:4px 10px}
:focus-visible{outline:3px solid #8AB4FF;outline-offset:2px}
[hidden]{display:none!important}
.intro{color:var(--c-muted);font-size:.95rem}

${scoped}
${anim}

/* ---------- the tile (all values come from the pack's tokens) ---------- */
.pack{background:var(--bg);color:var(--ink);font-family:var(--font-body);border-radius:22px;padding:22px 16px;display:grid;gap:26px}
.t-eyebrow,.t-label{margin:0;font:700 .74rem/1.2 var(--font-body);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.t-head{display:grid;gap:8px}
.t-title{margin:0;font-family:var(--font-display);font-weight:var(--display-weight,400);font-size:2.6rem;line-height:1;color:var(--accent)}
.t-chips{display:flex;gap:6px;flex-wrap:wrap}.t-chips span{border:1px solid var(--line);border-radius:999px;padding:2px 10px;font-size:.9rem}
.t-insp{margin:0;color:var(--muted);font-size:.95rem}
.t-block{display:grid;gap:12px}
.t-card{display:grid;grid-template-columns:76px minmax(0,1fr);gap:12px;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:12px}
.g-screen{border-radius:var(--r-card,16px);overflow:hidden;background:var(--bg);box-shadow:0 0 0 1px var(--line),0 18px 40px -18px #000;margin-inline:-6px}
.g-top{position:relative}
.g-scene{position:relative;aspect-ratio:360/250;overflow:hidden}.g-scene>svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.g-cust{position:absolute;left:11%;top:24%;width:42%}.g-cust svg{width:100%;height:auto;display:block}
.g-hud{position:absolute;top:8px;left:8px;right:8px;display:flex;justify-content:space-between;gap:8px}
.hud-pill{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:4px 12px;border-radius:999px;background:var(--hud-bg,var(--surface));color:var(--hud-ink,var(--ink));border:var(--hud-border,0);font-weight:700;font-variant-numeric:tabular-nums;backdrop-filter:blur(4px)}
.hud-pill small{font-weight:400;font-size:.85rem;color:var(--muted)}.hud-pill svg{width:20px;height:20px;display:block}
.g-panel{display:grid;gap:12px;padding:0 12px 14px;position:relative}
.g-bubble{margin-top:-30px;position:relative;background:var(--card-bg,var(--surface));border:var(--card-border,1px solid var(--line));box-shadow:var(--card-shadow,none);border-radius:var(--r-card,16px);padding:12px 14px}
.g-bubble p{margin:0}
.g-shelf{display:flex;gap:8px;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;gap:4px;padding:4px 10px 4px 4px;border-radius:999px;background:var(--surface);box-shadow:var(--card-shadow,none);border:var(--card-border,1px solid var(--line));font-weight:700;font-variant-numeric:tabular-nums}
.chip svg{width:36px;height:36px;display:block}
.t-portrait svg{width:76px;height:76px;display:block;border-radius:12px}
.t-quote p{margin:0}.t-who{font-family:var(--font-display);font-size:1.15rem}.t-who span{font-family:var(--font-body);font-size:.9rem;color:var(--muted)}
.kw{border-bottom:3px solid var(--calm)}.int{border-bottom:2px dotted var(--muted)}
.t-bench{display:grid;grid-template-columns:96px minmax(0,1fr);gap:10px;align-items:center}
.t-pot svg{width:96px;height:96px;display:block}
.t-slots{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.slot{aspect-ratio:1;border:2px dashed var(--muted);border-radius:12px;display:grid;place-items:center;overflow:hidden}
.slot.full{border:1px solid var(--line);background:var(--surface)}.slot svg{width:100%;height:100%;display:block}
.t-meter{display:grid;gap:6px;background:var(--card-bg,var(--surface));border-radius:var(--r-card,14px);padding:10px 12px;border:var(--card-border,1px solid var(--line));box-shadow:var(--card-shadow,none)}
.m-row{display:grid;grid-template-columns:22px 58px minmax(0,1fr) 20px;gap:8px;align-items:center;font-size:.95rem}
.m-ic svg{width:22px;height:22px;display:block}
.m-bar{display:grid;grid-template-columns:repeat(10,1fr);gap:2px;height:12px}.m-bar i{border-radius:3px;background:var(--sunk)}.m-bar i.on{background:var(--c)}
.m-v{text-align:right;font-variant-numeric:tabular-nums;font-weight:700}
.t-actions{display:grid;grid-template-columns:1fr 2fr;gap:8px}
.b-primary,.b-ghost{font:700 1rem var(--font-body);min-height:50px;border-radius:var(--r-btn,14px);cursor:pointer}
.b-primary{background:var(--btn-bg,var(--accent));color:var(--on-accent);border:0;box-shadow:var(--btn-shadow,none)}
.b-ghost{background:transparent;color:var(--ink);border:1.5px solid var(--line)}
.t-swatches{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
.sw{display:grid;gap:4px;font-size:.78rem;color:var(--muted)}.sw i{display:block;height:40px;border-radius:10px;border:1px solid var(--line)}
.ty-display{margin:0;font-family:var(--font-display);font-size:2rem;line-height:1.1}
.ty-h{margin:0;font-family:var(--font-display);font-size:1.3rem}
.ty-body{margin:0}.num{font-variant-numeric:tabular-nums;color:var(--accent);font-weight:700}
.ty-hand{margin:0;font-family:var(--font-hand);font-size:1.35rem;line-height:1.3}
.t-traits{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;font-size:.9rem}
.t-traits div{display:grid;justify-items:center;gap:4px}.tr-big svg{width:48px;height:48px;display:block}
.pack>*,.t-block>*{min-width:0}
.t-ings{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.ing{display:grid;grid-template-columns:96px 48px;align-items:end;gap:8px;font-size:.9rem}
.ing>svg{width:96px;height:96px;grid-row:span 2;display:block}.ing-s svg{width:48px;height:48px;display:block}
.t-pair{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.t-pair figure{margin:0;display:grid;gap:6px}.t-pair svg{width:100%;height:auto;display:block;border-radius:var(--r-card,10px)}
.t-pair figcaption{font-size:.9rem;color:var(--muted)}
.t-bigpot svg{width:min(240px,100%);height:auto;display:block;margin:0 auto}
.t-tex{display:grid;grid-template-columns:96px minmax(0,1fr);gap:12px;align-items:center;font-size:.92rem;color:var(--muted)}
.t-tex svg{width:96px;height:96px;display:block}.t-tex p{margin:0}

/* compare */
.compare{display:grid;gap:18px}
.compare h3{margin:0 0 8px;font-size:1rem}
.cmp-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.cmp-cell{padding:10px;gap:6px;border-radius:14px;justify-items:center;text-align:center}
.cmp-art svg{width:100%;height:auto;display:block;max-width:150px}.cmp-art{width:100%;display:grid;justify-items:center}.cmp-art .g-scene{width:100%;border-radius:10px}.cmp-art .g-scene svg,.cmp-art .g-cust svg{max-width:none}
.cmp-pair{display:grid;grid-template-columns:1fr 1fr;gap:4px}
.cmp-traits{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}.cmp-traits svg{width:100%}
.cmp-name{font-size:.8rem;color:var(--muted)}

/* rating */
.rate{display:grid;gap:14px;border:1px solid var(--c-line);border-radius:16px;padding:14px}
.rate h2{margin:0;font-size:1.1rem}
.r-pack{display:grid;gap:6px}
.r-stars{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}
.r-stars button{min-height:44px;border-radius:10px;border:1px solid var(--c-line);background:transparent;color:var(--c-fg);font:700 1rem inherit;cursor:pointer}
.r-stars button[aria-pressed="true"]{background:var(--c-fg);color:var(--c-bg)}
textarea{width:100%;min-height:90px;background:transparent;color:var(--c-fg);border:1px solid var(--c-line);border-radius:12px;padding:8px;font:15px/1.4 inherit}
.copy{font:700 1rem inherit;min-height:48px;border-radius:12px;border:0;background:var(--c-fg);color:var(--c-bg);cursor:pointer}
body.shot{padding:0}body.shot .bar,body.shot .rate,body.shot .intro{display:none}body.shot .wrap{max-width:none;width:360px;margin:0;gap:0}body.shot .pack{border-radius:0}
</style></head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <filter id="cvd-protan"><feColorMatrix type="matrix" values="0.152 1.053 -0.205 0 0  0.115 0.786 0.099 0 0  -0.004 -0.048 1.052 0 0  0 0 0 1 0"/></filter>
  <filter id="cvd-deutan"><feColorMatrix type="matrix" values="0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0"/></filter>
  <filter id="cvd-tritan"><feColorMatrix type="matrix" values="1.256 -0.077 -0.179 0 0  -0.078 0.931 0.148 0 0  0.005 0.691 0.304 0 0  0 0 0 1 0"/></filter>
  <filter id="cvd-grey"><feColorMatrix type="saturate" values="0"/></filter>
</defs></svg>
${packs.map(p => p.defs ? `<div class="pack-${p.id} defs-host" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden"><svg width="0" height="0">${p.defs}</svg></div>` : '').join('')}
<div class="wrap">
  <div class="bar">
    <h1>Hearthbrew · style tiles${ROUND > 1 ? ` · round ${ROUND}` : ''}</h1>
    <div class="tabs" role="group" aria-label="Direction">${packs.map((p, i) => `<button type="button" data-show="${p.id}" aria-pressed="${i === 0}">${p.label}</button>`).join('')}<button type="button" data-show="compare" aria-pressed="false">Compare all</button></div>
    <div class="row">
      <div class="seg" role="group" aria-label="Light"><button type="button" data-theme="night" aria-pressed="true">Candlelit</button><button type="button" data-theme="day" aria-pressed="false">Day</button></div>
      <div class="seg" role="group" aria-label="Cauldron"><button type="button" data-heat="simmer" aria-pressed="true">Simmer</button><button type="button" data-heat="boil" aria-pressed="false">Boil</button></div>
      <select id="cvd" aria-label="Colour vision"><option value="">Normal vision</option><option value="protan">Protan</option><option value="deutan">Deutan</option><option value="tritan">Tritan</option><option value="grey">Greyscale</option></select>
    </div>
  </div>
  <p class="intro">${ROUND > 1 ? 'Round 2, after your feedback: each direction leads with the game screen itself, with depth, light and natural colour. Same scene and layout in all three, so you compare the look. ' : ''}${['One', 'Two', 'Three', 'Four', 'Five'][packs.length - 1]} directions, identical content. Judge each against the brief: witchy, warm, herbal, curious, calm, readable on this screen. Then rate them at the bottom.</p>
  <div id="stage">
    ${packs.map((p, i) => `<div data-view="${p.id}"${i ? ' hidden' : ''}>${tile(p)}</div>`).join('')}
    <div data-view="compare" hidden>${compare()}</div>
  </div>
  <section class="rate" aria-label="Your ratings">
    <h2>Your verdict</h2>
    ${packs.map(p => `<div class="r-pack"><b>${p.label}</b><div class="r-stars" role="group" aria-label="Rate ${p.label}">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-rate="${p.id}:${n}" aria-pressed="false">${n}</button>`).join('')}</div></div>`).join('')}
    <label for="fav"><b>Favourite</b> (or a mix, e.g. "Shadow + Cyanotype")</label>
    <select id="fav"><option value="">Choose…</option>${packs.map(p => `<option>${p.label}</option>`).join('')}<option>A mix (describe below)</option></select>
    <label for="notes"><b>Comments</b></label>
    <textarea id="notes" placeholder="What do you love, what feels off, what would you combine?"></textarea>
    <button class="copy" type="button" id="copy">Copy my verdict</button>
    <p id="copied" class="intro" aria-live="polite"></p>
  </section>
</div>
<script>
(() => {
  const KEY = 'hearthbrew-style-tiles-${ROUND === 1 ? 'v1' : `r${ROUND}`}';
  let st = { view: '${packs[0].id}', day: false, boil: false, cvd: '', rates: {}, fav: '', notes: '' };
  try { Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const q = new URLSearchParams(location.search);
  if (q.get('shot')) { document.body.classList.add('shot'); st.view = q.get('shot'); st.day = q.get('theme') === 'day'; st.boil = q.get('heat') === 'boil'; st.cvd = ''; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  const press = (sel, on) => document.querySelectorAll(sel).forEach(b => b.setAttribute('aria-pressed', String(on(b))));
  function apply() {
    document.querySelectorAll('[data-view]').forEach(v => { v.hidden = v.dataset.view !== st.view; });
    document.querySelectorAll('.pack, .defs-host').forEach(p => p.classList.toggle('day', st.day));
    document.querySelectorAll('svg.pot').forEach(s => s.classList.toggle('boil', st.boil));
    document.getElementById('stage').style.filter = st.cvd ? 'url(#cvd-' + st.cvd + ')' : '';
    press('[data-show]', b => b.dataset.show === st.view);
    press('[data-theme]', b => (b.dataset.theme === 'day') === st.day);
    press('[data-heat]', b => (b.dataset.heat === 'boil') === st.boil);
    press('[data-rate]', b => { const [id, n] = b.dataset.rate.split(':'); return st.rates[id] === Number(n); });
    document.getElementById('cvd').value = st.cvd; document.getElementById('fav').value = st.fav; document.getElementById('notes').value = st.notes;
    save();
  }
  document.querySelectorAll('[data-show]').forEach(b => b.onclick = () => { st.view = b.dataset.show; apply(); window.scrollTo({ top: 0 }); });
  document.querySelectorAll('[data-theme]').forEach(b => b.onclick = () => { st.day = b.dataset.theme === 'day'; apply(); });
  document.querySelectorAll('[data-heat]').forEach(b => b.onclick = () => { st.boil = b.dataset.heat === 'boil'; apply(); });
  document.querySelectorAll('[data-rate]').forEach(b => b.onclick = () => { const [id, n] = b.dataset.rate.split(':'); st.rates[id] = Number(n); apply(); });
  document.getElementById('cvd').onchange = e => { st.cvd = e.target.value; apply(); };
  document.getElementById('fav').onchange = e => { st.fav = e.target.value; apply(); };
  document.getElementById('notes').oninput = e => { st.notes = e.target.value; save(); };
  const labels = ${JSON.stringify(Object.fromEntries(packs.map(p => [p.id, p.label])))};
  document.getElementById('copy').onclick = () => {
    const text = 'Hearthbrew style tiles verdict\\n' + Object.entries(labels).map(([id, l]) => l + ': ' + (st.rates[id] || '-') + '/5').join('\\n') +
      '\\nFavourite: ' + (st.fav || '-') + '\\nComments: ' + (st.notes || '-');
    const out = document.getElementById('copied');
    const fb = () => { const t = document.getElementById('notes'); t.value = text; t.focus(); t.select(); out.textContent = 'Selected in the comments box. Use your phone\\u2019s Copy.'; };
    try { navigator.clipboard.writeText(text).then(() => { out.textContent = 'Copied. Paste it back to Claude.'; }, fb); } catch (e) { fb(); }
  };
  apply();
})();
</script>
</body></html>`;

writeFileSync(fileURLToPath(new URL(OUT, root)), html);
console.log(`wrote ${OUT} (${(html.length / 1024).toFixed(0)} KB, ${packs.length} directions)`);
