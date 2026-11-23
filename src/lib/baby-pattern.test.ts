import { describe, expect, it } from "vitest";
import { BABY_PATTERN, buildBabyPattern, type BabyPatternItem } from "./baby-pattern";

const atPhoneEdge = (i: BabyPatternItem) =>
  i.side === "left" ? i.leftMobile >= 0 && i.leftMobile <= 7 : i.leftMobile >= 93 && i.leftMobile <= 100;

/** Items of one lane (side + inner/outer), top to bottom. */
function lanes(items: readonly BabyPatternItem[]): BabyPatternItem[][] {
  const byLane = new Map<string, BabyPatternItem[]>();
  for (const item of items) {
    const key = `${item.side}-${item.across < 0.5 ? "outer" : "inner"}`;
    byLane.set(key, [...(byLane.get(key) ?? []), item]);
  }
  return [...byLane.values()].map((lane) => [...lane].sort((a, b) => a.top - b.top));
}

describe("buildBabyPattern", () => {
  it("lays out the same items on every render, so server and browser match", () => {
    expect(buildBabyPattern()).toEqual(buildBabyPattern());
    expect(BABY_PATTERN).toEqual(buildBabyPattern());
  });

  it("scatters plenty of items down the whole page, on both sides", () => {
    expect(BABY_PATTERN.length).toBeGreaterThanOrEqual(100);
    for (let band = 0; band < 10; band++) {
      const inBand = BABY_PATTERN.filter((i) => i.top >= band * 10 && i.top < band * 10 + 10);
      expect(inBand.some((i) => i.side === "left")).toBe(true);
      expect(inBand.some((i) => i.side === "right")).toBe(true);
    }
  });

  it("keeps items inside the side margins on wide screens, clear of the invitation column", () => {
    expect(BABY_PATTERN.every((i) => i.across >= 0.05 && i.across <= 0.95)).toBe(true);
  });

  it("fills each margin with an outer and an inner lane", () => {
    for (const side of ["left", "right"] as const) {
      const onSide = BABY_PATTERN.filter((i) => i.side === side);
      expect(onSide.some((i) => i.across < 0.5)).toBe(true);
      expect(onSide.some((i) => i.across > 0.5)).toBe(true);
    }
  });

  it("pushes items to the very edges on phones", () => {
    expect(BABY_PATTERN.every(atPhoneEdge)).toBe(true);
  });

  it("never piles items on top of each other within a lane", () => {
    for (const lane of lanes(BABY_PATTERN)) {
      for (let n = 1; n < lane.length; n++) {
        expect(lane[n].top - lane[n - 1].top).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("never repeats the same item twice in a row within a lane", () => {
    for (const lane of lanes(BABY_PATTERN)) {
      for (let n = 1; n < lane.length; n++) {
        expect(lane[n].kind).not.toBe(lane[n - 1].kind);
      }
    }
  });

  it("uses pink and blue equally", () => {
    const pink = BABY_PATTERN.filter((i) => i.tone === "pink").length;
    const blue = BABY_PATTERN.filter((i) => i.tone === "blue").length;
    expect(pink).toBeGreaterThan(0);
    expect(pink).toBe(blue);
  });

  it("mixes every kind of baby item, including the new ones", () => {
    const kinds = new Set(BABY_PATTERN.map((i) => i.kind));
    for (const kind of ["heart", "footprints", "sock", "teddy", "moon", "crib"] as const) {
      expect(kinds.has(kind)).toBe(true);
    }
    expect(kinds.size).toBeGreaterThanOrEqual(13);
  });
});
