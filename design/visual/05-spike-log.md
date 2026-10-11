# Validation spike: Hearthlight v2 (2026-10-11)

**Page:** https://claude.ai/artifact/Uqb3t6TFBKLbcujGcGhsD1 (`prototypes/hearthlight-spike.html` , built by `node tools/build-spike.mjs`) · shots `shots/05-spike-{night,day}.png`
**Purpose:** prove the locked direction (`04d-direction.md`) on real, new assets before building the design system.

## Production log
Times are wall-clock **authoring** minutes per asset (Claude generating the SVG code), measured between consecutive tool completions.

| Asset | Min | Notes |
|---|---|---|
| ingredient:sage | 1.5 | includes one fix (mini must be simpler than icon) |
| ingredient:mint | 0.3 | |
| ingredient:nettle | 0.4 | |
| ingredient:honey | 0.4 | glass, honey and cloth lid; label detail at hero only |
| ingredient:lavender | 0.4 | the mini spike is one lens instead of florets |
| portrait:pell (2 moods) | 1.4 | includes extracting the shared `eyePair()` |
| weather:sun + weather:mist (+ mini glyphs) | 1.1 | includes one fix |
| notebook:page ("develop") | 0.5 | the sketch is generated from the hero drawing by CSS, so there's no second drawing |
| **Review round 1** (sage, mint and nettle redraw) | 3.5 | the shelf test caught three look-alike fern silhouettes. Fix: leaf **shapes** (oval, oval toothed, heart toothed) and real habits |

**Reading:**
- **Drawing is not the bottleneck.** Each asset costs minutes against the 30-minute target.
- **The real cost is review rounds:** screenshot, critique, redraw. Budget about one round per 3–4 assets, plus your review.

## Gate checks
| Check | Result |
|---|---|
| AA contrast, both themes | ✅ pass (`node tools/contrast-check.mjs hearthlight`); paper marks 4.9–5.7:1 |
| Tests | ✅ 24 pass. New: the LOD test (mini has no filters or hairlines; detail grows mini < icon < hero) |
| 340px | ✅ no overflow, no console errors, theme toggle works |
| Notebook develop | ✅ the end state is correct (plate opacity 1, sketch 0); instant under reduced motion. ⚠ The transition can't be watched in the hidden built-in pane, so **check it on your phone** |
| Distinct at chip size (8 ingredients) | ✅ after review round 1. ⚠ Open: nettle's drooping pyramid could read as a small fir tree. Your eye decides |
| Phone performance | ⏳ hero and scene use blur, grain and wood-grain filters; mini uses none. Check scroll smoothness on the S23 |
| Your rating ≥ 4/5 | ⏳ |

## Your verdict
*(to be filled in from your copied report)*
