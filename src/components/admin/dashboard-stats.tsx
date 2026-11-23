"use client";

import { useMemo, useState } from "react";
import { Clock, UserCheck, Users, UsersRound, UserX } from "lucide-react";
import { DashboardStatCard } from "./dashboard-stat-card";
import { FilteredGuestTable } from "./filtered-guest-table";
import type { GuestWithResponse } from "@/types/guest";
import { calculatePartyStats, type PartyStats } from "@/utils/statistics";

type CardId = "invited" | "attending" | "not_attending" | "no_answer" | "headcount";

type CardDef = {
  id: CardId;
  title: string;
  value: (s: PartyStats) => number;
  subtitle?: (s: PartyStats) => string;
  tooltip: string;
  icon: typeof Users;
  iconColor: string;
  bg: string;
  filter: (row: GuestWithResponse) => boolean;
  tableTitle: string;
};

const CARDS: CardDef[] = [
  {
    id: "invited",
    title: "Invited",
    value: (s) => s.invited,
    tooltip: "One per invitation link (companions not included).",
    icon: Users,
    iconColor: "text-party-ink",
    bg: "bg-card",
    filter: () => true,
    tableTitle: "All guests",
  },
  {
    id: "attending",
    title: "Attending",
    value: (s) => s.attending,
    tooltip: "Guests who said yes (companions not included).",
    icon: UserCheck,
    iconColor: "text-green-600",
    bg: "bg-gradient-to-br from-green-50 to-white",
    filter: (r) => r.attendance_status === "attending",
    tableTitle: "Attending",
  },
  {
    id: "not_attending",
    title: "Not attending",
    value: (s) => s.notAttending,
    tooltip: "Guests who said they can't make it.",
    icon: UserX,
    iconColor: "text-red-600",
    bg: "bg-gradient-to-br from-red-50 to-white",
    filter: (r) => r.attendance_status === "not_attending",
    tableTitle: "Not attending",
  },
  {
    id: "no_answer",
    title: "No answer yet",
    value: (s) => s.noAnswer,
    tooltip: "Guests who haven't answered through their link.",
    icon: Clock,
    iconColor: "text-amber-600",
    bg: "bg-gradient-to-br from-amber-50 to-white",
    filter: (r) => r.attendance_status === "pending",
    tableTitle: "No answer yet",
  },
  {
    id: "headcount",
    title: "Expected headcount",
    value: (s) => s.expectedHeadcount,
    subtitle: (s) =>
      `${s.attending} ${s.attending === 1 ? "guest" : "guests"} + ${s.approvedPlusOnes} ${
        s.approvedPlusOnes === 1 ? "plus-one" : "plus-ones"
      }`,
    tooltip: "Attending guests plus the companions you approved.",
    icon: UsersRound,
    iconColor: "text-party-ink",
    bg: "bg-gradient-to-br from-party-pink/30 via-white to-party-blue/30",
    filter: (r) => r.attendance_status === "attending",
    tableTitle: "Coming (with plus-ones)",
  },
];

/** Team Pink vs Team Blue: two equal-height segments sized by share (50/50 when no guesses). */
function TeamBar({ pink, blue }: { pink: number; blue: number }) {
  const total = pink + blue;
  const pinkShare = total === 0 ? 50 : Math.round((pink / total) * 100);

  return (
    <div className="rounded-lg border bg-card p-5" data-team-bar>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold">
        <span className="text-party-pink-ink">Team Pink (girl) · {pink}</span>
        <span className="text-party-blue-ink">{blue} · Team Blue (boy)</span>
      </div>
      <div className="flex h-4 overflow-hidden rounded-full" role="img" aria-label={`${pink} guessed girl, ${blue} guessed boy`}>
        <div className="bg-party-pink" style={{ width: `${pinkShare}%` }} />
        <div className="bg-party-blue" style={{ width: `${100 - pinkShare}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Guesses from attending guests.</p>
    </div>
  );
}

export function DashboardStats({ rows }: { rows: GuestWithResponse[] }) {
  const stats = useMemo(() => calculatePartyStats(rows), [rows]);
  const [expanded, setExpanded] = useState<CardId | null>(null);
  const expandedCard = CARDS.find((card) => card.id === expanded);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <DashboardStatCard
            key={card.id}
            title={card.title}
            value={card.value(stats)}
            subtitle={card.subtitle?.(stats)}
            infoTooltip={card.tooltip}
            icon={card.icon}
            iconColor={card.iconColor}
            bgGradient={card.bg}
            onClick={() => setExpanded(expanded === card.id ? null : card.id)}
            isExpanded={expanded === card.id}
            isClickable
          />
        ))}
      </div>

      {expandedCard && (
        <div className="animate-in slide-in-from-top-4 duration-300">
          <FilteredGuestTable guests={rows.filter(expandedCard.filter)} title={expandedCard.tableTitle} />
        </div>
      )}

      <TeamBar pink={stats.teamPink} blue={stats.teamBlue} />
    </div>
  );
}
