import { formatDeadlineDateManila } from "@/lib/rsvp-window";
import type { RsvpClosedReason } from "@/lib/rsvp-window";

interface RsvpClosedCardProps {
  reason: RsvpClosedReason;
  deadline: string | null;
}

/** Replaces the form once RSVPs are closed. Event details stay visible around it. */
export function RsvpClosedCard({ reason, deadline }: RsvpClosedCardProps) {
  const message =
    reason === "deadline" && deadline
      ? `RSVPs closed on ${formatDeadlineDateManila(deadline)}. Message Philip & Vera if you'd still like to come.`
      : "RSVPs are closed. Message Philip & Vera if you'd still like to come.";

  return (
    <div
      className="rounded-3xl border border-party-ink/10 bg-party-white/90 p-6 text-center shadow-sm sm:p-8"
      data-rsvp-closed={reason}
    >
      <p className="font-display text-2xl font-semibold text-party-ink">RSVPs are closed</p>
      <p className="mt-2 text-base text-party-ink-soft">{message}</p>
    </div>
  );
}
