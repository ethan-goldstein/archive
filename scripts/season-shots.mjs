/**
 * Visual check for the seasonal scroll journey: each chapter of several years at desktop width,
 * two years on a phone, and one reduced-motion pass.
 * Usage: BASE=http://localhost:3000 node scripts/season-shots.mjs <output-dir>
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const out = process.argv[2];
mkdirSync(out, { recursive: true });
const base = process.env.BASE ?? "http://localhost:3000";
const years = (process.env.YEARS ?? "2005,2010,2015,2019,2024,2026").split(",").map(Number);
const chapters = ["title", "winter", "spring", "summer", "fall", "world"];
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });

async function walk(page, year, prefix) {
  await page.goto(`${base}/year/${year}`);
  await page.waitForSelector("canvas", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1500);
  for (const c of chapters) {
    await page.evaluate((id) => {
      const el = document.querySelector(`[data-chapter="${id}"]`);
      window.scrollTo({ top: el.offsetTop + (id === "title" ? 0 : 40), behavior: "instant" });
    }, c);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${out}/${prefix}${year}-${c}.png` });
  }
}

const d = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const p = await d.newPage();
for (const y of years) await walk(p, y, "d-");
await d.close();

const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const mp = await m.newPage();
for (const y of [years[0], years[years.length - 1]]) await walk(mp, y, "m-");
await m.close();

const r = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const rp = await r.newPage();
await walk(rp, years[0], "rm-");
await r.close();
await browser.close();
console.log("done", out);
