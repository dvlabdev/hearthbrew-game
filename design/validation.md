# Validation log (M0c gate)

Each check records: pass, fail or adjust, the evidence, and the date. The criteria are in roadmap.md §7b.

## Check 4: solution-space analysis (started early, 2026-10-07)
**Tool:** `tools/solution_space.py` (brute force over every ingredient combination × Simmer/Boil, applying rules R1–R5, R7 and R8). Run `python tools/tune_midsummer.py` for the finale tuning.

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

⚠️ **Prototype B was not updated.** It keeps the old values so your playtest results stay comparable.

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

**Garden vs expedition:**
- An expedition gives about 4.8 random units per action point, with rare finds.
- The garden gives `plots × 1` chosen units per action point.
- The crossover is at about 5 plots, so expeditions win early and the garden wins late. That's a real trade-off. ✅ (Input for the check 5 decision audit.)

## Checks 2 and 5–8 and the design-quality checklist
Not started.
