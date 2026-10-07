# M0c follow-up plan (written 2026-10-07)

**Where we are**
- ✅ Prototype A, art: passed. Palette locked.
- ✅ Prototype B, brewing and riddles: blind test passed.
- ⏳ Your playtest of B is pending. You can play it in several sittings; progress is saved on your phone.

**What's left:** sessions 3 and 4 below. Neither waits for your playtest. Your results only feed the final gate decision.

```
Session 3 (build + measure) ──► Session 4 (review + decide) ──► GATE ──► M1 plan
   ▲ your playtest of B ──────────────┘   ▲ your playtest of C ──┘
```

---

## Session 3: build and measure ✅ done 2026-10-07 (results in validation.md)

### 3a. Prototype C, the foraging mini-game → `prototypes/forage.html`
- **The goal:** find out whether picking in a grid is still fun on the 5th run, and whether each area's twist reads clearly without explanation.
- **Shared rules** (content-bible §5):
  - Tiles are hidden bushes.
  - The **basket holds 6 picks** (8 with the upgrade). There's no timer.
  - **Herb clusters:** the neighbours of a find usually hold the same herb, so a good first pick pays off.
  - **Glints:** 1–2 rare nodes shimmer faintly, which is a reason to look before tapping.
  - The end screen shows your haul, the time taken and rare finds.
- **The three areas** (switchable):

| Area | Grid | Twist | What the player should notice without being told |
|---|---|---|---|
| Meadow | 5×5 | None (clusters only) | "Picking next to a find is smart" |
| Whisperwood | 6×6 | After each pick, one hidden rare node **rustles and moves** to a neighbouring tile, and both tiles visibly shake | "The rustle is the rare thing moving" |
| Under the Hill | 6×6 | **Dark:** only the lantern radius around your last pick is visible, and crystals form **veins** of adjacent tiles | "Follow the vein" |

- **Measurement:**
  - After each run, a 1-tap rating: "Would you play this again tomorrow?" (1–5).
  - After 5 runs, a copyable report with run times, haul, rare finds and ratings.
- **Pass:** the median run takes 60–90 s, the 5th run is still rated 3 or more, and every twist is understood (you describe it in your own words).
- **Fallback:** if a twist fails, simplify it or drop it. The meadow version alone is enough for v1.

### 3b. Economy simulation → `tools/economy_sim.py`
- **Inputs:** prices, customers per day, upgrades with costs and unlock days, donations (from `economy.md` and `content.json`).
- **Three bots:** weak (1.5★ average), average (2.0★) and strong (2.6★). Each plays 20 days, buys story-critical items first, then the rest by priority, and serves the featured request.
- **Output:**
  - A day-by-day table of coins and purchases.
  - **Dead days** flagged: nothing new and nothing affordable.
  - The **4 checks from economy.md §5**:
    1. No dead day.
    2. The 5th cauldron slot is bought by day 12.
    3. No runaway hoarding before day 15.
    4. The weak bot still reaches the festival.
- **Extra:** a garden vs expedition comparison of ingredient value per action point, as input for the decision audit.
- **Fix loop:** if a check fails, tune `economy.md` and re-run, then log the before/after in `validation.md`.

### 3c. Full solution-space check → extend `tools/solution_space.py`
- **Generate every possible request:** combine the keyword glossary with the intensity words for each tier.
- **Ingredient pool per tier:** tier 1 uses the starter 8, tier 2 adds the forest, tier 3 adds the cave. Run with 3, 4 and 5 slots.
- **Report:**
  - The spread of 3★ answer counts (target 2–6).
  - **Dominant** ingredients: in more than 60% of answers.
  - **Dead** ingredients: in fewer than 5% of answers.
- **Known issue to fix:** too much Calm in the starter set (5 of 8 ingredients have some).
  - **Candidate fix A:** mint loses its Calm `[-2,0,0,2]`.
  - **Candidate fix B:** sage loses its Calm `[0,0,0,3]`.
  - **Candidate fix C:** both A and B.
  - Test each candidate and pick the one that fixes the Calm surplus without breaking the 10 tuned riddles.
- **Output:** final ingredient values written into `content.json` and `content-bible.md`, with the reasons logged.

**End of session:** publish prototype C for your phone, commit, push.

---

> **Update (2026-10-07):** prototypes C and C2 both failed playtests. The morning is now **trail choice + event cards** (`design/expedition.md`), validated in the M1 slice instead of another prototype.

## Session 4: review and decide

| # | Deliverable | Content |
|---|---|---|
| 5 | Decision audit (`validation.md`) | For each phase: its decisions, the trade-off, and whether any option is always best. Uses the 3b garden vs expedition numbers. |
| 7 | Time budget | Seconds per phase, **measured** from your B and C reports where available, otherwise estimated. Does a day fit 5–15 min, including day 1? |
| 8 | Click-flow | A Mermaid diagram of one full day, with tap counts per phase. |
| C | `design/quality-review.md` | The 10-item checklist scored 1–5 with evidence, plus: a **novelty chart** for days 1–20, a **storyboard of the first 10 minutes**, and a **pillar matrix** (features without a pillar are cut). |
| D | Editor re-audit | The veteran-editor agent scores the 4 axes again. Last time: 6.0. **The gate needs at least 7.5.** |

**Gate decision**
- **Go:** all prototypes passed (including your playtests), checks 4–8 passed or adjusted, the checklist averages at least 4, and the re-audit scores at least 7.5. Then:
  - Update `CLAUDE.md` to M1.
  - Write the **M1 vertical slice plan:** TypeScript + Vite project setup, `src/core` built from the prototypes' tested rules, days 1–3 playable.
- **No-go:** list the fixes, re-run only the checks that failed.

---

## What I need from you, whenever you have time
1. **Prototype B (brew toy):** finish the 10 customers, then copy the report and the 4 answers. It's fine to stop and resume.
2. **Prototype C (forage):** available after session 3. Play 5 runs (about 7 minutes in total), then copy the report.

Neither blocks the next sessions; both are needed for the final gate.
