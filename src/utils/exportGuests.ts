import * as XLSX from "xlsx";
import type { Guest } from "@/types/guest";
import { EXPORT_GUESTS_DEFAULT_BASENAME } from "@/utils/constants";

interface ExportGuestData {
  Name: string;
  "Guest Type": string;
  Email: string;
  Phone: string;
  "Attendance Status": string;
  "Plus Guests": number;
  "Created Date": string;
  "Submitted Date": string;
  Notes: string;
}

export function exportGuestsToExcel(
  guests: Guest[],
  filename = EXPORT_GUESTS_DEFAULT_BASENAME
) {
  // Format data for Excel
  const formattedData: ExportGuestData[] = guests.map((guest) => ({
    Name: guest.name,
    "Guest Type": guest.guest_type === "vip" ? "VIP" : "Standard",
    Email: guest.email || "",
    Phone: guest.phone || "",
    "Attendance Status":
      guest.attendance_status === "attending"
        ? "Attending"
        : guest.attendance_status === "not_attending"
          ? "Not Attending"
          : "Pending",
    "Plus Guests": guest.number_of_plus_invited_guests || 0,
    "Created Date": new Date(guest.created_at).toLocaleDateString(),
    "Submitted Date": guest.submitted_at
      ? new Date(guest.submitted_at).toLocaleDateString()
      : "",
    Notes: guest.notes || "",
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 25 }, // Name
    { wch: 12 }, // Guest Type
    { wch: 30 }, // Email
    { wch: 15 }, // Phone
    { wch: 18 }, // Attendance Status
    { wch: 12 }, // Plus Guests
    { wch: 15 }, // Created Date
    { wch: 15 }, // Submitted Date
    { wch: 30 }, // Notes
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const fullFilename = `${filename}_${timestamp}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, fullFilename);
}
