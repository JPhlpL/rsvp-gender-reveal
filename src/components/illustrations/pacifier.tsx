import { Svg, WHITE, type IllustrationProps } from "./svg";

/** Pacifier. Takes its color from `currentColor`. */
export function Pacifier(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 64 64" {...props}>
      <circle cx="32" cy="15" r="9" stroke="currentColor" strokeWidth={5} />
      <ellipse cx="32" cy="52" rx="7" ry="8" fill={WHITE} />
      <ellipse cx="32" cy="36" rx="21" ry="12" fill="currentColor" />
      <circle cx="32" cy="36" r="5" fill={WHITE} />
    </Svg>
  );
}
