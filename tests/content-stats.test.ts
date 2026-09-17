import { describe, expect, it } from "vitest";
import { computeStats } from "@/lib/content/stats";

describe("stats", () => {
  it("counts only real content and reports placeholders as slots", () => {
    const s = computeStats();
    expect(s.years).toBe(22);
    expect(s.milestones).toBeGreaterThanOrEqual(15); // births, moves, schools
    expect(s.memories).toBeGreaterThanOrEqual(12);
    expect(s.slotsLeft).toBeGreaterThan(100);
    expect(s.culturalNotes).toBeGreaterThan(1000);
    expect(s.byEra.length).toBe(5);
  });
});
