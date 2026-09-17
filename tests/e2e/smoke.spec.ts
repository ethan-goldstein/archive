import { test, expect, type Page } from "@playwright/test";

/** Hydration marker: SettingsSync stamps data-sound on <html> from its first effect on every page. */
async function hydrated(page: Page) {
  await page.locator("html[data-sound]").waitFor({ timeout: 15_000 });
}

async function noHorizontalOverflow(page: Page) {
  const { sw, cw } = await page.evaluate(() => ({
    sw: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    cw: document.documentElement.clientWidth,
  }));
  expect(sw, "page must not scroll horizontally").toBeLessThanOrEqual(cw + 1);
}

test.describe("routes", () => {
  for (const path of ["/", "/year/2005", "/year/2012", "/year/2019", "/year/2026", "/timeline", "/search", "/about", "/stats", "/map", "/backyard"]) {
    test(`${path} renders without horizontal overflow`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await page.waitForLoadState("networkidle");
      await noHorizontalOverflow(page);
    });
  }

  test("years outside the archive 404", async ({ page }) => {
    const res = await page.goto("/year/2004");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Nothing is filed here." })).toBeVisible();
  });
});

test.describe("year system", () => {
  test("arrow keys travel and the URL follows, back returns", async ({ page }) => {
    await page.goto("/year/2008");
    await expect(page.locator("main")).toHaveAttribute("data-era", "xp");
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/\/year\/2009$/);
    await expect(page.locator("main")).toHaveAttribute("data-era", "aero");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("2009");
    await page.goBack();
    await expect(page).toHaveURL(/\/year\/2008$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("2008");
  });

  test("clicking a strip year changes the page in place", async ({ page }) => {
    await page.goto("/year/2015");
    await page.getByRole("tab", { name: "2021" }).click();
    await expect(page).toHaveURL(/\/year\/2021$/);
    await expect(page.locator("main")).toHaveAttribute("data-era", "glass");
  });

  test("age and birthplace are correct for 2005", async ({ page }) => {
    await page.goto("/year/2005");
    await expect(page.getByText("Potomac, Maryland").first()).toBeVisible();
    await expect(page.getByText("Born this year")).toBeVisible();
  });
});

test.describe("search", () => {
  test("the palette finds a cultural item and navigates", async ({ page }) => {
    await page.goto("/year/2010");
    await hydrated(page);
    await page.keyboard.press("ControlOrMeta+k");
    const input = page.getByRole("dialog", { name: "Search the archive" }).getByRole("textbox");
    await expect(input).toBeFocused();
    await input.fill("Skyrim");
    await expect(page.getByRole("option").first()).toContainText("Skyrim");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/year\/2011#games$/);
  });
});

test.describe("hub", () => {
  test("opens straight onto all 22 years, with no gate and no audio", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    await expect(page.getByRole("heading", { level: 1, name: "Ethan Goldstein" })).toBeVisible();
    await expect(page.getByRole("button", { name: /enter/i })).toHaveCount(0);
    await expect(page.locator("a.yc")).toHaveCount(22);
    const playing = await page.evaluate(() => Array.from(document.querySelectorAll("audio")).some((a) => !a.paused));
    expect(playing).toBe(false);
    await page.locator("a.yc", { hasText: "2013" }).click();
    await expect(page).toHaveURL(/\/year\/2013$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("2013");
  });
});

test.describe("navigation", () => {
  test("one clean nav on every route, and search opens by click", async ({ page }) => {
    for (const path of ["/", "/year/2012", "/timeline", "/map", "/stats", "/about", "/backyard"]) {
      await page.goto(path);
      await expect(page.getByRole("link", { name: /Ethan Goldstein, archive home/ })).toBeVisible();
      await expect(page.locator(".os-window, .os-title, .sky")).toHaveCount(path === "/backyard" ? await page.locator(".os-window, .os-title").count() : 0);
    }
    await page.goto("/year/2012");
    await hydrated(page);
    await page.getByRole("button", { name: "Search the archive" }).click();
    await expect(page.getByRole("dialog", { name: "Search the archive" }).getByRole("textbox")).toBeFocused();
  });
});

