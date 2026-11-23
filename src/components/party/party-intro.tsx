"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { PartyEnvelope } from "./party-envelope";

/**
 * Shows the envelope first, then the invitation. The envelope shows on every visit.
 * Content mounts once the envelope is opened or the browser is idle, so the intro
 * animation stays smooth.
 */
export function PartyIntro({ children }: { children: ReactNode }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [idleMount, setIdleMount] = useState(false);

  useEffect(() => {
    if (isRevealed) return;

    let cancelled = false;
    const enable = () => {
      if (!cancelled) setIdleMount(true);
    };

    const useIdle = typeof requestIdleCallback === "function";
    const id = useIdle
      ? requestIdleCallback(enable, { timeout: 2800 })
      : setTimeout(enable, 700);

    return () => {
      cancelled = true;
      if (useIdle) cancelIdleCallback(id as number);
      else clearTimeout(id as ReturnType<typeof setTimeout>);
    };
  }, [isRevealed]);

  useEffect(() => {
    if (isRevealed) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isRevealed]);

  const handleOpen = useCallback(() => setIsRevealed(true), []);

  return (
    <>
      {!isRevealed && <PartyEnvelope onOpen={handleOpen} />}

      <div
        className={`relative z-10 transition-opacity duration-700 ${
          isRevealed ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"
        }`}
      >
        {isRevealed || idleMount ? children : null}
      </div>
    </>
  );
}
