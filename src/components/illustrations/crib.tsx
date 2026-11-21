import { BLUE, PINK, Svg, WHITE, type IllustrationProps } from "./svg";

const BAR_XS = [24, 32, 40, 48, 56, 64, 72];

/** Baby crib with a pink mattress and a blue blanket. */
export function Crib(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 96 84" {...props}>
      {/* Mobile */}
      <path d="M48 4v8" />
      <path d="M36 12h24" />
      <circle cx="36" cy="17" r="3.5" fill={PINK} />
      <circle cx="48" cy="17" r="3.5" fill={BLUE} />
      <circle cx="60" cy="17" r="3.5" fill={PINK} />

      {/* Headboard rail and bars */}
      <path d="M14 34 Q48 22 82 34" />
      {BAR_XS.map((x) => (
        <path key={`top-${x}`} d={`M${x} ${x === 48 ? 30 : 32}V50`} />
      ))}
      <path d="M14 66H82" />
      {BAR_XS.map((x) => (
        <path key={`low-${x}`} d={`M${x} 60V66`} />
      ))}

      {/* Mattress, pillow and blanket */}
      <rect x="14" y="50" width="68" height="10" rx="3" fill={PINK} />
      <ellipse cx="27" cy="47" rx="9" ry="5" fill={WHITE} />
      <path d="M40 50 Q42 42 52 43 H76 Q81 43 81 50 Z" fill={BLUE} />
      <path d="M46 46h28" strokeDasharray="2 4" />

      {/* Posts with round feet */}
      <rect x="8" y="26" width="6" height="50" rx="3" fill={WHITE} />
      <rect x="82" y="26" width="6" height="50" rx="3" fill={WHITE} />
      <circle cx="11" cy="24" r="4" fill={BLUE} />
      <circle cx="85" cy="24" r="4" fill={PINK} />
      <circle cx="11" cy="79" r="3" fill={PINK} />
      <circle cx="85" cy="79" r="3" fill={BLUE} />
    </Svg>
  );
}
