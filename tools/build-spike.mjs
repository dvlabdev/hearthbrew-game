// Builds prototypes/hearthlight-spike.html: the validation spike for the locked Hearthlight v2 direction
// (level-of-detail ladder, shelf test, two customers, weather cards, Spot the herb on paper, Notebook "develop").
// Self-contained, so it publishes as one Artifact. Usage: node tools/build-spike.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { STYLES, loadAll } from '../src/art/registry.js';

await loadAll();

const root = new URL('..', import.meta.url);
const read = (/** @type {string} */ rel) => readFileSync(fileURLToPath(new URL(rel, root)), 'utf8');
const P = STYLES.hearthlight;
const A = (/** @type {string} */ id, /** @type {any} */ o) => P.ASSETS[id](o);
const css = read('src/art/styles/hearthlight/style.css').replace(/:root\[data-theme="day"\]/g, '.pack-hearthlight.day').replace(/:root/g, '.pack-hearthlight');
const ING = ['chamomile', 'fireroot', 'rosehip', 'sage', 'mint', 'nettle', 'honey', 'lavender'];
const cap = (/** @type {string} */ s) => s[0].toUpperCase() + s.slice(1);
const TRAITS = [['heat', 'Heat', 0], ['calm', 'Calm', 6], ['vigor', 'Vigor', 1], ['clarity', 'Clarity', 0]];

