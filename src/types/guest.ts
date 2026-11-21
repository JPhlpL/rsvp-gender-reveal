import type { Database } from "./database";
import type { GuestResponse } from "./response";

export type Guest = Database["public"]["Tables"]["guests"]["Row"];
export type GuestInsert = Database["public"]["Tables"]["guests"]["Insert"];
export type GuestUpdate = Database["public"]["Tables"]["guests"]["Update"];

export type AttendanceStatus = Database["public"]["Enums"]["attendance_status"];

/** A guest row joined with its (optional) RSVP response. */
export type GuestWithResponse = Guest & { response: GuestResponse | null };
