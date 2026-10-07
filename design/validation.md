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

## Checks 2 and 5–8 and the design-quality checklist
Not started.
