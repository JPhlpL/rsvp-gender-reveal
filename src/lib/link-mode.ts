/** Dashboard wording for the Personalized links switch and what /invitation does in each mode. */
export interface LinkModeCopy {
  state: "On" | "Off";
  summary: string;
  linkTitle: string;
  linkPurpose: string;
  copyLabel: string;
  copiedToast: string;
  badge: string;
}

const ON: LinkModeCopy = {
  state: "On",
  summary:
    "Guests answer from the personal link you send each of them, so add them to your list first.",
  linkTitle: "Showcase link",
  linkPurpose:
    "Anyone can open it to see the invitation, but there's no RSVP form. It asks visitors to use their personal link.",
  copyLabel: "Copy showcase link",
  copiedToast: "Showcase link copied",
  badge: "Personalized links: on",
};

const OFF: LinkModeCopy = {
  state: "Off",
  summary:
    "Anyone can RSVP at the general link below, and each answer adds a guest to your list. Personal links you already sent keep working.",
  linkTitle: "General RSVP link",
  linkPurpose:
    "Anyone who opens it can RSVP, without being on your list first. Share it in group chats or on social media.",
  copyLabel: "Copy general link",
  copiedToast: "General link copied",
  badge: "Personalized links: off (anyone can RSVP)",
};

export function linkModeCopy(personalizedLinks: boolean): LinkModeCopy {
  return personalizedLinks ? ON : OFF;
}
