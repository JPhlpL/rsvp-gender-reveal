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
import type { AttendanceStatus, Guest } from "@/types/guest";
import { ADMIN_GUEST_TABLE_PAGE_SIZE } from "@/utils/constants";

interface GuestTableProps {
  guests: Guest[];
}

type StatusFilter = "all" | AttendanceStatus;

export function GuestTable({ guests }: GuestTableProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredGuests = useMemo(() => {
    if (statusFilter === "all") return guests;
    return guests.filter((g) => g.attendance_status === statusFilter);
  }, [guests, statusFilter]);

  const columns = useMemo<ColumnDef<Guest>[]>(
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
          <div className="font-medium text-center">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "guest_type",
        header: () => <div className="text-center">Type</div>,
        cell: ({ row }) => {
          const type = row.getValue("guest_type") as string;
          const typeColors = {
            standard: "bg-gray-50 text-gray-700 border-gray-200",
            vip: "bg-amber-50 text-amber-700 border-amber-200",
          };
          const typeLabels = {
            standard: "Standard",
            vip: "VIP",
          };

          return (
            <div className="flex justify-center">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${typeColors[type as keyof typeof typeColors]}`}
              >
                {typeLabels[type as keyof typeof typeLabels]}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: () => <div className="text-center">Email</div>,
        cell: ({ row }) => {
          const email = row.getValue("email") as string | null;
          return <div className="text-center">{email || "-"}</div>;
        },
      },
      {
        accessorKey: "phone",
        header: () => <div className="text-center">Phone</div>,
        cell: ({ row }) => {
          const phone = row.getValue("phone") as string | null;
          return <div className="text-center">{phone || "-"}</div>;
        },
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
            pending: "bg-beige-50 text-beige-700 border-beige-200",
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
        accessorKey: "number_of_plus_invited_guests",
        header: () => <div className="text-center">Plus Guests</div>,
        cell: ({ row }) => {
          const numberInvited = row.getValue(
            "number_of_plus_invited_guests"
          ) as number | null;

          if (numberInvited !== null) {
            return <div className="text-center">{numberInvited}</div>;
          }
          return <div className="text-center">0</div>;
        },
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
