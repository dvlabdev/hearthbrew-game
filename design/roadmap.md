# Hearthbrew — Design & Production Plan (v2, post-audit)

## Context
We're starting from an empty folder (`H:\Il mio Drive\claude-repo\CraftingGame`). The goal is a small, polished crafting game, built entirely inside Claude Code, that you can enjoy as a short diversion.

Decisions so far:
- Browser game in TypeScript.
- A cozy potion and remedy shop.
- 5–15 minute sessions.
- Vector art generated in code.
- A day split into phases, in the style of Dave the Diver.

This v2 of the plan includes the editorial audit (it scored v1 at 6/10). It resolves the contradictions in the core rules, cuts the scope for v1, and adds an end goal, tension, an economy, onboarding, accessibility and playtest metrics.

---

## 1. Concept
**Working title:** *Hearthbrew*. Other candidates: *Thistle & Tincture*, *The Mossy Kettle*, *Brew & Bloom*, *Willowick Remedies*. The final name is decided in M0a.

**Frame (proposal, finalized in M0a):** you inherit your old mentor's dusty apothecary in a village. The **Midsummer Festival is in 20 days**. Restore the shop, win the trust of the villagers, and brew the festival's centerpiece remedy.
- The story runs in **chapters**: arrival → the shop reopens → the forest → the cave → festival preparations.
- The finale is the festival day, followed by credits.
- After that, an **endless mode** continues: new request sets and village needs.

