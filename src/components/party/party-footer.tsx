import { PartyMark } from "@/components/illustrations";
import { EVENT_DATE_SHORT, EVENT_TITLE } from "@/utils/constants";

export function PartyFooter() {
  return (
    <footer className="px-4 pt-6 pb-12 text-center">
      <PartyMark className="mx-auto mb-2 h-8 w-8" />
      <p className="text-xs uppercase tracking-[0.25em] text-party-ink-soft">
        {EVENT_TITLE} · {EVENT_DATE_SHORT}
      </p>
    </footer>
  );
}
