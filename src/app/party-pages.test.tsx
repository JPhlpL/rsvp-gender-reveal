import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// MiniFrames checks the photo files on disk through a server-only helper.
vi.mock("server-only", () => ({}));
vi.mock("@/repositories/invitationRepository", () => ({
  getInvitationByUuid: vi.fn(),
  getRsvpSettings: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("unexpected redirect");
  }),
}));

import { BabyPatternBackground } from "@/components/party/baby-pattern-background";
import { GiftGuide } from "@/components/party/gift-guide";
import { PartyIntro } from "@/components/party/party-intro";
import { RsvpSection } from "@/components/party/rsvp-section";
import { ShowcaseRsvpSection } from "@/components/party/showcase-rsvp-section";
import { rsvpPathSegment } from "@/lib/rsvp-path";
import { getInvitationByUuid, getRsvpSettings } from "@/repositories/invitationRepository";
import { COPY_RSVP_INTRO } from "@/utils/constants";
import PublicInvitationPage from "./invitation/page";
import GuestInvitationPage from "./rsvp/[guestSlug]/page";

const guest = {
  id: "g1",
  uuid: "11111111-1111-4111-8111-111111111111",
  name: "Ana Cruz",
  notes: null,
  added_via: "admin" as const,
};

beforeEach(() => {
  vi.mocked(getRsvpSettings).mockResolvedValue({
    rsvp_deadline: null,
    rsvp_closed: false,
    personalized_links: true,
  });
  vi.mocked(getInvitationByUuid).mockResolvedValue({ guest, response: null });
});

const pages: [string, () => Promise<ReactElement>][] = [
  ["the showcase invitation", () => PublicInvitationPage()],
  [
    "a guest's invitation",
    () =>
      GuestInvitationPage({
        params: Promise.resolve({ guestSlug: rsvpPathSegment(guest.name, guest.uuid) }),
      }),
  ],
];

/** The elements the page hands to PartyIntro, i.e. what appears once the envelope opens. */
function revealedContent(page: ReactElement): ReactNode[] {
  const main = page as ReactElement<{ children: ReactNode }>;
  const intro = Children.toArray(main.props.children).find(
    (child): child is ReactElement<{ children: ReactNode }> =>
      isValidElement(child) && child.type === PartyIntro
  );
  return intro ? Children.toArray(intro.props.children) : [];
}

describe.each(pages)("%s", (_name, render) => {
  it("keeps the baby items out of sight while the envelope shows", async () => {
    const html = renderToStaticMarkup(await render());
    expect(html).toContain("You&#x27;re Invited!");
    expect(html).not.toContain("data-baby-pattern");
  });

  it("brings the baby items in with the invitation once the envelope opens", async () => {
    const content = revealedContent(await render());
    expect(content.some((child) => isValidElement(child) && child.type === BabyPatternBackground)).toBe(
      true
    );
  });

  it("shows the Gift Guide before the RSVP section", async () => {
    const types = revealedContent(await render()).map((child) =>
      isValidElement(child) ? child.type : null
    );
    const giftGuide = types.indexOf(GiftGuide);
    const rsvp = types.findIndex((type) => type === RsvpSection || type === ShowcaseRsvpSection);
    expect(giftGuide).toBeGreaterThan(-1);
    expect(rsvp).toBeGreaterThan(-1);
    expect(giftGuide).toBeLessThan(rsvp);
  });
});

describe("the RSVP heading", () => {
  const deadline = "2026-12-01T15:59:59Z";

  const sections: [string, () => ReactElement][] = [
    [
      "on a guest's invitation",
      () => (
        <RsvpSection
          guest={guest}
          settings={{ rsvp_deadline: deadline, rsvp_closed: false }}
          view={{ kind: "form" }}
          slug={rsvpPathSegment(guest.name, guest.uuid)}
        />
      ),
    ],
    [
      "on the general RSVP form",
      () => (
        <ShowcaseRsvpSection
          view={{ kind: "form" }}
          settings={{ rsvp_deadline: deadline, rsvp_closed: false, personalized_links: false }}
        />
      ),
    ],
  ];

  it.each(sections)("asks guests to answer carefully, without naming a date, %s", (_name, section) => {
    const html = renderToStaticMarkup(section());
    expect(html).toContain(COPY_RSVP_INTRO);
    expect(html).not.toContain("Please RSVP by");
    expect(html).not.toContain("December");
  });
});
