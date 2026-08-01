/**
 * Compresse et redimensionne toutes les images de public/images en place.
 *
 * Usage :
 *   npm install -D sharp
 *   node scripts/optimize-images.mjs
 *
 * Le script :
 *  - fait une sauvegarde des originaux dans public/images-originals/ (une seule fois)
 *  - redimensionne toute image dont la largeur dépasse MAX_WIDTH
 *  - recompresse les JPEG en qualité 78 (bon compromis poids/qualité)
 *  - laisse les autres formats (png, webp) redimensionnés mais non recompressés en qualité
 *
 * Les chemins et extensions de fichiers ne changent pas : aucun changement de
 * code n'est nécessaire ailleurs dans le projet.
 */
import { readdir, mkdir, copyFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const IMAGES_DIR = path.resolve('public/images');
const BACKUP_DIR = path.resolve('public/images-originals');
const MAX_WIDTH = 1600; // suffisant pour des heros pleine largeur en desktop
const JPEG_QUALITY = 78;

async function ensureBackup(file) {
  await mkdir(BACKUP_DIR, { recursive: true });
  const dest = path.join(BACKUP_DIR, path.basename(file));
  try {
    await stat(dest);
    // déjà sauvegardé, on ne l'écrase pas (pour ne pas sauvegarder une version déjà compressée)
  } catch {
    await copyFile(file, dest);
  }
}

async function optimize(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

  await ensureBackup(file);

  const originalBuffer = await sharp(path.join(BACKUP_DIR, path.basename(file))).toBuffer();
  const image = sharp(originalBuffer);
  const meta = await image.metadata();

  let pipeline = image;
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH });
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: JPEG_QUALITY });
  }

  const outBuffer = await pipeline.toBuffer();
  const originalSize = (await stat(file)).size;

  // Ne réécrit que si on gagne réellement de la place
  if (outBuffer.length < originalSize) {
    await sharp(outBuffer).toFile(file + '.tmp');
    await copyFile(file + '.tmp', file);
    const { unlink } = await import('node:fs/promises');
    await unlink(file + '.tmp');
    console.log(
      `✓ ${path.basename(file)}  ${(originalSize / 1024).toFixed(0)}kB → ${(outBuffer.length / 1024).toFixed(0)}kB`
    );
  } else {
    console.log(`= ${path.basename(file)}  déjà optimal, inchangé`);
  }
}

async function main() {
  const files = await readdir(IMAGES_DIR);
  let count = 0;
  for (const f of files) {
    const full = path.join(IMAGES_DIR, f);
    const s = await stat(full);
    if (s.isFile()) {
      await optimize(full);
      count++;
    }
  }
  console.log(`\nTerminé. ${count} fichier(s) traité(s). Originaux conservés dans public/images-originals/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
