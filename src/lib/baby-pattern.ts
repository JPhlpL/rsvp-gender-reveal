/**
 * Layout of the faint baby items scattered behind the invitation. Positions look random but
 * come from a fixed seed, so the server and the browser draw exactly the same thing.
 */
export type BabyItemKind = "onesie" | "pacifier" | "star" | "bottle" | "rattle" | "cloud" | "balloons";

/** Items drawn in a single tint (pink or blue). The others carry their own pink-and-blue colors. */
export const TINTED_KINDS: ReadonlySet<BabyItemKind> = new Set(["onesie", "pacifier", "star"]);

export interface BabyPatternItem {
  kind: BabyItemKind;
  tone: "pink" | "blue" | null;
  /** Percent of the page height. */
  top: number;
  /** Percent of the page width on wide screens (side margins only). */
  left: number;
  /** Percent of the page width on phones (the very edges, partly off-screen). */
  leftMobile: number;
  /** Pixels on wide screens; phones draw it smaller. */
  size: number;
  /** Degrees. */
  rotate: number;
}

const KINDS: BabyItemKind[] = ["onesie", "bottle", "pacifier", "rattle", "star", "cloud", "balloons"];

/** Small seeded random generator (mulberry32). */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** One item on each side per row, rows spread down the full page height. */
export function buildBabyPattern(seed = 20261205, rows = 24): BabyPatternItem[] {
  const rand = seeded(seed);
  const between = (min: number, max: number) => min + rand() * (max - min);
  const items: BabyPatternItem[] = [];

  for (let row = 0; row < rows; row++) {
    for (const side of ["left", "right"] as const) {
      const kind = KINDS[(row * 3 + (side === "left" ? 0 : 4)) % KINDS.length];
      items.push({
        kind,
        tone: null,
        top: round1(((row + between(0.15, 0.85)) / rows) * 100),
        left: round1(side === "left" ? between(3, 25) : between(75, 97)),
        leftMobile: round1(side === "left" ? between(1, 6) : between(94, 99)),
        size: Math.round(between(34, 60)),
        rotate: Math.round(between(-28, 28)),
      });
    }
  }

  // Alternate pink and blue across tinted items; an odd one out becomes a (two-tone) bottle.
  const tinted = items.filter((item) => TINTED_KINDS.has(item.kind));
  if (tinted.length % 2 === 1) {
    tinted[tinted.length - 1].kind = "bottle";
    tinted.pop();
  }
  tinted.forEach((item, i) => {
    item.tone = i % 2 === 0 ? "pink" : "blue";
  });

  return items;
}

export const BABY_PATTERN: readonly BabyPatternItem[] = buildBabyPattern();
