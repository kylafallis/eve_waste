#!/usr/bin/env node
/**
 * tools/build-images.mjs
 *
 * Generates AVIF + WebP responsive variants (640/1280/1920w) for every real
 * photograph dropped in images/source/. Run locally with `npm run build:images`
 * after `npm install` — sharp is a devDependency used only by this script.
 * The site itself ships only the generated static image files, no dependency.
 *
 * Usage:
 *   1. npm install
 *   2. Drop full-resolution photographs (jpg/jpeg/png/tiff) into images/source/
 *   3. npm run build:images
 *   4. Reference the output in <img> / <picture> markup, e.g.:
 *      images/ad-system-prototype-1280.webp
 */
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, '..', 'images', 'source');
const TEAM_SRC_DIR = path.join(SRC_DIR, 'team');
const OUT_DIR = path.join(__dirname, '..', 'images');
const TEAM_OUT_DIR = path.join(OUT_DIR, 'team');
const WIDTHS = [640, 1280, 1920];
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.tiff']);

// Headshots are cropped to the 3:4 the team card renders at, rather than being
// scaled whole, and are emitted at only two widths — the card is never wider
// than ~440 CSS px. Cut-out portraits (transparent PNGs) are flattened onto
// Forest Green so they match the monogram tiles they replace.
const TEAM_WIDTHS = [440, 880];
const TEAM_RATIO = 3 / 4;
const FOREST_GREEN = '#15342D';

async function buildTeam() {
  if (!existsSync(TEAM_SRC_DIR)) return;
  const files = (await readdir(TEAM_SRC_DIR))
    .filter(f => SOURCE_EXTENSIONS.has(path.extname(f).toLowerCase()));
  if (files.length === 0) return;

  await mkdir(TEAM_OUT_DIR, { recursive: true });

  for (const file of files) {
    const name = path.parse(file).name;
    const inputPath = path.join(TEAM_SRC_DIR, file);

    for (const width of TEAM_WIDTHS) {
      const height = Math.round(width / TEAM_RATIO);
      const base = sharp(inputPath)
        .rotate()
        .flatten({ background: FOREST_GREEN })
        // `attention` keeps the face in frame instead of centre-cropping it out.
        .resize(width, height, { fit: 'cover', position: sharp.strategy.attention });

      const webpPath = path.join(TEAM_OUT_DIR, `${name}-${width}.webp`);
      const avifPath = path.join(TEAM_OUT_DIR, `${name}-${width}.avif`);

      await base.clone().webp({ quality: 84 }).toFile(webpPath);
      await base.clone().avif({ quality: 62 }).toFile(avifPath);
      console.log(`Wrote ${path.relative(process.cwd(), webpPath)} + .avif (${width}x${height})`);
    }
  }
}

async function main() {
  await buildTeam();

  if (!existsSync(SRC_DIR)) {
    console.error(`No source directory found at ${path.relative(process.cwd(), SRC_DIR)}.`);
    console.error('Create it and add real photographs (jpg/jpeg/png/tiff), then re-run.');
    process.exitCode = 1;
    return;
  }

  const files = (await readdir(SRC_DIR)).filter(f => SOURCE_EXTENSIONS.has(path.extname(f).toLowerCase()));

  if (files.length === 0) {
    console.log(`No photographs found in ${path.relative(process.cwd(), SRC_DIR)}. Nothing to do.`);
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });

  for (const file of files) {
    const name = path.parse(file).name;
    const inputPath = path.join(SRC_DIR, file);
    const metadata = await sharp(inputPath).metadata();
    // Orientations 5-8 swap the axes, so the displayed width is the stored height.
    const sourceWidth = metadata.orientation >= 5 ? metadata.height : metadata.width;

    for (const width of WIDTHS) {
      if (sourceWidth && sourceWidth < width) {
        console.log(`Skipping ${name} @ ${width}w — source is only ${sourceWidth}px wide.`);
        continue;
      }

      const webpPath = path.join(OUT_DIR, `${name}-${width}.webp`);
      const avifPath = path.join(OUT_DIR, `${name}-${width}.avif`);

      // .rotate() with no argument applies the EXIF orientation and strips the
      // tag, so phone photos land upright and the emitted pixel dimensions are
      // the ones to put in the <img> width/height attributes.
      const webpInfo = await sharp(inputPath).rotate().resize({ width }).webp({ quality: 82 }).toFile(webpPath);
      console.log(`Wrote ${path.relative(process.cwd(), webpPath)} (${webpInfo.width}x${webpInfo.height})`);

      const avifInfo = await sharp(inputPath).rotate().resize({ width }).avif({ quality: 60 }).toFile(avifPath);
      console.log(`Wrote ${path.relative(process.cwd(), avifPath)} (${avifInfo.width}x${avifInfo.height})`);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
