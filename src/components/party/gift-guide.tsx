import { Onesie } from "@/components/illustrations";
import { COPY_GIFT_GUIDE_BODY, COPY_GIFT_GUIDE_TITLE } from "@/utils/constants";

/** The couple's gift guide. Pink and blue onesies are the same size. */
export function GiftGuide() {
  return (
    <section className="px-4 py-10 text-center sm:py-14" aria-labelledby="gift-guide-title">
      <div className="mx-auto max-w-xl rounded-3xl border border-party-ink/10 bg-party-white/90 px-5 py-8 shadow-sm sm:px-8">
        <div className="mx-auto mb-4 flex items-end justify-center gap-3" aria-hidden="true">
          <Onesie className="h-10 w-10 -rotate-12 text-party-pink" />
          <Onesie className="h-10 w-10 rotate-12 text-party-blue" />
        </div>
        <h2
          id="gift-guide-title"
          className="font-display text-3xl font-semibold text-party-ink sm:text-4xl"
        >
          {COPY_GIFT_GUIDE_TITLE}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-party-ink-soft sm:text-lg">
          {COPY_GIFT_GUIDE_BODY}
        </p>
      </div>
    </section>
  );
}
