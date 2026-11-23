export interface EnvelopeState {
  /** Remember "opened" for the browser session (guest links) or not (showcase page). */
  remember: boolean;
  /** The envelope was opened earlier in this browser session. */
  rememberedOpen: boolean;
  /** The envelope was tapped open on this visit. */
  openedThisVisit: boolean;
}

/** True when the invitation shows instead of the envelope. */
export function isEnvelopeOpen({ remember, rememberedOpen, openedThisVisit }: EnvelopeState): boolean {
  if (openedThisVisit) return true;
  return remember && rememberedOpen;
}
