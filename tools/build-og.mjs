#!/usr/bin/env node
/**
 * tools/build-og.mjs
 *
 * Renders the 1200x630 Open Graph card for each page family, plus the 512x512
 * Organization logo referenced by the JSON-LD. Run with `npm run build:og`.
 * sharp is a devDependency used only by this script — the site ships the
 * generated PNGs and gains no dependency.
 *
 * Every headline below is copy that already exists on the corresponding page
 * or in CONTENT.md. Do not add a card with invented copy.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'assets', 'og');
const LOGO_PATH = path.join(__dirname, '..', 'assets', 'logo-512.png');

const FOREST = '#15342D';
const FOREST_MID = '#1D473D';
const SPROUT = '#65976A';
const CLAY = '#DAE1DE';
const WHITE = '#FFFFFF';
const FONT = "Verdana, Geneva, 'DejaVu Sans', sans-serif";

const LEAF = [
  'M16 28C6 23 3 13 8 3c3 9 5 17 8 25Z',
  'M16 28c10-5 13-15 8-25-3 9-5 17-8 25Z'
];

const CARDS = [
  { slug: 'home', eyebrow: 'Modular bio-reactors', lines: ['Putting food waste', 'back to work.'] },
  { slug: 'about', eyebrow: 'About', lines: ['Waste is not our fault,', 'but it is our problem.'] },
  { slug: 'platform', eyebrow: 'The bio-reactor', lines: ['Waste goes in.', 'Products come out.'] },
  { slug: 'team', eyebrow: 'Team', lines: ['Meet the founders.'] },
  { slug: 'pilots', eyebrow: 'Pilot program', lines: ['How a pilot works.'] },
  { slug: 'contact', eyebrow: 'Contact', lines: ['Build with EvE.'] }
];

function leafGroup(x, y, size, fill, opacity = 1) {
  const scale = size / 32;
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${fill}" opacity="${opacity}">
      ${LEAF.map(d => `<path d="${d}"/>`).join('\n      ')}
    </g>`;
}

function card({ eyebrow, lines }) {
  const headlineSize = lines.length > 1 ? 76 : 88;
  const lineHeight = headlineSize * 1.22;
  const blockTop = 330 - ((lines.length - 1) * lineHeight) / 2;

  const headline = lines
    .map((line, i) => `<text x="80" y="${blockTop + i * lineHeight}" font-family="${FONT}"
        font-size="${headlineSize}" font-weight="700" fill="${WHITE}"
        letter-spacing="-2">${line}</text>`)
    .join('\n    ');

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${FOREST}"/>
    ${leafGroup(830, 60, 520, FOREST_MID, 1)}
    ${leafGroup(80, 62, 44, WHITE)}
    <text x="140" y="98" font-family="${FONT}" font-size="34" font-weight="700"
      fill="${WHITE}" letter-spacing="1">EvE Waste</text>
    <text x="80" y="196" font-family="${FONT}" font-size="22" font-weight="700"
      fill="${SPROUT}" letter-spacing="6">${eyebrow.toUpperCase()}</text>
    ${headline}
    <rect x="80" y="486" width="120" height="5" fill="${SPROUT}"/>
    <text x="80" y="556" font-family="${FONT}" font-size="25" fill="${CLAY}"
      letter-spacing="0.5">Columbus, Ohio &#183; evewaste.com</text>
  </svg>`);
}

const logo = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${FOREST}"/>
  ${leafGroup(88, 88, 336, WHITE)}
</svg>`);

await mkdir(OUT_DIR, { recursive: true });

for (const spec of CARDS) {
  const out = path.join(OUT_DIR, `${spec.slug}.png`);
  await sharp(card(spec)).png({ compressionLevel: 9 }).toFile(out);
  console.log(`Wrote ${path.relative(process.cwd(), out)}`);
}

await sharp(logo).png({ compressionLevel: 9 }).toFile(LOGO_PATH);
console.log(`Wrote ${path.relative(process.cwd(), LOGO_PATH)}`);
