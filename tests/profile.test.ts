import { describe, expect, it } from "vitest";
import { profileForYear } from "@/lib/three/profile";

describe("render profile", () => {
  it("starts pixelated and flat, ends cinematic", () => {
    const a = profileForYear(2005), z = profileForYear(2026);
    expect(a.pixelSize).toBeGreaterThan(0);
    expect(a.posterize).toBeGreaterThan(0);
    expect(a.material).toBe("flat");
    expect(z.pixelSize).toBe(0);
    expect(z.material).toBe("cinematic");
    expect(z.dof).toBe(true);
    expect(z.techLevel).toBe(1);
  });

  it("slides within an era instead of snapping", () => {
    const y09 = profileForYear(2009), y12 = profileForYear(2012);
    expect(y09.material).toBe(y12.material);
    expect(y12.bloom).not.toBe(y09.bloom);
    expect(y09.eraT).toBe(0);
    expect(y12.eraT).toBe(1);
  });
});
