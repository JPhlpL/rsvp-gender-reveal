import { BabyOutline } from "@/components/illustrations";
import { PartyFooter } from "@/components/party/party-footer";
import { EVENT_HOSTS } from "@/utils/constants";

export const dynamic = "force-dynamic";

export default function InvalidInvitationPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <BabyOutline className="mx-auto mb-6 h-24 w-24 text-party-blue" />
          <h1 className="font-display text-3xl font-semibold text-party-ink sm:text-4xl">
            Oops! This link isn&apos;t valid
          </h1>
          <p className="mt-4 text-base text-party-ink-soft">
            We couldn&apos;t find an invitation for this link. Please check that you copied the
            whole link, or message {EVENT_HOSTS} for a new one.
          </p>
        </div>
      </div>
      <PartyFooter />
    </main>
  );
}
