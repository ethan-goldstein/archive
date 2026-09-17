/**
 * Visual review of the clean UI: the hub, one year per quality level (title and a season),
 * the secondary pages, and phones. Usage: BASE=http://localhost:3000 node scripts/screenshots.mjs <dir>
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const out = process.argv[2]; mkdirSync(out, { recursive: true });
const base = process.env.BASE ?? "http://localhost:3000";
const browser = await chromium.launch({ args: ["--enable-gpu", "--ignore-gpu-blocklist", "--use-angle=metal"] });
const toChapter = (page, id) => page.evaluate((c) => { const el = document.querySelector(`[data-chapter="${c}"]`); window.scrollTo({ top: el.offsetTop + 40, behavior: "instant" }); }, id);

const d = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await d.newPage();
await p.goto(`${base}/`); await p.waitForTimeout(1200);
await p.screenshot({ path: `${out}/hub.png` });
await p.screenshot({ path: `${out}/hub-full.png`, fullPage: true });
for (const y of [2005, 2010, 2015, 2019, 2024]) {
  await p.goto(`${base}/year/${y}`); await p.waitForTimeout(2600);
  await p.screenshot({ path: `${out}/y${y}-title.png` });
  await toChapter(p, "fall"); await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/y${y}-fall.png` });
  await p.mouse.wheel(0, 700); await p.waitForTimeout(1200);
  await p.screenshot({ path: `${out}/y${y}-fall-modules.png` });
}
for (const r of ["about", "stats", "map", "timeline", "year/1999"]) { await p.goto(`${base}/${r}`); await p.waitForTimeout(1500); await p.screenshot({ path: `${out}/${r.replace("/", "-")}.png` }); }
await d.close();

const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const mp = await m.newPage();
await mp.goto(`${base}/`); await mp.waitForTimeout(1000); await mp.screenshot({ path: `${out}/m-hub.png` });
for (const y of [2005, 2024]) { await mp.goto(`${base}/year/${y}`); await mp.waitForTimeout(2400); await mp.screenshot({ path: `${out}/m-y${y}.png` }); await toChapter(mp, "summer"); await mp.waitForTimeout(1400); await mp.screenshot({ path: `${out}/m-y${y}-summer.png` }); }
await m.close(); await browser.close();
console.log("done");
