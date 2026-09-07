#!/usr/bin/env node
/**
 * tools/build-og.mjs
 *
 * Renders the 1200x630 Open Graph card for each page family. Run with
 * `npm run build:og`. sharp is a devDependency used only by this script, the
 * site ships the generated PNGs and gains no dependency.
 *
 * The leaf and wordmark come from the real supplied lockup
 * (images/source/brand/eve-logo.png), not from hand-drawn approximations.
 * Run `npm run build:brand` first if the lockup ever changes.
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
const LOGO_SRC = path.join(__dirname, '..', 'images', 'source', 'brand', 'eve-logo.png');

const FOREST = '#15342D';
const FOREST_MID = '#1D473D';
const SPROUT = '#65976A';
const CLAY = '#DAE1DE';
const WHITE = '#FFFFFF';
const FONT = "Verdana, Geneva, 'DejaVu Sans', sans-serif";

// Ink bounding boxes measured from the source alpha channel.
const LEAF = { left: 79, top: 55, width: 582, height: 432 };
const LOCKUP = { left: 79, top: 55, width: 1536, height: 432 };

const CARDS = [
  { slug: 'home', eyebrow: 'Modular bio-reactors', lines: ['Putting food waste', 'back to work.'] },
  { slug: 'about', eyebrow: 'About', lines: ['Waste is not our fault,', 'but it is our problem.'] },
  { slug: 'platform', eyebrow: 'The bio-reactor', lines: ['Waste goes in.', 'Products come out.'] },
  { slug: 'team', eyebrow: 'Team', lines: ['Meet the founders.'] },
  { slug: 'pilots', eyebrow: 'Pilot program', lines: ['How a pilot works.'] },
  { slug: 'contact', eyebrow: 'Contact', lines: ['Build with EvE.'] }
];

/** The leaf silhouette recoloured, by pairing a solid fill with the leaf's alpha. */
async function tintedLeaf(width, colour) {
  const alpha = await sharp(LOGO_SRC)
    .extract(LEAF)
    .resize({ width })
    .ensureAlpha()
    .extractChannel(3)
    .toBuffer();
  const { height } = await sharp(alpha).metadata();
  return sharp({ create: { width, height, channels: 3, background: colour } })
    .joinChannel(alpha)
    .png()
    .toBuffer();
}

function cardBase({ eyebrow, lines }) {
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
    <text x="80" y="196" font-family="${FONT}" font-size="22" font-weight="700"
      fill="${SPROUT}" letter-spacing="6">${eyebrow.toUpperCase()}</text>
    ${headline}
    <rect x="80" y="486" width="120" height="5" fill="${SPROUT}"/>
    <text x="80" y="556" font-family="${FONT}" font-size="25" fill="${CLAY}"
      letter-spacing="0.5">Columbus, Ohio &#183; evewaste.com</text>
  </svg>`);
}

await mkdir(OUT_DIR, { recursive: true });

// Built once and reused across all six cards.
const bigLeaf = await tintedLeaf(520, FOREST_MID);
const lockup = await sharp(LOGO_SRC).extract(LOCKUP).resize({ width: 240 }).png().toBuffer();

for (const spec of CARDS) {
  const out = path.join(OUT_DIR, `${spec.slug}.png`);
  await sharp(cardBase(spec))
    .composite([
      { input: bigLeaf, left: 830, top: 60 },
      { input: lockup, left: 80, top: 58 }
    ])
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`Wrote ${path.relative(process.cwd(), out)}`);
}
