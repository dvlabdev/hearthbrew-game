# Validation log (M0c gate)

Each check records: pass, fail or adjust, the evidence, and the date. The criteria are in roadmap.md §7b.

## Check 4: solution-space analysis (started early, 2026-10-07)
**Tool:** `tools/solution_space.py` (brute force over every ingredient combination × Simmer/Boil, applying rules R1–R5, R7 and R8). Run `python tools/tune_midsummer.py` for the finale tuning.

*Historical (tol 2 and pre-variant-D values; superseded by the tol-1 results and the full request-space check below).*

| Request | Pool | 3★ combinations | Verdict |
|---|---|---|---|
| Marla, sleep `[0,6,0,0]` tol 2 | starter shelf, 3 slots | 3 | ✅ pass (target 2–6) |
| Pell, warm `[4,0,4,0]` tol 2 | starter + nettle | 5 | ✅ pass |
| Fennick, exam `[0,3,0,4]` tol 2 | starter shelf | 9 | ⚠️ slightly generous. Revisit with tol 1 for tier 2. |
| Midsummer Draught `[5,5,5,5]`, original (tol 3, R7 on, unlimited Sunwort) | all v1, 5 slots | **595** | ❌ fail. Trivial: 5× Sunwort was a dominant answer, and angelica was near-dominant. |
| Midsummer Draught, **tuned** (tol 2, R7 off, 1–2 Sunwort required, angelica `[2,0,1,1]`) | all v1, 5 slots | 17 (199 at 2★ or better); **21 (231)** after brimstone was added to the pool and the script moved to content.json | ✅ adjusted. Varied ingredient use; works as a capstone challenge. |

**Changes applied:**
- Angelica changed from `[2,0,2,1]` to `[2,0,1,1]`.
- Sunwort is a single harvest of 2.
- Finale rules: tol 2, R7 off, Sunwort required.

**Still to do for check 4:**
- Generate all request templates by tier.
- Flag ingredients that are never used (dead) or used everywhere (dominant) across the full request set.

