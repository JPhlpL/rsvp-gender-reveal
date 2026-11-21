"use client";

import { useCallback, useState } from "react";
import { PartyMark } from "@/components/illustrations";
import { EVENT_DATE_SHORT, EVENT_HOSTS, EVENT_TITLE } from "@/utils/constants";

const PARTICLES = [0, 1, 2, 3, 4, 5];

/** Tap-to-open envelope shown before the invitation. */
export function PartyEnvelope({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "exiting">("sealed");

  const handleOpen = useCallback(() => {
    if (phase !== "sealed") return;
    setPhase("opening");
    setTimeout(() => setPhase("exiting"), 1600);
    setTimeout(onOpen, 2400);
  }, [phase, onOpen]);

  const isOpen = phase !== "sealed";

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center px-4 transition-opacity duration-700 ${
        phase === "exiting" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-party-cream" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,var(--color-party-pink)_0%,transparent_45%),radial-gradient(circle_at_80%_75%,var(--color-party-blue)_0%,transparent_45%)] opacity-70" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full animate-float ${
              i % 2 === 0 ? "bg-party-pink-deep/40" : "bg-party-blue-deep/40"
            }`}
            style={{
              left: `${12 + i * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <p
        className={`relative z-10 mb-8 sm:mb-12 text-center text-sm italic text-party-ink-soft transition-all duration-700 ${
          isOpen ? "opacity-0 -translate-y-4" : "opacity-100"
        }`}
      >
        You have received a party invitation
      </p>

      <div
        className={`relative z-10 cursor-pointer envelope-container ${isOpen ? "is-open" : ""}`}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleOpen();
        }}
        aria-label="Open your party invitation"
      >
        <div className="envelope-body">
          <div className="envelope-lid-closed" />
          <div className="envelope-lid-open" />
          <div className="envelope-front" />
          <div className="envelope-letter">
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <PartyMark className="mb-2 h-10 w-10 sm:h-12 sm:w-12" />
              <p className="font-display text-lg font-semibold leading-tight text-party-ink sm:text-xl">
                You&apos;re Invited!
              </p>
              <p className="mt-1 text-[11px] italic text-party-ink-soft sm:text-xs">
                {isOpen ? EVENT_TITLE : "tap to open"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`relative z-10 mt-6 flex flex-col items-center transition-all duration-500 ${
          isOpen ? "opacity-0 translate-y-4" : "opacity-100"
        }`}
      >
        <svg
          className="animate-tap-hint h-7 w-7 text-party-ink-soft sm:h-8 sm:w-8"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 2C10.9 2 10 2.9 10 4V10.5C10 10.5 8.7 9.7 7.8 9.4C6.9 9.1 6 9.6 6 10.5C6 11.1 6.3 11.6 7 12.3L10.5 16C10.5 16 11 17 11 18V21H17V18C17 17 18 15.5 18 14V7C18 5.9 17.1 5 16 5C15.8 5 15.6 5 15.4 5.1C15.1 4.5 14.6 4 13.9 4C13.7 4 13.5 4 13.3 4.1C13 3.5 12.5 3 11.8 3C11.8 3 12 2.5 12 2Z"
            fill="currentColor"
          />
        </svg>
        <p className="mt-1 text-xs italic tracking-wide text-party-ink-soft">tap the envelope</p>
      </div>

      <div
        className={`relative z-10 mt-6 text-center transition-all duration-700 ${
          isOpen ? "opacity-0 translate-y-4" : "opacity-100"
        }`}
      >
        <p className="font-display text-2xl font-semibold text-party-ink sm:text-3xl">{EVENT_HOSTS}</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-party-ink-soft sm:text-xs">
          {EVENT_DATE_SHORT}
        </p>
      </div>
    </div>
  );
}
