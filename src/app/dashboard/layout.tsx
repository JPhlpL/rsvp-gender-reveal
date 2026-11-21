import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminNavigation } from "@/components/admin/admin-navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-party-cream">
      <div className="relative z-10 flex min-h-screen flex-col">
        <AdminNavigation userEmail={admin.email} />
        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
