"use client";

import { useState, useCallback } from "react";
import {
  EVENT_WEDDING_AUDIO_USER_GESTURE,
  WEDDING_COUPLE_NAMES_SHORT,
  WEDDING_DATE_DISPLAY_FOOTER,
  WEDDING_ENVELOPE_INITIALS,
} from "@/utils/constants";

export type WeddingEnvelopeVariant = "invitation" | "showcase";

interface WeddingEnvelopeProps {
  onOpen: () => void;
  /** `showcase` = `/general-invitation` preview copy (no “You’re invited” on the letter). */
  variant?: WeddingEnvelopeVariant;
}

export function WeddingEnvelope({
  onOpen,
  variant = "invitation",
}: WeddingEnvelopeProps) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "exiting">(
    "sealed"
  );

  const handleClick = useCallback(() => {
    if (phase !== "sealed") return;
    setPhase("opening");

    setTimeout(() => setPhase("exiting"), 1600);
    setTimeout(() => onOpen(), 2400);
  }, [phase, onOpen]);

  const isOpen = phase === "opening" || phase === "exiting";

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 ${
        phase === "exiting" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#F0E6D6_0%,_#E8DCC8_40%,_#D4B896_100%)]" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-wedding-gold/30 animate-float"
            style={{
              left: `${15 + i * 14}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Top text */}
      <div
        className={`relative z-10 text-center mb-8 sm:mb-12 transition-all duration-700 ${
          isOpen ? "opacity-0 -translate-y-4" : "opacity-100"
        }`}
      >
        <p className="font-serif text-wedding-brown-medium/70 text-xs sm:text-sm italic tracking-wide">
          {variant === "showcase"
            ? "Please open the letter"
            : "You have received an invitation"}
        </p>
      </div>

      {/* Envelope */}
      <div
        className={`relative z-10 cursor-pointer envelope-container ${isOpen ? "is-open" : ""}`}
        onPointerDown={() => {
          if (phase === "sealed") {
            window.dispatchEvent(new Event(EVENT_WEDDING_AUDIO_USER_GESTURE));
          }
        }}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        aria-label={
          variant === "showcase"
            ? "Open wedding invitation preview"
            : "Open wedding invitation envelope"
        }
      >
        <div className="envelope-body">
          {/* Lid closed — front face, z-index 3, rotates away */}
          <div className="envelope-lid-closed" />

          {/* Lid open — back face, z-index 1, rotates into view */}
          <div className="envelope-lid-open" />

          {/* Front face — the V-fold, z-index 3 */}
          <div className="envelope-front" />

          {/* Letter — z-index 2, slides up */}
          <div className="envelope-letter">
            <div className="flex flex-col items-center justify-center h-full px-4 text-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-wedding-rose/90 flex items-center justify-center shadow-md mb-2 sm:mb-3">
                <span className="font-script text-wedding-white text-sm sm:text-base leading-none">
                  {WEDDING_ENVELOPE_INITIALS}
                </span>
              </div>
              {variant === "showcase" ? (
                isOpen ? (
                  <>
                    <p className="font-script text-wedding-brown text-lg sm:text-xl leading-tight">
                      {WEDDING_COUPLE_NAMES_SHORT}
                    </p>
                    <p className="font-serif text-wedding-brown-medium text-[11px] sm:text-xs mt-1 italic">
                      {WEDDING_DATE_DISPLAY_FOOTER}
                    </p>
                  </>
                ) : (
                  <p className="font-script text-wedding-brown text-xl sm:text-2xl leading-tight">
                    Tap to open
                  </p>
                )
              ) : isOpen ? (
                <>
                  <p className="font-script text-wedding-brown text-lg sm:text-xl leading-tight">
                    You&apos;re Invited
                  </p>
                  <p className="font-serif text-wedding-brown-medium text-[11px] sm:text-xs mt-1 italic">
                    you are cordially invited
                  </p>
                </>
              ) : (
                <>
                  <p className="font-script text-wedding-brown text-lg sm:text-xl leading-tight">
                    You&apos;re Invited
                  </p>
                  <p className="font-serif text-wedding-brown-warm text-[10px] sm:text-xs mt-1 italic">
                    tap to open
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tap indicator */}
      <div
        className={`relative z-10 flex flex-col items-center mt-5 sm:mt-6 transition-all duration-500 ${
          isOpen ? "opacity-0 translate-y-4" : "opacity-100"
        }`}
      >
        {/* Pointing hand */}
        <div className="animate-tap-hint">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="text-wedding-brown-warm/70 sm:w-8 sm:h-8"
          >
            <path
              d="M12 2C10.9 2 10 2.9 10 4V10.5C10 10.5 8.7 9.7 7.8 9.4C6.9 9.1 6 9.6 6 10.5C6 11.1 6.3 11.6 7 12.3L10.5 16C10.5 16 11 17 11 18V21H17V18C17 17 18 15.5 18 14V7C18 5.9 17.1 5 16 5C15.8 5 15.6 5 15.4 5.1C15.1 4.5 14.6 4 13.9 4C13.7 4 13.5 4 13.3 4.1C13 3.5 12.5 3 11.8 3C11.8 3 12 2.5 12 2Z"
              fill="currentColor"
              opacity="0.8"
            />
          </svg>
        </div>
        <p className="font-serif text-wedding-brown-warm/50 text-[10px] sm:text-xs italic mt-1 tracking-wide">
          {variant === "showcase" ? "Tap to open" : "tap the envelope"}
        </p>
      </div>

      {/* Bottom text */}
      <div
        className={`relative z-10 text-center mt-4 sm:mt-6 transition-all duration-700 ${
          isOpen ? "opacity-0 translate-y-4" : "opacity-100"
        }`}
      >
        <p className="font-script text-wedding-brown/80 text-2xl sm:text-3xl">
          {WEDDING_COUPLE_NAMES_SHORT}
        </p>
        <p className="font-playfair text-wedding-brown-warm/50 text-[10px] sm:text-xs tracking-[0.25em] uppercase mt-2">
          {WEDDING_DATE_DISPLAY_FOOTER}
        </p>
      </div>
    </div>
  );
}
