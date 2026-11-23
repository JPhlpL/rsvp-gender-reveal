import { describe, expect, it } from "vitest";
import { toAdminResponseFields, toGuestResponseInsert } from "./answer-rules";
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

  describe("with the guest's existing answer", () => {
    const existing = (
      plus_one_status: "pending" | "approved" | "declined",
      plus_one_approved_count: number | null
    ) => ({ is_attending: true, plus_one_count: 3, plus_one_status, plus_one_approved_count });

    it("keeps a pending request when the count is left as it was", () => {
      expect(toAdminResponseFields(attending(3, "A, B, C"), existing("pending", null))).toMatchObject({
        plus_one_status: "pending",
        plus_one_approved_count: null,
      });
    });

    it("keeps a partial approval when the count is left as it was", () => {
      expect(toAdminResponseFields(attending(3, "A, B, C"), existing("approved", 2))).toMatchObject({
        plus_one_status: "approved",
        plus_one_approved_count: 2,
      });
    });

    it("keeps a decline when the count is left as it was", () => {
      expect(toAdminResponseFields(attending(3, "A, B, C"), existing("declined", 0))).toMatchObject({
        plus_one_status: "declined",
        plus_one_approved_count: 0,
      });
    });

    it("approves a count the admin changed", () => {
      expect(toAdminResponseFields(attending(2, "A, B"), existing("pending", null))).toMatchObject({
        plus_one_status: "approved",
        plus_one_approved_count: 2,
      });
    });

    it("approves plus-ones for a guest who previously said no", () => {
      const declinedInvite = {
        is_attending: false,
        plus_one_count: 0,
        plus_one_status: "none" as const,
        plus_one_approved_count: null,
      };
      expect(toAdminResponseFields(attending(1, "A"), declinedInvite)).toMatchObject({
        plus_one_status: "approved",
        plus_one_approved_count: 1,
      });
    });
  });
});
