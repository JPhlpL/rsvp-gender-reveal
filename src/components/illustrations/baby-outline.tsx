import { Svg, WHITE, type IllustrationProps } from "./svg";

/** Sleeping baby wrapped in a blanket: placeholder inside the photo frames. Uses `currentColor`. */
export function BabyOutline(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 120 120" {...props}>
      <path d="M22 116 Q22 80 60 80 Q98 80 98 116 Z" fill="currentColor" />
      <path d="M42 92 Q60 102 78 92" stroke={WHITE} strokeWidth={3} />
      <circle cx="60" cy="52" r="28" fill={WHITE} stroke="currentColor" strokeWidth={3} />
      <path d="M56 25 Q58 16 66 19 Q70 22 66 26" stroke="currentColor" strokeWidth={3} />
      <path d="M44 52 Q48 56 52 52" strokeWidth={2.5} />
      <path d="M68 52 Q72 56 76 52" strokeWidth={2.5} />
      <path d="M54 64 Q60 69 66 64" strokeWidth={2.5} />
      <circle cx="42" cy="61" r="4" fill="currentColor" stroke="none" opacity={0.35} />
      <circle cx="78" cy="61" r="4" fill="currentColor" stroke="none" opacity={0.35} />
    </Svg>
  );
}
