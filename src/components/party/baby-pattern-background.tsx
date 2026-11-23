import type { ComponentType, CSSProperties } from "react";
import {
  BabyBottle,
  Balloons,
  Cloud,
  Onesie,
  Pacifier,
  Rattle,
  Star,
} from "@/components/illustrations";
import { BABY_PATTERN, type BabyItemKind } from "@/lib/baby-pattern";

const ICONS: Record<BabyItemKind, ComponentType<{ className?: string }>> = {
  onesie: Onesie,
  pacifier: Pacifier,
  star: Star,
  bottle: BabyBottle,
  rattle: Rattle,
  cloud: Cloud,
  balloons: Balloons,
};

const TONE = { pink: "text-party-pink", blue: "text-party-blue" } as const;

/**
 * Faint baby items scattered down the whole invitation, behind the content. Wide screens
 * fill the side margins; phones show smaller items peeking in from the edges.
 */
export function BabyPatternBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {BABY_PATTERN.map((item, i) => {
        const Icon = ICONS[item.kind];
        const style = {
          top: `${item.top}%`,
          width: item.size,
          height: item.size,
          "--x": `${item.left}%`,
          "--xm": `${item.leftMobile}%`,
          "--r": `${item.rotate}deg`,
        } as CSSProperties;

        return (
          <span
            key={i}
            style={style}
            className="absolute left-[var(--xm)] -translate-x-1/2 rotate-[var(--r)] scale-[0.6] opacity-30 md:left-[var(--x)] md:scale-100 md:opacity-50"
          >
            <Icon className={`h-full w-full ${item.tone ? TONE[item.tone] : ""}`} />
          </span>
        );
      })}
    </div>
  );
}
