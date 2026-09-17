/**
 * Smoothness, measured. Scrolls a full year with wheel events and fires rapid arrow-key year changes,
 * recording every frame delta with requestAnimationFrame and every layout shift with PerformanceObserver.
 * Usage: BASE=http://localhost:3000 node scripts/scroll-perf.mjs [years]   (default 2005,2012,2024)
 */
import { chromium } from "@playwright/test";
const base = process.env.BASE ?? "http://localhost:3000";
const years = (process.argv[2] ?? "2005,2012,2024").split(",").map(Number);
const browser = await chromium.launch({ args: ["--enable-gpu", "--ignore-gpu-blocklist", "--use-angle=metal", "--enable-features=Vulkan"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const startProbe = () => page.evaluate(() => {
  const w = window;
  w.__f = []; w.__ls = 0; w.__run = true; w.__vis = 0;
  let last = performance.now();
  const tick = (t) => { const d = t - last; w.__f.push(d); last = t; if (d > 50) { const p = document.querySelector('.year-wash')?.dataset.phase; if (p !== 'hold' && p !== 'in') w.__vis++; } if (w.__run) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  if (!w.__po) { w.__po = new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) w.__ls += e.value; }); w.__po.observe({ type: "layout-shift", buffered: false }); }
});
const stopProbe = () => page.evaluate(() => {
  const w = window; w.__run = false;
  const f = w.__f.slice(2).sort((a, b) => a - b);
  const n = f.length || 1;
  const over = (ms) => f.filter((x) => x > ms).length;
  return { frames: n, avg: +(f.reduce((a, b) => a + b, 0) / n).toFixed(1), p95: +f[Math.floor(n * 0.95)].toFixed(1), max: +f[n - 1].toFixed(1), janky: +((over(25) / n) * 100).toFixed(1), long: over(50), visibleLong: w.__vis, cls: +w.__ls.toFixed(4) };
});

const rows = [];
for (const y of years) {
  await page.goto(`${base}/year/${y}`);
  await page.waitForTimeout(3000);
  await page.mouse.move(720, 500);
  await startProbe();
  for (let i = 0; i < 90; i++) { await page.mouse.wheel(0, 160); await page.waitForTimeout(16); }
  await page.waitForTimeout(600);
  rows.push({ test: `scroll ${y}`, ...(await stopProbe()) });

  await page.goto(`${base}/year/${y}`);
  await page.waitForTimeout(2500);
  await page.mouse.wheel(0, 900); await page.waitForTimeout(150);
  await startProbe();
  const dir = y >= 2020 ? "ArrowLeft" : "ArrowRight";
  for (let i = 0; i < 6; i++) { await page.keyboard.press(dir); await page.waitForTimeout(450); }
  await page.waitForTimeout(500);
  const r = await stopProbe();
  const scrollY = await page.evaluate(() => Math.round(window.scrollY));
  rows.push({ test: `6 year changes from ${y}`, ...r, endScrollY: scrollY });
}
console.table(rows);
const gpu = await page.evaluate(() => { const c = document.createElement("canvas").getContext("webgl2"); const e = c?.getExtension("WEBGL_debug_renderer_info"); return e ? c.getParameter(e.UNMASKED_RENDERER_WEBGL) : "unknown"; });
console.log("renderer:", gpu);
await browser.close();
