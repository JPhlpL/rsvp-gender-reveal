"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BaseTable } from "@/components/application/table/base-table";
import { EditGuestModal } from "./edit-guest-modal";
import { DeleteGuestDialog } from "./delete-guest-dialog";
import { CopyLinkModal } from "./copy-link-modal";
import { ViewResponseModal } from "./view-response-modal";
import { EditAnswerModal } from "./edit-answer-modal";
import { ResetAnswerDialog } from "./reset-answer-dialog";
import { GeneralLinkBadge } from "./general-link-badge";
import type { AttendanceStatus, GuestWithResponse } from "@/types/guest";
import { ADMIN_GUEST_TABLE_PAGE_SIZE } from "@/utils/constants";
import { guessLabel, plusOneSummary } from "@/lib/guest-labels";

interface GuestTableProps {
  guests: GuestWithResponse[];
}

type StatusFilter = "all" | AttendanceStatus;

export function GuestTable({ guests }: GuestTableProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredGuests = useMemo(() => {
    if (statusFilter === "all") return guests;
    return guests.filter((g) => g.attendance_status === statusFilter);
  }, [guests, statusFilter]);

  const columns = useMemo<ColumnDef<GuestWithResponse>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Name
                <ArrowUpDown className="ml-2" />
              </Button>
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="font-medium">{row.getValue("name")}</span>
            {row.original.added_via === "general_link" && <GeneralLinkBadge />}
          </div>
        ),
      },
      {
        accessorKey: "attendance_status",
        header: ({ column }) => {
          return (
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Status
                <ArrowUpDown className="ml-2" />
              </Button>
            </div>
          );
        },
        cell: ({ row }) => {
          const status = row.getValue("attendance_status") as string;
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
            <div className="flex justify-center">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusColors[status as keyof typeof statusColors]}`}
              >
                {statusLabels[status as keyof typeof statusLabels]}
              </span>
            </div>
          );
        },
        sortingFn: (rowA, rowB, columnId) => {
          const order: Record<string, number> = {
            pending: 0,
            attending: 1,
            not_attending: 2,
          };
          const a = rowA.getValue(columnId) as string;
          const b = rowB.getValue(columnId) as string;
          return (order[a] ?? 99) - (order[b] ?? 99);
        },
      },
      {
        id: "guess",
        header: () => <div className="text-center">Guess</div>,
        cell: ({ row }) => {
          const label = guessLabel(row.original.response);
          const tone =
            label === "Girl"
              ? "bg-party-pink/50 text-party-pink-ink"
              : label === "Boy"
                ? "bg-party-blue/50 text-party-blue-ink"
                : "text-muted-foreground";
          return (
            <div className="flex justify-center">
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${tone}`}>{label}</span>
            </div>
          );
        },
      },
      {
        id: "plus_ones",
        header: () => <div className="text-center">Plus-ones</div>,
        cell: ({ row }) => (
          <div className="text-center text-sm">{plusOneSummary(row.original.response)}</div>
        ),
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => {
          return (
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Created
                <ArrowUpDown className="ml-2" />
              </Button>
            </div>
          );
        },
        cell: ({ row }) => {
          const date = new Date(row.getValue("created_at"));
          return <div className="text-center">{date.toLocaleDateString()}</div>;
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const guest = row.original;
          return (
            <div className="flex items-center justify-center gap-1">
              <ViewResponseModal guest={guest} />
              <EditAnswerModal guest={guest} />
              <ResetAnswerDialog guest={guest} />
              <CopyLinkModal guest={guest} />
              <EditGuestModal guest={guest} />
              <DeleteGuestDialog guest={guest} />
            </div>
          );
        },
      },
    ],
    []
  );

  const statusToolbar = (
    <div className="flex w-full flex-col gap-1.5 sm:w-[11rem]">
      <span className="text-xs text-muted-foreground sm:sr-only">Status</span>
      <Select
        value={statusFilter}
        onValueChange={(v) => setStatusFilter(v as StatusFilter)}
      >
        <SelectTrigger aria-label="Filter by status" className="w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="attending">Attending</SelectItem>
          <SelectItem value="not_attending">Not attending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <BaseTable
      data={filteredGuests}
      columns={columns}
      searchColumn="name"
      searchPlaceholder="Search by name..."
      emptyMessage="No guests found."
      countLabel="guest(s)"
      pageSize={ADMIN_GUEST_TABLE_PAGE_SIZE}
      showPagination={true}
      additionalToolbar={statusToolbar}
    />
  );
}
