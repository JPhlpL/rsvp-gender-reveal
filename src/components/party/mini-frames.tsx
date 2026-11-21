import Image from "next/image";
import { BabyOutline, Clothespin } from "@/components/illustrations";
import { publicFileExists } from "@/lib/public-file";
import { COPY_MINI_QUESTION, PARTY_PHOTO_PATHS } from "@/utils/constants";

type FrameProps = {
  label: string;
  photoPath: string;
  tone: "pink" | "blue";
};

const TONE = {
  pink: { frame: "border-party-pink bg-party-pink/30", text: "text-party-pink-ink", tilt: "-rotate-3" },
  blue: { frame: "border-party-blue bg-party-blue/30", text: "text-party-blue-ink", tilt: "rotate-3" },
} as const;

function PhotoFrame({ label, photoPath, tone }: FrameProps) {
  const style = TONE[tone];
  const hasPhoto = publicFileExists(photoPath);

  return (
    <figure className={`relative w-[41%] max-w-[13rem] ${style.tilt}`}>
      <Clothespin
        className={`absolute -top-5 left-1/2 z-10 h-10 w-4 -translate-x-1/2 ${style.text}`}
      />
      <div className={`rounded-md border-4 bg-party-white p-2 pb-3 shadow-md ${style.frame}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-party-white">
          {hasPhoto ? (
            <Image
              src={photoPath}
              alt={`${label} baby photo`}
              fill
              sizes="(max-width: 640px) 41vw, 13rem"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-3">
              <BabyOutline className={`h-full w-full ${style.text}`} />
            </div>
          )}
        </div>
        <figcaption className={`mt-2 text-center font-display text-base font-semibold sm:text-lg ${style.text}`}>
          {label}
        </figcaption>
      </div>
    </figure>
  );
}

/** "Mini Vera or Mini Philip?" — the couple's baby photos side by side. */
export function MiniFrames() {
  return (
    <section className="px-4 py-10 sm:py-14" aria-labelledby="mini-frames-title">
      <h2
        id="mini-frames-title"
        className="mb-10 text-center font-display text-3xl font-semibold text-party-ink sm:text-4xl"
      >
        {COPY_MINI_QUESTION}
      </h2>
      <div className="mx-auto flex max-w-md items-center justify-between gap-2 px-1">
        <PhotoFrame label="Mini Vera" photoPath={PARTY_PHOTO_PATHS.vera} tone="pink" />
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-party-ink font-display text-sm font-semibold text-party-white shadow">
          or
        </span>
        <PhotoFrame label="Mini Philip" photoPath={PARTY_PHOTO_PATHS.philip} tone="blue" />
      </div>
    </section>
  );
}
