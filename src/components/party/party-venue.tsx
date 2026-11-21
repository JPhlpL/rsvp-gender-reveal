"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  VENUE_ADDRESS,
  VENUE_MAP_IFRAME_TITLE,
  VENUE_MAPS_EMBED_URL,
  VENUE_MAPS_URL,
  VENUE_NAME,
} from "@/utils/constants";

/** Where: venue name, address with copy, lazy Google map and directions link. */
export function PartyVenue() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${VENUE_NAME}, ${VENUE_ADDRESS}`);
      toast.success("Address copied");
    } catch {
      toast.error("Couldn't copy — long-press the address instead");
    }
  };

  return (
    <section className="px-4 py-10 sm:py-14" aria-labelledby="venue-title">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-party-ink-soft">Where</p>
        <h2 id="venue-title" className="mt-2 font-display text-3xl font-semibold text-party-ink sm:text-4xl">
          {VENUE_NAME}
        </h2>
        <p className="mt-2 text-sm text-party-ink-soft sm:text-base">{VENUE_ADDRESS}</p>
        <button
          type="button"
          onClick={copyAddress}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-party-ink/15 bg-party-white/80 px-4 py-1.5 text-xs font-semibold text-party-ink transition hover:bg-party-white"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy address
        </button>
      </div>

      <div ref={containerRef} className="mx-auto mt-6 max-w-xl overflow-hidden rounded-2xl border border-party-ink/15 bg-party-white shadow-sm">
        <div className="relative aspect-[16/10]">
          {isInView ? (
            <iframe
              src={VENUE_MAPS_EMBED_URL}
              className="h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={VENUE_MAP_IFRAME_TITLE}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-party-cream text-party-ink-soft">
              <MapPin className="h-6 w-6" />
            </div>
          )}
        </div>
        <a
          href={VENUE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border-t border-party-ink/10 bg-party-cream px-4 py-3 text-sm font-semibold text-party-ink transition hover:bg-party-white"
        >
          <MapPin className="h-4 w-4" />
          Open in Google Maps
        </a>
      </div>
    </section>
  );
}
