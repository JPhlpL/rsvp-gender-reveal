import type { GuestWithResponse } from "@/types/guest";
import type { GuestResponse } from "@/types/response";

/** A complete `responses` row for tests; override only what a test cares about. */
export function makeResponse(overrides: Partial<GuestResponse> = {}): GuestResponse {
  return {
    guest_id: "g1",
    name: "Ana",
    is_attending: true,
    guess: "girl",
    plus_one_count: 0,
    plus_one_names: null,
    plus_one_status: "none",
    plus_one_approved_count: null,
    message: null,
    created_at: "2026-11-21T00:00:00Z",
    updated_at: "2026-11-21T00:00:00Z",
    ...overrides,
  };
}

/** A guest row joined with its response (null = no answer yet). */
export function makeGuestRow(
  overrides: Partial<GuestWithResponse> = {}
): GuestWithResponse {
  return {
    id: "g1",
    uuid: "11111111-1111-4111-8111-111111111111",
    name: "Ana Cruz",
    email: null,
    phone: null,
    notes: null,
    attendance_status: "pending",
    submitted_at: null,
    created_at: "2026-11-21T00:00:00Z",
    updated_at: "2026-11-21T00:00:00Z",
    response: null,
    ...overrides,
  };
}
