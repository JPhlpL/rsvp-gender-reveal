"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GuestCard } from "./guest-card";
import type { AttendanceStatus, GuestWithResponse } from "@/types/guest";
import { ADMIN_GUEST_CARD_LIST_PAGE_SIZE } from "@/utils/constants";

interface GuestCardListProps {
  guests: GuestWithResponse[];
}

type StatusFilter = "all" | AttendanceStatus;

type SortOption =
  | "name_asc"
  | "name_desc"
  | "created_desc"
  | "created_asc"
  | "status_asc"
  | "status_desc";

const STATUS_SORT_ORDER: Record<string, number> = {
  pending: 0,
  attending: 1,
  not_attending: 2,
};

export function GuestCardList({ guests }: GuestCardListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = ADMIN_GUEST_CARD_LIST_PAGE_SIZE;

  const filteredGuests = useMemo(() => {
    let list = guests.filter((guest) =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter !== "all") {
      list = list.filter((g) => g.attendance_status === statusFilter);
    }
    const arr = [...list];
    arr.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
        case "name_desc":
          return b.name.localeCompare(a.name, undefined, { sensitivity: "base" });
        case "created_desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "created_asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "status_asc":
          return (
            STATUS_SORT_ORDER[a.attendance_status] -
            STATUS_SORT_ORDER[b.attendance_status]
          );
        case "status_desc":
          return (
            STATUS_SORT_ORDER[b.attendance_status] -
            STATUS_SORT_ORDER[a.attendance_status]
          );
        default:
          return 0;
      }
    });
    return arr;
  }, [guests, searchTerm, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredGuests.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedGuests = filteredGuests.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as StatusFilter);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background pb-4 border-b border-border/30 mb-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search guests by name..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 border-0 bg-muted/60 shadow-none focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-ring/45"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Status</span>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger aria-label="Filter by status" className="w-full">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="attending">Attending</SelectItem>
                <SelectItem value="not_attending">Not attending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Sort</span>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger aria-label="Sort guests" className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name_asc">Name (A–Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z–A)</SelectItem>
                <SelectItem value="created_desc">Created (newest)</SelectItem>
                <SelectItem value="created_asc">Created (oldest)</SelectItem>
                <SelectItem value="status_asc">Status (pending first)</SelectItem>
                <SelectItem value="status_desc">Status (not attending first)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(searchTerm || statusFilter !== "all") && (
          <div className="text-xs text-muted-foreground">
            {filteredGuests.length} guest{filteredGuests.length !== 1 ? "s" : ""}{" "}
            shown
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {filteredGuests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            {searchTerm || statusFilter !== "all"
              ? "No guests match your filters."
              : "No guests yet."}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedGuests.map((guest) => (
                <GuestCard key={guest.id} guest={guest} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
