import { BLUE, PINK, Svg, WHITE, type IllustrationProps } from "./svg";

/** Site mark: a circle split evenly pink and blue with a question mark. */
export function PartyMark(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 64 64" {...props}>
      <path d="M32 4 A28 28 0 0 0 32 60 Z" fill={PINK} stroke="none" />
      <path d="M32 4 A28 28 0 0 1 32 60 Z" fill={BLUE} stroke="none" />
      <circle cx="32" cy="32" r="28" />
      <path
        d="M24 25 Q24 16 32 16 Q40 16 40 24 Q40 30 33 32 Q32 33 32 37"
        stroke={WHITE}
        strokeWidth={5}
      />
      <circle cx="32" cy="46" r="3.5" fill={WHITE} stroke="none" />
    </Svg>
  );
}
