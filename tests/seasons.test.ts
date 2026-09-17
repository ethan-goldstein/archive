import { describe, expect, it } from "vitest";
import { seasonOfDate, seasonOfMonth, sliceSeasons, splitBySeason, SEASONS } from "@/lib/content/seasons";
import { getYear } from "@/lib/content/getYear";
import { placeholder } from "@/lib/content/placeholders";

describe("seasons", () => {
  it("maps months to seasons with December in winter", () => {
    expect(seasonOfMonth(12)).toBe("winter");
    expect(seasonOfMonth(2)).toBe("winter");
    expect(seasonOfMonth(4)).toBe("spring");
    expect(seasonOfMonth(7)).toBe("summer");
    expect(seasonOfMonth(10)).toBe("fall");
  });

  it("reads ISO dates and month names, and gives up on bare years", () => {
    expect(seasonOfDate("2005-02-10")).toBe("winter");
    expect(seasonOfDate("2016-06")).toBe("summer");
    expect(seasonOfDate("October 2019")).toBe("fall");
    expect(seasonOfDate("2009")).toBeNull();
    expect(seasonOfDate("3rd grade (2013–14)")).toBeNull();
    expect(seasonOfDate(undefined)).toBeNull();
  });

  it("sends undated real entries to fall and spreads placeholders across chapters", () => {
    const entries = [
      { id: "a", date: undefined },
      placeholder("x", "memory", "p1"),
      placeholder("y", "memory", "p2"),
      { id: "b", date: "2010-05-01" },
    ];
    const split = splitBySeason(entries, (e) => e.date);
    expect(split.fall.map((e) => ("id" in e ? e.id : ""))).toContain("a");
    expect(split.spring.map((e) => ("id" in e ? e.id : ""))).toContain("b");
    expect(split.winter.length + split.spring.length).toBe(3);
  });

  it("slices a real year so the birthday lands in winter and every memory lands somewhere", () => {
    const y = getYear(2005);
    const slices = sliceSeasons(y);
    expect(slices.winter.data.personal.milestones.some((m) => "id" in m && m.id === "born")).toBe(true);
    const total = SEASONS.reduce((n, s) => n + slices[s].data.personal.memories.length, 0);
    expect(total).toBe(y.personal.memories.length);
    expect(slices.winter.data.personal.music).toEqual(y.personal.music);
  });
});
