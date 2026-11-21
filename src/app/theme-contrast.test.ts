import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

type Rgb = [number, number, number];

const css = readFileSync(path.resolve(__dirname, "globals.css"), "utf8");

function token(name: string): Rgb {
  const match = css.match(new RegExp(`--color-party-${name}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!match) throw new Error(`token --color-party-${name} not found`);
  const hex = match[1];
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb;
}

function luminance([r, g, b]: Rgb): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: Rgb, b: Rgb): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** A translucent fill (e.g. bg-party-pink/60) as it renders over `base`. */
function over(fill: Rgb, alpha: number, base: Rgb): Rgb {
  return fill.map((c, i) => Math.round(c * alpha + base[i] * (1 - alpha))) as Rgb;
}

const AA = 4.5;

describe("party text colors meet WCAG AA (spec §7.11)", () => {
  const white = () => token("white");
  const cream = () => token("cream");

  const pairs: [string, () => Rgb, () => Rgb][] = [
    ["pink-ink on white", () => token("pink-ink"), white],
    ["pink-ink on cream", () => token("pink-ink"), cream],
    ["pink-ink on pink/60 over white", () => token("pink-ink"), () => over(token("pink"), 0.6, white())],
    ["pink-ink on pink/60 over cream", () => token("pink-ink"), () => over(token("pink"), 0.6, cream())],
    ["blue-ink on white", () => token("blue-ink"), white],
    ["blue-ink on cream", () => token("blue-ink"), cream],
    ["blue-ink on blue/60 over white", () => token("blue-ink"), () => over(token("blue"), 0.6, white())],
    ["blue-ink on blue/60 over cream", () => token("blue-ink"), () => over(token("blue"), 0.6, cream())],
    ["ink-soft on white", () => token("ink-soft"), white],
    ["ink-soft on cream", () => token("ink-soft"), cream],
    ["ink on cream", () => token("ink"), cream],
  ];

  it.each(pairs)("%s", (_label, fg, bg) => {
    expect(contrast(fg(), bg())).toBeGreaterThanOrEqual(AA);
  });
});

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx$/.test(entry.name) && !/\.test\.tsx$/.test(entry.name) ? [full] : [];
  });
}

describe("text never uses the pale illustration accents", () => {
  it("has no text-party-pink-deep / text-party-blue-deep classes", () => {
    const offenders = sourceFiles(path.resolve(__dirname, ".."))
      .filter((file) => /\btext-party-(pink|blue)-deep\b/.test(readFileSync(file, "utf8")))
      .map((file) => path.relative(path.resolve(__dirname, ".."), file));
    expect(offenders).toEqual([]);
  });
});
