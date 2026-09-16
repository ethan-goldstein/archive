/** Screenshots of the game scenes: node scripts/game-shots.mjs <dir> */
import { chromium } from "@playwright/test";
const out = process.argv[2]; const base = "http://localhost:3000";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const logs = []; p.on("pageerror", (e) => logs.push(e.message)); p.on("console", (m) => { if (m.type() === "error") logs.push(m.text()); });
await p.goto(`${base}/backyard`); await p.waitForTimeout(800); await p.screenshot({ path: `${out}/g1-title.png` });
await p.getByRole("button", { name: /play ball/i }).click(); await p.waitForTimeout(600); await p.screenshot({ path: `${out}/g2-draft.png`, fullPage: true });
for (let i = 0; i < 7; i++) { await p.waitForFunction(() => !!document.querySelector('button[aria-label^="Draft "]:not([disabled])'), null, { timeout: 10000 }); await p.locator('button[aria-label^="Draft "]:not([disabled])').first().click(); await p.waitForTimeout(900); }
await p.getByRole("button", { name: /take the field/i }).click({ timeout: 10000 }); await p.waitForTimeout(1500); await p.screenshot({ path: `${out}/g3-play.png` });
await p.waitForTimeout(6000); await p.screenshot({ path: `${out}/g4-play-later.png` });
const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(`${base}/backyard`); await m.waitForTimeout(800); await m.screenshot({ path: `${out}/g5-m-title.png`, fullPage: true });
console.log(JSON.stringify({ logs })); await b.close();
