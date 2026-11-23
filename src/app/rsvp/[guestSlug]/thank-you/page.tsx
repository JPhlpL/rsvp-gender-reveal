import Link from "next/link";
import { redirect } from "next/navigation";
import { Balloons } from "@/components/illustrations";
import { AnswerStatusCard } from "@/components/party/answer-status-card";
import { PartyClosing } from "@/components/party/party-closing";
import { PartyFooter } from "@/components/party/party-footer";
import { parseGuestUuidFromRsvpParam, rsvpPathSegment } from "@/lib/rsvp-path";
import { getInvitationByUuid, getRsvpSettings } from "@/repositories/invitationRepository";

export const dynamic = "force-dynamic";

interface ThankYouPageProps {
  params: Promise<{ guestSlug: string }>;
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const { guestSlug } = await params;

  const uuid = parseGuestUuidFromRsvpParam(guestSlug);
  if (!uuid) redirect("/rsvp/error");

  const [invitation, settings] = await Promise.all([getInvitationByUuid(uuid), getRsvpSettings()]);
  if (!invitation) redirect("/rsvp/error");

  const { guest, response } = invitation;
  if (!response) redirect(`/rsvp/${rsvpPathSegment(guest.name, guest.uuid)}`);

  const canAnswerAgain = guest.added_via === "general_link" && !settings.personalized_links;

  return (
    <main className="flex min-h-screen flex-col">
      <section className="px-4 pt-14 pb-6 text-center">
        <Balloons className="mx-auto mb-4 h-24 w-20" />
        <h1 className="font-display text-4xl font-semibold text-party-ink sm:text-5xl">Thank you!</h1>
        <p className="mt-2 text-base text-party-ink-soft">Your RSVP is in, {guest.name}.</p>
      </section>
      <div className="mx-auto w-full max-w-xl px-4">
        <AnswerStatusCard response={response} />
        {canAnswerAgain && (
          <p className="mt-4 text-center text-base text-party-ink-soft">
            Answering for someone else?{" "}
            <Link href="/invitation" className="font-semibold text-party-ink underline underline-offset-4">
              Fill in the form again
            </Link>
          </p>
        )}
      </div>
      <PartyClosing />
      <PartyFooter />
    </main>
  );
}
