import { describe, expect, it } from "vitest";
import { isAdminEmail, isAdminUser, parseAdminEmails } from "./admin-emails";

describe("parseAdminEmails", () => {
  it("trims, lowercases and drops empty entries", () => {
    expect(parseAdminEmails(" A@x.com, ,b@y.com ")).toEqual(["a@x.com", "b@y.com"]);
  });

  it("returns an empty list when unset", () => {
    expect(parseAdminEmails(undefined)).toEqual([]);
  });
});

describe("isAdminEmail", () => {
  it("matches case-insensitively", () => {
    expect(isAdminEmail("A@X.com", ["a@x.com"])).toBe(true);
  });

  it("rejects emails not on the list", () => {
    expect(isAdminEmail("c@z.com", ["a@x.com"])).toBe(false);
  });

  it("rejects a missing email", () => {
    expect(isAdminEmail(null, ["a@x.com"])).toBe(false);
  });

  it("lets nobody in when the list is empty", () => {
    expect(isAdminEmail("a@x.com", [])).toBe(false);
  });
});

describe("isAdminUser", () => {
  const list = ["a@x.com"];

  it("admits a listed email marked as admin by the setup script", () => {
    expect(isAdminUser({ email: "a@x.com", app_metadata: { role: "admin" } }, list)).toBe(true);
  });

  it("refuses a listed email without the admin mark (e.g. created by hand or self sign-up)", () => {
    expect(isAdminUser({ email: "a@x.com", app_metadata: {} }, list)).toBe(false);
  });

  it("refuses an admin-marked user whose email isn't listed", () => {
    expect(isAdminUser({ email: "c@z.com", app_metadata: { role: "admin" } }, list)).toBe(false);
  });

  it("refuses a missing user", () => {
    expect(isAdminUser(null, list)).toBe(false);
  });
});
