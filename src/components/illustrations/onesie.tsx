import { Svg, WHITE, type IllustrationProps } from "./svg";

/** Baby onesie. Takes its color from `currentColor` (e.g. `text-party-pink`). */
export function Onesie(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 64 64" {...props}>
      <path
        d="M22 8 Q32 17 42 8 L56 16 L50 28 L44 25 V51 Q44 58 37 58 H36 Q32 52 28 58 H27 Q20 58 20 51 V25 L14 28 L8 16 Z"
        fill="currentColor"
      />
      <path d="M24 10 Q32 19 40 10" stroke={WHITE} />
      <circle cx="32" cy="36" r="4.5" fill={WHITE} strokeWidth={1.5} />
      <circle cx="28.5" cy="55" r="1.5" fill={WHITE} stroke="none" />
      <circle cx="35.5" cy="55" r="1.5" fill={WHITE} stroke="none" />
    </Svg>
  );
}
