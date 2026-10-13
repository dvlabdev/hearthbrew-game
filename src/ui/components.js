// Shared component renderers (markup for src/ui/components.css). Used by the screens and the ?components gallery.
import { art } from '../art/registry.js';
import { TRAITS, herbName } from '../content/index.js';
import { t } from '../content/strings.js';

/** Demo meter rows for the ?components gallery. */
const DEMO = TRAITS.map((tr, i) => /** @type {const} */ ([tr.id, tr.name, [0, 6, 1, 0][i] ?? 0]));

/** A find tile, as on the haul screen. */
export function findTile(/** @type {{ herb: string, label: string, count: number, value: number, prime?: boolean, poor?: boolean, rare?: boolean, heavy?: boolean, pressed?: boolean, disabled?: boolean }} */ f) {
  return `<button type="button" class="find${f.rare ? ' rare' : ''}${f.heavy ? ' heavy' : ''}" aria-pressed="${!!f.pressed}"${f.disabled ? ' disabled' : ''}
    aria-label="${t('find.label', { herb: f.label, count: f.count, value: f.value })}${f.prime ? t('find.prime') : f.poor ? t('find.poor') : ''}${f.rare ? t('find.rare') : ''}${f.heavy ? t('find.heavy') : ''}">
    ${art(`ingredient:${f.herb}`, { lod: 'mini' })}<span><span class="name">${f.label} ×${f.count}</span>
    <span class="sub"><span class="coin-badge${f.prime ? ' prime' : f.poor ? ' poor' : ''}">${art('ui:coin')}${f.value}</span>${f.heavy ? `<span class="slots">${t('find.slots')}</span>` : ''}</span></span></button>`;
}

/** A shelf chip with wilt pips (one pip per item; red = wilts tonight). */
export function shelfChip(/** @type {{ herb: string, count: number, next?: number, nights: number[] }} */ c) {
  return `<span class="chip" aria-label="${t('shelf.chip', { herb: herbName(c.herb), count: c.count })}${c.next != null && c.next !== c.count ? t('shelf.chipNext', { next: c.next }) : ''}${t('shelf.chipWilt', { n: c.nights.filter(n => n <= 1).length })}">
    ${art(`ingredient:${c.herb}`, { lod: 'mini' })}${c.count}${c.next != null && c.next !== c.count ? `<span class="delta">→${c.next}</span>` : ''}
    <span class="pips">${c.nights.map(n => `<i class="pip${n <= 1 ? ' wilt' : ''}"></i>`).join('')}</span></span>`;
}

/** The trait meter. */
export const meter = (/** @type {readonly (readonly [string, string, number])[]} */ rows = DEMO) => `<div class="meter">${rows.map(([k, n, v]) => `<div class="row" style="--c:var(--${k})">${art(`trait:${k}`)}<span>${n}</span>
  <span class="bar">${Array.from({ length: 10 }, (_, i) => `<i class="${i < v ? 'on' : ''}"></i>`).join('')}</span><span class="v">${v}</span></div>`).join('')}</div>`;

