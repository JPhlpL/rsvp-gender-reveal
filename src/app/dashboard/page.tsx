import { requireAdmin } from "@/lib/auth/require-admin";
import { guestRepository } from "@/repositories/guestRepository";
import { settingsRepository } from "@/repositories/settingsRepository";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { SettingsCard } from "@/components/admin/settings-card";
import { describeRsvpStatus, isRsvpOpen, manilaDateFromDeadline } from "@/lib/rsvp-window";
import { DEFAULT_PUBLIC_APP_URL } from "@/utils/constants";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireAdmin();
  const [guests, settings] = await Promise.all([
    guestRepository.getAllGuestsWithResponses(),
    settingsRepository.getSettings(),
  ]);
  const now = new Date();

  return (
    <div className="space-y-6">
      <SettingsCard
        deadlineDate={settings.rsvp_deadline ? manilaDateFromDeadline(settings.rsvp_deadline) : ""}
        rsvpClosed={settings.rsvp_closed}
        statusLine={describeRsvpStatus(settings, now)}
        isOpen={isRsvpOpen(settings, now)}
        personalizedLinks={settings.personalized_links}
        generalLinkUrl={`${process.env.NEXT_PUBLIC_APP_URL || DEFAULT_PUBLIC_APP_URL}/invitation`}
      />
      <DashboardStats rows={guests} />
    </div>
  );
}
