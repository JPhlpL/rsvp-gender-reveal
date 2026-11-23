/**
 * Background music helpers. The envelope announces its tap and the music player listens.
 * The signal is delivered synchronously, inside the tap, because browsers only let a page
 * start sound in direct response to the visitor's own tap or click.
 */
const ENVELOPE_TAPPED_EVENT = "party:envelope-tapped";

/** Called by the envelope when the guest taps it. */
export function announceEnvelopeTapped(target: EventTarget = window): void {
  target.dispatchEvent(new Event(ENVELOPE_TAPPED_EVENT));
}

/** Runs `listener` on each envelope tap. Returns the unsubscribe function. */
export function onEnvelopeTapped(listener: () => void, target: EventTarget = window): () => void {
  target.addEventListener(ENVELOPE_TAPPED_EVENT, listener);
  return () => target.removeEventListener(ENVELOPE_TAPPED_EVENT, listener);
}

/**
 * Whether the page can change the volume. iPhones ignore volume set by a page (only the side
 * buttons change it), so the player shows its slider only where it works.
 */
export function canAdjustVolume(audio: { volume: number } = new Audio()): boolean {
  audio.volume = 0.5;
  return audio.volume === 0.5;
}
