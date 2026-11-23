import { Balloons, Crib, Onesie, Star } from "@/components/illustrations";
import { EVENT_DATE_DISPLAY, EVENT_HOSTS_LINE } from "@/utils/constants";

/** Invitation hero: illustrations, event title, hosts and date. */
export function PartyHeader() {
  return (
    <section className="relative px-4 pt-12 pb-8 text-center sm:pt-16">
      <Star className="absolute left-[8%] top-10 h-5 w-5 text-party-pink" />
      <Star className="absolute right-[8%] top-16 h-5 w-5 text-party-blue" />

      <Balloons className="mx-auto mb-2 h-20 w-16 sm:h-24 sm:w-20" />

      <p className="text-xs uppercase tracking-[0.3em] text-party-ink-soft sm:text-sm">
        You&apos;re invited to the
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-party-ink sm:text-6xl">
        Gender Reveal
        <span className="block text-3xl sm:text-5xl">&amp; Baby Shower</span>
      </h1>
      <p className="mt-3 font-display text-xl text-party-ink-soft sm:text-2xl">{EVENT_HOSTS_LINE}</p>

      <div className="mx-auto mt-6 flex max-w-sm items-end justify-center gap-3">
        <Onesie className="h-12 w-12 -rotate-12 text-party-pink sm:h-14 sm:w-14" />
        <Crib className="h-24 w-28 sm:h-28 sm:w-32" />
        <Onesie className="h-12 w-12 rotate-12 text-party-blue sm:h-14 sm:w-14" />
      </div>

      <p className="mx-auto mt-6 inline-block rounded-full border border-party-ink/15 bg-party-white/80 px-5 py-2 text-sm font-semibold text-party-ink shadow-sm sm:text-base">
        {EVENT_DATE_DISPLAY}
      </p>
    </section>
  );
}
