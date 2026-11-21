import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import * as illustrations from "./index";

const entries = Object.entries(illustrations);

describe("illustrations", () => {
  it("exports the full baby set", () => {
    expect(Object.keys(illustrations).sort()).toEqual(
      [
        "BabyBottle",
        "BabyOutline",
        "Balloons",
        "Clothespin",
        "Cloud",
        "Crib",
        "Onesie",
        "Pacifier",
        "PartyMark",
        "Rattle",
        "Star",
      ].sort()
    );
  });

  it.each(entries)("%s renders a decorative svg", (_name, Component) => {
    const html = renderToStaticMarkup(<Component />);
    expect(html).toContain("<svg");
    expect(html).toContain('aria-hidden="true"');
  });

  it.each(entries)("%s uses only theme colors (no hex literals)", (_name, Component) => {
    const html = renderToStaticMarkup(<Component />);
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });

  it.each(entries)("%s becomes a labelled image when given a title", (_name, Component) => {
    const html = renderToStaticMarkup(<Component title="Cute drawing" />);
    expect(html).toContain('role="img"');
    expect(html).toContain("<title>Cute drawing</title>");
    expect(html).not.toContain('aria-hidden="true"');
  });
});
