import type { ComponentType, CSSProperties } from "react";
import {
  BabyBottle,
  Balloons,
  Cloud,
  Crib,
  Footprints,
  Heart,
  Moon,
  Onesie,
  Pacifier,
  Rattle,
  Sock,
  Star,
  TeddyBear,
} from "@/components/illustrations";
import { BABY_PATTERN, type BabyItemKind, type BabyPatternItem } from "@/lib/baby-pattern";

const ICONS: Record<BabyItemKind, ComponentType<{ className?: string }>> = {
  onesie: Onesie,
  pacifier: Pacifier,
  star: Star,
  heart: Heart,
  footprints: Footprints,
  sock: Sock,
  bottle: BabyBottle,
  rattle: Rattle,
  cloud: Cloud,
  balloons: Balloons,
  teddy: TeddyBear,
  moon: Moon,
  crib: Crib,
};

const TONE = { pink: "text-party-pink", blue: "text-party-blue" } as const;

/** Width of one side margin: half the page minus half the invitation column (max-w-xl, 36rem). */
const MARGIN = "(50% - 18rem)";

/** Wide-screen position: a share of the side margin, measured from that side's page edge. */
function wideLeft({ side, across }: BabyPatternItem): string {
  return side === "left" ? `calc(${MARGIN} * ${across})` : `calc(100% - ${MARGIN} * ${across})`;
}

/**
 * Faint baby items scattered down the whole invitation, behind the content. Wide screens
 * fill the side margins beside the column; phones show smaller items peeking in from the edges.
 */
export function BabyPatternBackground() {
  return (
    <div
      aria-hidden="true"
      data-baby-pattern
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {BABY_PATTERN.map((item, i) => {
        const Icon = ICONS[item.kind];
        const style = {
          top: `${item.top}%`,
          width: item.size,
          height: item.size,
          "--x": wideLeft(item),
          "--xm": `${item.leftMobile}%`,
          "--r": `${item.rotate}deg`,
        } as CSSProperties;

        return (
          <span
            key={i}
            style={style}
            className="absolute left-(--xm) -translate-x-1/2 rotate-(--r) scale-[0.6] opacity-30 md:left-(--x) md:scale-100 md:opacity-50"
          >
            <Icon className={`h-full w-full ${item.tone ? TONE[item.tone] : ""}`} />
          </span>
        );
      })}
    </div>
  );
}
