import type { GuestResponse } from "@/types/response";

/** "Girl", "Boy" or "—" for the admin views. */
export function guessLabel(response: GuestResponse | null): string {
  if (response?.guess === "girl") return "Girl";
  if (response?.guess === "boy") return "Boy";
  return "—";
}

/** Short plus-one status for tables and cards: "+2 pending", "+1 approved", "+2 declined" or "—". */
export function plusOneSummary(response: GuestResponse | null): string {
  if (!response || response.plus_one_count === 0) return "—";

  switch (response.plus_one_status) {
    case "pending":
      return `+${response.plus_one_count} pending`;
    case "approved":
      return `+${response.plus_one_approved_count ?? 0} approved`;
    case "declined":
      return `+${response.plus_one_count} declined`;
    default:
      return "—";
  }
}
