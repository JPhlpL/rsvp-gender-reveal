import { describe, expect, it } from "vitest";
import { guessLabel, plusOneSummary } from "./guest-labels";
import { makeResponse } from "@/test/factories";

describe("plusOneSummary", () => {
  it("shows a dash without an answer", () => {
    expect(plusOneSummary(null)).toBe("—");
  });

  it("shows a dash when nobody was requested", () => {
    expect(plusOneSummary(makeResponse())).toBe("—");
  });

  it("shows pending requests", () => {
    expect(plusOneSummary(makeResponse({ plus_one_count: 2, plus_one_status: "pending" }))).toBe(
      "+2 pending"
    );
  });

  it("shows the approved number, not the requested one", () => {
    expect(
      plusOneSummary(
        makeResponse({ plus_one_count: 3, plus_one_status: "approved", plus_one_approved_count: 1 })
      )
    ).toBe("+1 approved");
  });

  it("shows declined requests", () => {
    expect(
      plusOneSummary(
        makeResponse({ plus_one_count: 2, plus_one_status: "declined", plus_one_approved_count: 0 })
      )
    ).toBe("+2 declined");
  });
});

describe("guessLabel", () => {
  it.each([
    [makeResponse({ guess: "girl" }), "Girl"],
    [makeResponse({ guess: "boy" }), "Boy"],
    [makeResponse({ is_attending: false, guess: null }), "—"],
    [null, "—"],
  ] as const)("labels %#", (response, expected) => {
    expect(guessLabel(response)).toBe(expected);
  });
});
