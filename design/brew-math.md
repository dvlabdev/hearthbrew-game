# Brew Math & Request Scoring: spec

**Status:** M0a draft v1. All numbers are **provisional**. M0b.1 (research) refines the ingredient vectors, and M0c (the solution-space script) validates the balance.

## 1. Traits
A **trait vector** has 4 components: `[Heat, Calm, Vigor, Clarity]`.

| Trait | Icon / shape | Meaning in fiction | Real-world anchor |
|---|---|---|---|
| 🔥 Heat | flame / triangle | warming, stimulating circulation | ginger, pepper, mustard |
| 💧 Calm | droplet / circle | soothing, sleep, easing nerves | chamomile, lavender, lemon balm |
| 🌿 Vigor | leaf / square | strength, recovery, nourishment | nettle, rosehip, honey |
| ✨ Clarity | star / diamond | focus, alertness, clear breath | sage, mint, rosemary |

- Ingredient values range from −3 to +4 per trait. A negative value represents an opposing effect, such as mint *cooling*.
- A final brew is clamped to 0–10 per trait.

## 2. Brewing a good
```
brew = clamp0..10( reactions( base.mod + Σ processed(ingredient_i) , context ) )
```
- **Base:** decides the good type.
  - Potion: spring water, mod `[0,0,0,0]`.
  - Tea: tea leaves, mod `[0,1,0,0]`. Always steeped (a gentle "simmer").
  - Salve: oil + beeswax (M3).
- **Slots:** the cauldron starts with 3 slots and upgrades to 4, then 5.
  - Empty slots are allowed.
  - Duplicates are allowed, at one unit per slot.
- **Heat setting** (cauldron only): **Simmer** or **Boil**. This is the infusion vs decoction choice (🧪 real):
  - Simmer: `delicate` ingredients (flowers, soft leaves) give their full value. `tough` ingredients (roots, bark, hips) give −1 on their *main* trait, because extraction is incomplete.
  - Boil: `tough` ingredients give their full value. `delicate` ingredients lose −1 Clarity and −1 Calm (the volatile aromatics evaporate), with each penalty applied only if the ingredient has that trait.
- **Order doesn't matter.** Addition is commutative. Depth comes from processing, the heat setting and reactions.
- **Before → after preview:** while you drag ingredients in, the meter shows the projected brew, based **only on what the Notebook knows** (see §6).

## 3. Reaction rules (data-driven, v1 starter set)
Each rule has a condition, an effect, a tag, and a Notebook entry written the first time it triggers.

| ID | Condition | Effect | Tag |
|---|---|---|---|
| R1 | Delicate ingredient at **Boil** | −1 Clarity and −1 Calm on that ingredient | 🧪 real (volatile oils evaporate) |
| R2 | Tough ingredient at **Simmer** | −1 on its main trait | 🧪 real (decoction needed) |
| R3 | Brew Heat ≥ 8 at **Boil** | **Scorched**: all other traits −1, and the potion gets a burnt look | 🧪✨ exaggerated |
| R4 | Honey + any Heat ingredient | +1 Calm (honey softens the bite) | 🧪✨ exaggerated |
| R5 | Salt in a brew | +1 to the brew's highest trait, and the good keeps 2 extra days on the shelf | 🧪✨ (salt preserves) |
| R6 | Oil-based ingredient + water base without beeswax | **Separated**: quality capped at 1★ | 🧪 real (emulsification) |
| R7 | The brew's two highest traits are equal and ≥ 4 | **Harmonized**: +1 star (max 3★) | ✨ magic (a Wren-taught "balance charm") |
| R8 | Quartz dust in the brew | **Purify**: the lowest non-zero trait becomes 0 | ✨ magic |

- Rules run in a fixed order: per-ingredient rules (R1, R2) → sum → brew-level rules (R3–R7).
- The full reaction set is designed in M0b.1, from the research.

## 4. Freshness & processing
| State | When | Effect |
|---|---|---|
| Fresh | Days 0–2 after gathering | Full vector |
| Wilted | Days 3–4 | −1 on every non-zero trait (toward 0) |
| Spent | Day 5+ | Composts automatically (becomes fertilizer) |
| Dried | Drying rack, 1 night | Never decays. Uses the ingredient's own `dried` vector, typically Clarity −1, and for aromatics +1 Heat. Delicate → no longer delicate. |
| Ground (M3) | Mortar | +1 on the main trait; tough → no longer tough |

## 5. Requests & scoring
**Target**
- A request has a **hidden target vector `T`** (all 4 traits; unmentioned traits are usually 0) and a **tolerance `tol`**.
- **Distance:** Manhattan, `d = Σ |brew_i − T_i|`. Overshooting a trait the customer doesn't want (Heat in a sleep draught) costs as much as undershooting.

**Stars**

