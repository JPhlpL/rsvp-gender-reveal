import { BabyBottle, Pacifier, Rattle } from "@/components/illustrations";
import { COPY_CLOSING, EVENT_HOSTS } from "@/utils/constants";

/** Closing line from the couple. */
export function PartyClosing() {
  return (
    <section className="px-4 py-10 text-center sm:py-14">
      <div className="mx-auto mb-5 flex items-end justify-center gap-4" aria-hidden="true">
        <Pacifier className="h-10 w-10 text-party-pink" />
        <BabyBottle className="h-14 w-9" />
        <Rattle className="h-10 w-10" />
        <Pacifier className="h-10 w-10 text-party-blue" />
      </div>
      <p className="mx-auto max-w-md font-display text-2xl font-semibold leading-snug text-party-ink sm:text-3xl">
        {COPY_CLOSING}
      </p>
      <p className="mt-3 text-base text-party-ink-soft">— {EVENT_HOSTS}</p>
    </section>
  );
}
