import { Onesie } from "@/components/illustrations";
import { COPY_WEAR_YOUR_GUESS_BODY, COPY_WEAR_YOUR_GUESS_TITLE } from "@/utils/constants";

/** Dress code: wear pink for girl, blue for boy. Both swatches are identical in size. */
export function WearYourGuess() {
  return (
    <section className="px-4 py-10 text-center sm:py-14">
      <h2 className="font-display text-3xl font-semibold text-party-ink sm:text-4xl">
        {COPY_WEAR_YOUR_GUESS_TITLE}
      </h2>
      <p className="mt-2 text-base text-party-ink-soft sm:text-lg">{COPY_WEAR_YOUR_GUESS_BODY}</p>

      <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-party-pink/50 px-3 py-4">
          <Onesie className="h-14 w-14 text-party-pink" />
          <span className="font-display text-lg font-semibold text-party-pink-deep">Girl</span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-party-blue/50 px-3 py-4">
          <Onesie className="h-14 w-14 text-party-blue" />
          <span className="font-display text-lg font-semibold text-party-blue-deep">Boy</span>
        </div>
      </div>
    </section>
  );
}