| Condition | Stars | Price ×| Relationship |
|---|---|---|---|
| d ≤ tol | ★★★ | 1.5 | +2 |
| d ≤ tol + 2 | ★★ | 1.0 | +1 |
| d ≤ tol + 4 | ★ | 0.6 | +0, skips tomorrow |
| otherwise | – | 0.25 (the customer pays out of kindness) | +0, skips tomorrow |

**Bonuses**
- **Recipe bonus:** the brew is within d ≤ 2 of a *known* named recipe, and that recipe scores at least 2★ for this request → price ×1.2. Named recipes reward mastery but are never required.
- **Featured request:** price ×2, reputation +2.

**Riddle generation**
- **Template:** `{who} + {situation keyword(s)} + {intensity word}`.
- **Keywords** map to traits, for example:
  - "can't sleep" → Calm
  - "chilled to the bone" → Heat
  - "aching back" → Vigor (+ Heat)
  - "head in a fog" → Clarity
  - "jittery" → Calm (+ Clarity)
- **Intensity words** set the magnitude: "a little" = 3, plain = 4–5, "terribly / all week" = 6–7.
- **Difficulty tiers** follow reputation:

| Tier | Traits involved | tol | Extra |
|---|---|---|---|
| 1 (days 1–4) | 1 | 2 | Clear keywords |
| 2 (days 5–12) | 2 | 2 | — |
| 3 (days 13+) | 2–3 | 1 | Includes "avoid" constraints ("but nothing that keeps me up" → Clarity 0, Heat 0) and synonyms |

**Example riddles**
| Riddle | Hidden T | Valid solutions (3 slots) |
|---|---|---|
| Marla: "The baby's had me up all week, I just need to *sleep*." | `[0,6,0,0]` tol 2 | Chamomile×2 (simmer) → d0 · Chamomile + Lavender + Honey → `[0,6,1,1]` d2 |
| Pell: "Chilled to the bone and my shoulders ache." | `[4,0,4,0]` tol 2 | Fireroot + Nettle (boil) → d0 · + Honey → `[4,2,5,0]` d3 → 2★ (R4 adds +1 Calm) |
| Fennick: "Exam tomorrow. My head's foggy and my hands won't stop shaking." | `[0,3,0,4]` tol 2 | Sage + Mint (simmer) → `[0,2,0,5]` (Heat clamped) d2 · Sage + Chamomile → `[0,4,0,3]` d2 · Sage×2 + Chamomile → `[0,5,0,6]` d4 → 2★ |

## 6. The Notebook: what the player knows
- **Ingredients:**
  - Wren's starter ingredients are fully known: her notes.
  - A new ingredient shows its **dominant trait** on pickup and its full vector after it's first used in a brew.
- **Reaction rules:** logged in the Notebook the first time each one triggers, as a short note with Wren's annotation. After that, the preview accounts for them.
- **Keywords:** each keyword is logged as "decoded" after any brew of 2★ or better for a request that contains it. Decoded keywords are underlined in future riddles, and hovering or tapping one shows its trait icon.
- **Recipes:** a named recipe is logged when a brew lands within d ≤ 1 of it. Undiscovered recipes appear as silhouettes with Wren's hint.
- **Legibility vs discovery:** the preview is always *honest about what's known* and shows "?" where things are unknown. Nothing is hidden on purpose once you've discovered it.

## 7. Starter ingredients (provisional — research pass M0b.1 refines them)
| Ingredient | Vector [H,C,V,Cl] | Tags | Source |
|---|---|---|---|
| Chamomile | [0,3,0,0] | delicate, flower | start shelf / garden |
| Lavender | [0,2,0,1] | delicate, flower | garden |
| Mint | [−2,1,0,2] | delicate, leaf | start shelf / meadow |
| Sage | [0,1,0,3] | leaf | start shelf / meadow |
| Fireroot | [3,0,1,0] | tough, root | start shelf / meadow |
| Nettle | [1,0,3,0] | leaf | meadow |
| Rosehip | [0,0,2,1] | tough, fruit | meadow / garden |
| Honey | [0,1,1,0] | sweetener (R4) | market |

The tags `delicate` and `tough` are exclusive. Sage and nettle are neither (they're robust leaves), so heat doesn't affect them.

## 8. Open questions (to resolve in M0b / M0c)
1. ~~Penalty for unwanted traits~~ **Resolved (2026-10-07):** full weight. Overshooting an unwanted trait costs the same as missing a wanted one. Revisit only if M0c playtests show tier 1 is frustrating.
2. ~~Simmer/Boil tap~~ **Resolved (2026-10-07):** **Simmer is the default**; Boil is an optional toggle on the cauldron.
3. Featured request: **a regular when one is due that day, otherwise a walk-in** (decided in M0b).
4. ~~Batch size~~ **Resolved in M0b:** potion = 2 bottles, tea = 3 cups, salve = 2 jars (see content-bible §1).
5. R7 Harmonized does **not** apply to the Midsummer Draught (see content-bible §8).
