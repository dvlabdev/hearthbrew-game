# Hearthbrew — project conventions

A cozy, witchy apothecary crafting game for the browser. You inherit Old Mother Wren's shop in Thornwick, at the edge of the Whisperwood, with 20 days until Midsummer Eve.
- Design: `design/GDD.md`
- Brewing and scoring rules: `design/brew-math.md`
- Art direction (palette, type, illustration rules): `design/art-direction.md`
The source of truth for scope and milestones is `design/roadmap.md`. Read it before starting any milestone.

## Current phase
M1 setup (branch `m1-setup`): core, tests, sims, art library and shell are done. **Next:** the art direction exploration (roadmap). Brewing, riddle and Notebook screens wait for the user's prototype B verdict. Throwaway prototypes go in `prototypes/`; content data lives in `design/data/content.json`.

## Design rules
- Every feature must serve at least one pillar:
  1. Read the customer: riddle requests, with no trait numbers shown.
  2. Discovery is progression: the Apothecary's Notebook.
  3. Always one more day.
  4. Cozy, with gentle stakes: missed opportunities, never lost progress.
- **Scope guard:** anything on the "v2 maybe" list in the roadmap stays out of v1. Propose additions, don't implement them.
- In-game remedies are fictional. Never include real harmful recipes; toxic plants are abstract only.
- Tag every reaction rule as 🧪 real, 🧪✨ exaggerated or ✨ magic.

## Tech (no-build, decided 2026-10-09)
npm cannot install packages on Google Drive's streaming disk (EBADF), so the project has **no dependencies and no build step**.
- **Code:** plain ES modules (`.js`) with **JSDoc types** and `// @ts-check` style. The browser loads `index.html` directly; JSON is imported with `with { type: 'json' }`.
- **Commands:**
  - `npm run dev` starts `tools/serve.mjs` on :5173 (`?debug`, `?gallery`).
  - `npm test` runs Node's built-in test runner.
  - `npm run sim:haul` and `npm run sim:economy` run the full simulations.
  - `npm run typecheck` runs TypeScript over `src/` (this needs a download; CI runs it).
- **Layout:**
  - `src/core` holds pure rules, with no DOM.
  - `src/content/data/content.json` is the single content source.
  - `src/art` is the art registry plus style packs (`styles/<id>/index.js` + `style.css`). **Screens use only `art(id)`.**
  - `src/sim` holds the simulations; `src/ui` the screens and CSS.
- **Reference:**
  - The Python tools in `tools/` are the validated reference.
  - After any rule or content change, run `python tools/export_fixtures.py` and then `npm test` (parity tests).
- **Saves** are versioned, and every schema change ships with a migration and a test (`src/core/save.js`).

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