## Prototype A: art style tile (2026-10-07)
- **File:** `prototypes/art-tile.html`
- **Live (private):** https://claude.ai/artifact/Qwj6bgxEiaENJ1G8zedJe7
- **Contents:**
  - Light theme ("Daylight") and dark theme ("Candlelit").
  - 4 trait badges (colour + shape + glyph) with a colour-vision simulation (protan, deutan, tritan, mono).
  - 3 typefaces: IM Fell English (display), Atkinson Hyperlegible (body), Kalam (Wren's notes).
  - Ingredient art: chamomile, fireroot, glowcap.
  - Animated cauldron with Simmer/Boil.
  - Marla's riddle card.
  - A working 375px brew screen with an honest preview (glowcap's Calm shows "?" until it's brewed).
- **Covers check 8 wireframe:** yes, the brew screen.
- **Iterations:**
  - v2: fits 360px phones (Samsung S23).
  - v3: 3 palette proposals; stronger contrast between Simmer and Boil.
- **Status:** ✅ **PASS (2026-10-07).** The user approved the concept and the flames. They chose **palette A, Whisperwood Dusk, with Candlelit as the primary look**. Locked in `design/art-direction.md`.

## Prototype B: brew + riddle toy (2026-10-07)
- **File:** `prototypes/brew-toy.html`
- **Live (private):** https://claude.ai/artifact/UMRAX3RFJxVG9Q2VdB19Jb
- **Riddles:** `design/data/riddles-toy.json`. Checker: `python tools/check_riddles.py`.

### Riddle solution space
- **Tolerance 2 was far too generous.** A single ingredient often scored 3★: sage alone for Fennick, and up to 23 three-star combinations per riddle.
- **Decision:** **tolerance 1 for every tier**. Updated in brew-math.md.
- **Two rewordings:**
  - #2: "*a bit* chilled", so the target is reachable.
  - #7: "*terribly* foggy, hands shake *a little*", to tighten it.
- **Single 3★ answers, kept as deliberate "aha" moments:**
  - #2: boil the fireroot.
  - #10: mint cancels nettle's hidden heat.
  - Both still have 6–7 two-star answers.
- ⚠️ **Content finding:** Calm is over-supplied in the starter set (5 of 8 ingredients have some), so Calm riddles stay generous (7–9 solutions). Rebalance in the full check 4.

### Blind tests (fresh general-purpose agents, player-visible information only)
| | Tier 1 at 2★+ | Tier 2 at 2★+ | Tier 3 | Avg ★ |
|---|---|---|---|---|
| Round 1 | 5/5 | 2/4 | 1★ | 2.0 |
| Round 2 (after fixes) | 5/5 (all 3★) | 4/4 | 2★ | 2.7 |

**Round-1 failures were missing information, not hard puzzles:**
- Nothing tied "stiff back" to Vigor. The player guessed Calm and scored 0★.
- The player added same-kind troubles together (4+3) instead of taking the stronger.
- "to the bone" read as an intensity word.

**Fixes:**
- A "The four traits" page in the Notebook, saying what each trait treats.
- Wren rules: same-kind troubles don't add up; sturdy leaves ignore heat; mint can't go below zero.
- Riddle #6 reworded.
- A first-visit hint to open the Notebook.

**Satisfying moments reported:**
- Round 1: boiled mint strips exactly its extra Calm and Clarity (#3).
- Round 2: Simmer/Boil used as a fine-tuning dial (two chamomiles boiled land exactly on 4).

The heat rule creates the intended depth.

**Remaining risk:** with the Notebook's help it may now be *too* legible (8/10 at 3★). The real test is a human with no arithmetic shortcut.

- **Blind-test status:** ✅ PASS (targets: tier 1 ≥70%, tier 2 ≥50%)
- **Human playtest:** ⏳ waiting for the user's results and 4 answers

## Prototype C: foraging grey-box (2026-10-07)
- **File:** `prototypes/forage.html`
- **Live (private):** https://claude.ai/artifact/EazbRDLu3WERyJwpLQ29XV
- **Shared rules:** a basket of 6 picks, no timer, herb clusters.
- **The three areas:**
  - **Meadow** (5×5): shimmering rare bushes.
  - **Whisperwood** (6×6): a hidden rare plant moves to a neighbouring tile after each pick, and both tiles shake.
  - **Under the Hill** (6×6): dark, with a lantern radius around your last pick; salt and quartz grow in veins.
- **Suggested order of the 5 runs:** meadow, meadow, forest, cave, then your choice. A rating follows every run, and a copyable report with 4 open questions comes at the end. Progress is saved on the device.
- **Checked at 360px:**
  - No horizontal overflow and no console errors.
  - Tiles are 58px in the meadow and 48px in the forest and cave.
  - The forest rustle animates 2 tiles after a pick.
  - The cave starts with 6 lit tiles.
  - Area tabs are locked mid-run.
- **Status:** ❌ **FAIL (user playtest, 2026-10-07).**
  - Median run time **6 s** (4–20 s); the target was 60–90 s.
  - Ratings 2–4.
  - Twists not understood. In your words: the meadow was "just a filler, I need more signals"; the forest was "sometimes I have something below, sometimes not"; in the cave you were "just moving towards the next loot". Overall: "not incredibly fun".
- **Diagnosis:**
  - No goal: nothing tells you what you need.
  - No readable information before a pick, so taps are random.
  - The twists add noise, not decisions.
- **Decision (yours):** redesign as **herb identification**. You forage against a shopping list, plants show identifying clues, and harmless look-alikes waste a pick. Spec in `design/forage-v2.md`; prototype C2 follows.

## Prototype C2: herb walk (2026-10-07)
- **File:** `prototypes/forage-v2.html`
- **Live (private):** https://claude.ai/artifact/Ss3SERT5AiymbqKCu636CV
- **Spec:** `design/forage-v2.md`
- **Three walks with Wren's list.** You inspect a plant (Flower, Leaf and stem, Scent), then pick it or leave it.
- **Harmless look-alikes,** added one per walk: chamomile/mayweed, nettle/dead-nettle, mint/ground-ivy.
- **Wrong picks** bring Wren's correction and a new field-guide entry. Rare finds: lavender and rosehip.
- **Checked at 360px:** no overflow or console errors; 99px tiles; inspect → pick look-alike → correction → guide entry works.
- **Status:** ❌ **FAIL (user playtest, 2026-10-07).**
  - Walk 1: 23 s, list 2/3, 3 wrong picks, rated 4.
  - Walks 2 and 3: 1 s each, nothing inspected (skipped).
  - In your words: "The 'wrong' pick was not clear why it was wrong"; "I didn't understand it, I must retry"; it would work "only if it's one of many minigames".
- **Diagnosis:**
  - The difference lived only in text, and the thumbnails were near-identical. The clue never became visible.
  - A frustrating first walk made you skip the rest.
  - A single repeated mini-game isn't wanted; variety is.
- **Decision (yours, 2026-10-07):** **trail choice + event cards** for v1. Spec in `design/expedition.md`. Identification survives as an occasional "Spot the herb" event card, with the two plants side by side and the difference circled. A pool of rotating micro-games goes on the v2 list.
- **Gate impact:** prototype C is **closed by a design decision**, not passed. There is no dexterity or skill risk left in v1's morning. It's measured in the M1 slice instead (morning 15–40 s; trails chosen by need).

## Prototype C3: choose your haul (2026-10-07)
**Origin:** your idea; features brainstormed by a game designer (14 candidates) and reviewed by an editor. Your decisions:
- Tomorrow appears as a **clue**, with no green ticks.
- **Leftovers stay behind.**
- The haul happens on **every expedition**, at most 1 expedition per day.

Spec: `design/expedition.md`.

**Dominance check:** `python tools/haul_sim.py` (5 days × 300 runs, 5 strategies).
- **First run: FAIL.** "Always take the most valuable" came within 6% of the planner and won 70% of runs, because rares were also the most valuable. Value and rarity pointed the same way.
- **Fix (V3):**
  - Rares pay little in coins and count for Midsummer instead (lavender and glowcap value 1).
  - Rosehip and valerian pay well (value 3).
  - Rare weight 6.
- **Result: ✅ all 3 checks pass.**
  - The planner beats need-only by 17%, value-only by 26%, rarity-only by 15%.
  - Each single-factor strategy is the best of the three in some runs (need 33%, value 18%, rarity 52%).
  - The strategies disagree on 99% of hauls.

**Prototype:** `prototypes/haul.html`, live (private) at https://claude.ai/artifact/58kLwbSX9EwWUw8aqUXoHi
- 5 scripted mornings, with a Spot the herb card after day 2: side by side, centres circled.
- **Cross-check:** the planner's picks played in the browser give exactly the sim's results (coins 65/66/49/67/48; served ✓✓✓/✓✓✓/✓✓✗/✓✓✓/✓✗✓).
- **At 360px:** no overflow and no console errors (one badge overlap was found and fixed).

**Your playtest (2026-10-07):**

| Day | Haul time | Rating |
|---|---|---|
| 1 | 204 s | 4/5 |
| 2 | 90 s | 4/5 |
| 3 | 40 s | 4/5 |
| 4 | 28 s | 4/5 |
| 5 | 10 s | 4/5 |

- Spot the herb answered correctly: "clear this time". ✅
- You wanted a 6th slot on only 1 of 5 mornings, and were tapping "almost by habit" by days 4–5. ❌ Tension is low.
- Value was readable only from the description (the coin dots didn't read). ❌
- You missed Pell twice: "something strong" (2 units) wasn't obvious enough.
- **Verdict: PASS WITH FIXES.** It's the best-rated morning design so far, steady at 4/5 every day.

**Fixes (2026-10-07):**
1. **Weather is a whole-day modifier** (your request). Each weather affects the finds (count and mix), **quality** (prime kinds give a **double dose** and +1 value; poor kinds −1 value and keep a night less), **rarity** odds, shelf life, and **which customers come** (frost → warming, mist → clarity, rain → calm). Five weathers: sun, rain, wind, mist, frost.
2. **Value badge** is a numbered coin ("◉ 2"), gold with ▲ when prime and grey with ▼ when poor.
3. **"Strong" hint:** Wren notes that "strong" means a double helping.

**Sim re-check:** a new check 4, "weather changes the best haul".
- Value-only weather effects moved it on only 35–43% of days.
- Prime-as-double-dose raised it to 53–73%.
- **Bug found by the browser cross-check:** the sim removed *identical* twin items together. Fixed; after that, "need-only" came within 8% of the planner. Rare weight 6 → 8 fixes it.
- **Final: all 4 checks pass.** The planner beats need by 10%, value by 20%, rarity by 11%; each strategy wins in some runs; the strategies disagree on 99% of hauls; the weather changes the best haul on 53% of days.
- **Honest reading:** following tomorrow's clue is a decent beginner strategy, and thinking about rarity and freshness earns about 10–20% more.
- **Browser cross-check:** exact match on all 5 days (66/68/47/70/51).

**Remaining risk:** habit by day 4–5 in a 5-in-a-row test. To be re-measured in M1, where each haul sits inside a full day.

## Check 4: full request space (2026-10-07)
**Tool:** `python tools/request_space.py [--variant X]`. It generates every request per tier from the keywords × intensity words, and counts 3★ answers for the whole pool and for **realistic baskets** (7–9 kinds × 2 units each).

**Before:**
- Tier 1: **7/21 requests had no 3★ answer**, because every starter ingredient carried a side trait. Chamomile appeared in 62% of answers, fireroot in only 3%.
- Tier 3: median of **260** answers per request.
- Brimstone was never useful in potions.

**Decision: variant D**, the "starter ingredients are simple and honest" principle:
- Sage becomes `[0,0,0,3]`.
- Fireroot becomes `[3,0,0,0]`.
- Rosehip becomes `[0,0,2,0]`.
- Tier 3 tolerance becomes **0**.
- **Brimstone** is not allowed in potions.
- **Quartz** is rare.

**After:**
- **Tier 1:** 0 unsolvable, median 5 answers, no dominant or dead ingredient. This also fixes the Calm surplus.
- **Tier 2, with a basket:** 35% of days in the 2–6 target range; 36% of days have no 3★ answer, but 83% of days can reach 2★.
  - Mitigation: **the featured request is teased the night before**, so the player can gather for it.
- **Tier 3, with a basket:** about 37–45% of days still have 7+ answers. That's acceptable for late-game mastery; re-check in M3 with real content.
- **The 10 tuned riddles:** all still solvable (1–9 three-star answers).
- **Midsummer Draught:** 11 three-star answers (9 without brimstone).

⚠️ **Prototype B was not updated.** It keeps the old values so your playtest results stay comparable. **M1 must re-check the riddles against variant D.**

## Check 6: 20-day economy (2026-10-07)
**Tool:** `python tools/economy_sim.py`. See economy.md for the results table.

**First run, all failing:**
- Income was half the plan.
- Salve customers were *lost* before the salve pot was bought, which breaks pillar 4.
- Bots never saved up, so the 5th slot was never bought.
- Days 6, 8, 11 and 14 were dead.

**Fixes:**
- Prices raised to 15/10/24.
- Requests only appear for goods your stations can make.
- Bots save up for story-critical items.
- Story beats added on the gap days.
- Decor shop opens on day 8.

**Result:** ✅ **all 4 checks pass** for every bot.

**Garden vs expedition** *(superseded 2026-10-08: action points were removed; the morning is now 1 of 3 random cards. Kept for the yield numbers.)*:
- An expedition gives about 4.8 random units per action point, with rare finds.
- The garden gives `plots × 1` chosen units per action point.
- The crossover is at about 5 plots, so expeditions win early and the garden wins late. That's a real trade-off. ✅ (Input for the check 5 decision audit.)

## Checks 5, 7, 8, the checklist and the editor re-audit
See `design/quality-review.md` (2026-10-07/08). Editor re-audit: **7.0/10** (gate 7.5) → conditional go, see roadmap.md.
