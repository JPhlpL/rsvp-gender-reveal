import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BABY_PATTERN } from "@/lib/baby-pattern";
import { makeResponse } from "@/test/factories";
import { AnswerStatusCard } from "./answer-status-card";
import { BabyPatternBackground } from "./baby-pattern-background";
import { GiftGuide } from "./gift-guide";
import { RsvpShowcaseNote } from "./rsvp-showcase-note";

describe("AnswerStatusCard", () => {
  it("keeps reminding a girl guesser to wear pink after they answer", () => {
    const html = renderToStaticMarkup(
      <AnswerStatusCard response={makeResponse({ is_attending: true, guess: "girl" })} />
    );
    expect(html).toContain("Your guess: Girl. Wear pink!");
  });

  it("keeps reminding a boy guesser to wear blue after they answer", () => {
    const html = renderToStaticMarkup(
      <AnswerStatusCard response={makeResponse({ is_attending: true, guess: "boy" })} />
    );
    expect(html).toContain("Your guess: Boy. Wear blue!");
  });

  it("shows no dress code to guests who can't come", () => {
    const html = renderToStaticMarkup(
      <AnswerStatusCard response={makeResponse({ is_attending: false, guess: null })} />
    );
    expect(html).not.toContain("Wear ");
  });
});

describe("GiftGuide", () => {
  it("shows the couple's gift guide word for word", () => {
    const html = renderToStaticMarkup(<GiftGuide />);
    expect(html).toContain("Gift Guide");
    expect(html).toContain(
      "Having you celebrate with us is truly all we could ask for. However, if you’d like to give a gift, gender-neutral clothing, everyday baby essentials, or nursery items would mean the world to us. Thank you so much!"
    );
  });
});

describe("RsvpShowcaseNote", () => {
  it("points visitors to their personal link instead of showing a form", () => {
    const html = renderToStaticMarkup(<RsvpShowcaseNote />);
    expect(html).toContain("RSVP");
    expect(html).toContain("Please RSVP using the personal link Philip &amp; Vera sent you.");
    expect(html).toContain("Don&#x27;t have one yet? Message Philip &amp; Vera.");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
  });
});

describe("BabyPatternBackground", () => {
  const html = renderToStaticMarkup(<BabyPatternBackground />);

  it("draws one baby item per pattern entry, hidden from screen readers", () => {
    expect(html.match(/<svg/g)?.length).toBe(BABY_PATTERN.length);
    expect(html).toMatch(/^<div aria-hidden="true"/);
  });

  it("places wide-screen items in the margins beside the invitation column", () => {
    // Left margin measured from the page edge, right margin mirrored from the other edge.
    expect(html).toMatch(/--x:calc\(\(50% - 18rem\) \* 0\.\d+\)/);
    expect(html).toMatch(/--x:calc\(100% - \(50% - 18rem\) \* 0\.\d+\)/);
  });
});
