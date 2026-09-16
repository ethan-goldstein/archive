/**
 * Visual check: screenshots of every key screen at desktop, phone, and tablet widths.
 * Usage: npm run start (in another terminal), then: node scripts/screenshots.mjs <output-dir>
 */
import { chromium } from "@playwright/test";
const out = process.argv[2];
const base = "http://localhost:3000";
const browser = await chromium.launch();
const shot = async (page, name, opts = {}) => page.screenshot({ path: `${out}/${name}.png`, ...opts });

// Desktop
const d = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
let p = await d.newPage();
await p.goto(`${base}/`); await p.waitForTimeout(800); await shot(p, "01-intro-off");
await p.keyboard.press("Space"); await p.waitForTimeout(2600); await shot(p, "02-intro-ready");
await p.getByRole("button", { name: /enter the archive/i }).click(); await p.waitForURL(/year\/2005/); await p.waitForTimeout(900);
await shot(p, "03-year-2005", { fullPage: true });
for (const y of [2010, 2015, 2019, 2024]) {
  await p.goto(`${base}/year/${y}`); await p.waitForTimeout(900); await shot(p, `04-year-${y}`, { fullPage: true });
}
await p.goto(`${base}/year/2012`); await p.waitForTimeout(700);
await p.keyboard.press("ArrowRight"); await p.waitForTimeout(1200); await shot(p, "05-year-2013-after-arrow");
await p.keyboard.press("ControlOrMeta+k"); await p.waitForTimeout(400); await p.keyboard.type("minecraft"); await p.waitForTimeout(500); await shot(p, "06-palette");
await p.keyboard.press("Escape"); await p.waitForTimeout(400);
await p.getByRole("button", { name: "Music" }).first().click(); await p.waitForTimeout(600); await shot(p, "07-player-drawer-aero");
await p.keyboard.press("Escape"); await p.waitForTimeout(300);
await p.goto(`${base}/timeline`); await p.waitForTimeout(900); await shot(p, "08-timeline");
await p.keyboard.press("End"); await p.waitForTimeout(1500); await shot(p, "09-timeline-2026");
await p.goto(`${base}/about`); await p.waitForTimeout(700); await shot(p, "10-about", { fullPage: true });
await p.goto(`${base}/year/2004`); await p.waitForTimeout(500); await shot(p, "11-404");
await d.close();

// Phone
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
p = await m.newPage();
await p.goto(`${base}/`); await p.waitForTimeout(700); await shot(p, "20-m-intro");
await p.goto(`${base}/year/2005`); await p.waitForTimeout(900); await shot(p, "21-m-2005", { fullPage: true });
await p.goto(`${base}/year/2016`); await p.waitForTimeout(900); await shot(p, "22-m-2016", { fullPage: true });
await p.goto(`${base}/year/2023`); await p.waitForTimeout(900); await shot(p, "23-m-2023");
await p.goto(`${base}/timeline`); await p.waitForTimeout(900); await shot(p, "24-m-timeline");
await m.close();

// Tablet
const t = await browser.newContext({ viewport: { width: 768, height: 1024 }, deviceScaleFactor: 1 });
p = await t.newPage();
await p.goto(`${base}/year/2019`); await p.waitForTimeout(900); await shot(p, "30-t-2019", { fullPage: true });
await t.close();
await browser.close();
console.log("done");
