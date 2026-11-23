import { BabyPatternBackground } from "@/components/party/baby-pattern-background";
import { GiftGuide } from "@/components/party/gift-guide";
import { MiniFrames } from "@/components/party/mini-frames";
import { PartyClosing } from "@/components/party/party-closing";
import { PartyDivider } from "@/components/party/party-divider";
import { PartyFooter } from "@/components/party/party-footer";
import { PartyHeader } from "@/components/party/party-header";
import { PartyIntro } from "@/components/party/party-intro";
import { PartyMusicPlayer } from "@/components/party/party-music-player";
import { PartyVenue } from "@/components/party/party-venue";
import { PrizesTeaser } from "@/components/party/prizes-teaser";
import { ShowcaseRsvpSection } from "@/components/party/showcase-rsvp-section";
import { WearYourGuess } from "@/components/party/wear-your-guess";
import { resolveShowcaseView } from "@/lib/invitation-view";
import { getRsvpSettings } from "@/repositories/invitationRepository";

// Reads the personalized-links switch on every request.
export const dynamic = "force-dynamic";

/**
 * The public invitation. Personalized links on: a showcase with a note in place of the
 * RSVP form. Off: the general RSVP form anyone can answer (design §12).
 */
export default async function PublicInvitationPage() {
  const settings = await getRsvpSettings();
  const view = resolveShowcaseView(settings, new Date());

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-28">
      <PartyIntro>
        {/* Inside the intro, so the baby items fade in with the invitation, not behind the envelope */}
        <BabyPatternBackground />
        <PartyHeader />
        <PartyDivider />
        <MiniFrames />
        <PartyDivider />
        <WearYourGuess />
        <PartyDivider />
        <PartyVenue />
        <PrizesTeaser />
        <PartyDivider />
        <GiftGuide />
        <PartyDivider />
        <ShowcaseRsvpSection view={view} />
        <PartyDivider />
        <PartyClosing />
        <PartyFooter />
      </PartyIntro>
      {/* Outside the intro, so it is ready to start the song on the envelope tap */}
      <PartyMusicPlayer />
    </main>
  );
}
