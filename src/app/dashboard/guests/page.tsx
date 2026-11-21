import { fetchGuestsAction } from "@/actions/guest";
import { CreateGuestModal } from "@/components/admin/create-guest-modal";
import { DeleteAllGuestsDialog } from "@/components/admin/delete-all-guests-dialog";
import { GuestTable } from "@/components/admin/guest-table";
import { GuestCardList } from "@/components/admin/guest-card-list";
import { ExportGuestsButton } from "@/components/admin/export-guests-button";

export const dynamic = "force-dynamic";

export default async function GuestsPage() {
  const guests = await fetchGuestsAction();

  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:block space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ExportGuestsButton guests={guests} />
          <div className="flex flex-wrap items-center gap-2">
            <DeleteAllGuestsDialog guestCount={guests.length} />
            <CreateGuestModal />
          </div>
        </div>
        <GuestTable guests={guests} />
      </div>

      {/* Mobile View with Fixed Header */}
      <div className="block sm:hidden h-[calc(100vh-8rem)] flex flex-col">
        {/* Fixed Add Guest Button and Export */}
        <div className="pb-3 space-y-2">
          <CreateGuestModal />
          <ExportGuestsButton guests={guests} />
          <DeleteAllGuestsDialog guestCount={guests.length} />
        </div>

        {/* Scrollable Card List (includes sticky search) */}
        <div className="flex-1 overflow-hidden">
          <GuestCardList guests={guests} />
        </div>
      </div>
    </>
  );
}
