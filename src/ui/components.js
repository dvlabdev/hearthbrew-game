// Shared component renderers (markup for src/ui/components.css). Used by the screens and the ?components gallery.
// All return Raw (html`…`): content values are escaped; attributes use t() (plain text, escaped), content uses tx().
import { TRAITS, herbName } from '../content/index.js';
import { t } from '../content/strings.js';
import { html, pic } from './dom.js';

/** Demo meter rows for the ?components gallery. */
const DEMO = TRAITS.map((tr, i) => /** @type {const} */ ([tr.id, tr.name, [0, 6, 1, 0][i] ?? 0]));

/**
 * A find tile, as on the haul screen: the picture opens the details (data-action="details"),
 * the rest of the tile picks the herb (data-action="pick"; a long-press also opens the details).
 */
export function findTile(/** @type {{ herb: string, label: string, count: number, value: number, prime?: boolean, poor?: boolean, rare?: boolean, heavy?: boolean, pressed?: boolean, disabled?: boolean }} */ f) {
  const label = t('find.label', { herb: f.label, count: f.count, value: f.value })
    + (f.prime ? t('find.prime') : f.poor ? t('find.poor') : '') + (f.rare ? t('find.rare') : '') + (f.heavy ? t('find.heavy') : '');
  const cls = ['find', f.rare && 'rare', f.heavy && 'heavy', f.pressed && 'is-picked', f.disabled && 'is-full'].filter(Boolean).join(' ');
  return html`<div class="${cls}" data-key="find-${f.herb}">
    <button type="button" class="find-info" data-action="details" data-herb="${f.herb}" aria-label="${t('find.about', { herb: f.label })}">${pic(`ingredient:${f.herb}`, { lod: 'mini' })}<span class="find-i" aria-hidden="true">i</span></button>
    <button type="button" class="find-pick" data-action="pick" data-hold="details" data-herb="${f.herb}" aria-pressed="${!!f.pressed}"${f.disabled ? html` disabled` : ''} aria-label="${label}">
      <span class="name">${f.label} ×${f.count}</span>
      <span class="sub"><span class="coin-badge${f.prime ? ' prime' : f.poor ? ' poor' : ''}">${pic('ui:coin')}${f.value}</span>${f.heavy ? html`<span class="slots">${t('find.slots')}</span>` : ''}</span></button></div>`;
}

/** A shelf chip with wilt pips (one pip per item; red = wilts tonight). */
export function shelfChip(/** @type {{ herb: string, count: number, next?: number, nights: number[] }} */ c) {
  const grows = c.next != null && c.next !== c.count;
  const label = t('shelf.chip', { herb: herbName(c.herb), count: c.count }) + (grows ? t('shelf.chipNext', { next: /** @type {number} */ (c.next) }) : '')
    + t('shelf.chipWilt', { n: c.nights.filter(n => n <= 1).length });
  return html`<span class="chip" data-key="chip-${c.herb}" aria-label="${label}">
    ${pic(`ingredient:${c.herb}`, { lod: 'mini' })}${c.count}${grows ? html`<span class="delta">→${c.next}</span>` : ''}
    <span class="pips">${c.nights.map(n => html`<i class="pip${n <= 1 ? ' wilt' : ''}"></i>`)}</span></span>`;
}

/** The trait meter. */
export const meter = (/** @type {readonly (readonly [string, string, number])[]} */ rows = DEMO) => html`<div class="meter">${rows.map(([k, n, v]) => html`<div class="row" style="--c:var(--${k})">${pic(`trait:${k}`)}<span>${n}</span>
  <span class="bar">${Array.from({ length: 10 }, (_, i) => html`<i class="${i < v ? 'on' : ''}"></i>`)}</span><span class="v">${v}</span></div>`)}</div>`;
