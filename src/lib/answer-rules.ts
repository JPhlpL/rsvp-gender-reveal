import type { RsvpAnswer } from "@/schemas/rsvp";
import type {
  GuestResponse,
  GuestResponseInsert,
} from "@/types/response";

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

export type ExistingPlusOneState = Pick<
  GuestResponse,
  "is_attending" | "plus_one_count" | "plus_one_status" | "plus_one_approved_count"
>;

/**
 * An answer entered by an admin. A plus-one count the admin sets or changes counts as
 * approved; when attendance and the count are left as they were (e.g. only the message
 * was fixed), the couple's earlier decision — pending, partial approval or decline — stays.
 */
export function toAdminResponseFields(
  answer: RsvpAnswer,
  existing?: ExistingPlusOneState | null
): ResponseFields {
  const fields = baseFields(answer);
  const count = fields.plus_one_count ?? 0;
  if (!fields.is_attending || count === 0) return fields;

  const unchanged =
    existing?.is_attending === true &&
    existing.plus_one_count === count &&
    existing.plus_one_status !== "none";

  if (unchanged) {
    fields.plus_one_status = existing.plus_one_status;
    fields.plus_one_approved_count = existing.plus_one_approved_count;
  } else {
    fields.plus_one_status = "approved";
    fields.plus_one_approved_count = count;
  }
  return fields;
}
