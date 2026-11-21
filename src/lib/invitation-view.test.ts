import { describe, expect, it } from "vitest";
import { answerStatus, resolveInvitationView } from "./invitation-view";
import { makeResponse } from "@/test/factories";

const open = { rsvp_deadline: "2026-12-01T23:59:59+08:00", rsvp_closed: false };
const before = new Date("2026-11-21T00:00:00Z");
const after = new Date("2026-12-02T00:00:00+08:00");

describe("resolveInvitationView", () => {
  it("shows the answer even when RSVPs are closed", () => {
    const response = makeResponse();
    expect(resolveInvitationView(response, { ...open, rsvp_closed: true }, before)).toEqual({
      kind: "answered",
      response,
    });
  });

  it("shows the form while open", () => {
    expect(resolveInvitationView(null, open, before)).toEqual({ kind: "form" });
  });

  it("shows the closed card after the deadline", () => {
    expect(resolveInvitationView(null, open, after)).toEqual({
      kind: "closed",
      reason: "deadline",
    });
  });
});

describe("answerStatus", () => {
  it.each([
    ["attending", makeResponse()],
    ["plus_pending", makeResponse({ plus_one_count: 2, plus_one_status: "pending" })],
    [
      "plus_approved",
      makeResponse({ plus_one_count: 2, plus_one_status: "approved", plus_one_approved_count: 1 }),
    ],
    [
      "plus_declined",
      makeResponse({ plus_one_count: 2, plus_one_status: "declined", plus_one_approved_count: 0 }),
    ],
    ["not_attending", makeResponse({ is_attending: false, guess: null })],
  ] as const)("maps to %s", (expected, response) => {
    expect(answerStatus(response)).toBe(expected);
  });
});
