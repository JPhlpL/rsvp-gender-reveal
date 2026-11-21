import { Svg, type IllustrationProps } from "./svg";

/** Rounded five-point star. Takes its color from `currentColor`. */
export function Star(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 32 32" {...props}>
      <path
        d="M16 3 L19.6 11.2 L28.5 12 L21.8 17.9 L23.8 26.6 L16 22 L8.2 26.6 L10.2 17.9 L3.5 12 L12.4 11.2 Z"
        fill="currentColor"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
