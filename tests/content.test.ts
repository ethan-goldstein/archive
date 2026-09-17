import { describe, expect, it } from "vitest";
import { getAllYears, getYear } from "@/lib/content/getYear";
import { isPlaceholder } from "@/lib/content/placeholders";
import { YEARS } from "@/lib/content/eras";

describe("content", () => {
  const years = getAllYears();

  it("has all 22 years", () => {
    expect(years.map((y) => y.year)).toEqual(YEARS);
  });

  it("derives age and era", () => {
    const y = getYear(2012);
    expect(y.age).toBe(7);
    expect(y.era).toBe("aero");
    expect(y.mode).toBe("full");
    expect(getYear(2006).mode).toBe("fragment");
  });

  it("keeps every year's location as a real fact with no house numbers", () => {
    expect(getYear(2005).location).toBe("Olney, Maryland");
    expect(getYear(2014).location).toBe("Paddock Lane, Cold Spring, Potomac");
    for (const y of years) {
      expect(isPlaceholder(y.location)).toBe(false);
      expect(String(y.location)).not.toMatch(/\d{3,}/);
    }
  });

  it("never marks cultural tracks as personal", () => {
    for (const y of years) for (const t of y.culture.music) expect(t.personal).toBe(false);
  });

  it("has unique ids across all cultural tracks and personal entries", () => {
    const ids = new Set<string>();
    for (const y of years) {
      for (const t of y.culture.music) {
        expect(ids.has(t.id), `duplicate id ${t.id}`).toBe(false);
        ids.add(t.id);
      }
      for (const m of y.personal.memories) {
        const id = isPlaceholder(m) ? m.id : m.id;
        if (!id) continue;
        expect(ids.has(id), `duplicate id ${id}`).toBe(false);
        ids.add(id);
      }
    }
  });

  it("gives every year cultural context in every category", () => {
    for (const y of years) {
      expect(y.culture.internet.length, `${y.year} internet`).toBeGreaterThan(0);
      expect(y.culture.tech.length, `${y.year} tech`).toBeGreaterThan(0);
      expect(y.culture.games.length, `${y.year} games`).toBeGreaterThan(0);
      expect(y.culture.onScreen.length, `${y.year} onScreen`).toBeGreaterThan(0);
      expect(y.culture.music.length, `${y.year} music`).toBeGreaterThan(0);
      expect(y.culture.culture.length, `${y.year} culture`).toBeGreaterThan(0);
      expect(y.culture.capsule.length, `${y.year} capsule`).toBeGreaterThan(0);
    }
  });
});
