"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { canAdjustVolume, onEnvelopeTapped } from "@/lib/party-music";
import { COPY_MUSIC_LABEL, PARTY_MUSIC_DEFAULT_VOLUME, PARTY_MUSIC_SRC } from "@/utils/constants";

// Checked once per page load; the server assumes no slider until the browser says otherwise.
let volumeAdjustable: boolean | undefined;
const subscribeNever = () => () => {};
const getVolumeAdjustable = () => (volumeAdjustable ??= canAdjustVolume());
const getVolumeAdjustableOnServer = () => false;

/**
 * Background music for the invitation pages. Hidden until the guest taps the envelope; that
 * tap starts the song (browsers only allow sound after a tap). Guests can pause, play, mute
 * and, where the device allows it, change the volume.
 */
export function PartyMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [shown, setShown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(PARTY_MUSIC_DEFAULT_VOLUME);
  const [muted, setMuted] = useState(false);
  const adjustable = useSyncExternalStore(
    subscribeNever,
    getVolumeAdjustable,
    getVolumeAdjustableOnServer
  );

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
    el.muted = muted;
  }, [volume, muted]);

  useEffect(
    () =>
      onEnvelopeTapped(() => {
        setShown(true);
        // Still inside the guest's tap, so the browser allows it. If it refuses, Play works.
        void audioRef.current?.play().catch(() => {});
      }),
    []
  );

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
  }, []);

  const toggleMute = useCallback(() => {
    if (muted && volume === 0) setVolume(PARTY_MUSIC_DEFAULT_VOLUME);
    setMuted(!muted);
  }, [muted, volume]);

  const changeVolume = useCallback((next: number) => {
    setVolume(next);
    setMuted(next === 0);
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={PARTY_MUSIC_SRC}
        preload="none"
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {shown && (
        <MusicControls
          isPlaying={isPlaying}
          muted={muted}
          volume={volume}
          volumeAdjustable={adjustable}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onVolumeChange={changeVolume}
        />
      )}
    </>
  );
}

interface MusicControlsProps {
  isPlaying: boolean;
  muted: boolean;
  /** 0 to 1. */
  volume: number;
  /** False on iPhones, which ignore volume set by the page. */
  volumeAdjustable: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
}

/** The compact bar pinned to the bottom of the screen. */
export function MusicControls({
  isPlaying,
  muted,
  volume,
  volumeAdjustable,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
}: MusicControlsProps) {
  const silent = muted || volume === 0;

  return (
    <div
      role="region"
      aria-label="Music player"
      // Sits just above the site-wide copyright line pinned to the bottom of the screen.
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(2.5rem+env(safe-area-inset-bottom))] animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="pointer-events-auto mx-auto flex max-w-md items-center gap-3 rounded-full border border-party-ink/10 bg-party-white/95 py-2 pr-4 pl-2 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-party-ink text-party-white shadow-sm transition-transform active:scale-95"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" fill="currentColor" />
          ) : (
            <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
          )}
        </button>

        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-party-ink">
          {COPY_MUSIC_LABEL}
        </p>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? "Unmute music" : "Mute music"}
          className="shrink-0 rounded-full p-1.5 text-party-ink hover:bg-party-ink/5"
        >
          {silent ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>

        {volumeAdjustable && (
          <input
            type="range"
            min={0}
            max={100}
            value={silent ? 0 : Math.round(volume * 100)}
            onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
            aria-label="Volume"
            className="h-1 w-16 shrink-0 cursor-pointer accent-party-ink sm:w-28"
          />
        )}
      </div>
    </div>
  );
}
