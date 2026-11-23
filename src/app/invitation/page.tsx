import { GiftGuide } from "@/components/party/gift-guide";
import { MiniFrames } from "@/components/party/mini-frames";
import { PartyClosing } from "@/components/party/party-closing";
import { PartyDivider } from "@/components/party/party-divider";
import { PartyFooter } from "@/components/party/party-footer";
import { PartyHeader } from "@/components/party/party-header";
import { PartyIntro } from "@/components/party/party-intro";
import { PartyVenue } from "@/components/party/party-venue";
import { PrizesTeaser } from "@/components/party/prizes-teaser";
import { RsvpShowcaseNote } from "@/components/party/rsvp-showcase-note";
import { WearYourGuess } from "@/components/party/wear-your-guess";

/**
 * Public showcase of the invitation: the same page guests get, with a note in place of
 * the RSVP form. Reads and writes no guest data. The envelope shows on every visit.
 */
export default function ShowcaseInvitationPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <PartyIntro rememberOpened={false}>
        <PartyHeader />
        <PartyDivider />
        <MiniFrames />
        <PartyDivider />
        <WearYourGuess />
        <PartyDivider />
        <PartyVenue />
        <PrizesTeaser />
        <PartyDivider />
        <RsvpShowcaseNote />
        <PartyDivider />
        <GiftGuide />
        <PartyDivider />
        <PartyClosing />
        <PartyFooter />
      </PartyIntro>
    </main>
  );
}
