import { BLUE, CREAM, PINK, PINK_DEEP, Svg, WHITE, type IllustrationProps } from "./svg";

/** Baby bottle ("dede") with a pink nipple and a blue collar. */
export function BabyBottle(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 48 80" {...props}>
      <path d="M18 17 Q18 4 24 4 Q30 4 30 17 Z" fill={PINK} />
      <rect x="11" y="16" width="26" height="9" rx="3" fill={BLUE} />
      <rect x="10" y="25" width="28" height="50" rx="9" fill={WHITE} />
      <path
        d="M12 46 H36 V66 Q36 73 29 73 H19 Q12 73 12 66 Z"
        fill={CREAM}
        stroke="none"
      />
      <path d="M30 35h5M30 43h5M30 51h5M30 59h5" />
      <path
        d="M20 55 c-3-3-7 0-4 4 l4 4 4-4 c3-4-1-7-4-4 z"
        fill={PINK_DEEP}
        strokeWidth={1.5}
      />
    </Svg>
  );
}
