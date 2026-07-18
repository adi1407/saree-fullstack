  "use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { HERO_VIDEO_SRC } from "@/lib/hero-media";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [muted, setMuted] = useState(true);

  const startPlayback = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return false;

    video.muted = true;
    try {
      await video.play();
      setPlaying(true);
      setNeedsTap(false);
      return true;
    } catch {
      setNeedsTap(true);
      return false;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlaying = () => {
      setPlaying(true);
      setNeedsTap(false);
    };
    const onPause = () => setPlaying(false);

    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);

    // Attempt autoplay as soon as the element is ready
    if (video.readyState >= 2) {
      void startPlayback();
    } else {
      video.addEventListener("canplay", () => void startPlayback(), { once: true });
    }

    return () => {
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
    };
  }, [startPlayback]);

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    setMuted(next);
  }

  return (
    <div className="absolute inset-0 z-0 bg-ink">
      <video
        ref={videoRef}
        className="hero-video h-full w-full object-cover"
        src={HERO_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label={`${BRAND_NAME} festive edit video`}
        onClick={() => void startPlayback()}
      />

      {/* Readability overlays */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/85 via-ink/35 to-ink/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-ink/20 via-transparent to-ink/10 md:from-ink/30"
        aria-hidden
      />

      {needsTap && !playing && (
        <button
          type="button"
          onClick={() => void startPlayback()}
          className="focus-luxury absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-ink/30 text-white backdrop-blur-[2px]"
          aria-label="Play hero video"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-ink/60">
            <Play className="ml-1 h-7 w-7 fill-white text-white" />
          </span>
          <span className="text-eyebrow">Tap to play</span>
        </button>
      )}

      {playing && (
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={!muted}
          aria-label={muted ? "Unmute hero video" : "Mute hero video"}
          className="focus-luxury absolute bottom-6 right-6 z-20 flex items-center gap-1.5 rounded-full border border-white/25 bg-ink/60 px-3 py-1.5 text-eyebrow tracking-wider text-white/90 backdrop-blur-sm transition-colors hover:bg-ink/80 md:bottom-8 md:right-8"
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          {muted ? "Sound off" : "Sound on"}
        </button>
      )}
    </div>
  );
}
