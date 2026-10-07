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

## Checks 1–2 and 5–8 and the design-quality checklist
Not started.