test.describe("backyard baseball", () => {
  test("loads, drafts a team, and a pitch can be swung at", async ({ page }) => {
    await page.goto("/backyard");
    await expect(page.getByRole("heading", { name: /potomac sandlot/i })).toBeVisible();
    await page.getByRole("button", { name: /play ball/i }).click();
    for (let i = 0; i < 7; i++) {
      const card = page.getByRole("button", { name: /^Draft / }).first();
      await expect(card).toBeEnabled({ timeout: 10000 });
      await card.click();
    }
    await page.getByRole("button", { name: /take the field/i }).click({ timeout: 10000 });
    const field = page.getByRole("img", { name: /baseball field/i });
    await expect(field).toBeAttached();
    // you are the home team, so you pitch first: start the meter, then release
    const pitch = page.getByRole("button", { name: /^Pitch/ });
    await expect(pitch).toBeVisible({ timeout: 20000 });
    await pitch.dispatchEvent("pointerdown");
    await page.waitForTimeout(300);
    await pitch.dispatchEvent("pointerdown");
    // the HUD result line leaves "Play ball!" once the pitch resolves
    const result = page.locator("[aria-live='polite'] p").nth(1);
    await expect(result).not.toHaveText(/Play ball/, { timeout: 20000 });
  });
});

test.describe("memory map", () => {
  test("pins Potomac and links to 2005", async ({ page }) => {
    await page.goto("/map");
    await expect(page.getByRole("img", { name: /Shady Grove Hospital/ })).toBeVisible();
    await page.getByRole("link", { name: "2005" }).first().click();
    await expect(page).toHaveURL(/\/year\/2005$/);
  });
});

test.describe("seasons", () => {
  test("a year scrolls through its chapters in order and the era follows the year", async ({ page }) => {
    await page.goto("/year/2015");
    const ids = await page.locator("[data-chapter]").evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.chapter));
    expect(ids).toEqual(["title", "winter", "spring", "summer", "fall", "world"]);
    await expect(page.getByRole("heading", { level: 2, name: "Winter" })).toBeAttached();
    await expect(page.getByRole("heading", { level: 2, name: "Fall" })).toBeAttached();
    await expect(page.locator("main")).toHaveAttribute("data-era", "flat");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/\/year\/2017$/);
    await expect(page.locator("main")).toHaveAttribute("data-era", "dark");
    await noHorizontalOverflow(page);
  });

  test("a year change lands at the top and stays there", async ({ page }) => {
    await page.goto("/year/2014");
    await hydrated(page);
    await page.mouse.move(400, 500);
    await page.mouse.wheel(0, 2400);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(600);
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("2015");
    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(0);
    await page.waitForTimeout(700); // long enough for a fighting smooth scroll to snap back, if there were one
    expect(await page.evaluate(() => Math.round(window.scrollY))).toBe(0);
    await expect(page.locator(".year-wash")).toHaveCount(0);
  });

  test("nothing blurs or blends over the 3D canvas", async ({ page }) => {
    for (const year of [2010, 2024]) {
      await page.goto(`/year/${year}`);
      const bad = await page.evaluate(() => {
        const out: string[] = [];
        for (const el of Array.from(document.querySelectorAll<HTMLElement>("main *, header, .fx-layer"))) {
          const cs = getComputedStyle(el);
          const bf = cs.backdropFilter || (cs as unknown as Record<string, string>).webkitBackdropFilter;
          if (bf && bf !== "none") out.push(`backdrop-filter on .${el.className}`);
          if (cs.mixBlendMode !== "normal" && el.getBoundingClientRect().width > 600) out.push(`blend on .${el.className}`);
          if (cs.backgroundAttachment.includes("fixed")) out.push(`fixed background on .${el.className}`);
        }
        return out;
      });
      expect(bad, `year ${year}`).toEqual([]);
    }
  });

  test("the 3D layer mounts behind the year and the page still works without it", async ({ page }) => {
    await page.goto("/year/2010");
    await page.waitForLoadState("networkidle");
    const canvases = await page.locator("main canvas").count();
    // Headless GPUs vary; with WebGL there is exactly one canvas, without it the wallpaper shows and nothing breaks.
    expect(canvases).toBeLessThanOrEqual(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("2010");
    const world = page.getByRole("heading", { level: 2, name: "The world that year" });
    await world.scrollIntoViewIfNeeded();
    await expect(world).toBeInViewport();
  });
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });
  test("a year page renders its chapters without smooth scrolling", async ({ page }) => {
    await page.goto("/year/2019");
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
    await expect(page.getByRole("heading", { level: 2, name: "Summer" })).toBeAttached();
    await noHorizontalOverflow(page);
  });
});
