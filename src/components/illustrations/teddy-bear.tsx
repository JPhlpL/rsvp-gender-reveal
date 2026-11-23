import { BLUE, CREAM, INK, PINK, Svg, WHITE, type IllustrationProps } from "./svg";

/** Teddy bear with one pink and one blue ear and a pink-and-blue bow tie. */
export function TeddyBear(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 64 64" {...props}>
      {/* Body */}
      <ellipse cx="32" cy="51" rx="14" ry="11" fill={CREAM} />
      <ellipse cx="32" cy="53" rx="7" ry="5.5" fill={WHITE} strokeWidth={1.5} />

      {/* Ears */}
      <circle cx="18" cy="15" r="7" fill={CREAM} />
      <circle cx="18" cy="15" r="3.5" fill={PINK} strokeWidth={1.5} />
      <circle cx="46" cy="15" r="7" fill={CREAM} />
      <circle cx="46" cy="15" r="3.5" fill={BLUE} strokeWidth={1.5} />

      {/* Head */}
      <circle cx="32" cy="27" r="15" fill={CREAM} />
      <circle cx="26" cy="25" r="1.7" fill={INK} stroke="none" />
      <circle cx="38" cy="25" r="1.7" fill={INK} stroke="none" />
      <ellipse cx="32" cy="32" rx="6" ry="4.5" fill={WHITE} strokeWidth={1.5} />
      <ellipse cx="32" cy="30.5" rx="2" ry="1.4" fill={INK} stroke="none" />

      {/* Bow tie */}
      <path d="M32 43 l-6 -3.5 v7 z" fill={PINK} strokeWidth={1.5} />
      <path d="M32 43 l6 -3.5 v7 z" fill={BLUE} strokeWidth={1.5} />
    </Svg>
  );
}
