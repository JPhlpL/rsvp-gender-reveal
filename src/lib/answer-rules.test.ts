import { describe, expect, it } from "vitest";
import { plusOneDecision, toAdminResponseFields, toGuestResponseInsert } from "./answer-rules";
import type { RsvpAnswer } from "@/schemas/rsvp";

const attending = (count: number, names: string | null = null): RsvpAnswer => ({
  is_attending: true,
  name: "Ana",
  guess: "girl",
  plus_one_count: count,
  plus_one_names: names,
  message: null,
});

const cleared = {
  is_attending: false,
  guess: null,
  plus_one_count: 0,
  plus_one_names: null,
  plus_one_status: "none",
  plus_one_approved_count: null,
};

describe("toGuestResponseInsert", () => {
  it("not attending clears guess and plus-ones", () => {
    expect(
      toGuestResponseInsert("g1", {
        is_attending: false,
        name: "Ana",
        guess: "boy",
        plus_one_count: 2,
        plus_one_names: "Ben",
        message: "sorry",
      })
    ).toEqual({ guest_id: "g1", name: "Ana", message: "sorry", ...cleared });
  });

  it("marks requested plus-ones as pending", () => {
    expect(toGuestResponseInsert("g1", attending(2, "Ben, Cy"))).toMatchObject({
      plus_one_count: 2,
      plus_one_names: "Ben, Cy",
      plus_one_status: "pending",
      plus_one_approved_count: null,
    });
  });

  it("drops names when no plus-ones are requested", () => {
    expect(toGuestResponseInsert("g1", attending(0, "stray"))).toMatchObject({
      plus_one_count: 0,
      plus_one_names: null,
      plus_one_status: "none",
    });
  });

  it("stores a blank message as null", () => {
    expect(toGuestResponseInsert("g1", { ...attending(0), message: "" }).message).toBeNull();
  });
});

describe("toAdminResponseFields", () => {
  it("treats plus-ones entered by the admin as approved", () => {
    expect(toAdminResponseFields(attending(3, "A, B, C"))).toMatchObject({
      plus_one_status: "approved",
      plus_one_approved_count: 3,
    });
  });

  it("clears guess and plus-ones when not attending", () => {
    expect(toAdminResponseFields({ ...attending(2, "A, B"), is_attending: false })).toEqual({
      name: "Ana",
      message: null,
      ...cleared,
    });
  });

  it("uses status none for zero plus-ones", () => {
    expect(toAdminResponseFields(attending(0))).toMatchObject({
      plus_one_status: "none",
      plus_one_approved_count: null,
    });
  });
});

describe("plusOneDecision", () => {
  it("approves up to the requested count", () => {
    expect(plusOneDecision(3, { approve: true, count: 2 })).toEqual({
      plus_one_status: "approved",
      plus_one_approved_count: 2,
    });
  });

  it("declines with zero allowed", () => {
    expect(plusOneDecision(3, { approve: false })).toEqual({
      plus_one_status: "declined",
      plus_one_approved_count: 0,
    });
  });

  it("refuses more than requested", () => {
    expect(() => plusOneDecision(3, { approve: true, count: 4 })).toThrow(RangeError);
  });

  it("refuses approving zero", () => {
    expect(() => plusOneDecision(3, { approve: true, count: 0 })).toThrow(RangeError);
  });
});
