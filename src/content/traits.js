// Trait helpers shared by content and core (no imports, so content never depends on core).

/** Index of the strongest trait (first one on ties). @param {readonly number[]} v */
export function mainTrait(v) {
  let m = 0;
  for (let i = 1; i < v.length; i++) if (v[i] > v[m]) m = i;
  return m;
}
