/** Admin-entered note shown only to this guest on their invitation. */
export function GuestNotesCallout({ notes }: { notes: string | null | undefined }) {
  const text = notes?.trim();
  if (!text) return null;

  return (
    <div className="mb-6 rounded-2xl border border-party-ink/10 bg-party-white/90 px-4 py-3 text-left shadow-sm sm:px-5 sm:py-4">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-party-ink-soft sm:text-xs">
        A note for you
      </p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-party-ink sm:text-base">{text}</p>
    </div>
  );
}
