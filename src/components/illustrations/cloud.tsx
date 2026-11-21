import { Svg, WHITE, type IllustrationProps } from "./svg";

/** Puffy white cloud. */
export function Cloud(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 80 48" {...props}>
      <path
        d="M18 42 Q4 42 4 31 Q4 21 15 20 Q16 8 29 8 Q38 8 42 15 Q46 10 53 11 Q63 13 63 23 Q76 23 76 33 Q76 42 64 42 Z"
        fill={WHITE}
      />
    </Svg>
  );
}
