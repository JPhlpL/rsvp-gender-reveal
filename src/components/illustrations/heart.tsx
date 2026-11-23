import { Svg, WHITE, type IllustrationProps } from "./svg";

/** Little heart. Takes its color from `currentColor`. */
export function Heart(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 32 32" {...props}>
      <path
        d="M16 27 C6 20 3 14.5 3 10 C3 6.2 6 3.5 9.5 3.5 C12.5 3.5 14.8 5.3 16 7.6 C17.2 5.3 19.5 3.5 22.5 3.5 C26 3.5 29 6.2 29 10 C29 14.5 26 20 16 27 Z"
        fill="currentColor"
        strokeWidth={1.5}
      />
      <path d="M7.5 10 Q7.8 7.6 10.2 7" stroke={WHITE} strokeWidth={2} />
    </Svg>
  );
}
