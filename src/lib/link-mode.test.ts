import { describe, expect, it } from "vitest";
import { linkModeCopy } from "./link-mode";

describe("linkModeCopy", () => {
  it("explains that /invitation is only a showcase while personalized links are on", () => {
    const copy = linkModeCopy(true);
    expect(copy.state).toBe("On");
    expect(copy.summary).toBe(
      "Guests answer from the personal link you send each of them, so add them to your list first."
    );
    expect(copy.linkTitle).toBe("Showcase link");
    expect(copy.linkPurpose).toBe(
      "Anyone can open it to see the invitation, but there's no RSVP form. It asks visitors to use their personal link."
    );
    expect(copy.copyLabel).toBe("Copy showcase link");
    expect(copy.copiedToast).toBe("Showcase link copied");
    expect(copy.badge).toBe("Personalized links: on");
  });

  it("explains that anyone can RSVP at /invitation while personalized links are off", () => {
    const copy = linkModeCopy(false);
    expect(copy.state).toBe("Off");
    expect(copy.summary).toBe(
      "Anyone can RSVP at the general link below, and each answer adds a guest to your list. Personal links you already sent keep working."
    );
    expect(copy.linkTitle).toBe("General RSVP link");
    expect(copy.linkPurpose).toBe(
      "Anyone who opens it can RSVP, without being on your list first. Share it in group chats or on social media."
    );
    expect(copy.copyLabel).toBe("Copy general link");
    expect(copy.copiedToast).toBe("General link copied");
    expect(copy.badge).toBe("Personalized links: off (anyone can RSVP)");
  });
});
