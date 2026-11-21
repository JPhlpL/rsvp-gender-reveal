import type { GuestWithResponse } from "@/types/guest";

/** Numbers for the admin dashboard. Plus-one and guess figures count attending guests only. */
export interface PartyStats {
  invited: number;
  attending: number;
  notAttending: number;
  noAnswer: number;
  /** Seats the couple approved for companions. */
  approvedPlusOnes: number;
  /** Guests whose plus-one request still needs a decision. */
  pendingPlusOneRequests: number;
  /** Companion seats asked for in those undecided requests. */
  pendingPlusOneSeats: number;
  /** Attending guests plus approved companions. */
  expectedHeadcount: number;
  /** Expected headcount if every undecided request were approved. */
  headcountIfAllApproved: number;
  teamPink: number;
  teamBlue: number;
}

export function calculatePartyStats(rows: GuestWithResponse[]): PartyStats {
  const stats: PartyStats = {
    invited: rows.length,
    attending: 0,
    notAttending: 0,
    noAnswer: 0,
    approvedPlusOnes: 0,
    pendingPlusOneRequests: 0,
    pendingPlusOneSeats: 0,
    expectedHeadcount: 0,
    headcountIfAllApproved: 0,
    teamPink: 0,
    teamBlue: 0,
  };

  for (const row of rows) {
    if (row.attendance_status === "not_attending") {
      stats.notAttending++;
      continue;
    }
    if (row.attendance_status !== "attending") {
      stats.noAnswer++;
      continue;
    }

    stats.attending++;
    const response = row.response;
    if (!response) continue;

    if (response.guess === "girl") stats.teamPink++;
    if (response.guess === "boy") stats.teamBlue++;

    if (response.plus_one_status === "approved") {
      stats.approvedPlusOnes += response.plus_one_approved_count ?? 0;
    } else if (response.plus_one_status === "pending") {
      stats.pendingPlusOneRequests++;
      stats.pendingPlusOneSeats += response.plus_one_count;
    }
  }

  stats.expectedHeadcount = stats.attending + stats.approvedPlusOnes;
  stats.headcountIfAllApproved = stats.expectedHeadcount + stats.pendingPlusOneSeats;
  return stats;
}
