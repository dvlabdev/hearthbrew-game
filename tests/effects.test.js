import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame } from '../src/core/state.js';
import { EFFECTS, CONDITIONS, applyEffects } from '../src/core/effects.js';
import { CARD_ACTIONS, EVENT_KINDS, PHASES, ACTIONS, dispatch, startDay } from '../src/core/day.js';
import { VOCAB, validateContent } from '../src/content/validate.js';
import { CONTENT, MORNING, EVENTS, CUSTOMERS } from '../src/content/index.js';
import { makeRng } from '../src/core/rng.js';

test('the validator knows exactly the vocabulary the core implements', () => {
  assert.deepEqual(Object.keys(EFFECTS).sort(), [...VOCAB.effects].sort());
  assert.deepEqual(Object.keys(CONDITIONS).sort(), [...VOCAB.conditions].sort());
  assert.deepEqual(Object.keys(CARD_ACTIONS).sort(), [...VOCAB.cardActions].sort());
  assert.deepEqual(Object.keys(EVENT_KINDS).sort(), [...VOCAB.eventKinds].sort());
});

test('each effect does what it says and exposes its vars', () => {
  const s = startDay(newGame(3));
  const ctx = { rng: makeRng(1) };
  const coins = s.coins, shelf = s.shelf.length;
  const v = applyEffects(s, [{ coins: 5 }, { friend: 'bramble' }, { addHerbs: ['mint'] }, { learnHerb: 'glowcap' }, { learnRule: 'R2' }], ctx);
  assert.equal(s.coins, coins + 5);
  assert.equal(s.relationships.bramble, 1);
  assert.equal(s.shelf.length, shelf + 1);
  assert.deepEqual(s.today?.gained, ['mint']);
  assert.ok(s.notebook.known.glowcap);
  assert.deepEqual(s.notebook.rules, ['R2']);
  assert.deepEqual(v, { coins: 5, who: CUSTOMERS.bramble.name, herb: 'Glowcap', trait: 'Clarity' });
  const r = applyEffects(s, [{ friend: 'random' }, { learnHerb: 'unknown' }], ctx);
  assert.ok(typeof r.who === 'string' && typeof r.herb === 'string');
});

test('a new card defined only in content is dealt and played with no code change', () => {
  /** @type {any} */ const cards = MORNING.cards;
  cards.fishing = { weight: 1000, title: 'Fishing at {trail}', text: 'Sit by the water.', art: 'ingredient:mint',
    effects: [{ coins: 2 }, { addHerbs: ['mint'] }], note: 'note.garden' };
  try {
    assert.deepEqual(validateContent(CONTENT), []);
    const s = startDay(newGame(4));
    const i = s.today?.offer.findIndex(c => c.type === 'fishing') ?? -1;
    assert.ok(i >= 0, 'dealt');
    const after = dispatch(s, { type: 'chooseCard', index: i });
    assert.equal(after.today?.phase, 'shop');
    assert.equal(after.coins, s.coins + 2);
    assert.deepEqual(after.today?.gained, ['mint']);
  } finally { delete cards.fishing; }
});

test('a new encounter is just content', () => {
  const extra = { id: 'test-peddler', title: 'A peddler', text: 'A cart rattles by.', options: [{ label: 'Wave', text: 'A nod back.', effects: [{ coins: 1 }, { friend: 'pell' }] }] };
  EVENTS.encounter.push(extra);
  try {
    assert.deepEqual(validateContent(CONTENT), []);
    const s = startDay(newGame(6));
    if (!s.today) throw new Error('no day');
    s.today.phase = 'event'; s.today.event = { kind: 'encounter', id: extra.id };
    const after = dispatch(s, { type: 'resolveEvent', choice: 0 });
    assert.equal(after.coins, s.coins + 1);
    assert.equal(after.relationships.pell, s.relationships.pell + 1);
  } finally { EVENTS.encounter.pop(); }
});

test('dispatch: actions only in their phase, and only along PHASES', () => {
  const s = startDay(newGame(8));
  assert.throws(() => dispatch(s, { type: 'sleep' }), /not allowed in phase morning/);
  assert.throws(() => dispatch(s, { type: 'openShop' }), /not allowed/);
  assert.throws(() => dispatch(newGame(8), { type: 'chooseCard', index: 0 }), /no day/);
  for (const [type, a] of Object.entries(ACTIONS)) assert.ok(a.from in PHASES, type);
  // every phase is reachable and every phase has an action
  const froms = new Set(Object.values(ACTIONS).map(a => a.from));
  for (const p of Object.keys(PHASES)) assert.ok(froms.has(/** @type {any} */ (p)), `no action leaves ${p}`);
});

test('a full week through dispatch only', () => {
  let s = startDay(newGame(12));
  for (let d = 0; d < 7; d++) {
    const t = /** @type {NonNullable<typeof s.today>} */ (s.today);
    const i = Math.max(0, t.offer.findIndex(c => c.type === 'expedition'));
    s = dispatch(s, { type: 'chooseCard', index: i, buy: t.offer[i].offers?.[0] });
    if (s.today?.phase === 'haul') {
      s = dispatch(s, { type: 'takeHaul', picks: s.today.finds.slice(0, 2) });
      s = dispatch(s, { type: 'resolveEvent', choice: 0 });
    }
    s = dispatch(s, { type: 'openShop' });
    assert.equal(s.today?.phase, 'night');
    s = dispatch(s, { type: 'sleep' });
  }
  assert.equal(s.day, 8);
});
