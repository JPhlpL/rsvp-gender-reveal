import { describe, expect, it } from "vitest";
import { dressCodeFor } from "./dress-code";

describe("dressCodeFor", () => {
  it("tells girl guessers to wear pink", () => {
    expect(dressCodeFor("girl")).toBe("Wear pink!");
  });

  it("tells boy guessers to wear blue", () => {
    expect(dressCodeFor("boy")).toBe("Wear blue!");
  });

  it("says nothing before a guess is picked", () => {
    expect(dressCodeFor(null)).toBeNull();
    expect(dressCodeFor(undefined)).toBeNull();
  });
});
