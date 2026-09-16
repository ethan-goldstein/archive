import { describe, expect, it } from "vitest";
import { computeStats } from "@/lib/content/stats";

describe("stats", () => {
  it("counts only real content and reports placeholders as slots", () => {
    const s = computeStats();
    expect(s.years).toBe(22);
    expect(s.milestones).toBe(1); // the birth in 2005
    expect(s.memories).toBe(0);
    expect(s.slotsLeft).toBeGreaterThan(200);
    expect(s.culturalNotes).toBeGreaterThan(1000);
    expect(s.byEra.length).toBe(5);
  });
});
