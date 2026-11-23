import { describe, expect, it } from "vitest";
import { BABY_PATTERN, buildBabyPattern } from "./baby-pattern";

const inDesktopMargins = (x: number) => (x >= 1 && x <= 27) || (x >= 73 && x <= 99);
const atPhoneEdges = (x: number) => (x >= 0 && x <= 7) || (x >= 93 && x <= 100);

describe("buildBabyPattern", () => {
  it("lays out the same items on every render, so server and browser match", () => {
    expect(buildBabyPattern()).toEqual(buildBabyPattern());
    expect(BABY_PATTERN).toEqual(buildBabyPattern());
  });

  it("scatters items down the whole page, on both sides", () => {
    expect(BABY_PATTERN.length).toBeGreaterThanOrEqual(30);
    for (let band = 0; band < 10; band++) {
      const inBand = BABY_PATTERN.filter((i) => i.top >= band * 10 && i.top < band * 10 + 10);
      expect(inBand.some((i) => i.left < 50)).toBe(true);
      expect(inBand.some((i) => i.left > 50)).toBe(true);
    }
  });

  it("keeps items in the side margins on wide screens, clear of the invitation column", () => {
    expect(BABY_PATTERN.every((i) => inDesktopMargins(i.left))).toBe(true);
  });

  it("pushes items to the very edges on phones", () => {
    expect(BABY_PATTERN.every((i) => atPhoneEdges(i.leftMobile))).toBe(true);
  });

  it("uses pink and blue equally", () => {
    const pink = BABY_PATTERN.filter((i) => i.tone === "pink").length;
    const blue = BABY_PATTERN.filter((i) => i.tone === "blue").length;
    expect(pink).toBeGreaterThan(0);
    expect(pink).toBe(blue);
  });

  it("mixes several kinds of baby items", () => {
    expect(new Set(BABY_PATTERN.map((i) => i.kind)).size).toBeGreaterThanOrEqual(6);
  });
});
