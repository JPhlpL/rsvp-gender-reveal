import { INK_SOFT, Svg, type IllustrationProps } from "./svg";

/** Little clothespin that "holds" each photo frame. Uses `currentColor`. */
export function Clothespin(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 24 56" {...props}>
      <rect x="4" y="2" width="7" height="52" rx="3.5" fill="currentColor" />
      <rect x="13" y="2" width="7" height="52" rx="3.5" fill="currentColor" />
      <circle cx="12" cy="24" r="5" fill="none" stroke={INK_SOFT} strokeWidth={2.5} />
    </Svg>
  );
}
