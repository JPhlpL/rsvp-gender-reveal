import { describe, expect, it } from "vitest";
import {
  deadlineFromManilaDate,
  formatDeadlineDateManila,
  formatDeadlineManila,
  isRsvpOpen,
  manilaDateFromDeadline,
  rsvpClosedReason,
} from "./rsvp-window";

const s = { rsvp_deadline: "2026-12-01T23:59:59+08:00", rsvp_closed: false };

describe("isRsvpOpen", () => {
  it("is open one second before the deadline", () => {
    expect(isRsvpOpen(s, new Date("2026-12-01T15:59:59Z"))).toBe(true);
  });

  it("boundary evaluated in Manila regardless of server zone", () => {
    expect(isRsvpOpen(s, new Date("2026-12-01T16:00:00Z"))).toBe(false);
  });

  it("stays open forever without a deadline", () => {
    expect(isRsvpOpen({ ...s, rsvp_deadline: null }, new Date("2030-01-01Z"))).toBe(true);
  });

  it("is closed when closed manually, even before the deadline", () => {
    expect(isRsvpOpen({ ...s, rsvp_closed: true }, new Date("2026-11-21Z"))).toBe(false);
  });
});

describe("rsvpClosedReason", () => {
  it("prefers manual when both apply", () => {
    expect(rsvpClosedReason({ ...s, rsvp_closed: true }, new Date("2026-12-10Z"))).toBe("manual");
  });

  it("reports the deadline once it has passed", () => {
    expect(rsvpClosedReason(s, new Date("2026-12-02T00:00:00+08:00"))).toBe("deadline");
  });

  it("is null while open", () => {
    expect(rsvpClosedReason(s, new Date("2026-11-21Z"))).toBeNull();
  });
});

describe("deadlineFromManilaDate", () => {
  it("returns the last second of that day in Manila", () => {
    expect(deadlineFromManilaDate("2026-12-01")).toBe("2026-12-01T23:59:59+08:00");
  });

  it("rejects impossible dates", () => {
    expect(() => deadlineFromManilaDate("2026-02-30")).toThrow(RangeError);
  });

  it("rejects other formats", () => {
    expect(() => deadlineFromManilaDate("12/01/2026")).toThrow(RangeError);
  });
});

describe("manilaDateFromDeadline", () => {
  it("returns the Manila calendar date even though the instant is Dec 1 15:59Z", () => {
    expect(manilaDateFromDeadline("2026-12-01T23:59:59+08:00")).toBe("2026-12-01");
  });

  it("handles the UTC form Postgres returns", () => {
    expect(manilaDateFromDeadline("2026-12-01T15:59:59+00:00")).toBe("2026-12-01");
  });
});

describe("formatting", () => {
  it("formats the deadline date in Manila", () => {
    expect(formatDeadlineDateManila(s.rsvp_deadline)).toBe("Tuesday, December 1");
  });

  it("formats the deadline date and time in Manila with plain spaces", () => {
    expect(formatDeadlineManila(s.rsvp_deadline)).toBe("Tuesday, December 1, 11:59 PM");
  });
});
