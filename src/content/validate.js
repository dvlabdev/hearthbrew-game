// Content validation (design/content-model.md): cross-references, required fields and ranges.
// Pure: takes the parsed content.json and returns readable errors ([] = valid). Run by the tests and shown in ?debug.

const RARITIES = ['common', 'uncommon', 'rare'];
const EFFECTS = ['coins', 'friend'];
const RULE_TAGS = ['real', 'exaggerated', 'magic'];

/** @param {any} c parsed content.json @returns {string[]} */
export function validateContent(c) {
  /** @type {string[]} */ const errors = [];
  const err = (/** @type {string} */ where, /** @type {string} */ msg) => { errors.push(`${where}: ${msg}`); };
  const ING = c.ingredients || {}, CUST = c.customers || {}, PLANTS = c.plants || {};
  const traitIds = (c.traits || []).map((/** @type {any} */ t) => t.id);
  const ruleIds = (c.rules || []).map((/** @type {any} */ r) => r.id);
  const isIng = (/** @type {string} */ id) => Object.hasOwn(ING, id);
  const isHerb = (/** @type {string} */ id) => isIng(id) && !!ING[id].forage;
  const vec = (/** @type {string} */ where, /** @type {any} */ v) => {
    if (!Array.isArray(v) || v.length !== 4 || !v.every(Number.isInteger)) err(where, 'vec must be 4 integers');
  };
  const dupes = (/** @type {string} */ where, /** @type {string[]} */ ids) => {
    for (const id of new Set(ids.filter((x, i) => ids.indexOf(x) !== i))) err(where, `duplicate id "${id}"`);
  };

  if (traitIds.length !== 4) err('traits', 'there must be exactly 4 traits');
  dupes('rules', ruleIds);
  for (const r of c.rules || []) if (!RULE_TAGS.includes(r.tag)) err(`rules.${r.id}`, `tag must be one of ${RULE_TAGS.join(', ')}`);

  // Ingredients and their forage facet
  /** @type {Set<string>} */ const kinds = new Set();
  for (const [id, ing] of Object.entries(ING)) {
    const w = `ingredients.${id}`;
    if (!ing.name) err(w, 'missing name');
    vec(w, ing.vec);
    if (!Array.isArray(ing.tags)) err(w, 'tags must be a list');
    else if (ing.tags.includes('delicate') && ing.tags.includes('tough')) err(w, 'delicate and tough are exclusive');
    if (Object.hasOwn(PLANTS, id)) err(w, 'also listed under plants');
    const f = ing.forage;
    if (!f) continue;
    kinds.add(f.kind);
    if (typeof f.kind !== 'string' || !f.kind) err(`${w}.forage`, 'missing kind');
    if (!RARITIES.includes(f.rarity)) err(`${w}.forage`, `rarity must be one of ${RARITIES.join(', ')}`);
    if (f.slots !== 1 && f.slots !== 2) err(`${w}.forage`, 'slots must be 1 or 2');
    if (!(Number.isInteger(f.units) && f.units > 0)) err(`${w}.forage`, 'units must be a positive integer');
    if (!(Number.isInteger(f.value) && f.value >= 0)) err(`${w}.forage`, 'value must be a non-negative integer');
    if (Array.isArray(ing.vec) && Math.max(...ing.vec) <= 0) err(w, 'a foraged herb needs a positive trait');
  }
  if (!kinds.size) err('ingredients', 'no foraged herbs');

  if (Object.values(c.bases || {}).filter((/** @type {any} */ b) => b.default).length !== 1) err('bases', 'exactly one base must be the default');

  for (const [id, r] of Object.entries(c.recipes || {})) {
    vec(`recipes.${id}`, r.vec);
    for (const ing of Object.keys(r.requires || {})) if (!isIng(ing)) err(`recipes.${id}.requires`, `unknown ingredient "${ing}"`);
  }

  for (const [id, w] of Object.entries(c.weather || {})) {
    if (!(w.finds > 0)) err(`weather.${id}`, 'finds must be > 0');
    for (const key of ['prime', 'boost', 'poor']) for (const k of w[key] || []) if (!kinds.has(k)) err(`weather.${id}.${key}`, `unknown forage kind "${k}"`);
    if (w.skew != null && !traitIds.includes(w.skew)) err(`weather.${id}.skew`, `unknown trait "${w.skew}"`);
  }

  for (const [id, cu] of Object.entries(CUST)) {
    if (!cu.name) err(`customers.${id}`, 'missing name');
    if (!traitIds.includes(cu.trait)) err(`customers.${id}`, `unknown trait "${cu.trait}"`);
  }

  const st = c.start || {};
  if (!(Number.isInteger(st.days) && st.days > 0)) err('start.days', 'must be a positive integer');
  if (!(Number.isInteger(st.garden) && st.garden >= 0)) err('start.garden', 'must be a non-negative integer');
  for (const s of st.shelf || []) {
    if (!isHerb(s.herb)) err('start.shelf', `"${s.herb}" is not a foraged herb`);
    if (!(s.nights > 0)) err('start.shelf', `"${s.herb}" needs nights > 0`);
  }

  const m = c.morning || {};
  for (const [id, card] of Object.entries(m.cards || {})) {
    if (!(card.weight > 0)) err(`morning.cards.${id}`, 'weight must be > 0');
    if (!card.title || !card.text) err(`morning.cards.${id}`, 'missing title or text');
    if (!card.art) err(`morning.cards.${id}`, 'missing art');
  }
  for (const h of m.garden?.plots || []) if (!isHerb(h)) err('morning.garden.plots', `"${h}" is not a foraged herb`);
  if (!(m.trails || []).length) err('morning.trails', 'needs at least one trail');

  const ev = c.events || {};
  dupes('events', ['spot', 'encounter', 'discovery'].flatMap(k => (ev[k] || []).map((/** @type {any} */ e) => e.id)));
  for (const e of ev.spot || []) {
    const w = `events.spot.${e.id}`;
    if (!isIng(e.good)) err(`${w}.good`, `unknown ingredient "${e.good}"`);
    if (!isIng(e.bad) && !Object.hasOwn(PLANTS, e.bad)) err(`${w}.bad`, `unknown plant "${e.bad}"`);
    if (!isHerb(e.reward)) err(`${w}.reward`, `"${e.reward}" is not a foraged herb`);
  }
  for (const e of ev.encounter || []) {
    if (!(e.options || []).length) err(`events.encounter.${e.id}`, 'needs options');
    for (const o of e.options || []) if (!EFFECTS.includes(o.effect)) err(`events.encounter.${e.id}`, `unknown effect "${o.effect}"`);
  }
  for (const e of ev.discovery || []) if (!ruleIds.includes(e.rule)) err(`events.discovery.${e.id}`, `unknown rule "${e.rule}"`);

  // Aliases: old id -> an id that exists; the old id must be gone
  const targets = /** @type {Record<string, Record<string, unknown>>} */ ({ herb: ING, customer: CUST });
  for (const [kind, map] of Object.entries(c.aliases || {})) {
    if (!targets[kind]) { err('aliases', `unknown id kind "${kind}"`); continue; }
    for (const [from, to] of Object.entries(/** @type {Record<string, string>} */ (map))) {
      if (!Object.hasOwn(targets[kind], to)) err(`aliases.${kind}.${from}`, `points to unknown "${to}"`);
      if (Object.hasOwn(targets[kind], from)) err(`aliases.${kind}.${from}`, 'the old id still exists');
    }
  }

  // Strings: well-formed placeholders; every forage kind and rarity has a label
  for (const [k, s] of Object.entries(c.strings || {})) {
    if (typeof s !== 'string') err(`strings.${k}`, 'must be text');
    else if (s.replace(/\{\w+\}/g, '').match(/[{}]/)) err(`strings.${k}`, 'malformed {placeholder}');
  }
  for (const k of kinds) if (!c.strings?.[`kind.${k}`]) err('strings', `missing "kind.${k}"`);
  for (const r of RARITIES) if (!c.strings?.[`rarity.${r}`]) err('strings', `missing "rarity.${r}"`);
  return errors;
}
