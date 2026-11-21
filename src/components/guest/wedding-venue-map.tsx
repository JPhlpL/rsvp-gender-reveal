"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import {
  WEDDING_VENUE_MAP_IFRAME_TITLE,
  WEDDING_VENUE_MAPS_EMBED_URL,
  WEDDING_VENUE_MAPS_SHORT_URL,
} from "@/utils/constants";

export function WeddingVenueMap() {
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
      { rootMargin: "100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mt-6 sm:mt-8">
      <div className="rounded-xl overflow-hidden border border-wedding-sand/50 shadow-sm bg-wedding-white/40">
        <div className="aspect-[16/9] sm:aspect-[2/1] relative">
          {isInView ? (
            <iframe
              src={WEDDING_VENUE_MAPS_EMBED_URL}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={WEDDING_VENUE_MAP_IFRAME_TITLE}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-wedding-beige/30">
              <div className="flex flex-col items-center gap-2 text-wedding-brown-warm/50">
                <MapPin className="w-6 h-6" />
                <span className="font-serif text-xs">Loading map...</span>
              </div>
            </div>
          )}
        </div>

        <a
          href={WEDDING_VENUE_MAPS_SHORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-wedding-cream/80 border-t border-wedding-sand/30 text-wedding-brown font-playfair text-xs sm:text-sm uppercase tracking-[0.1em] transition-colors hover:bg-wedding-sand/20"
        >
          <MapPin className="w-3.5 h-3.5" />
          Get Directions
        </a>
      </div>
    </div>
  );
}
