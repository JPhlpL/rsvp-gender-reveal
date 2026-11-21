import { describe, expect, it } from "vitest";
import { isAdminEmail, parseAdminEmails } from "./admin-emails";

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
