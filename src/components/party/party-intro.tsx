"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { PartyEnvelope } from "./party-envelope";
import { isEnvelopeOpen } from "@/lib/envelope";
import { readSessionFlag, writeSessionFlag } from "@/lib/session-flag";
import { STORAGE_PARTY_ENVELOPE_OPENED } from "@/utils/constants";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

interface PartyIntroProps {
  children: ReactNode;
  /**
   * Remember "opened" for the browser session, so a guest reopening their link skips
   * the envelope. The showcase page passes false: the envelope shows on every visit.
   */
  rememberOpened?: boolean;
}

/**
 * Shows the envelope first, then the invitation. Content mounts once the envelope
 * is opened or the browser is idle, so the intro animation stays smooth.
 */
export function PartyIntro({ children, rememberOpened = true }: PartyIntroProps) {
  const rememberedOpen = useSyncExternalStore(
    subscribe,
    () => readSessionFlag(STORAGE_PARTY_ENVELOPE_OPENED),
    () => false
  );
  const [openedThisVisit, setOpenedThisVisit] = useState(false);
  const isRevealed = isEnvelopeOpen({
    remember: rememberOpened,
    rememberedOpen,
    openedThisVisit,
  });
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

  const handleOpen = useCallback(() => {
    setOpenedThisVisit(true);
    if (!rememberOpened) return;
    writeSessionFlag(STORAGE_PARTY_ENVELOPE_OPENED);
    window.dispatchEvent(new Event("storage"));
  }, [rememberOpened]);

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
