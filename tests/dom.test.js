import { test } from 'node:test';
import assert from 'node:assert/strict';
import { html, raw, tx, esc, Raw } from '../src/ui/dom.js';

test('html escapes interpolations, in content and in attributes', () => {
  const evil = `<script>alert("x")</script>`;
  const out = String(html`<p title="${`Wren's "page"`}">${evil}</p>`);
  assert.equal(out, '<p title="Wren&#39;s &quot;page&quot;">&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</p>');
});

test('Raw passes through; arrays are joined; null, false and undefined render nothing', () => {
  const items = ['a<', raw('<b>b</b>'), html`<i>${'c&'}</i>`];
  assert.equal(String(html`${items}|${null}|${false}|${undefined}|${0}`), 'a&lt;<b>b</b><i>c&amp;</i>||||0');
  assert.ok(html`x` instanceof Raw);
});

test('tx keeps the string table markup but escapes the vars', () => {
  assert.equal(String(tx('haul.brings', { trait: '<i>Calm</i>' })), 'Brings <b>&lt;i&gt;Calm&lt;/i&gt;</b>.');
  assert.equal(esc(`&'"`), '&amp;&#39;&quot;');
});
