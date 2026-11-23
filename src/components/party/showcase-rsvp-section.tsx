import type { ShowcaseView } from "@/lib/invitation-view";
import { formatDeadlineDateManila } from "@/lib/rsvp-window";
import type { PublicSettings } from "@/types/settings";
import { RsvpClosedCard } from "./rsvp-closed-card";
import { RsvpForm } from "./rsvp-form";
import { RsvpShowcaseNote } from "./rsvp-showcase-note";

interface ShowcaseRsvpSectionProps {
  view: ShowcaseView;
  settings: PublicSettings;
}

/** The RSVP part of /invitation, depending on the personalized-links switch (§12). */
export function ShowcaseRsvpSection({ view, settings }: ShowcaseRsvpSectionProps) {
  if (view.kind === "showcase") return <RsvpShowcaseNote />;

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
          {view.kind === "form" && <RsvpForm mode="general" />}
          {view.kind === "closed" && (
            <RsvpClosedCard reason={view.reason} deadline={settings.rsvp_deadline} />
          )}
        </div>
      </div>
    </section>
  );
}
