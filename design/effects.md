# Effects, card and event registries, phases (content v5, 2026-10-13)

This is audit Direction 2 (`design/audit-2026-10-12.md`). **Goal:** new morning cards, encounters and discoveries are written as content, with no code. Behaviour that is truly new is one small, named registry entry. One table says which player action is allowed when.

## The effects vocabulary
An **effect** is a one-key object `{ name: argument }`. Lists of effects apply in order. The vocabulary lives in `src/core/effects.js` (`EFFECTS`):

| Effect | Argument | Does | Exposes (for note text) |
|---|---|---|---|
| `coins` | integer | Coins change hands (negative = paid) | `{coins}` |
| `friend` | `"random"` or customer id | +1 relationship (never decreases) | `{who}` (name) |
| `addHerbs` | `[herb ids]` | Fresh herbs join the shelf, shaped by today's weather; recorded in `gained` | `{herb}` if exactly one |
| `learnHerb` | `"unknown"` or herb id | The Notebook learns a herb (`"unknown"` = a random one it doesn't know) | `{herb}`, `{trait}` |
| `learnRule` | rule id | A brewing rule goes into the Notebook | n/a |

**Randomness:** effects that draw (`friend: random`, `learnHerb: unknown`) use the stream of the step that applies them, in list order. Reordering effects therefore changes seeded replays; adding content at the end doesn't.

## Morning cards (`content.morning.cards`)
```json
"errand": { "weight": 1.5, "title": "Village errand", "text": "…", "art": "ingredient:honey",
            "effects": [{ "friend": "random" }, { "coins": 8 }],
            "note": "note.errand", "texts": ["{who} needed a hand with the washing line.", "…"] }
```
- **`when`** (optional): a condition from `CONDITIONS` (`canBuyHerb`, `unknownHerb`). The card is dealt only when it holds.
- **`effects`**: applied when the card is chosen. Then **`note`** (a strings key) is filled with the effects' vars plus `{text}`, which is one of **`texts`** drawn at random and filled with the same vars.
- **`action`** (instead of effects): a named behaviour in `CARD_ACTIONS` (`src/core/day.js`):
  - **`haul`** goes to the haul screen;
  - **`buyHerb`** deals a few affordable stall herbs (its `markup` and `offers` are card fields). The player picks one; this applies `coins: -price` and `addHerbs`.
- **Order:** cards are dealt from the eligible ones in content order, weighted by `weight`. Add new cards at the end to keep old seeds.
- A card with `offers` opens a sheet on the morning screen for the sub-choice. Any future action that deals choices works the same way.

## Events after the haul (`content.events`)
- **`draw`**: `[{ "kind": "encounter", "weight": 1 }, …]`. Among the kinds available today, one is drawn by weight, then one entry of that kind.
- **Kinds** live in `EVENT_KINDS` (`src/core/day.js`). Each has `deck(s)`, optional `available(s)` and `onDraw(s)`, and `resolve(s, entry, choice)`:
  - **`spot`**: two look-alikes (`good`, `bad`, `reward`). Right = `addHerbs` + `learnHerb` of the reward; wrong = nothing. Never two days in a row (`spotEvery`).
  - **`encounter`**: `options: [{ label, text, effects }]`. The chosen option's effects apply.
  - **`discovery`**: `effects` (must teach: `learnRule` or `learnHerb`). It's offered only while it still teaches something.
- **New encounters and discoveries** are content only. A new *kind* (e.g. a wisp chase) is one `EVENT_KINDS` entry plus its screen.

## Phases and dispatch
`PHASES` is the one place that lists the day's phases and where each may lead:

```
morning → haul | shop      haul → event      event → shop      shop → night      night → morning
```

`ACTIONS` names each player action and the phase it's allowed in:

| Action | Allowed in |
|---|---|
| `chooseCard {index, buy?}` | morning |
| `takeHaul {picks}` | haul |
| `resolveEvent {choice}` | event |
| `openShop` (the interim shop serves itself, then night falls) | shop |
| `sleep` | night |

`dispatch(state, action)` is the only entry point the UI and the debug bot use. It refuses an action outside its phase, and any result that jumps to a phase `PHASES` doesn't allow. The step functions (`chooseCard`, `applyHaul`, …) stay exported for focused tests.

## Validation and tests
- **Validator vocabulary:** `validateContent()` knows the vocabulary (`VOCAB` in `src/content/validate.js`). It checks every effect's name and argument, card conditions and actions, note keys, `buyHerb` fields, event draw kinds and weights, and that discoveries teach.
- **`tests/effects.test.js` checks:**
  - `VOCAB` matches the core registries exactly;
  - each effect works;
  - **a new card and a new encounter added only as data play correctly**;
  - `dispatch` enforces the phase table;
  - a week plays through `dispatch` alone.
- **Determinism:** seeded replays and both sims were identical before and after this change. Only the content version moved, from 4 to 5.

## Adding things: the cost now
| Addition | Where |
|---|---|
| A card whose behaviour is effects (fishing, foraging duty, a festival chore) | `content.json` only (+ art id) |
| An encounter, a discovery, a Spot pair | `content.json` only (+ plant art for Spot) |
| A new effect word (e.g. `addGarden`) | `EFFECTS` + `VOCAB.effects` + a test |
| A new card behaviour (e.g. a two-step trade) | `CARD_ACTIONS` + `VOCAB.cardActions` + its sheet in the morning screen |
| A new event kind | `EVENT_KINDS` + `VOCAB.eventKinds` + its markup in `src/ui/screens/event.js` |
