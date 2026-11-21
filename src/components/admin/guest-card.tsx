"use client";

import { BaseCard } from "@/components/application/cards/base-card";
import { EditGuestModal } from "./edit-guest-modal";
import { DeleteGuestDialog } from "./delete-guest-dialog";
import { CopyLinkModal } from "./copy-link-modal";
import { ViewResponseModal } from "./view-response-modal";
import type { GuestWithResponse } from "@/types/guest";
import { guessLabel, plusOneSummary } from "@/lib/guest-labels";

interface GuestCardProps {
  guest: GuestWithResponse;
}

export function GuestCard({ guest }: GuestCardProps) {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      attending: "bg-green-50 text-green-700 border-green-200",
      not_attending: "bg-red-50 text-red-700 border-red-200",
    };

    const statusLabels = {
      pending: "Pending",
      attending: "Attending",
      not_attending: "Not Attending",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
          statusColors[status as keyof typeof statusColors]
        }`}
      >
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };

  const cardHeader = (
    <>
      <h3 className="font-semibold text-sm mb-1">{guest.name}</h3>
      <div className="flex items-center gap-1.5">
        {getStatusBadge(guest.attendance_status)}
      </div>
    </>
  );

  const cardFooter = (
    <div className="flex items-center gap-1">
      <ViewResponseModal guest={guest} />
      <CopyLinkModal guest={guest} />
      <EditGuestModal guest={guest} />
      <DeleteGuestDialog guest={guest} />
    </div>
  );

  return (
    <BaseCard header={cardHeader} footer={cardFooter} compact>
      <div className="space-y-1">
        <div className="text-xs">
          <span className="text-muted-foreground">Guess: </span>
          <span className="font-semibold">{guessLabel(guest.response)}</span>
          <span className="text-muted-foreground"> · Plus-ones: </span>
          <span className="font-semibold">{plusOneSummary(guest.response)}</span>
        </div>

        {/* Created Date */}
        <div className="text-[10px] text-muted-foreground">
          Created: {new Date(guest.created_at).toLocaleDateString()}
        </div>
      </div>
    </BaseCard>
  );
}