// Production log: authoring time per asset, from design/visual/05-spike-log.md (minutes).
const LOG = [['Sage (incl. one fix)', 1.5], ['Mint', 0.3], ['Nettle', 0.4], ['Honey', 0.4], ['Lavender', 0.4], ['Pell, 2 moods (incl. shared-eyes refactor)', 1.4], ['Weather: sun + mist (incl. one fix)', 1.1], ['Notebook develop', 0.5]];

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Hearthlight Spike</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Fraunces:opsz,wght@9..144,600&family=Caveat:wght@500;600&display=swap">
<style>
${css}
${read('src/art/anim.css')}
${read('src/ui/notebook.css')}
*{box-sizing:border-box}
html{background:#1D1828}
body{margin:0;font:16px/1.5 var(--font-body,"Atkinson Hyperlegible",system-ui,sans-serif)}
.pack-hearthlight{background:var(--bg);color:var(--ink);min-height:100vh;padding-inline:16px;padding-block:0 48px}
.wrap{max-width:440px;margin:0 auto;display:grid;gap:30px}
.wrap>*{min-width:0}
.bar{position:sticky;top:0;z-index:5;background:var(--bg);padding:calc(env(safe-area-inset-top,0px) + 10px) 0 10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;border-bottom:1px solid var(--line)}
.bar h1{font:var(--display-weight) 1.25rem var(--font-display);margin:0;flex:1 0 100%}
.seg{display:flex;gap:4px}
button,select{font:inherit;font-size:.95rem;min-height:44px;padding:6px 14px;border-radius:var(--r-btn);border:1px solid var(--line);background:transparent;color:var(--ink);cursor:pointer}
[aria-pressed="true"]{background:var(--ink);color:var(--bg)}
:focus-visible{outline:3px solid var(--highlight);outline-offset:2px}
[hidden]{display:none!important}
h2{font:var(--display-weight) 1.35rem/1.2 var(--font-display);margin:0 0 4px;text-wrap:balance}
.lead{margin:0 0 12px;color:var(--muted)}
.card{background:var(--card-bg);border:var(--card-border);box-shadow:var(--card-shadow);border-radius:var(--r-card);padding:12px}
/* LOD ladder */
.ladder{display:grid;gap:10px}
.lrow{display:grid;grid-template-columns:112px 80px 48px 40px;gap:8px;align-items:end}
.lrow svg{display:block;width:100%;height:auto}
.lrow b{grid-column:1/-1;font-weight:700}
.lhead{display:grid;grid-template-columns:112px 80px 48px 40px;gap:8px;font-size:.85rem;color:var(--muted)}
/* shelf */
.shelf{display:flex;flex-wrap:wrap;gap:8px}
.chip{display:inline-flex;align-items:center;gap:2px;padding:4px 10px 4px 4px;border-radius:999px;background:var(--surface);border:var(--card-border);font-weight:700;font-variant-numeric:tabular-nums}
.chip svg{width:40px;height:40px;display:block}
.names{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:.9rem;color:var(--muted);margin-top:8px}
/* faces, weather, paper */
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.grid2 figure{margin:0;display:grid;gap:6px}.grid2 svg{width:100%;height:auto;display:block;border-radius:var(--r-card)}
figcaption{font-size:.95rem;color:var(--muted)}
.wx{display:grid;gap:10px}.wx svg{width:100%;height:auto;display:block;border-radius:10px}
.hud{display:flex;gap:8px;flex-wrap:wrap}
.pill{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:4px 12px;border-radius:999px;background:var(--hud-bg);border:var(--hud-border);font-weight:700}
.pill svg{width:24px;height:24px}
.spec{font-family:var(--font-hand);font-size:1.3rem;color:var(--ink)}
/* scene */
.g-screen{border-radius:var(--r-card);overflow:hidden;box-shadow:0 0 0 1px var(--line)}
.g-scene{position:relative;aspect-ratio:360/250;overflow:hidden}.g-scene>svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.g-cust{position:absolute;left:7%;top:17%;width:50%}.g-cust svg{width:100%;height:auto;display:block}
/* notebook */
.nb{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.nb figure{margin:0;display:grid;gap:8px}.nb figure>svg{width:100%;height:auto;display:block;filter:drop-shadow(0 8px 14px #0006)}
.nb button{width:100%}
.b-primary{background:var(--btn-bg);color:var(--on-accent);border:0;box-shadow:var(--btn-shadow);font-weight:700;min-height:48px}
/* log */
table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
td,th{padding:6px 4px;border-bottom:1px solid var(--line);text-align:left}td:last-child,th:last-child{text-align:right}
/* rating */
.rate{display:grid;gap:12px}
.stars{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}
textarea{width:100%;min-height:96px;background:transparent;color:var(--ink);border:1px solid var(--line);border-radius:12px;padding:8px;font:inherit}
body.shot .bar,body.shot .rate-sec{display:none}body.shot .pack-hearthlight{padding-inline:16px}body.shot .wrap{max-width:none;width:328px;margin:0}
</style></head>
<body>
<div class="pack-hearthlight" id="pack">
<div aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden"><svg width="0" height="0">${P.defs}</svg></div>
<div class="wrap">
  <div class="bar"><h1>Hearthlight v2 · validation spike</h1>
    <div class="seg" role="group" aria-label="Light"><button type="button" data-theme="night" aria-pressed="true">Candlelit</button><button type="button" data-theme="day" aria-pressed="false">Day</button></div>
    <select id="cvd" aria-label="Colour vision"><option value="">Normal vision</option><option value="protan">Protan</option><option value="deutan">Deutan</option><option value="tritan">Tritan</option><option value="grey">Greyscale</option></select>
  </div>
  <div id="stage" style="display:grid;gap:30px">

  <section><h2>One style, three levels of detail</h2>
    <p class="lead">Big views get the detail; small icons get Modern Fable's simple shapes, so they stay clear. Same light, same palette.</p>
    <div class="card ladder"><div class="lhead"><span>Hero</span><span>Icon</span><span>Mini</span><span>40px</span></div>
      ${ING.map(k => `<div class="lrow"><b>${cap(k)}</b>${A(`ingredient:${k}`, { lod: 'hero' })}${A(`ingredient:${k}`, {})}${A(`ingredient:${k}`, { lod: 'mini' })}${A(`ingredient:${k}`, { lod: 'mini' })}</div>`).join('')}
    </div></section>

  <section><h2>The shelf test</h2>
    <p class="lead">All eight at chip size. Each one should be recognisable at a glance, including in Greyscale above.</p>
    <div class="card"><div class="shelf">${ING.map((k, i) => `<span class="chip">${A(`ingredient:${k}`, { lod: 'mini' })}${(i % 3) + 1}</span>`).join('')}</div>
      <div class="names">${ING.map(cap).join(' · ')}</div></div></section>

  <section><h2>Two customers, two moods</h2>
    <p class="lead">Same face base, different people. Pell is the woodcutter: big, gruff, often hurt.</p>
    <div class="grid2">
      <figure>${A('portrait:marla', { mood: 'tired' })}<figcaption>Marla, asking</figcaption></figure>
      <figure>${A('portrait:marla', { mood: 'happy' })}<figcaption>Marla, served well</figcaption></figure>
      <figure>${A('portrait:pell', { mood: 'tired' })}<figcaption>Pell, aching</figcaption></figure>
      <figure>${A('portrait:pell', { mood: 'happy' })}<figcaption>Pell, served well</figcaption></figure>
    </div></section>

  <section><h2>Pell at the counter</h2>
    <div class="g-screen"><div class="g-scene">${A('scene:shop', {})}<div class="g-cust">${A('portrait:pell', { bare: true, mood: 'tired' })}</div>${A('scene:shop', { layer: 'front' })}</div></div></section>

  <section><h2>Morning weather</h2>
    <p class="lead">The sky is the day's clock. Each card has a small glyph for the top bar.</p>
    <div class="wx">${A('weather:sun', {})}${A('weather:mist', {})}</div>
    <div class="hud" style="margin-top:10px"><span class="pill">${A('weather:sun', { lod: 'mini' })}Sun</span><span class="pill">${A('weather:mist', { lod: 'mini' })}Mist</span></div></section>

  <section><h2>Spot the herb, on paper</h2>
    <div class="grid2"><figure>${A('plant:chamomile', {})}<figcaption><span class="spec">no. 12</span> Chamomile · domed centre</figcaption></figure>
      <figure>${A('plant:mayweed', {})}<figcaption><span class="spec">no. 13</span> Mayweed · flat centre</figcaption></figure></div></section>

  <section><h2>Wren's Notebook: an entry develops</h2>
    <p class="lead">Before you learn an ingredient it's a pencil sketch. Learn it, and the plate develops.</p>
    <div class="nb">${['chamomile', 'sage'].map(k => `<figure id="nb-${k}">${A('notebook:page', { ingredient: k })}<figcaption><span class="spec">${cap(k)}</span></figcaption>
      <button class="b-primary" type="button" data-learn="${k}">Learn it</button></figure>`).join('')}</div></section>

  <section><h2>Production log</h2>
    <p class="lead">Authoring time per asset, against a 30-minute target. These are generation times; review rounds come on top (see the log).</p>
    <table><thead><tr><th>Asset</th><th>Minutes</th></tr></thead><tbody>${LOG.map(([a, m]) => `<tr><td>${a}</td><td>${Number(m).toFixed(1)}</td></tr>`).join('')}</tbody></table></section>

  </div>
  <section class="rate-sec"><div class="card rate" aria-label="Your verdict"><h2>Your verdict</h2>
    ${['Overall', 'Detail ladder', 'New ingredients', 'Pell', 'Weather cards', 'Notebook'].map(n => `<div><b>${n}</b><div class="stars" role="group" aria-label="Rate ${n}">${[1, 2, 3, 4, 5].map(v => `<button type="button" data-rate="${n}:${v}" aria-pressed="false">${v}</button>`).join('')}</div></div>`).join('')}
    <label for="notes"><b>Comments</b></label><textarea id="notes" placeholder="What works, what feels off?"></textarea>
    <button class="b-primary" type="button" id="copy">Copy my verdict</button><p id="copied" class="lead" aria-live="polite"></p></div></section>
</div></div>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <filter id="cvd-protan"><feColorMatrix type="matrix" values="0.152 1.053 -0.205 0 0  0.115 0.786 0.099 0 0  -0.004 -0.048 1.052 0 0  0 0 0 1 0"/></filter>
  <filter id="cvd-deutan"><feColorMatrix type="matrix" values="0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0"/></filter>
  <filter id="cvd-tritan"><feColorMatrix type="matrix" values="1.256 -0.077 -0.179 0 0  -0.078 0.931 0.148 0 0  0.005 0.691 0.304 0 0  0 0 0 1 0"/></filter>
  <filter id="cvd-grey"><feColorMatrix type="saturate" values="0"/></filter>
</defs></svg>
<script>
(() => {
  const KEY = 'hearthlight-spike-v1';
  let st = { day: false, cvd: '', rates: {}, notes: '' };
  try { Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const q = new URLSearchParams(location.search);
  if (q.get('shot')) { document.body.classList.add('shot'); st.day = q.get('theme') === 'day'; st.cvd = ''; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  const pack = document.getElementById('pack');
  function apply() {
    pack.classList.toggle('day', st.day);
    document.documentElement.style.background = st.day ? '#F3E8D7' : '#1D1828';
    document.getElementById('stage').style.filter = st.cvd ? 'url(#cvd-' + st.cvd + ')' : '';
    document.querySelectorAll('[data-theme]').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.theme === 'day') === st.day)));
    document.querySelectorAll('[data-rate]').forEach(b => { const [n, v] = b.dataset.rate.split(':'); b.setAttribute('aria-pressed', String(st.rates[n] === Number(v))); });
    document.getElementById('cvd').value = st.cvd; document.getElementById('notes').value = st.notes;
    save();
  }
  document.querySelectorAll('[data-theme]').forEach(b => b.onclick = () => { st.day = b.dataset.theme === 'day'; apply(); });
  document.getElementById('cvd').onchange = e => { st.cvd = e.target.value; apply(); };
  document.querySelectorAll('[data-rate]').forEach(b => b.onclick = () => { const [n, v] = b.dataset.rate.split(':'); st.rates[n] = Number(v); apply(); });
  document.getElementById('notes').oninput = e => { st.notes = e.target.value; save(); };
  document.querySelectorAll('[data-learn]').forEach(b => b.onclick = () => {
    const fig = document.getElementById('nb-' + b.dataset.learn), on = !fig.classList.contains('developed');
    fig.classList.toggle('developed', on); b.textContent = on ? 'Forget (replay)' : 'Learn it';
  });
  document.getElementById('copy').onclick = () => {
    const text = 'Hearthlight spike verdict\\n' + ${JSON.stringify(['Overall', 'Detail ladder', 'New ingredients', 'Pell', 'Weather cards', 'Notebook'])}.map(n => n + ': ' + (st.rates[n] || '-') + '/5').join('\\n') + '\\nComments: ' + (st.notes || '-');
    const out = document.getElementById('copied');
    const fb = () => { const t = document.getElementById('notes'); t.value = text; t.focus(); t.select(); out.textContent = 'Selected in the comments box. Use your phone\\u2019s Copy.'; };
    try { navigator.clipboard.writeText(text).then(() => { out.textContent = 'Copied. Paste it back to Claude.'; }, fb); } catch (e) { fb(); }
  };
  apply();
})();
</script>
</body></html>`;

writeFileSync(fileURLToPath(new URL('prototypes/hearthlight-spike.html', root)), html);
console.log(`wrote prototypes/hearthlight-spike.html (${(html.length / 1024).toFixed(0)} KB)`);
