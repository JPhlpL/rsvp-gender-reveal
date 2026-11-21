"use client";

import {
  useSyncExternalStore,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { WeddingEnvelope, type WeddingEnvelopeVariant } from "./wedding-envelope";
import {
  EVENT_WEDDING_CONFIRMATION_REVEALED,
  STORAGE_WEDDING_ENVELOPE_OPENED,
} from "@/utils/constants";

interface WeddingIntroProps {
  children: ReactNode;
  envelopeVariant?: WeddingEnvelopeVariant;
  /** Separate keys for guest confirmation vs `/general-invitation` when `persistEnvelopeOpen` is true. */
  sessionStorageKey?: string;
  /**
   * When false (`/general-invitation` showcase), opening the envelope is in-memory only — refresh always shows the envelope again.
   */
  persistEnvelopeOpen?: boolean;
}

/**
 * Defers mounting invitation content until the envelope is opened or the browser
 * is idle (whichever comes first). Avoids parsing/hydrating the full page while
 * the intro animation runs, and reduces main-thread work on first paint.
 */
export function WeddingIntro({
  children,
  envelopeVariant = "invitation",
  sessionStorageKey = STORAGE_WEDDING_ENVELOPE_OPENED,
  persistEnvelopeOpen = true,
}: WeddingIntroProps) {
  const [localRevealed, setLocalRevealed] = useState(false);

  const storedRevealed = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () =>
      persistEnvelopeOpen
        ? sessionStorage.getItem(sessionStorageKey) === "true"
        : false,
    () => false
  );

  const isRevealed = persistEnvelopeOpen ? storedRevealed : localRevealed;
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

  const mounted = isRevealed || idleMount;

  const handleOpen = useCallback(() => {
    if (persistEnvelopeOpen) {
      sessionStorage.setItem(sessionStorageKey, "true");
      window.dispatchEvent(new Event("storage"));
    } else {
      setLocalRevealed(true);
    }
  }, [persistEnvelopeOpen, sessionStorageKey]);

  useEffect(() => {
    if (!isRevealed) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isRevealed]);

  useEffect(() => {
    if (!isRevealed) return;
    window.dispatchEvent(new Event(EVENT_WEDDING_CONFIRMATION_REVEALED));
  }, [isRevealed]);

  return (
    <>
      {!isRevealed && (
        <WeddingEnvelope variant={envelopeVariant} onOpen={handleOpen} />
      )}

      <div
        className={`relative z-10 transition-opacity duration-700 ${
          isRevealed
            ? "opacity-100"
            : "opacity-0 pointer-events-none h-0 overflow-hidden"
        }`}
      >
        {mounted ? children : null}
      </div>
    </>
  );
}
