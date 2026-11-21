import { BLUE, PINK, Svg, WHITE, type IllustrationProps } from "./svg";

/** A pink and a blue balloon tied together, equal in size. */
export function Balloons(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 80 100" {...props}>
      <path d="M27 54 Q24 70 34 80 Q40 86 40 94" />
      <path d="M53 54 Q56 70 46 80 Q40 86 40 94" />

      <ellipse cx="27" cy="30" rx="18" ry="22" fill={PINK} />
      <path d="M24 52 L27 57 L30 52 Z" fill={PINK} />
      <path d="M17 22 Q19 15 25 13" stroke={WHITE} strokeWidth={3} />

      <ellipse cx="53" cy="30" rx="18" ry="22" fill={BLUE} />
      <path d="M50 52 L53 57 L56 52 Z" fill={BLUE} />
      <path d="M43 22 Q45 15 51 13" stroke={WHITE} strokeWidth={3} />

      <path d="M40 92 l-6 -4 v8 z M40 92 l6 -4 v8 z" fill={PINK} />
    </Svg>
  );
}
