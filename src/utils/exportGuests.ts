import * as XLSX from "xlsx";
import type { GuestWithResponse } from "@/types/guest";
import type { PlusOneStatus } from "@/types/response";
import { EXPORT_GUESTS_DEFAULT_BASENAME, MANILA_TIME_ZONE } from "@/utils/constants";

/** One spreadsheet row; key order is the column order (spec §7.8). */
export interface ExportRow {
  Name: string;
  Phone: string;
  Email: string;
  Status: string;
  Guess: string;
  "Plus-ones requested": number | "";
  "Plus-one names": string;
  "Plus-one status": string;
  "Plus-ones approved": number | "";
  Message: string;
  "Admin notes": string;
  "Answered at": string;
  "Added via": string;
}

const STATUS_LABEL = {
  attending: "Attending",
  not_attending: "Not attending",
  pending: "No answer yet",
} as const;

const PLUS_ONE_STATUS_LABEL: Record<PlusOneStatus, string> = {
  none: "None",
  pending: "Waiting for approval",
  approved: "Approved",
  declined: "Declined",
};

function formatManila(iso: string): string {
  return new Date(iso)
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: MANILA_TIME_ZONE,
    })
    .replace(/ /g, " ");
}

export function toExportRows(rows: GuestWithResponse[]): ExportRow[] {
  return rows.map((guest) => {
    const r = guest.response;
    return {
      Name: guest.name,
      Phone: guest.phone || "",
      Email: guest.email || "",
      Status: STATUS_LABEL[guest.attendance_status],
      Guess: r?.guess === "girl" ? "Girl" : r?.guess === "boy" ? "Boy" : "",
      "Plus-ones requested": r ? r.plus_one_count : "",
      "Plus-one names": r?.plus_one_names || "",
      "Plus-one status": r ? PLUS_ONE_STATUS_LABEL[r.plus_one_status] : "",
      "Plus-ones approved": r?.plus_one_approved_count ?? "",
      Message: r?.message || "",
      "Admin notes": guest.notes || "",
      "Answered at": guest.submitted_at ? formatManila(guest.submitted_at) : "",
      "Added via": guest.added_via === "general_link" ? "General link" : "Personal link",
    };
  });
}

export function exportGuestsToExcel(
  rows: GuestWithResponse[],
  filename = EXPORT_GUESTS_DEFAULT_BASENAME
) {
  const worksheet = XLSX.utils.json_to_sheet(toExportRows(rows));
  worksheet["!cols"] = [
    { wch: 24 }, // Name
    { wch: 14 }, // Phone
    { wch: 26 }, // Email
    { wch: 14 }, // Status
    { wch: 8 }, // Guess
    { wch: 10 }, // Plus-ones requested
    { wch: 28 }, // Plus-one names
    { wch: 20 }, // Plus-one status
    { wch: 10 }, // Plus-ones approved
    { wch: 32 }, // Message
    { wch: 28 }, // Admin notes
    { wch: 20 }, // Answered at
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");

  const date = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${filename}_${date}.xlsx`);
}
