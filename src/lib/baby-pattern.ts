/**
 * Layout of the faint baby items scattered behind the invitation. Positions look random but
 * come from a fixed seed, so the server and the browser draw exactly the same thing.
 */
export type BabyItemKind =
  | "onesie"
  | "pacifier"
  | "star"
  | "heart"
  | "footprints"
  | "sock"
  | "bottle"
  | "rattle"
  | "cloud"
  | "balloons"
  | "teddy"
  | "moon"
  | "crib";

/** Items drawn in a single tint (pink or blue). The others carry their own pink-and-blue colors. */
export const TINTED_KINDS: ReadonlySet<BabyItemKind> = new Set([
  "onesie",
  "pacifier",
  "star",
  "heart",
  "footprints",
  "sock",
]);

export interface BabyPatternItem {
  kind: BabyItemKind;
  tone: "pink" | "blue" | null;
  /** Percent of the page height. */
  top: number;
  side: "left" | "right";
  /**
   * Wide screens: how far across the side margin (beside the invitation column) the item
   * sits, from 0 at the page edge to 1 at the column. Below 0.5 is the outer lane.
   */
  across: number;
  /** Percent of the page width on phones (the very edges, partly off-screen). */
  leftMobile: number;
  /** Pixels on wide screens; phones draw it smaller. */
  size: number;
  /** Degrees. */
  rotate: number;
}

const KINDS: BabyItemKind[] = [
  "onesie",
  "bottle",
  "pacifier",
  "rattle",
  "star",
  "cloud",
  "balloons",
  "heart",
  "footprints",
  "sock",
  "teddy",
  "moon",
  "crib",
];

const UNTINTED_KINDS = KINDS.filter((kind) => !TINTED_KINDS.has(kind));

/** The two lanes of each margin; the inner lane sits half a row lower, so they zig-zag. */
const LANES = [
  { lane: "outer", across: [0.1, 0.42], offset: 0.25 },
  { lane: "inner", across: [0.58, 0.9], offset: 0.75 },
] as const;

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
const round2 = (n: number) => Math.round(n * 100) / 100;

/** Two lanes per side, one item per lane per row, rows spread down the full page height. */
export function buildBabyPattern(seed = 20261205, rows = 30): BabyPatternItem[] {
  const rand = seeded(seed);
  const between = (min: number, max: number) => min + rand() * (max - min);
  const items: BabyPatternItem[] = [];
  const lastInLane = new Map<string, BabyItemKind>();

  for (let row = 0; row < rows; row++) {
    for (const side of ["left", "right"] as const) {
      for (const { lane, across, offset } of LANES) {
        const laneKey = `${side}-${lane}`;
        const previous = lastInLane.get(laneKey);
        let kind: BabyItemKind;
        do {
          kind = KINDS[Math.floor(rand() * KINDS.length)];
        } while (kind === previous);
        lastInLane.set(laneKey, kind);

        items.push({
          kind,
          tone: null,
          top: round1(((row + offset + between(-0.12, 0.12)) / rows) * 100),
          side,
          across: round2(between(across[0], across[1])),
          leftMobile: round1(side === "left" ? between(1, 6) : between(94, 99)),
          size: Math.round(between(30, 58)),
          rotate: Math.round(between(-28, 28)),
        });
      }
    }
  }

  // Alternate pink and blue across tinted items. An odd one out becomes an untinted item that
  // differs from its lane neighbours (same lane = 4 items apart: 2 sides x 2 lanes per row).
  const tinted = items.filter((item) => TINTED_KINDS.has(item.kind));
  if (tinted.length % 2 === 1) {
    const odd = tinted.pop()!;
    const at = items.indexOf(odd);
    const near = [items[at - 4]?.kind, items[at + 4]?.kind];
    odd.kind = UNTINTED_KINDS.find((kind) => !near.includes(kind))!;
  }
  tinted.forEach((item, i) => {
    item.tone = i % 2 === 0 ? "pink" : "blue";
  });

  return items;
}

export const BABY_PATTERN: readonly BabyPatternItem[] = buildBabyPattern();
