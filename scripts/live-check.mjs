import { chromium } from "@playwright/test";
const base = process.env.BASE ?? "https://ethan-goldstein.github.io/archive";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(String(e)));
for (const y of [2005, 2015, 2026]) {
  const res = await p.goto(`${base}/year/${y}/`); await p.waitForTimeout(2500);
  const info = await p.evaluate(() => ({ era: document.querySelector('main')?.dataset.era, nav: !!document.querySelector('.site-nav'), chrome: document.querySelectorAll('.os-window, .sky').length, canvas: !!document.querySelector("main canvas"), chapters: document.querySelectorAll("[data-chapter]").length, lenis: document.documentElement.classList.contains("lenis"), overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth }));
  console.log(y, res?.status(), JSON.stringify(info));
}
const h = await p.goto(`${base}/`); await p.waitForTimeout(1200);
console.log("hub", h?.status(), await p.evaluate(() => document.querySelectorAll("a.yc").length), "cards");
const t = await p.goto(`${base}/timeline/`); await p.waitForTimeout(2000);
console.log("timeline", t?.status(), await p.evaluate(() => !!document.querySelector("main canvas")));
console.log("page errors:", errors.length ? errors : "none");
await browser.close();
