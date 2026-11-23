import { describe, expect, it } from "vitest";
import { isEnvelopeOpen } from "./envelope";

describe("isEnvelopeOpen", () => {
  it("shows the envelope again on the showcase page even if it was opened before", () => {
    expect(isEnvelopeOpen({ remember: false, rememberedOpen: true, openedThisVisit: false })).toBe(false);
  });

  it("opens the showcase envelope once it's tapped on this visit", () => {
    expect(isEnvelopeOpen({ remember: false, rememberedOpen: false, openedThisVisit: true })).toBe(true);
  });

  it("skips the envelope on a guest link opened earlier in this browser session", () => {
    expect(isEnvelopeOpen({ remember: true, rememberedOpen: true, openedThisVisit: false })).toBe(true);
  });

  it("shows the envelope on a guest link the first time", () => {
    expect(isEnvelopeOpen({ remember: true, rememberedOpen: false, openedThisVisit: false })).toBe(false);
  });
});
