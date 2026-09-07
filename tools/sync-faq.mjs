#!/usr/bin/env node
/**
 * tools/sync-faq.mjs
 *
 * Regenerates the FAQPage JSON-LD in faq.html from the FAQ that actually
 * renders on the page. Run with `npm run sync:faq` after editing any FAQ entry.
 *
 * Why this is a script and not a hand-maintained block: Google treats a FAQPage
 * answer that does not appear on the page as a structured-data violation. With
 * eighteen entries, hand-syncing is a matter of time before they drift. This
 * makes the rendered HTML the single source of truth and the JSON-LD a
 * derivative of it, so drift is impossible.
 *
 * Answers are flattened to plain text: markup is stripped, entities decoded,
 * whitespace collapsed. Source citations render as links on the page and as
 * trailing plain text in the schema, which is correct for both.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGE = path.join(__dirname, '..', 'faq.html');
const PAGE_URL = 'https://evewaste.com/faq.html';

const ENTITIES = {
  '&mdash;': '—', '&ndash;': '–', '&middot;': '·', '&amp;': '&',
  '&lt;': '<', '&gt;': '>', '&quot;': '"', '&nbsp;': ' ', '&rarr;': '→',
  '&thinsp;': ' ', '&#8322;': '₂'
};

const decode = str =>
  str.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
     .replace(/&[a-z]+;/gi, e => ENTITIES[e] ?? e);

const plain = html =>
  decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

let page = await readFile(PAGE, 'utf8');

// Pull every rendered <details class="faq-item"> in document order.
const entries = [];
for (const [, summary, body] of page.matchAll(
  /<details class="faq-item">\s*<summary class="faq-item__question">([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g
)) {
  // Drop HTML comments so NEEDS INPUT notes never leak into the schema.
  const answer = plain(body.replace(/<!--[\s\S]*?-->/g, ''));
  const question = plain(summary);
  if (!question || !answer) {
    console.error(`Skipping an entry with an empty question or answer: ${question || '(no question)'}`);
    process.exitCode = 1;
    continue;
  }
  entries.push({ question, answer });
}

if (entries.length === 0) {
  console.error('No FAQ entries found in platform.html, refusing to write an empty schema.');
  process.exit(1);
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${PAGE_URL}#faq`,
  mainEntity: entries.map(e => ({
    '@type': 'Question',
    name: e.question,
    acceptedAnswer: { '@type': 'Answer', text: e.answer }
  }))
};

const block = `  <script type="application/ld+json">
${JSON.stringify(schema, null, 2).split('\n').map(l => '  ' + l).join('\n')}
  </script>`;

// Replace the existing FAQPage block, leaving the Organization block alone.
const existing = /  <script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/;
if (!existing.test(page)) {
  console.error('Could not find the FAQPage JSON-LD block to replace.');
  process.exit(1);
}
page = page.replace(existing, block);
await writeFile(PAGE, page);

console.log(`Synced ${entries.length} FAQ entries into faq.html's FAQPage schema.`);
for (const e of entries) console.log(`  - ${e.question}`);
