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
