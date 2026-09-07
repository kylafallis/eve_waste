#!/usr/bin/env node
/**
 * tools/stamp-assets.mjs
 *
 * Appends a content hash to every local CSS and JS reference in the HTML:
 *
 *     css/styles.css   ->   css/styles.css?v=3f9a1c04
 *
 * Why: this site has no bundler, so styles.css keeps its filename forever. That
 * normally forces a short cache lifetime, because a hard-cached stylesheet with
 * a stable URL can strand returning visitors on stale CSS with no way out.
 * Stamping the URL with a hash of the file's contents makes the URL change
 * whenever the file does, which is what lets _headers mark /css/* and /js/* as
 * immutable for a year. Unchanged files keep their hash and stay cached.
 *
 * Run `npm run stamp` after ANY edit to a file in css/ or js/, and before every
 * deploy. `npm run build` does it for you. The script is idempotent, it strips
 * an existing ?v= before writing the new one, so running it twice is harmless.
 * Running it when nothing changed produces no diff.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const hashes = new Map();
for (const dir of ['css', 'js']) {
  for (const file of await readdir(path.join(ROOT, dir))) {
    if (!/\.(css|js)$/.test(file)) continue;
    const body = await readFile(path.join(ROOT, dir, file));
    hashes.set(`${dir}/${file}`, createHash('sha256').update(body).digest('hex').slice(0, 8));
  }
}

// Matches href="css/x.css" or src="js/x.js", with or without an existing ?v=.
const REF = /(href|src)="((?:css|js)\/[A-Za-z0-9_.-]+\.(?:css|js))(\?v=[0-9a-f]+)?"/g;

let changed = 0;
for (const file of (await readdir(ROOT)).filter(f => f.endsWith('.html'))) {
  const full = path.join(ROOT, file);
  const before = await readFile(full, 'utf8');
  const after = before.replace(REF, (whole, attr, asset) => {
    const h = hashes.get(asset);
    if (!h) {
      console.warn(`  ${file}: references ${asset}, which does not exist on disk`);
      return whole;
    }
    return `${attr}="${asset}?v=${h}"`;
  });
  if (after !== before) {
    await writeFile(full, after);
    console.log(`Stamped ${file}`);
    changed++;
  }
}

console.log(changed === 0 ? 'All references already current.' : `Updated ${changed} file(s).`);
for (const [asset, h] of hashes) console.log(`  ${asset} -> ${h}`);
