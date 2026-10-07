> **Superseded (2026-10-07)** by `design/expedition.md` after a failed playtest. Kept for its lessons.

# Expedition v2: herb identification (prototype C2)

**Why:** prototype C failed (6-second runs, random taps). Foraging needs a goal and readable information.

**The fantasy:** you're a hedge-witch who *knows plants*. Real foraging is about telling a useful herb from its look-alike.

## Loop (one run ≈ 45–90 s)
1. **Shopping list:** 3–4 entries, for example "Chamomile ×2, Nettle ×2, Mint ×1". In the game it comes from tomorrow's teased featured request plus what the shop is low on.
2. **A patch of 12 plants,** drawn with distinguishing features: flower shape and colour, leaf edge, stem.
3. **Tap a plant to inspect it:** a close-up card with three clues (Flower, Leaf and stem, Scent). Then **Pick** or **Leave**. Inspecting is free; **the basket holds 6 picks**.
4. **Look-alikes** (harmless, never toxic: see the CLAUDE.md guardrails):
   - **Chamomile vs mayweed.** Chamomile has a domed, hollow centre and smells of apples. Mayweed has a flat centre and a sour smell.
   - **Nettle vs white dead-nettle.** Nettle has stinging hairs and drooping green catkins. Dead-nettle has white hooded flowers and doesn't sting.
   - **Mint vs ground-ivy.** Mint has a square stem and smells of mint. Ground-ivy has round, scalloped leaves and smells musty.
5. **A wrong pick** wastes a basket slot. Wren's note then explains the difference, and the look-alike joins the **field guide** (discovery, pillar 2).
6. **A rare find:** one plant per patch with a subtle tell (lavender among the mint, a late rosehip).
7. **End of run:** list completion ✓/✗, wrong picks, rare find, time, a rating.

## Difficulty across 3 runs
| Run | Look-alike pairs present | Field guide at the start |
|---|---|---|
| 1 | Chamomile/mayweed | Chamomile, nettle, mint, sage |
| 2 | + nettle/dead-nettle | + whatever you learned in run 1 |
| 3 | + mint/ground-ivy | + whatever you learned |

## Pass criteria
- Median run time of 45–90 s.
- Run 3 rated 4 or higher.
- In your own words, you used the clues to decide.
- At most 1 look-alike felt unfair.

## Scope note
The forest and cave twists are dropped from this test, to validate the core first. If identification works, areas differ by **which** plants and look-alikes grow there.
