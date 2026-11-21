import type { Guest } from "@/types/guest";

export interface GuestStatistics {
  /** Count of invitation rows in the database. */
  totalMainGuests: number;
  /** Sum of `number_of_plus_invited_guests` across all main guest rows (plus seats only). */
  totalPlusSeats: number;
  /** Sum of (1 + plus) seats across every row, including declined. */
  totalGuestsInvited: number;
  /**
   * Sum of (1 + plus) for rows that are **pending** or **attending** only.
   * Declined rows are excluded — “still in play” capacity for planning.
   */
  totalSeatsPendingAndAttending: number;
  /** Sum of (1 + plus) for attending rows. */
  totalAttending: number;
  /** Sum of (1 + plus) for not_attending rows. */
  totalNotAttending: number;
  /** Pending seats (main + plus) for pending rows. */
  totalPending: number;
  mainGuestsPendingCount: number;
  mainGuestsAttendingCount: number;
  mainGuestsNotAttendingCount: number;
  attendingPercentage: number;
  notAttendingPercentage: number;
  pendingPercentage: number;
  /** Attending seats as % of `totalSeatsPendingAndAttending` (0 if that total is 0). */
  attendingPercentageOfActiveInvited: number;
}

function seatsForGuest(guest: Guest): number {
  return 1 + (guest.number_of_plus_invited_guests || 0);
}

/**
 * Calculate comprehensive guest statistics for the admin dashboard.
 */
export function calculateGuestStatistics(guests: Guest[]): GuestStatistics {
  const totalMainGuests = guests.length;

  const totalPlusSeats = guests.reduce(
    (sum, guest) => sum + (guest.number_of_plus_invited_guests || 0),
    0
  );

  const mainGuestsPendingCount = guests.filter(
    (g) => g.attendance_status === "pending"
  ).length;
  const mainGuestsAttendingCount = guests.filter(
    (g) => g.attendance_status === "attending"
  ).length;
  const mainGuestsNotAttendingCount = guests.filter(
    (g) => g.attendance_status === "not_attending"
  ).length;

  const totalGuestsInvited = guests.reduce(
    (sum, guest) => sum + seatsForGuest(guest),
    0
  );

  const totalSeatsPendingAndAttending = guests
    .filter(
      (g) =>
        g.attendance_status === "pending" || g.attendance_status === "attending"
    )
    .reduce((sum, guest) => sum + seatsForGuest(guest), 0);

  const totalAttending = guests
    .filter((g) => g.attendance_status === "attending")
    .reduce((sum, guest) => sum + seatsForGuest(guest), 0);

  const totalNotAttending = guests
    .filter((g) => g.attendance_status === "not_attending")
    .reduce((sum, guest) => sum + seatsForGuest(guest), 0);

  const totalPending = guests
    .filter((g) => g.attendance_status === "pending")
    .reduce((sum, guest) => sum + seatsForGuest(guest), 0);

  const attendingPercentage =
    totalGuestsInvited > 0
      ? Math.round((totalAttending / totalGuestsInvited) * 100)
      : 0;

  const notAttendingPercentage =
    totalGuestsInvited > 0
      ? Math.round((totalNotAttending / totalGuestsInvited) * 100)
      : 0;

  const pendingPercentage =
    totalGuestsInvited > 0
      ? Math.round((totalPending / totalGuestsInvited) * 100)
      : 0;

  const attendingPercentageOfActiveInvited =
    totalSeatsPendingAndAttending > 0
      ? Math.round((totalAttending / totalSeatsPendingAndAttending) * 100)
      : 0;

  return {
    totalMainGuests,
    totalPlusSeats,
    totalGuestsInvited,
    totalSeatsPendingAndAttending,
    totalAttending,
    totalNotAttending,
    totalPending,
    mainGuestsPendingCount,
    mainGuestsAttendingCount,
    mainGuestsNotAttendingCount,
    attendingPercentage,
    notAttendingPercentage,
    pendingPercentage,
    attendingPercentageOfActiveInvited,
  };
}
