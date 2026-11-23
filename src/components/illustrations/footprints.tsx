import { Svg, type IllustrationProps } from "./svg";

/** A pair of tiny baby footprints, one stepping ahead. Takes its color from `currentColor`. */
export function Footprints(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 48 58" {...props}>
      <g fill="currentColor" strokeWidth={1.5}>
        {/* Left foot */}
        <ellipse cx="15" cy="43" rx="7" ry="11" />
        <circle cx="19.5" cy="27" r="3" />
        <circle cx="14.5" cy="25.5" r="2.3" />
        <circle cx="10.5" cy="27" r="2" />
        <circle cx="7.5" cy="30" r="1.7" />

        {/* Right foot, a step ahead */}
        <ellipse cx="33" cy="29" rx="7" ry="11" />
        <circle cx="28.5" cy="13" r="3" />
        <circle cx="33.5" cy="11.5" r="2.3" />
        <circle cx="37.5" cy="13" r="2" />
        <circle cx="40.5" cy="16" r="1.7" />
      </g>
    </Svg>
  );
}
