import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { makeResponse } from "@/test/factories";
import { AnswerStatusCard } from "./answer-status-card";
import { GiftGuide } from "./gift-guide";

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
