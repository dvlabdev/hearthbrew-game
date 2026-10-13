// Hearthlight Notebook page: the ingredient as a pencil sketch that "develops" into the full plate.
import { svg, ST, paper } from './kit.js';
import { ASSETS as INGREDIENTS } from './ingredients.js';

/**
 * Notebook page (hero, paper). Holds the ingredient twice: a pencil sketch (the same drawing, restyled by CSS) and
 * the full plate. Adding the class `developed` to any ancestor develops it (CSS: the .nb-sketch component in src/ui/components.css; instant under reduced motion).
 */
function notebookPage(/** @type {{ ingredient?: string }} */ o = {}) {
  const ing = o.ingredient || 'chamomile';
  const hero = INGREDIENTS[`ingredient:${ing}`]({ lod: 'hero', at: { x: 10, y: 10, w: 100, h: 100 } });
  return svg('0 0 120 150', `${paper(120, 150)}
    <g class="nb-sketch">${hero}</g><g class="nb-full">${hero}</g>
    <path d="M14 120 H106 M14 130 H106 M14 140 H80" ${ST('--paper-line', 0.5)} opacity=".6"/>`, `Notebook page: ${ing}`);
}

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'notebook:page': notebookPage,
};
