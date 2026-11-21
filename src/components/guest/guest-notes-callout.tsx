interface GuestNotesCalloutProps {
  notes: string | null | undefined;
}

/** Admin-entered notes visible to the guest on the confirmation page. */
export function GuestNotesCallout({ notes }: GuestNotesCalloutProps) {
  const text = notes?.trim();
  if (!text) return null;

  return (
    <div className="mb-6 rounded-lg border border-wedding-gold/50 bg-wedding-white/70 px-4 py-3 sm:px-5 sm:py-4 text-left shadow-sm">
      <p className="font-playfair text-wedding-brown text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2">
        A note for you
      </p>
      <p className="font-serif text-wedding-brown-medium text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}
