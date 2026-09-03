#!/usr/bin/env node
/**
 * tools/build-brand.mjs
 *
 * Derives every brand asset the site ships from the one real logo file,
 * images/source/brand/eve-logo.png — the supplied lockup: a cream (#FBE6AC)
 * leaf mark plus the EvE wordmark on transparency, drawn for dark backgrounds.
 *
 * Run with `npm run build:brand`. sharp is a devDependency used only by this
 * script; the site ships the generated files and gains no dependency.
 *
 * Emits:
 *   assets/eve-logo-176.png / -352.png   header + footer lockup (1x / 2x)
 *   assets/logo-512.png                  Organization JSON-LD logo, on Forest Green
 *   assets/favicon-32.png                browser tab
 *   assets/favicon.ico                   legacy, 16 + 32 + 48 in one file
 *   assets/apple-touch-icon.png          180x180 home-screen icon
 *   assets/favicon.svg                   kept in sync by hand — see note below
 *
 * NOTE the source is a raster PNG, so the favicons are rasterised from it. The
 * hand-drawn assets/favicon.svg is the one asset NOT derived here; if the logo
 * is ever supplied as vector artwork, replace favicon.svg too and delete this note.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'images', 'source', 'brand', 'eve-logo.png');
const OUT = path.join(__dirname, '..', 'assets');

const FOREST_GREEN = '#15342D';

// Measured from the source alpha channel: the leaf occupies x 79-660, the
// wordmark 708-1614, with a 47px gap between them. Trimmed of its transparent
// margin so the marks sit flush in whatever box they are placed in.
const LEAF = { left: 79, top: 55, width: 582, height: 432 };
const LOCKUP = { left: 79, top: 55, width: 1536, height: 432 };

/** Minimal ICO container wrapping PNG frames — sharp cannot write .ico itself. */
function buildIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);            // reserved
  header.writeUInt16LE(1, 2);            // type: icon
  header.writeUInt16LE(frames.length, 4);

  let offset = 6 + frames.length * 16;
  const entries = [];
  for (const { size, png } of frames) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 means 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2);                      // palette size
    e.writeUInt8(0, 3);                      // reserved
    e.writeUInt16LE(1, 4);                   // colour planes
    e.writeUInt16LE(32, 6);                  // bits per pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...frames.map(f => f.png)]);
}

/** The leaf on a Forest Green square, padded so it does not touch the edges. */
async function squareIcon(size) {
  const inset = Math.round(size * 0.20);
  const leaf = await sharp(SRC)
    .extract(LEAF)
    .resize(size - inset * 2, size - inset * 2, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: FOREST_GREEN }
  })
    .composite([{ input: leaf, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

await mkdir(OUT, { recursive: true });

// 1. Header / footer lockup, cream on transparency, at 1x and 2x.
for (const width of [176, 352]) {
  const file = path.join(OUT, `eve-logo-${width}.png`);
  await sharp(SRC).extract(LOCKUP).resize({ width }).png({ compressionLevel: 9 }).toFile(file);
  console.log(`Wrote ${path.relative(process.cwd(), file)}`);
}

// 2. Organization JSON-LD logo — the lockup on Forest Green, since the artwork
//    is cream and would vanish on the white background a consumer may assume.
const lockup512 = await sharp(SRC)
  .extract(LOCKUP)
  .resize(512 - 64 * 2, null, { fit: 'inside' })
  .toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: FOREST_GREEN } })
  .composite([{ input: lockup512, gravity: 'centre' }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT, 'logo-512.png'));
console.log('Wrote assets/logo-512.png');

// 3. Favicons and the touch icon.
await writeFile(path.join(OUT, 'favicon-32.png'), await squareIcon(32));
console.log('Wrote assets/favicon-32.png');

await writeFile(path.join(OUT, 'apple-touch-icon.png'), await squareIcon(180));
console.log('Wrote assets/apple-touch-icon.png');

const icoFrames = [];
for (const size of [16, 32, 48]) icoFrames.push({ size, png: await squareIcon(size) });
await writeFile(path.join(OUT, 'favicon.ico'), buildIco(icoFrames));
console.log('Wrote assets/favicon.ico (16 + 32 + 48)');
