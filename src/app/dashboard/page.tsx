import { fetchGuestsAction } from "@/actions/guest";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { calculateGuestStatistics } from "@/utils/statistics";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const guests = await fetchGuestsAction();
  const stats = calculateGuestStatistics(guests);

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} guests={guests} />

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-heading text-base font-medium mb-4">
          Additional Metrics
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Response Rate</p>
            <p className="text-3xl font-bold text-blue-700">
              {stats.totalMainGuests > 0
                ? Math.round(
                    ((stats.totalMainGuests -
                      guests.filter((g) => g.attendance_status === "pending")
                        .length) /
                      stats.totalMainGuests) *
                      100
                  )
                : 0}
              %
            </p>
            <p className="text-xs text-muted-foreground">
              Main guests who responded
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
