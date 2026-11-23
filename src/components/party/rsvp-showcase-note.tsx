import { COPY_SHOWCASE_NO_LINK, COPY_SHOWCASE_RSVP_NOTE } from "@/utils/constants";

/** Takes the RSVP form's place on the public showcase invitation. Nothing to submit. */
export function RsvpShowcaseNote() {
  return (
    <section id="rsvp" className="px-4 py-10 sm:py-14" aria-labelledby="rsvp-title">
      <div className="mx-auto max-w-xl">
        <h2 id="rsvp-title" className="text-center font-display text-4xl font-semibold text-party-ink">
          RSVP
        </h2>
        <div className="mt-6 rounded-3xl border border-party-ink/10 bg-party-white/90 p-6 text-center shadow-sm sm:p-8">
          <p className="font-display text-xl font-semibold text-party-ink sm:text-2xl">
            {COPY_SHOWCASE_RSVP_NOTE}
          </p>
          <p className="mt-3 text-base text-party-ink-soft">{COPY_SHOWCASE_NO_LINK}</p>
        </div>
      </div>
    </section>
  );
}
