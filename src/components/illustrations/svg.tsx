import type { ReactNode } from "react";

export interface IllustrationProps {
  className?: string;
  /** When set, the drawing is announced as an image with this label; otherwise it is decorative. */
  title?: string;
}

/** Theme colors (see `--color-party-*` in globals.css). */
export const PINK = "var(--color-party-pink)";
export const PINK_DEEP = "var(--color-party-pink-deep)";
export const BLUE = "var(--color-party-blue)";
export const BLUE_DEEP = "var(--color-party-blue-deep)";
export const CREAM = "var(--color-party-cream)";
export const WHITE = "var(--color-party-white)";
export const INK = "var(--color-party-ink)";
export const INK_SOFT = "var(--color-party-ink-soft)";

/** Shared outer <svg>: ink outlines, rounded joins, decorative unless titled. */
export function Svg({
  viewBox,
  className,
  title,
  children,
}: IllustrationProps & { viewBox: string; children: ReactNode }) {
  const a11y = title ? { role: "img" as const } : { "aria-hidden": true as const };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      fill="none"
      stroke={INK}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11y}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
