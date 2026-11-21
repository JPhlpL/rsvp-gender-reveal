import type { RsvpAnswer } from "@/schemas/rsvp";
import type { GuestResponseInsert, GuestResponseUpdate } from "@/types/response";

type ResponseFields = Omit<GuestResponseInsert, "guest_id">;

/** Fields shared by guest and admin answers; plus-one status is decided by the caller. */
function baseFields(answer: RsvpAnswer): ResponseFields {
  if (!answer.is_attending) {
    return {
      name: answer.name,
      is_attending: false,
      guess: null,
      plus_one_count: 0,
      plus_one_names: null,
      plus_one_status: "none",
      plus_one_approved_count: null,
      message: answer.message || null,
    };
  }

  const count = answer.plus_one_count;
  return {
    name: answer.name,
    is_attending: true,
    guess: answer.guess,
    plus_one_count: count,
    plus_one_names: count > 0 ? answer.plus_one_names || null : null,
    plus_one_status: "none",
    plus_one_approved_count: null,
    message: answer.message || null,
  };
}

/** A guest's own submission: requested plus-ones wait for the couple's approval. */
export function toGuestResponseInsert(
  guestId: string,
  answer: RsvpAnswer
): GuestResponseInsert {
  const fields = baseFields(answer);
  if (fields.is_attending && (fields.plus_one_count ?? 0) > 0) {
    fields.plus_one_status = "pending";
  }
  return { guest_id: guestId, ...fields };
}

/** An answer entered by an admin: plus-ones they enter are already decided. */
export function toAdminResponseFields(answer: RsvpAnswer): ResponseFields {
  const fields = baseFields(answer);
  const count = fields.plus_one_count ?? 0;
  if (fields.is_attending && count > 0) {
    fields.plus_one_status = "approved";
    fields.plus_one_approved_count = count;
  }
  return fields;
}

export type PlusOneDecisionInput =
  | { approve: true; count: number }
  | { approve: false };

/** The couple's decision on a pending plus-one request. */
export function plusOneDecision(
  requested: number,
  decision: PlusOneDecisionInput
): Pick<GuestResponseUpdate, "plus_one_status" | "plus_one_approved_count"> {
  if (!decision.approve) {
    return { plus_one_status: "declined", plus_one_approved_count: 0 };
  }

  const { count } = decision;
  if (!Number.isInteger(count) || count < 1 || count > requested) {
    throw new RangeError(`Pick between 1 and ${requested}`);
  }

  return { plus_one_status: "approved", plus_one_approved_count: count };
}
