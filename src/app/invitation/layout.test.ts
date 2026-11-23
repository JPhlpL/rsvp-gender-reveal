import { describe, expect, it } from "vitest";
import { metadata } from "./layout";

describe("showcase invitation metadata", () => {
  it("stays out of search results like the guest pages", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