### Pillars
1. **Read the customer (riddle requests).** Customers describe a *situation*, such as "my son can't sleep before his exam." You diagnose which trait profile would help. The request shows **no trait numbers**; you rely on keywords, your Notebook and experience.
2. **Discovery is progression (the Apothecary's Notebook).** Reaction rules and ingredient properties are discovered by experimenting and written into the Notebook. *Knowledge* is the main progression, ahead of coins.
3. **Always one more day.** There's a visible daily goal, a teaser for tomorrow, and multi-day growth.
4. **Cozy, with gentle stakes.** There's no fail state and nothing can be lost permanently. Opportunities *can* be missed:
   - A bad brew sells for less and gives no relationship gain.
   - Ingredients lose freshness.
   - A disappointed regular skips the next day.

### The day: 4 phases, one session ≈ 5–15 min
```
1. EXPLORE & COLLECT ─► 2. PREPARE & SELL ─► 3. IMPROVE ─► 4. REST (~10 s, autosave) ─► next day
```
1. **Explore & Collect** (morning, **3 action points**). Spend them on:
   - an **expedition** (the foraging mini-game in one area);
   - the **garden** (plant, water, harvest — multi-day growth);
   - the **market** (buy bases and basic items).
2. **Prepare & Sell** (day).
   - Brew at the stations.
   - Serve 3–6 riddle requests.
   - One request is the **featured request**, the day's goal.
3. **Improve** (evening). Ledger, upgrades, Notebook review, unlocks.
4. **Rest** (night). A one-screen recap: highlights, relationship changes, tomorrow's teaser. Kept short. Later it gains gameplay through the moon altar (v2).

---

## 2. Core rules (spec written in M0a: `design/brew-math.md`)
- **Trait vector:** 4 traits: 🔥Heat, 💧Calm, 🌿Vigor, ✨Clarity, each an integer from 0 to 10.
  - Every ingredient has a vector.
  - Every trait gets **color + shape + icon**, for accessibility.
- **Brew:**
  1. Start from the base modifier.
  2. Add the vectors of the ingredients, *after processing*.
  3. Apply any triggered **reaction rules** (e.g. boiling a delicate flower → Clarity −2; oil + water without wax → "separated", quality cap 1★).
  - **Order is not a mechanic.** We dropped it to keep the math readable; processing *before* the brew is the source of depth instead.
- **Recipes vs requests:**
  - A **recipe** is a named target vector with a tolerance. Discovering it adds it to the recipe book.
  - A **request** has a *hidden* target vector generated from a riddle template. **Any brew close enough satisfies it**, named or not.
  - Score = distance from the target → 0–3★ → price multiplier and relationship gain.
  - Hitting a known recipe gives a small bonus (the "proper remedy" price).
- **Riddle generation:** templates such as `{person} {situation} → target profile`.
  - Keywords hint at traits ("can't sleep" → Calm, "cold mountain" → Heat).
  - The Notebook logs every keyword you've decoded.
  - Difficulty grows with reputation: more traits involved, tighter tolerance, ambiguous wording.
- **Freshness:** fresh ingredients lose potency after N days. The drying rack preserves them, and dried ingredients shift their traits.
- **Relationships:** 4 regulars with 3 story beats each.
  - A good match raises the relationship.
  - A poor match gives no gain, and the regular skips tomorrow.
  - Relationships never drop.

## 3. Content (v1 scope — cut roughly in half after the audit)
### Research grounding (M0b.1, time-boxed)
- **M0 (short pass):** real herbalism and preparation chemistry for the ~8 starting ingredients and the first reaction rules.
- **Before M3 (full deep research):** herbalism, the preparation chemistry below, and historical alchemy (four elements, *tria prima*, the 7 operations used for naming).
  - Preparation chemistry: infusion vs decoction, maceration, distillation, emulsification, drying, salt as a preservative.
- Every rule is tagged 🧪 real / 🧪✨ exaggerated / ✨ magic.
- Output: `design/research/alchemy-research.md` and the ingredient → trait table.
- **Guardrails:**
  - In-game effects are fictional and the game isn't medical advice.
  - Toxic plants appear only abstractly.
  - No real recipes that could cause harm.

### Goods (v1)
| Good | Base | Station | Unlock |
|---|---|---|---|
| Potions | Spring water | Cauldron | Day 1 |
| Teas & infusions | Tea leaves | Kettle | ~Day 4 |
| Salves & balms | Oil + beeswax | Mortar + cauldron | ~Day 9 |
| Self-use goods | — | Any | Garden tonic ~Day 5, **lantern oil** (opens the cave) ~Day 12 |

### Tools (v1)
- **Stations:**
  - Cauldron (start; slots 3 → 5)
  - Shelf (start)
  - Kettle
  - Drying rack
  - Mortar & pestle
- **Field tools:**
  - Basket and sickle (start)
  - Trowel (roots)
  - Lantern (cave)
- **Garden:**
  - Watering can and 2 plots (start; up to 6 plots)
  - Compost bin (turns failed brews into fertilizer)

### Areas & mini-game (v1)
- **One mini-game framework with skins.** A search-and-pick grid: limited picks, hidden nodes, hint glints.
- Each area changes the parameters and adds one twist:
  - **Meadow:** basic version.
  - **Forest:** some nodes move between picks.
  - **Cave:** dark; the lantern reveals a radius.
- Input: tap or click. Duration: about 60–90 seconds.

### Materials (v1, ~20)
- **Meadow and garden:** mint, chamomile, fireroot, nettle, sage, lavender, honey.
- **Forest:** glowcap mushroom, oak moss, pine resin, berries, roots.
- **Cave:** sulfur, salt, quartz.
- **Market:** water, oil, tea leaves, beeswax.

Everything is animal-friendly: honey, wax and shed feathers only.

### Pacing to the festival (20 days)
| Days | Content |
|---|---|
| 1 | Brew and serve only, scripted |
| 2 | + Garden |
| 3 | + Meadow expedition |
| 4–6 | Kettle (teas), drying rack, freshness |
| 7 | Forest opens |
| 9–11 | Mortar, salves |
| 12–14 | Lantern oil → cave |
| 15–19 | Festival preparations, regulars' final beats |
| 20 | Festival finale, then credits and endless mode |

### Deferred to the "v2 maybe" list
- Candles and incense
- Distiller and tinctures
- Moon altar, Arcane and charms
- Marsh and cliffs
- Beehive and greenhouse
- Seasons and moon phases
- More regulars

## 4. Economy (M0b.3: `design/economy.md`)
- Income per day and cost curves per upgrade, targeting about one meaningful purchase every 1–2 days.
- **Coin sinks:**
  - Shop decor (cosmetic)
  - Village donations (unlock festival elements)
  - Rare seeds
  - Market restocks
- **Balance simulation:** a Vitest test where a greedy bot plays 20 days. It asserts no stalls, no runaway coins, and that the festival is reachable by day 20.

## 5. Onboarding & accessibility
- **Days 1–3 are scripted.** After that, at most **one new verb per day**.
- Dragging an ingredient onto a station shows a **before → after trait preview**. The player never has to do the math in their head.
- **CLAUDE.md conventions from M1:**
  - Colorblind-safe palette, with shape + icon on every trait.
  - Pointer events, so touch and mouse both work.
  - Responsive layout that works on mobile.
  - Minimum font size of 16px.
  - Reduced-motion option.
- **Settings:** volume, reduced motion, reset save.

## 6. Playtest metrics (debug panel, from M1)
- Time to first sale (target under 90 seconds)
- Session length
- Average stars per brew
- Percentage of requests matched on the first try
- Coins against the next upgrade cost, per day
- The day of the first "nothing new to do" moment

---

## 7. Tech structure
- **Stack:** TypeScript + Vite. DOM/CSS panels plus inline SVG art. Vitest for tests. Sound effects synthesized with WebAudio.
- **Architecture:** a pure serializable state, pure system functions (`brew`, `scoreRequest`, `generateRequest`, `advanceDay`), a thin UI that reads the state, and content kept in typed data files.
- **Save:** localStorage, versioned, **with migration tests from day one**.
- **Hosting:** GitHub Pages by default. A private claude.ai Artifact is optional (its storage is per browser).

```
CraftingGame/
  design/  GDD.md  brew-math.md  content-bible.md  economy.md  roadmap.md  research/
  src/core/  src/content/  src/ui/  src/art/  src/audio/  src/debug/
  tests/     # systems, save migrations, 20-day balance sim
  CLAUDE.md  # conventions, a11y rules, scope guard ("v2 maybe" list)
```

## 7b. M0c: design validation gate (before any production code)
These are cheap tests that try to disprove the design before we invest in building it. Output: `design/validation.md`, with a pass, fail or adjust result for each check.

**A. Throwaway prototypes** (each a single file, deleted afterwards)
1. **Brew + riddle toy:**
   - One HTML page with 8 ingredients, a trait meter and 10 riddles.
   - Questions: is decoding a riddle and then hitting the profile *fun*? Do you hit the "aha"?
   - Does it feel like guess-the-designer?
   - A blind test: an agent or a friend solves the riddles without the answer key, and we compare.
2. **Mini-game grey-box:**
   - The search grid at 60–90 seconds, played on desktop *and* mobile touch.
   - Questions: is it enjoyable on the 5th play? Does it fit the cozy tone?
3. **Art style tile:**
   - Palette, fonts, 3 ingredient icons, the cauldron and one customer, all generated in code.
   - Question: can code-generated art reach a quality bar we're happy with? This is the biggest production risk.

**B. Analytical checks** (scripts and spreadsheets)
4. **Solution-space analysis:**
   - A script enumerates the ingredient combinations for every request profile.
   - Target: 2–6 valid solutions per request. Not exactly 1, which is a lookup puzzle, and not dozens, which is trivial.
   - It flags **dominant ingredients** (one that solves everything) and **dead ingredients** (never optimal).
5. **Decision audit:**
   - For each phase, list the meaningful decisions and their trade-offs.
   - Check that no option is always best. For example, the garden should not always beat an expedition.
   - Check that each phase is worth its time.
6. **20-day paper economy:**
   - A spreadsheet of coin sources and sinks per day, done before code.
   - Mark when each upgrade becomes affordable.
   - Find "dead days" with nothing new or nothing to buy.
7. **Time budget:**
   - Estimate seconds per phase, for example 3 AP × 60–90 s, plus 4 customers × 45 s.
   - Confirm that a day fits within 5–15 minutes, including day 1.
8. **Click-flow and wireframes:**
   - Screen map of one full day, counting taps per phase.
   - Layout of the brew screen at 375px width.

**C. Design-quality review** (checklist, scored 1–5 per item)
- **Legibility:** can the player predict a brew's outcome before committing?
- **Meaningful choice:** every phase has at least one real trade-off.
- **Depth/complexity ratio:** many outcomes from few rules. Count verbs against the combinations that emerge.
- **Feedback loops:** compounding (rich get richer) is kept in check, for example by rising costs and featured requests.
- **Novelty curve:** something new or meaningful on every one of the 20 days. Draw the day-by-day chart.
- **First-time player journey:** a storyboard of the first 10 minutes, step by step.
- **Pillar matrix:** every feature maps to at least one pillar. Features with no pillar are cut.
- **Fiction and mechanics fit:** the mechanics support the story (mentor's apothecary, festival, real chemistry + magic).
- **Recovery:** bad days still progress something (Notebook, relationships, the garden).
- **Post-festival hook:** the endless mode has a reason to exist.

**Gate to M1:**
- The 3 prototypes pass.
- Checks 4–8 pass or have been adjusted.
- The checklist averages at least 4/5.
- A **re-audit by the editor agent** scores at least 7.5/10.

## 8. Roadmap
| # | Milestone | Deliverables | Exit test |
|---|---|---|---|
| M0a | Rules | GDD (frame, pillars, day), **brew-math.md**, name, tone, CLAUDE.md | Contradictions resolved; you'd play it |
| M0b | Content | .1 short research (starting ingredients). .2 content-bible (v1 scope). .3 economy.md | Every item has a role; rules tagged real, exaggerated or magic |
| M0c | Validation gate | 3 throwaway prototypes, analytical checks, quality checklist, editor re-audit (section 7b) | Gate criteria met |
| M1 | Vertical slice | Days 1–3 playable in grey-box: brew, serve riddles, garden, meadow mini-game, Notebook stub, debug metrics | First sale in under 90 s; day 1 is fun |
| M2 | Core systems | Stars, relationships, freshness, upgrades, economy, save + migrations, balance sim | Sim passes; 5 days feel like progress |
| M3 | Content | **Full deep research**, then forest and cave, teas and salves, 4 regulars × 3 beats, 20-day story | Festival reachable; about 2 hours of play |
| M4 | Juice & polish | Vector art, animation, SFX, onboarding polish, accessibility pass | A new player succeeds unaided |
| M5 | Ship | GitHub Pages, final balance from metrics | You play for fun |

**Cadence for each feature:**
1. Write a spec in `design/`.
2. Implement it.
3. Run tests.
4. Play it in the built-in browser.
5. Write down playtest notes and metrics.
6. Adjust.

## Audit record
- **v1 score:** 6/10 (design 6.5, originality 5.5, approachability 5.5, progression 6).
- **All four recommendation groups were adopted.**
- **Rest phase and research timing:** compromise kept. Rest stays as a short phase; research is a short pass in M0 and the full pass before M3.
- **Next step:** re-audit v2 after M0a if desired.

## Verification
- **M0:** review the design docs together.
- **From M1:**
  - `npm run test` covers the systems, save migrations and the 20-day balance sim.
  - `npm run dev` runs the game, played in the built-in browser.
  - The debug panel metrics are checked against the targets.
  - Each milestone's exit test must pass.
