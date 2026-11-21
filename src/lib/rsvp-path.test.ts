import { describe, expect, it } from "vitest";
import {
  parseGuestUuidFromRsvpParam,
  rsvpPathSegment,
  rsvpSlugsMatch,
} from "./rsvp-path";

const U = "1a2b3c4d-1111-4222-8333-123456789abc";

describe("rsvpPathSegment", () => {
  it("joins the slugified name and the uuid", () => {
    expect(rsvpPathSegment("Maria Santos", U)).toBe(`maria-santos-${U}`);
  });

  it("strips accents and emoji", () => {
    expect(rsvpPathSegment("Ñiño 👶", U)).toBe(`nino-${U}`);
  });

  it("falls back to 'guest' when nothing usable is left", () => {
    expect(rsvpPathSegment("!!!", U)).toBe(`guest-${U}`);
  });
});

describe("parseGuestUuidFromRsvpParam", () => {
  it("reads the uuid from a name-uuid segment and lowercases it", () => {
    expect(parseGuestUuidFromRsvpParam(`maria-santos-${U.toUpperCase()}`)).toBe(U);
  });

  it("accepts a bare uuid", () => {
    expect(parseGuestUuidFromRsvpParam(U)).toBe(U);
  });

  it("returns null when there is no uuid", () => {
    expect(parseGuestUuidFromRsvpParam("hello")).toBeNull();
  });

  it("returns null for malformed percent-encoding", () => {
    expect(parseGuestUuidFromRsvpParam("%E0%A4%A")).toBeNull();
  });
});

describe("rsvpSlugsMatch", () => {
  it("ignores case", () => {
    expect(rsvpSlugsMatch(`Maria-Santos-${U}`, `maria-santos-${U}`)).toBe(true);
  });
});
