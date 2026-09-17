import { test, expect, type Page } from "@playwright/test";

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
    await expect(page.getByText("moved or deleted")).toBeVisible();
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
    await page.keyboard.press("ControlOrMeta+k");
    const input = page.getByRole("dialog", { name: "Search the archive" }).getByRole("textbox");
    await expect(input).toBeFocused();
    await input.fill("Skyrim");
    await expect(page.getByRole("option").first()).toContainText("Skyrim");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/year\/2011#games$/);
  });
});

test.describe("intro", () => {
  test("no audio plays before a gesture and enter leads to 2005", async ({ page }) => {
    await page.goto("/");
    const playing = await page.evaluate(() => Array.from(document.querySelectorAll("audio")).some((a) => !a.paused));
    expect(playing).toBe(false);
    await page.keyboard.press("Space");
    await page.getByRole("button", { name: /enter the archive/i }).click();
    await expect(page).toHaveURL(/\/year\/2005$/);
  });
});

test.describe("browser frame", () => {
  test("menu bar opens by keyboard and the OS toggle flips the skin", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "phone", "desktop chrome only");
    await page.goto("/year/2012");
    await page.getByRole("menuitem", { name: "View" }).click();
    await expect(page.getByRole("menu", { name: "View" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu", { name: "View" })).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute("data-frame", "aero");
    await page.getByRole("button", { name: /Auto UI/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-frame", "xp");
    await expect(page.locator("html")).toHaveAttribute("data-os", "win");
    await page.getByRole("button", { name: /Win 98/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-os", "mac");
    await page.getByRole("button", { name: /Mac OS/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-frame", "aero");
  });

  test("the address bar navigates to a typed year", async ({ page }) => {
    await page.goto("/year/2012");
    const address = page.getByRole("textbox", { name: "Address" });
    await address.fill("2019");
    await address.press("Enter");
    await expect(page).toHaveURL(/\/year\/2019$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("2019");
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

test.describe("draggable windows", () => {
  test("a window moves when its title bar is dragged in the xp era", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop only");
    await page.goto("/year/2006");
    const win = page.locator("#photos");
    await win.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const chrome = win.locator(".surface-chrome");
    const before = await win.boundingBox();
    const box = await chrome.boundingBox();
    await page.mouse.move(box!.x + 40, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + 140, box!.y + 80, { steps: 8 });
    await page.mouse.up();
    const after = await win.boundingBox();
    expect(Math.abs(after!.x - before!.x)).toBeGreaterThan(50);
  });
});

test.describe("seasons and frames", () => {
  test("a year scrolls through its chapters in order and the frame follows the era", async ({ page }) => {
    await page.goto("/year/2015");
    const ids = await page.locator("[data-chapter]").evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.chapter));
    expect(ids).toEqual(["title", "winter", "spring", "summer", "fall", "world"]);
    await expect(page.getByRole("heading", { level: 2, name: "Winter" })).toBeAttached();
    await expect(page.getByRole("heading", { level: 2, name: "Fall" })).toBeAttached();
    await expect(page.locator("html")).toHaveAttribute("data-frame", "flat");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/\/year\/2017$/);
    await expect(page.locator("html")).toHaveAttribute("data-frame", "dark");
    await noHorizontalOverflow(page);
  });

  test("2026 drops the window chrome for the spatial capsule", async ({ page }) => {
    await page.goto("/year/2026");
    await expect(page.locator("html")).toHaveAttribute("data-frame", "spatial");
    await expect(page.locator(".os-window .os-title")).toBeHidden();
    await expect(page.getByRole("textbox", { name: "Address" })).toBeVisible();
    await noHorizontalOverflow(page);
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
