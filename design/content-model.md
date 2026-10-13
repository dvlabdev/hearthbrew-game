# Content model (content v4–v5, 2026-10-13)

All game content lives in `src/content/data/content.json`. Code reads it through `src/content/index.js` and never hard-codes content ids, numbers or player text. This is audit Direction 1 (`design/audit-2026-10-12.md`).

## One entity per herb
An **ingredient** is the single entity for a plant or material:
- `name`, `vec` (Heat, Calm, Vigor, Clarity), `tags`, `sources`, optional `grow` and `price`;
- **`forage`** (optional): present when the herb can turn up on a haul.
  ```json
  "forage": { "kind": "flower", "rarity": "common", "slots": 1, "units": 1, "value": 1 }
  ```

`FORAGE` (in `index.js`) is derived: every ingredient with a `forage` facet, plus its `name` and its **trait**. The trait is the strongest entry of `vec`, first on ties. The haul and the brewing therefore can't disagree about what a herb does.

**Order matters for seeded randomness:** the haul draws from foraged herbs in file order. Add new herbs at the end, or old seeds will replay differently. Saves are unaffected either way.

**`plants`** holds things that appear but are not ingredients, such as the look-alike `mayweed` in Spot the herb (just a `name`).

## Constants
- **`start`:**
  - `days` (season length);
  - `coins`;
  - `shelf` (the validated starting stock);
  - `garden` (plot count);
  - `owned`.
- **`morning.cards[type].art`:** the art id for the card; `"weather"` means today's weather.
- **What cards, encounters and discoveries *do*** is declared as effects (content v5). The garden's plots, the errand's coins and the market's markup now live on their cards; see `design/effects.md`.
- **`bases.<id>.default: true`:** the base used when none is chosen (spring water).
- **Brewing rule R4** keys on the `sweetener` tag, not on an id.
- `relationships` in a new game cover exactly the `customers`.

## Strings
- **`strings`** is a flat map of dotted keys to text with `{placeholders}`. Light inline markup (`<b>`, `<small>`) is allowed; it's trusted content.
- **`t(key, vars)`** fills a string. **`tn(key, n, vars)`** picks `key.one` or `key.other`.
- A missing key renders as the key itself, and a test fails if any `t('…')` or `tn('…')` key used in `src/` is missing.
- **Names** come from content:
  - `herbName(id)` (ingredient, then plant name);
  - `traitName(id)`;
  - customer `name`.
- **Labels:** `kind.<kind>` and `rarity.<rarity>` label the forage facets. The validator requires one for every kind in use.
- **Story text that belongs to an entity stays on that entity:** card titles, event text, weather text, customer clues.
- **Out of scope:** developer messages (`throw new Error`) and debug panels stay in English in code. The art packs' own `aria-label`s are part of the style pack contract.

## Aliases and save repair
**`aliases`** maps old ids to new ones: `{ "herb": { "oldId": "newId" }, "customer": { … } }`. When renaming a content id:
1. Rename it everywhere in `content.json`.
2. Add the alias.
3. The validator checks that the target exists and the old id is gone.

`repairIds()` runs on every `load()`, after the schema migrations:
- it maps ids through the aliases;
- it drops shelf items, Notebook entries and relationships whose ids no longer exist;
- it adds missing customers at 0;
- if the day in progress refers to a missing id, the day restarts from its morning.

Content changes never need a save migration. Schema changes still do (`SAVE_VERSION`, now 3).

## Validation
`validateContent(content)` returns readable errors such as `events.spot.chamomile-mayweed.reward: "lavendr" is not a foraged herb`. It runs in:
- `tests/content.test.js` (must be `[]`), with a negative test that breaks a copy and checks the messages;
- `?debug` (the title and in-game debug panels show "content: valid" or the list).

**What it checks:**
- **Cross-references:** recipes → ingredients; weather kinds → forage kinds; garden plots, the start shelf and spot rewards → foraged herbs; spot plants → ingredients or plants; discoveries → rules; customers and weather skew → traits; aliases.
- **Fields and ranges:** 4-integer vectors, slots 1–2, rarity, units and value, card weights, art and text, encounter effects (`coins`, `friend`), exactly one default base, start values.
- **Uniqueness and tags:** rule and event ids are unique; rule tags are real, exaggerated or magic.
- **Strings:** placeholders are well-formed, and there's a label for every kind and rarity.

**Art coverage** is tested separately: `requiredIds()` in `src/art/registry.js` now includes card art and spot plants from content, so content doesn't depend on art.

## Reference tools
**The Python tools in `tools/` are frozen (decided 2026-10-13)** as historical validation:
- the fixtures they produced stay as parity tests;
- the JS core is the source of truth for rules and content;
- `solution_space.py` still reads `ingredients[*].vec` and `tags`, which the forage facet leaves untouched.
