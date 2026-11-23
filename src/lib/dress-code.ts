import type { GuestResponse } from "@/types/response";

/** The dress-code reminder for a guess: pink for girl, blue for boy. */
export function dressCodeFor(guess: GuestResponse["guess"] | undefined): string | null {
  if (guess === "girl") return "Wear pink!";
  if (guess === "boy") return "Wear blue!";
  return null;
}
