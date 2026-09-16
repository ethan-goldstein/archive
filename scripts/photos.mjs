/**
 * Photo and video ingest.  Usage:  npm run photos
 *
 * Drop originals into public/photos/<year>/ (jpg, jpeg, png, webp, heic; mp4, mov, webm) and run this.
 * For every image it:  converts HEIC → JPEG (macOS sips), applies the EXIF rotation, resizes to fit
 * 1800px, re-encodes WITHOUT metadata (no GPS, no camera serials), and writes a tiny blur preview.
 * Originals are replaced in place by the cleaned file, so keep your own backups elsewhere.
 * Videos are listed as-is (no transcode); keep them small or link YouTube instead.
 *
 * Output: content/generated/media.json — auto-included on each year page. Add captions, alt text and
 * tags in content/personal/<year>.ts by referencing the same `src` (see README "Photos").
 */
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const ROOT = "public/photos";
const OUT = "content/generated/media.json";
const IMAGE = /\.(jpe?g|png|webp|heic|heif)$/i;
const VIDEO = /\.(mp4|mov|webm|m4v)$/i;
const MAX = 1800;

const slug = (s) => s.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "photo";
const media = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
if (!existsSync(ROOT)) mkdirSync(ROOT, { recursive: true });

let images = 0, videos = 0;
for (const year of readdirSync(ROOT).filter((d) => /^\d{4}$/.test(d)).sort()) {
  const dir = path.join(ROOT, year);
  const entry = { photos: [], videos: [] };
  const files = readdirSync(dir).filter((f) => !f.startsWith(".")).sort();
  const used = new Set();
  for (const file of files) {
    const full = path.join(dir, file);
    if (!statSync(full).isFile()) continue;
    if (VIDEO.test(file)) {
      const id = `${year}-${slug(file)}`;
      entry.videos.push({ id, src: `/photos/${year}/${file}`, bytes: statSync(full).size });
      videos += 1;
      continue;
    }
    if (!IMAGE.test(file)) continue;
    let source = full;
    let tmpHeic = null;
    if (/\.hei[cf]$/i.test(file)) {
      tmpHeic = path.join(dir, `.${slug(file)}.converted.jpg`);
      execFileSync("sips", ["-s", "format", "jpeg", full, "--out", tmpHeic], { stdio: "ignore" });
      source = tmpHeic;
    }
    const isPng = /\.png$/i.test(file);
    let base = slug(file);
    while (used.has(base)) base = `${base}-2`;
    used.add(base);
    const outName = `${base}.${isPng ? "png" : "jpg"}`;
    const outPath = path.join(dir, outName);
    const tmpOut = path.join(dir, `.${base}.tmp`);
    const img = sharp(source).rotate().resize(MAX, MAX, { fit: "inside", withoutEnlargement: true });
    const info = await (isPng ? img.png({ compressionLevel: 9 }) : img.jpeg({ quality: 84, mozjpeg: true })).toFile(tmpOut);
    const blur = await sharp(tmpOut).resize(12, 12, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
    if (tmpHeic) unlinkSync(tmpHeic);
    if (outPath !== full && existsSync(full)) unlinkSync(full);
    renameSync(tmpOut, outPath);
    entry.photos.push({ id: `${year}-${base}`, src: `/photos/${year}/${outName}`, width: info.width, height: info.height, blurDataURL: `data:image/webp;base64,${blur.toString("base64")}` });
    images += 1;
  }
  media[year] = entry;
  console.log(`${year}: ${entry.photos.length} photos, ${entry.videos.length} videos`);
}
writeFileSync(OUT, JSON.stringify(media, null, 1) + "\n");
console.log(`done · ${images} images cleaned, ${videos} videos listed → ${OUT}`);
