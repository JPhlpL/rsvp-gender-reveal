import { Svg, WHITE, type IllustrationProps } from "./svg";

/** Sleepy crescent moon with a closed eye. */
export function Moon(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 48 48" {...props}>
      <path d="M24.8 6 A18 18 0 1 0 41.5 28.3 A14 14 0 1 1 24.8 6 Z" fill={WHITE} />
      <path d="M11 28 Q14 31 17 28" />
    </Svg>
  );
}
