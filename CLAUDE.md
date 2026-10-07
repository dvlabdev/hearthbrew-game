# Hearthbrew — project conventions

A cozy, witchy apothecary crafting game for the browser. You inherit Old Mother Wren's shop in Thornwick, at the edge of the Whisperwood, with 20 days until Midsummer Eve.
- Design: `design/GDD.md`
- Brewing and scoring rules: `design/brew-math.md`
- Art direction (palette, type, illustration rules): `design/art-direction.md`
The source of truth for scope and milestones is `design/roadmap.md`. Read it before starting any milestone.

## Current phase
M0c gate: **conditional go** (see `design/roadmap.md`). Waiting on the user's prototype B playtest. Then M1 (vertical slice). Throwaway prototypes go in `prototypes/`; content data lives in `design/data/content.json`.

## Design rules
- Every feature must serve at least one pillar:
  1. Read the customer: riddle requests, with no trait numbers shown.
  2. Discovery is progression: the Apothecary's Notebook.
  3. Always one more day.
  4. Cozy, with gentle stakes: missed opportunities, never lost progress.
- **Scope guard:** anything on the "v2 maybe" list in the roadmap stays out of v1. Propose additions, don't implement them.
- In-game remedies are fictional. Never include real harmful recipes; toxic plants are abstract only.
- Tag every reaction rule as 🧪 real, 🧪✨ exaggerated or ✨ magic.

## Tech (from M1)
- TypeScript + Vite, DOM/CSS panels plus inline SVG art, Vitest, WebAudio sound effects.
- `src/core` is pure, serializable state and pure functions, with no DOM. `src/ui` only reads state and dispatches actions.
- Content lives in typed data files in `src/content`. Adding content should never require changing systems.
- Saves are versioned, and every schema change ships with a migration test.

## Accessibility (mandatory from M1)
- Every trait is shown as color + shape + icon, using a colorblind-safe palette.
- Pointer events only (touch and mouse). The layout must work at **360px** width (the user tests on a Samsung S23 inside the Claude app, so check 340px too).
- Minimum font size 16px. Honor reduced motion.

## Workflow
For each feature:
1. Write a spec in `design/`.
2. Implement it.
3. Run `npm run test`.
4. Play it in the built-in browser.
5. Write playtest notes and metrics.
6. Adjust.
