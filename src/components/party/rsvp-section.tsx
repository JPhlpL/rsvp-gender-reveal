import type { InvitationView } from "@/lib/invitation-view";
import { formatDeadlineDateManila } from "@/lib/rsvp-window";
import type { InvitationGuest } from "@/repositories/invitationRepository";
import type { RsvpSettings } from "@/types/settings";
import { AnswerStatusCard } from "./answer-status-card";
import { GuestNotesCallout } from "./guest-notes-callout";
import { RsvpClosedCard } from "./rsvp-closed-card";
import { RsvpForm } from "./rsvp-form";

interface RsvpSectionProps {
  guest: InvitationGuest;
  settings: RsvpSettings;
  view: InvitationView;
  slug: string;
}

export function RsvpSection({ guest, settings, view, slug }: RsvpSectionProps) {
  return (
    <section id="rsvp" className="px-4 py-10 sm:py-14" aria-labelledby="rsvp-title">
      <div className="mx-auto max-w-xl">
        <h2 id="rsvp-title" className="text-center font-display text-4xl font-semibold text-party-ink">
          RSVP
        </h2>
        {view.kind === "form" && settings.rsvp_deadline && (
          <p className="mt-2 mb-6 text-center text-base font-semibold text-party-ink-soft">
            Please RSVP by {formatDeadlineDateManila(settings.rsvp_deadline)}
          </p>
        )}
        <div className="mt-6">
          <GuestNotesCallout notes={guest.notes} />
          {view.kind === "form" && (
            <RsvpForm mode="guest" uuid={guest.uuid} slug={slug} guestName={guest.name} />
          )}
          {view.kind === "answered" && <AnswerStatusCard response={view.response} />}
          {view.kind === "closed" && (
            <RsvpClosedCard reason={view.reason} deadline={settings.rsvp_deadline} />
          )}
        </div>
      </div>
    </section>
  );
}
