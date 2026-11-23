import { Svg, WHITE, type IllustrationProps } from "./svg";

/** Baby sock with a white cuff. Takes its color from `currentColor`. */
export function Sock(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 48 64" {...props}>
      <path
        d="M14 10 H32 V36 Q33 42 40 44 Q46 46 45 52 Q44 58 37 58 H22 Q13 58 13 49 Z"
        fill="currentColor"
      />
      <rect x="12" y="5" width="22" height="10" rx="3.5" fill={WHITE} />
      <path d="M17.5 8v4M23 8v4M28.5 8v4" strokeWidth={1.5} />
      <circle cx="22" cy="27" r="1.8" fill={WHITE} stroke="none" />
      <circle cx="25" cy="37" r="1.8" fill={WHITE} stroke="none" />
      <circle cx="33" cy="50" r="1.8" fill={WHITE} stroke="none" />
    </Svg>
  );
}
