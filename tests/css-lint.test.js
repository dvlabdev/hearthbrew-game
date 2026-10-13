// Design-system lint: components and screens use semantic tokens only (design/visual/05-design-system.md).
// Literal colours and px font sizes belong in src/ui/tokens.css or a style pack, never in components.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const UI = fileURLToPath(new URL('../src/ui/', import.meta.url));
const files = readdirSync(UI).filter(f => f.endsWith('.css') && f !== 'tokens.css').map(f => UI + f);
if (existsSync(UI + 'screens')) files.push(...readdirSync(UI + 'screens').filter(f => f.endsWith('.css')).map(f => `${UI}screens/${f}`));

test('component and screen CSS has no literal colours or px font sizes', () => {
  for (const file of files) {
    const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const lines = css.split('\n');
    lines.forEach((line, i) => {
      assert.doesNotMatch(line, /#[0-9a-fA-F]{3,8}\b/, `${file}:${i + 1} literal hex colour`);
      assert.doesNotMatch(line, /\b(rgb|rgba|hsl|hsla)\(/, `${file}:${i + 1} literal colour function`);
      assert.doesNotMatch(line, /font(-size)?:[^;]*\b\d+(\.\d+)?px/, `${file}:${i + 1} px font size (use --fs-*)`);
    });
  }
});

test('no text smaller than the 16px floor in the type scale', () => {
  const tokens = readFileSync(UI + 'tokens.css', 'utf8');
  for (const [, v] of tokens.matchAll(/--fs-[\w-]+:([\d.]+)rem/g)) assert.ok(Number(v) >= 1, `type token ${v}rem is under 16px`);
});

test('style pack CSS holds tokens only (behaviour belongs in src/ui)', () => {
  const PACKS = fileURLToPath(new URL('../src/art/styles/', import.meta.url));
  for (const id of readdirSync(PACKS).filter(f => existsSync(`${PACKS}${f}/style.css`))) {
    const css = readFileSync(`${PACKS}${id}/style.css`, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    // every rule's selector (skipping @media / @supports wrappers) must be a :root token block
    for (const [, sel] of css.matchAll(/([^{}]+)\{/g)) {
      const s = sel.trim();
      if (s.startsWith('@')) continue;
      for (const part of s.split(',')) assert.match(part.trim(), /^:root(\[data-theme(="[\w-]+")?\]|:not\(\[data-theme(="[\w-]+")?\]\))*$/, `${id}/style.css: "${part.trim()}" is not a token block`);
    }
  }
});
