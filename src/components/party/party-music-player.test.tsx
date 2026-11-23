import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MusicControls, PartyMusicPlayer } from "./party-music-player";

const noop = () => {};
const controls = (overrides: Partial<Parameters<typeof MusicControls>[0]> = {}) =>
  renderToStaticMarkup(
    <MusicControls
      isPlaying={false}
      muted={false}
      volume={0.7}
      volumeAdjustable
      onTogglePlay={noop}
      onToggleMute={noop}
      onVolumeChange={noop}
      {...overrides}
    />
  );

describe("PartyMusicPlayer", () => {
  const html = renderToStaticMarkup(<PartyMusicPlayer />);

  it("loads the party song only when it's played, and loops it", () => {
    expect(html).toMatch(/<audio[^>]*src="\/party\/bg_music\.mp3"/);
    expect(html).toMatch(/<audio[^>]*loop=""/);
    expect(html).toMatch(/<audio[^>]*preload="none"/);
  });

  it("keeps its controls hidden until the envelope is tapped", () => {
    expect(html).not.toContain("Play music");
    expect(html).not.toContain("Background music");
  });
});

describe("MusicControls", () => {
  it("names what's playing, with no album cover", () => {
    const html = controls();
    expect(html).toContain("Background music");
    expect(html).not.toContain("<img");
  });

  it("offers play while paused and pause while playing", () => {
    expect(controls({ isPlaying: false })).toContain('aria-label="Play music"');
    expect(controls({ isPlaying: true })).toContain('aria-label="Pause music"');
  });

  it("lets guests mute and unmute", () => {
    expect(controls({ muted: false })).toContain('aria-label="Mute music"');
    expect(controls({ muted: true })).toContain('aria-label="Unmute music"');
  });

  it("shows a volume slider where the volume can be changed", () => {
    const html = controls({ volume: 0.7 });
    expect(html).toMatch(/<input[^>]*type="range"[^>]*aria-label="Volume"/);
    expect(html).toContain('value="70"');
  });

  it("drops the slider on iPhones, which only take the side buttons, but keeps mute", () => {
    const html = controls({ volumeAdjustable: false });
    expect(html).not.toContain('aria-label="Volume"');
    expect(html).toContain('aria-label="Mute music"');
  });

  it("shows the slider at zero while muted", () => {
    expect(controls({ muted: true, volume: 0.7 })).toContain('value="0"');
  });
});
