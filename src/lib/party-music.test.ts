import { describe, expect, it, vi } from "vitest";
import { announceEnvelopeTapped, canAdjustVolume, onEnvelopeTapped } from "./party-music";

describe("envelope tap signal", () => {
  it("reaches listeners right away, inside the tap, so browsers allow the music to start", () => {
    const target = new EventTarget();
    const listener = vi.fn();
    onEnvelopeTapped(listener, target);

    announceEnvelopeTapped(target);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("stops reaching a listener once it unsubscribes", () => {
    const target = new EventTarget();
    const listener = vi.fn();
    const unsubscribe = onEnvelopeTapped(listener, target);

    unsubscribe();
    announceEnvelopeTapped(target);

    expect(listener).not.toHaveBeenCalled();
  });
});

describe("canAdjustVolume", () => {
  it("is true where the page can set the volume (Android, computers)", () => {
    expect(canAdjustVolume({ volume: 1 })).toBe(true);
  });

  it("is false on iPhones, which ignore volume set by the page", () => {
    const iphoneAudio = {
      get volume() {
        return 1;
      },
      set volume(_ignored: number) {},
    };
    expect(canAdjustVolume(iphoneAudio)).toBe(false);
  });
});
