import { describe, expect, it } from "vitest";
import { calculatePartyStats } from "./statistics";
import { makeGuestRow, makeResponse } from "@/test/factories";

describe("calculatePartyStats", () => {
  it("counts guests, headcount and guesses", () => {
    const rows = [
      makeGuestRow({
        id: "A",
        attendance_status: "attending",
        response: makeResponse({
          guess: "girl",
          plus_one_count: 2,
          plus_one_status: "approved",
          plus_one_approved_count: 2,
        }),
      }),
      makeGuestRow({
        id: "B",
        attendance_status: "attending",
        response: makeResponse({ guess: "boy", plus_one_count: 3, plus_one_status: "pending" }),
      }),
      makeGuestRow({
        id: "C",
        attendance_status: "attending",
        response: makeResponse({ guess: "girl" }),
      }),
      makeGuestRow({
        id: "D",
        attendance_status: "not_attending",
        response: makeResponse({ is_attending: false, guess: null }),
      }),
      makeGuestRow({ id: "E" }),
    ];

    expect(calculatePartyStats(rows)).toEqual({
      invited: 5,
      attending: 3,
      notAttending: 1,
      noAnswer: 1,
      approvedPlusOnes: 2,
      expectedHeadcount: 5,
      teamPink: 2,
      teamBlue: 1,
    });
  });

  it("is all zeros for an empty list", () => {
    expect(calculatePartyStats([])).toMatchObject({
      invited: 0,
      expectedHeadcount: 0,
      teamPink: 0,
      teamBlue: 0,
    });
  });
});
