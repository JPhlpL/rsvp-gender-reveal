import type { RsvpClosedReason } from "@/lib/rsvp-window";
import { MSG_RSVP_CLOSED } from "@/utils/constants";

interface RsvpClosedCardProps {
  reason: RsvpClosedReason;
}

/**
 * Replaces the form once RSVPs are closed. Event details stay visible around it. Names no
 * date, whether the deadline passed or the couple closed RSVPs by hand (they asked for no dates).
 */
export function RsvpClosedCard({ reason }: RsvpClosedCardProps) {
  return (
    <div
      className="rounded-3xl border border-party-ink/10 bg-party-white/90 p-6 text-center shadow-sm sm:p-8"
      data-rsvp-closed={reason}
    >
      <p className="font-display text-2xl font-semibold text-party-ink">RSVPs are closed</p>
      <p className="mt-2 text-base text-party-ink-soft">{MSG_RSVP_CLOSED}</p>
    </div>
  );
}
