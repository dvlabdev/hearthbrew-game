# Hearthbrew: Roadmap (v3, 2026-10-08)

Replaces the v2 plan (in git history). **Sources of truth:**
- Design: `GDD.md`
- Rules: `brew-math.md`
- Content: `content-bible.md`
- Morning and expedition: `expedition.md`
- Economy: `economy.md`
- Look: `art-direction.md`
- Evidence: `validation.md`, `quality-review.md`

## Pillars
1. **Read the customer:** riddle requests, no numbers.
2. **Discovery is progression:** Wren's Notebook.
3. **Always one more day:** tomorrow's teased customer, multi-day growth.
4. **Cozy, gentle stakes:** missed opportunities, never lost progress.

## The day (current design)
1. **Morning:** choose **1 of 3 random cards** (expedition → choose your haul → event card; garden; market; village errand; Wren's study).
2. **Prepare & Sell:** riddles, brewing (Simmer/Boil), serving.
3. **Improve:** upgrades, donations, decor.
4. **Rest:** a 10 s recap and tomorrow's clue.

## Milestones
| # | Milestone | Status |
|---|---|---|
| M0a | Rules (GDD, brew-math) | ✅ done |
| M0b | Content (research, content bible, economy) | ✅ done |
| M0c | Validation gate | ⏳ **conditional go**, see below |
| M1 | Vertical slice: days 1–3 playable | waiting for the gate |
| M2 | Core systems: stars, relationships, freshness, upgrades, saves + migrations | — |
| M3 | Content: forest and cave, teas and salves, 4 regulars × 3 beats, 20-day story, endless-mode spec | — |
| M4 | Juice & polish: art pass, animation, sound effects, onboarding, accessibility audit | — |
| M5 | Ship: GitHub Pages, final balance from metrics | — |

## M0c gate status
| Gate item | Status | Evidence |
|---|---|---|
| A, art style | ✅ PASS | Whisperwood Dusk, Candlelit primary (`art-direction.md`) |
| B, brewing + riddles | ✅ blind tests · ⏳ **your playtest required** | validation.md |
| C, morning | ⚠️ **WAIVED** (formal): grid (C) and herb walk (C2) failed; the haul (C3) passed with fixes. The full morning (cards + haul + events in a real day) is **measured in M1**. | validation.md, expedition.md |
| Check 4, request space | ✅ (variant D, tol 1/1/0) | tools/request_space.py |
| Check 5, decision audit | ✅ (revised after the action points were removed) | quality-review.md |
| Check 6, economy | ✅ all 4 checks, 3 bots | tools/economy_sim.py |
| Check 7, time budget | ✅ estimated (sell-phase time not yet measured) | quality-review.md |
| Check 8, tap-flow | ✅ | quality-review.md |
| Quality checklist | 3.9 / 5 (target 4.0) | quality-review.md |
| Editor re-audit | **7.0 / 10** (target 7.5; was 6.0) | below |

**Editor's verdict:** a conditional go, expected to re-score at about 7.5, once all of these are done:
1. ⏳ **Your prototype B playtest passes:**
   - tier 1 at 2★ or better ≥ 70%, tier 2 ≥ 50%;
   - median time per customer ≤ 90 s;
   - last-customer rating ≥ 3.5;
   - at least one unprompted "aha";
   - it doesn't feel like guessing what the designer wanted.

   **If it fails: hard no-go.** Rework the riddles and the Notebook first.
2. ✅ **Action points resolved:** removed. The morning is 1 of 3 random cards (your decision, 2026-10-08).
3. ✅ **Docs reconciled** (2026-10-08): GDD, brew-math, content-bible, expedition, economy, quality-review, validation, and this roadmap.
4. ✅ **Formal waiver for C** recorded above.

## M1 scope: vertical slice (days 1–3), with the editor's de-risking built in
- **Tech setup:** TypeScript + Vite + Vitest, following CLAUDE.md conventions. 360px first, accessibility from day one.
- **`src/core` written once, from `content.json` v2:** brew math, scoring, the riddle **generator** (not hand-tuned riddles, with "no repeated phrasing within 3 days"), the haul, weather, freshness.
- **Port the three Python checks to Vitest** against the real core: request space, economy, haul.
- Add a **headless 20-day bot** that runs haul → real brew → sell. Re-check the tier-2 days that have no 3★ answer, and make sure **the teased featured request is always reachable at 3★**.
- **Playable days 1–3:** the scripted tutorial (quality-review storyboard), morning cards, the haul, brewing, serving, Improve, Rest.
- **Debug panel:**
  - Metrics: time to first sale, time per customer, first-try 2★+ %, haul time, daily rating.
  - **Jump to day N with a seeded state**, to test hauls on days 5 and 10.
- **Content-cost probe:** time one full day of content (riddles, one event card, one story beat, two icons) and extrapolate to 20 days. If it comes to more than about 1.5× the budget, **cut a regular or the cave now.**
- **Kill criterion:** if day 1 rates below 3.5 in your playtest, stop and redesign before M2.

## Scope guard ("v2 maybe")
- **Goods and stations:** candles and incense, distiller and tinctures, moon altar, Arcane, charms, grinding (mortar).
- **Places and calendar:** marsh and cliffs, beehive, greenhouse, seasons and moon phases.
- **Haul extras:** bloom calendar, At its peak, pinned special orders, Mark the patch, Wren's sets, basket and tool upgrades.
- **Morning:** rotating micro-games.
- **People:** more regulars.

## Audit record
| Date | Reviewer | Score | Notes |
|---|---|---|---|
| 2026-10-06 | Editor agent | 6.0 | Contradictory rules, overscoped, no tension or end goal |
| 2026-10-08 | Editor agent | 7.0 | Rules disciplined, failures killed on evidence. Open: human core-loop test, the dead action point (now fixed), doc drift (now fixed), late-game tension, content cost |
