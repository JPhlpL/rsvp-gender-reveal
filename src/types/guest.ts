import { Database } from "./database";

// Guest table types
export type Guest = Database["public"]["Tables"]["guests"]["Row"];
export type GuestInsert = Database["public"]["Tables"]["guests"]["Insert"];
export type GuestUpdate = Database["public"]["Tables"]["guests"]["Update"];

// Enum types
export type AttendanceStatus = Database["public"]["Enums"]["attendance_status"];
