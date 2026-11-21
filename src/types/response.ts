import type { Database } from "./database";

export type GuestResponse = Database["public"]["Tables"]["responses"]["Row"];
export type GuestResponseInsert =
  Database["public"]["Tables"]["responses"]["Insert"];
export type GuestResponseUpdate =
  Database["public"]["Tables"]["responses"]["Update"];

export type RsvpGuess = Database["public"]["Enums"]["rsvp_guess"];
export type PlusOneStatus = Database["public"]["Enums"]["plus_one_status"];
