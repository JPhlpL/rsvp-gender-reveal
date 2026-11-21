import { Gift } from "lucide-react";
import { Star } from "@/components/illustrations";
import { COPY_PRIZES } from "@/utils/constants";

/** "A lot of gift and cash prizes are waiting" */
export function PrizesTeaser() {
  return (
    <section className="px-4 py-8 sm:py-10">
      <div className="mx-auto flex max-w-md items-center gap-4 rounded-2xl border border-party-ink/10 bg-gradient-to-r from-party-pink/50 via-party-white to-party-blue/50 px-5 py-5 shadow-sm">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-party-ink text-party-white">
          <Gift className="h-6 w-6" />
        </span>
        <p className="font-display text-lg font-semibold leading-snug text-party-ink sm:text-xl">
          {COPY_PRIZES}
        </p>
        <div className="ml-auto flex flex-col gap-1" aria-hidden="true">
          <Star className="h-4 w-4 text-party-pink" />
          <Star className="h-4 w-4 text-party-blue" />
        </div>
      </div>
    </section>
  );
}
