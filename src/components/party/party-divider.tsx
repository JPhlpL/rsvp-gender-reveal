import { Cloud, Star } from "@/components/illustrations";

/** Small centered divider: pink star, cloud, blue star. */
export function PartyDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden="true">
      <Star className="h-4 w-4 text-party-pink" />
      <Cloud className="h-6 w-10" />
      <Star className="h-4 w-4 text-party-blue" />
    </div>
  );
}
