import { BLUE, BLUE_DEEP, PINK, Svg, WHITE, type IllustrationProps } from "./svg";

/** Baby rattle: pink ball with a blue band and a blue handle. */
export function Rattle(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 64 64" {...props}>
      <rect
        x="34"
        y="32"
        width="8"
        height="26"
        rx="4"
        transform="rotate(-45 38 45)"
        fill={BLUE}
      />
      <circle cx="54" cy="54" r="6" fill={PINK} />
      <circle cx="24" cy="24" r="17" fill={PINK} />
      <path d="M8.5 20 Q24 31 39.5 20" stroke={BLUE_DEEP} strokeWidth={4} />
      <path d="M15 14 Q19 9 24 9" stroke={WHITE} strokeWidth={3} />
      <circle cx="36.5" cy="36.5" r="4" fill={WHITE} />
    </Svg>
  );
}
