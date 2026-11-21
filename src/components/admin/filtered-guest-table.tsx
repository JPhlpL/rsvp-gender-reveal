"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BaseTable } from "@/components/application/table/base-table";
import type { AttendanceStatus, Guest } from "@/types/guest";
import { ADMIN_DASHBOARD_FILTERED_TABLE_PAGE_SIZE } from "@/utils/constants";

interface FilteredGuestTableProps {
  guests: Guest[];
  title: string;
  showPlusGuests?: boolean;
}

type StatusFilter = "all" | AttendanceStatus;

export function FilteredGuestTable({
  guests,
  title,
  showPlusGuests = false,
}: FilteredGuestTableProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredGuests = useMemo(() => {
    if (statusFilter === "all") return guests;
    return guests.filter((g) => g.attendance_status === statusFilter);
  }, [guests, statusFilter]);

  const getStatusBadge = (status: string) => {
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
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
          statusColors[status as keyof typeof statusColors]
        }`}
      >
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };

  const calculateTotalSeats = (guest: Guest) => {
    return 1 + (guest.number_of_plus_invited_guests || 0);
  };

  const columns = useMemo<ColumnDef<Guest>[]>(() => {
    const baseColumns: ColumnDef<Guest>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4"
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        enableSorting: true,
      },
      {
        accessorKey: "guest_type",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4"
            >
              Type
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="capitalize text-sm">{row.getValue("guest_type")}</div>
        ),
        enableSorting: true,
      },
    ];

    if (showPlusGuests) {
      baseColumns.push({
        id: "total_seats",
        header: () => <div className="text-center">Total Seats</div>,
        cell: ({ row }) => {
          const guest = row.original;
          const totalSeats = calculateTotalSeats(guest);
          const plusGuests = guest.number_of_plus_invited_guests || 0;

          return (
            <div className="text-center">
              <span className="font-semibold">{totalSeats}</span>
              {plusGuests > 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                  (1 + {plusGuests})
                </span>
              )}
            </div>
          );
        },
      });
    }

    baseColumns.push({
      accessorKey: "attendance_status",
      header: ({ column }) => {
        return (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="flex justify-center">
          {getStatusBadge(row.getValue("attendance_status"))}
        </div>
      ),
      enableSorting: true,
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
    });

    if (guests.some((g) => g.email)) {
      baseColumns.push({
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.getValue("email") || "-"}
          </div>
        ),
      });
    }

    if (guests.some((g) => g.phone)) {
      baseColumns.push({
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.getValue("phone") || "-"}
          </div>
        ),
      });
    }

    return baseColumns;
  }, [guests, showPlusGuests]);

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
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <span>{title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {filteredGuests.length} guest{filteredGuests.length !== 1 ? "s" : ""}
            {statusFilter !== "all" && (
              <span className="ml-1 text-xs">(filtered)</span>
            )}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BaseTable
          data={filteredGuests}
          columns={columns}
          searchColumn="name"
          searchPlaceholder="Search guests..."
          emptyMessage="No guests found in this category"
          showCount={false}
          fullWidthSearch={true}
          pageSize={ADMIN_DASHBOARD_FILTERED_TABLE_PAGE_SIZE}
          showPagination={true}
          additionalToolbar={statusToolbar}
        />
      </CardContent>
    </Card>
  );
}
