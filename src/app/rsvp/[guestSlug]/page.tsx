import { redirect } from "next/navigation";
import { MiniFrames } from "@/components/party/mini-frames";
import { PartyClosing } from "@/components/party/party-closing";
import { PartyDivider } from "@/components/party/party-divider";
import { PartyFooter } from "@/components/party/party-footer";
import { PartyHeader } from "@/components/party/party-header";
import { PartyIntro } from "@/components/party/party-intro";
import { PartyVenue } from "@/components/party/party-venue";
import { PrizesTeaser } from "@/components/party/prizes-teaser";
import { GuestNotesCallout } from "@/components/party/guest-notes-callout";
import { WearYourGuess } from "@/components/party/wear-your-guess";
import { resolveInvitationView } from "@/lib/invitation-view";
import {
  parseGuestUuidFromRsvpParam,
  rsvpPathSegment,
  rsvpSlugsMatch,
} from "@/lib/rsvp-path";
import { getInvitationByUuid, getRsvpSettings } from "@/repositories/invitationRepository";

export const dynamic = "force-dynamic";

interface InvitationPageProps {
  params: Promise<{ guestSlug: string }>;
}

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { guestSlug } = await params;

  const uuid = parseGuestUuidFromRsvpParam(guestSlug);
  if (!uuid) redirect("/rsvp/error");

  const [invitation, settings] = await Promise.all([
    getInvitationByUuid(uuid),
    getRsvpSettings(),
  ]);
  if (!invitation) redirect("/rsvp/error");

  const { guest, response } = invitation;
  const canonicalSlug = rsvpPathSegment(guest.name, guest.uuid);
  if (!rsvpSlugsMatch(guestSlug, canonicalSlug)) {
    redirect(`/rsvp/${canonicalSlug}`);
  }

  const view = resolveInvitationView(response, settings, new Date());

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <PartyIntro>
        <PartyHeader />
        <PartyDivider />
        <MiniFrames />
        <PartyDivider />
        <WearYourGuess />
        <PartyDivider />
        <PartyVenue />
        <PrizesTeaser />
        <PartyDivider />
        <section id="rsvp" className="px-4 py-10 sm:py-14">
          <div className="mx-auto max-w-xl">
            {/* Replaced by the RSVP section in Task 8. */}
            <GuestNotesCallout notes={guest.notes} />
            <p data-view={view.kind}>RSVP</p>
          </div>
        </section>
        <PartyDivider />
        <PartyClosing />
        <PartyFooter />
      </PartyIntro>
    </main>
  );
}
