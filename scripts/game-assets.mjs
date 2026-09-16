/**
 * Turns Higgsfield generations into game assets:
 *   node scripts/game-assets.mjs manifest.json
 * manifest: { "cards": { "<kidId>": "<url>" }, "field": "<url>", "cover": "<url>" }
 * Cards: key out the magenta background, nearest-neighbour downscale to 96×96, quantise to 32 colours.
 * Field/cover: downscale to 640×360 / 960×540 and quantise. Output under public/game/.
 */
import sharp from "sharp";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(process.argv[2], "utf8"));
mkdirSync("public/game/cards", { recursive: true });

async function fetchBuf(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

/** Magenta → transparent, with a tolerance, on raw RGBA pixels. */
function keyMagenta(data, width, height) {
  for (let i = 0; i < width * height * 4; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r > 140 && b > 110 && g < 130 && r - g > 50 && b - g > 30) data[i + 3] = 0;
  }
  return data;
}

async function card(id, url) {
  const buf = await fetchBuf(url);
  // crop the drawn frame (about 5% each side), then downscale
  const meta = await sharp(buf).metadata();
  const inset = Math.round((meta.width ?? 1024) * 0.06);
  const small = await sharp(buf).extract({ left: inset, top: inset, width: (meta.width ?? 1024) - inset * 2, height: (meta.height ?? 1024) - inset * 2 }).resize(96, 96, { kernel: sharp.kernel.nearest, fit: "cover" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const keyed = keyMagenta(small.data, small.info.width, small.info.height);
  await sharp(keyed, { raw: { width: 96, height: 96, channels: 4 } }).png({ palette: true, colours: 32, compressionLevel: 9 }).toFile(`public/game/cards/${id}.png`);
  console.log("card", id);
}

async function scene(name, url, w, h) {
  const buf = await fetchBuf(url);
  await sharp(buf).resize(w, h, { kernel: sharp.kernel.nearest, fit: "cover" }).png({ palette: true, colours: 48, compressionLevel: 9 }).toFile(`public/game/${name}.png`);
  console.log("scene", name);
}

for (const [id, url] of Object.entries(manifest.cards ?? {})) await card(id, url);
if (manifest.field) await scene("field", manifest.field, 640, 360);
if (manifest.cover) await scene("cover", manifest.cover, 960, 540);

const lines = ["# Game assets", "", "Generated with Higgsfield (nano_banana_pro) from prompts using one locked style formula, then keyed, downscaled with nearest-neighbour sampling and palette-quantised by scripts/game-assets.mjs.", "", ...Object.keys(manifest.cards ?? {}).map((id) => `- cards/${id}.png`), manifest.field ? "- field.png" : "", manifest.cover ? "- cover.png" : ""];
writeFileSync("public/game/ASSETS.md", lines.filter(Boolean).join("\n") + "\n");
console.log("done");
