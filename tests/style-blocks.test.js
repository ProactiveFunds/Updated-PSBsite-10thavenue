// A backtick inside a component's <style>{` … `}</style> block closes the
// template literal early. The build does fail, but with `Expected "}" but found
// <some css word>` pointing at a line nowhere near the comment that caused it —
// which has cost three separate debugging cycles. This names the file and line
// directly.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, not URL.pathname — the repo path contains spaces.
const SRC = fileURLToPath(new URL('../src', import.meta.url));

function jsxFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) jsxFiles(p, out);
    else if (entry.name.endsWith('.jsx')) out.push(p);
  }
  return out;
}

test('no stray backtick inside a <style> template literal', () => {
  const offences = [];
  for (const file of jsxFiles(join(SRC, 'components'))) {
    const text = readFileSync(file, 'utf8');
    const open = '<style>{`';
    let i = text.indexOf(open);
    while (i !== -1) {
      const start = i + open.length;
      const end = text.indexOf('`}</style>', start);
      assert.notEqual(end, -1, `${file}: <style> block is never closed`);
      const block = text.slice(start, end);
      if (block.includes('`')) {
        const line = text.slice(0, start + block.indexOf('`')).split('\n').length;
        offences.push(`${file.replace(SRC, 'src')}:${line}`);
      }
      i = text.indexOf(open, end + 1);
    }
  }
  assert.deepEqual(offences, [],
    'Backtick inside a <style>{` … `}</style> block — it closes the template '
    + 'literal and the build dies with a misleading error. Use plain quotes when '
    + 'quoting CSS in a comment. Offending line(s):\n  ' + offences.join('\n  '));
});

test('every <style> template literal is balanced', () => {
  for (const file of jsxFiles(join(SRC, 'components'))) {
    const text = readFileSync(file, 'utf8');
    const opens = (text.match(/<style>\{`/g) || []).length;
    const closes = (text.match(/`\}<\/style>/g) || []).length;
    assert.equal(opens, closes, `${file.replace(SRC, 'src')}: ${opens} <style> opens vs ${closes} closes`);
  }
});
