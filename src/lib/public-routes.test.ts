import { describe, expect, it } from "vitest";
import { isPublicRoute } from "./public-routes";

describe("isPublicRoute", () => {
  it("lets anyone open the showcase invitation", () => {
    expect(isPublicRoute("/invitation")).toBe(true);
  });

  it("keeps guest links and the login page public", () => {
    expect(isPublicRoute("/rsvp/ana-11111111-1111-4111-8111-111111111111")).toBe(true);
    expect(isPublicRoute("/login")).toBe(true);
    expect(isPublicRoute("/opengraph-image")).toBe(true);
  });

  it("keeps the dashboard private", () => {
    expect(isPublicRoute("/dashboard")).toBe(false);
    expect(isPublicRoute("/dashboard/guests")).toBe(false);
  });

  it("matches whole path segments only", () => {
    expect(isPublicRoute("/invitations-admin")).toBe(false);
    expect(isPublicRoute("/rsvpx")).toBe(false);
  });
});
