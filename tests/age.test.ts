import { describe, expect, it } from "vitest";
import { ageAt, ageInYear, ageLabel, lifeStageFor } from "@/lib/content/age";
import { ERAS, YEARS, clampYear, eraForYear, parseYearParam } from "@/lib/content/eras";

describe("age", () => {
  it("turns N in year 2005+N", () => {
    expect(ageInYear(2005)).toBe(0);
    expect(ageInYear(2012)).toBe(7);
    expect(ageInYear(2026)).toBe(21);
  });
  it("is exact around the birthday", () => {
    expect(ageAt(new Date(2023, 1, 9))).toBe(17);
    expect(ageAt(new Date(2023, 1, 10))).toBe(18);
    expect(ageAt(new Date(2023, 11, 31))).toBe(18);
  });
  it("labels 2005 as Born", () => {
    expect(ageLabel(2005)).toBe("Born");
    expect(ageLabel(2016)).toBe("Age 11");
  });
  it("assigns a life stage to every year", () => {
    for (const y of YEARS) expect(lifeStageFor(y).label).not.toBe("Unlabelled");
  });
});

describe("eras", () => {
  it("cover 2005–2026 contiguously with no gaps", () => {
    let expected = 2005;
    for (const era of ERAS) {
      expect(era.from).toBe(expected);
      expected = era.to + 1;
    }
    expect(expected).toBe(2027);
  });
  it("maps boundary years", () => {
    expect(eraForYear(2008).id).toBe("xp");
    expect(eraForYear(2009).id).toBe("aero");
    expect(eraForYear(2013).id).toBe("flat");
    expect(eraForYear(2017).id).toBe("dark");
    expect(eraForYear(2021).id).toBe("glass");
  });
  it("parses route params strictly", () => {
    expect(parseYearParam("2012")).toBe(2012);
    expect(parseYearParam("2004")).toBeNull();
    expect(parseYearParam("2027")).toBeNull();
    expect(parseYearParam("20a2")).toBeNull();
    expect(parseYearParam(undefined)).toBeNull();
    expect(clampYear(1999)).toBe(2005);
    expect(clampYear(2030.7)).toBe(2026);
  });
});
