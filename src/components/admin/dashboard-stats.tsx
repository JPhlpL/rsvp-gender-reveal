"use client";

import { useState, type ReactNode } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  UsersRound,
  Ban,
} from "lucide-react";
import { DashboardStatCard } from "./dashboard-stat-card";
import { FilteredGuestTable } from "./filtered-guest-table";
import type { GuestStatistics } from "@/utils/statistics";
import type { Guest } from "@/types/guest";

interface DashboardStatsProps {
  stats: GuestStatistics;
  guests: Guest[];
}

export type DashboardStatCardId =
  | "main_invited"
  | "main_pending"
  | "main_attending"
  | "main_not_attending"
  | "total_active_invited"
  | "total_pending_seats"
  | "total_attending_seats"
  | "total_not_attending_seats"
  | null;

const HINT_MAIN_ROWS =
  "Counts invitation rows only (one per primary guest). Plus-one slots are not added here.";

const HINT_TOTAL_SEATS =
  "Each row = 1 main seat + the number of plus guests invited for that row.";

const HINT_ACTIVE_TOTAL =
  "Adds 1 + plus seats for every pending or attending row. Rows marked not attending are left out so this matches “who might still come.”";

export function DashboardStats({ stats, guests }: DashboardStatsProps) {
  const [expandedCard, setExpandedCard] = useState<DashboardStatCardId>(null);

  const toggleCard = (cardType: DashboardStatCardId) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };

  const getFilteredGuests = (type: DashboardStatCardId): Guest[] => {
    switch (type) {
      case "main_invited":
        return guests;
      case "main_pending":
        return guests.filter((g) => g.attendance_status === "pending");
      case "main_attending":
        return guests.filter((g) => g.attendance_status === "attending");
      case "main_not_attending":
        return guests.filter((g) => g.attendance_status === "not_attending");
      case "total_active_invited":
        return guests.filter(
          (g) =>
            g.attendance_status === "pending" ||
            g.attendance_status === "attending"
        );
      case "total_pending_seats":
        return guests.filter((g) => g.attendance_status === "pending");
      case "total_attending_seats":
        return guests.filter((g) => g.attendance_status === "attending");
      case "total_not_attending_seats":
        return guests.filter((g) => g.attendance_status === "not_attending");
      default:
        return [];
    }
  };

  const getTableTitle = (type: DashboardStatCardId): string => {
    switch (type) {
      case "main_invited":
        return "All main guests";
      case "main_pending":
        return "Main guests — pending";
      case "main_attending":
        return "Main guests — attending";
      case "main_not_attending":
        return "Main guests — not attending";
      case "total_active_invited":
        return "Pending + attending (seat total)";
      case "total_pending_seats":
        return "Pending — total seats";
      case "total_attending_seats":
        return "Attending — total seats";
      case "total_not_attending_seats":
        return "Not attending — total seats";
      default:
        return "";
    }
  };

  const showPlusForExpanded = (type: DashboardStatCardId): boolean => {
    if (!type) return false;
    return type.startsWith("total_");
  };

  const renderCardWithTable = (
    cardType: DashboardStatCardId,
    title: string,
    value: ReactNode,
    subtitle: ReactNode,
    icon: typeof Users,
    iconColor: string,
    bgGradient: string,
    infoTooltip: string,
    options?: { showPlusGuests?: boolean }
  ) => (
    <div className="space-y-4">
      <DashboardStatCard
        title={title}
        value={value}
        subtitle={subtitle}
        infoTooltip={infoTooltip}
        icon={icon}
        iconColor={iconColor}
        bgGradient={bgGradient}
        onClick={() => toggleCard(cardType)}
        isExpanded={expandedCard === cardType}
        isClickable
      />

      {expandedCard === cardType && (
        <div className="lg:hidden animate-in slide-in-from-top-4 duration-300">
          <FilteredGuestTable
            guests={getFilteredGuests(cardType)}
            title={getTableTitle(cardType)}
            showPlusGuests={
              options?.showPlusGuests ?? showPlusForExpanded(cardType)
            }
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Main guests
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Row counts only — each number is one invitation (primary guest), not
            including their plus seats.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {renderCardWithTable(
            "main_invited",
            "Main guests invited",
            stats.totalMainGuests,
            "All invitation rows on your list",
            Users,
            "text-beige-600",
            "bg-gradient-to-br from-beige-50 to-white",
            HINT_MAIN_ROWS,
            { showPlusGuests: false }
          )}
          {renderCardWithTable(
            "main_pending",
            "Main guests pending",
            stats.mainGuestsPendingCount,
            "Awaiting RSVP",
            Clock,
            "text-amber-600",
            "bg-gradient-to-br from-amber-50 to-white",
            HINT_MAIN_ROWS,
            { showPlusGuests: false }
          )}
          {renderCardWithTable(
            "main_attending",
            "Main guests attending",
            stats.mainGuestsAttendingCount,
            "Confirmed “yes” from the primary guest",
            UserCheck,
            "text-green-600",
            "bg-gradient-to-br from-green-50 to-white",
            HINT_MAIN_ROWS,
            { showPlusGuests: false }
          )}
          {renderCardWithTable(
            "main_not_attending",
            "Main guests not attending",
            stats.mainGuestsNotAttendingCount,
            "Declined from the primary guest",
            Ban,
            "text-red-600",
            "bg-gradient-to-br from-red-50 to-white",
            HINT_MAIN_ROWS,
            { showPlusGuests: false }
          )}
        </div>
      </section>

      <section className="rounded-2xl border-2 border-primary/25 bg-primary/5 p-4 sm:p-6 space-y-3 shadow-sm">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            Total seats
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Headcount math: <strong className="text-foreground">1 + plus</strong>{" "}
            per row. <strong className="text-foreground">Active invited</strong>{" "}
            sums pending + attending seats only (declined excluded).{" "}
            <strong className="text-foreground">Total pending guests</strong> is
            main + plus seats for rows still awaiting RSVP.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {renderCardWithTable(
            "total_active_invited",
            "Total guests invited (active)",
            stats.totalSeatsPendingAndAttending,
            <>
              <p>
                Pending + attending seats only. Not attending rows are{" "}
                <span className="font-medium text-foreground">not</span>{" "}
                included.
              </p>
            </>,
            UsersRound,
            "text-blue-600",
            "bg-gradient-to-br from-blue-50/90 to-white",
            HINT_ACTIVE_TOTAL,
            { showPlusGuests: true }
          )}
          {renderCardWithTable(
            "total_pending_seats",
            "Total pending guests",
            stats.totalPending,
            <p>{stats.pendingPercentage}% of all list seats</p>,
            Clock,
            "text-amber-700",
            "bg-gradient-to-br from-amber-50/90 to-white",
            `${HINT_TOTAL_SEATS} Only rows with status pending.`,
            { showPlusGuests: true }
          )}
          {renderCardWithTable(
            "total_attending_seats",
            "Total attending guests",
            stats.totalAttending,
            <>
              <p>
                {stats.totalSeatsPendingAndAttending > 0
                  ? `${stats.attendingPercentageOfActiveInvited}% of active invited seats`
                  : "—"}
                {" · "}
                {stats.attendingPercentage}% of all list seats
              </p>
            </>,
            UserCheck,
            "text-emerald-700",
            "bg-gradient-to-br from-emerald-50/90 to-white",
            `${HINT_TOTAL_SEATS} Only rows with status attending.`,
            { showPlusGuests: true }
          )}
          {renderCardWithTable(
            "total_not_attending_seats",
            "Total not attending guests",
            stats.totalNotAttending,
            <p>{stats.notAttendingPercentage}% of all list seats</p>,
            UserX,
            "text-red-700",
            "bg-gradient-to-br from-rose-50/90 to-white",
            `${HINT_TOTAL_SEATS} Only rows with status not attending.`,
            { showPlusGuests: true }
          )}
        </div>
      </section>

      {expandedCard && (
        <div className="hidden lg:block animate-in slide-in-from-top-4 duration-300">
          <FilteredGuestTable
            guests={getFilteredGuests(expandedCard)}
            title={getTableTitle(expandedCard)}
            showPlusGuests={showPlusForExpanded(expandedCard)}
          />
        </div>
      )}
    </div>
  );
}
