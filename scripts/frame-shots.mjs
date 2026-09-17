import { chromium } from "@playwright/test";
const out = process.argv[2]; const base = process.env.BASE;
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const d = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await d.newPage();
for (const y of [2005, 2010, 2015, 2019, 2024, 2026]) {
  await p.goto(`${base}/year/${y}`); await p.waitForTimeout(1800);
  await p.screenshot({ path: `${out}/f-${y}.png` });
  console.log(y, await p.evaluate(() => [document.documentElement.dataset.frame, document.documentElement.dataset.os, getComputedStyle(document.documentElement).getPropertyValue("--era-t"), document.documentElement.scrollWidth <= document.documentElement.clientWidth].join(" ")));
}
await p.goto(`${base}/year/2024`); await p.waitForTimeout(800);
await p.getByRole("menuitem", { name: "View" }).click(); await p.waitForTimeout(300); await p.screenshot({ path: `${out}/f-2024-menu.png` });
await p.keyboard.press("Escape");
await p.goto(`${base}/timeline`); await p.waitForTimeout(800); await p.screenshot({ path: `${out}/f-timeline.png` });
await d.close();
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const mp = await m.newPage();
for (const y of [2015, 2026]) { await mp.goto(`${base}/year/${y}`); await mp.waitForTimeout(1500); await mp.screenshot({ path: `${out}/m-${y}.png` }); }
await m.close(); await browser.close();
