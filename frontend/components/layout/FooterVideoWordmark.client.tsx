"use client";

import { useEffect, useId, useRef } from "react";
import { BRAND_NAME } from "@/lib/brand";
import { HERO_VIDEO_POSTER, HERO_VIDEO_SRC } from "@/lib/hero-media";

/**
 * Full-bleed footer brand mark: the hero film is clipped to the AADIORA wordmark
 * via SVG `clipPath` — living fabric through the letters.
 */
export function FooterVideoWordmark() {
  const reactId = useId();
  const clipId = `aadiora-footer-clip-${reactId.replace(/:/g, "")}`;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const preferReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (preferReduced) {
      video.pause();
      return;
    }

    video.muted = true;
    void video.play().catch(() => {
      /* autoplay may be blocked — poster still shows through the clip */
    });
  }, []);

  return (
    <section
      className="footer-video-wordmark relative isolate overflow-hidden bg-ink"
      aria-label={`${BRAND_NAME} brand film`}
    >
      {/* Soft ambient film behind the letters */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.16]" aria-hidden>
        <video
          className="footer-video-wordmark__ambient h-full w-full object-cover"
          src={HERO_VIDEO_SRC}
          poster={HERO_VIDEO_POSTER}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          tabIndex={-1}
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/75 to-ink/45" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-secondary/55 to-transparent"
      />

      <div className="relative mx-auto flex w-full flex-col items-center px-2 py-8 sm:py-12 md:py-14">
        <p className="mb-2 text-center text-eyebrow tracking-[0.35em] text-secondary/75">
          Handwoven in India
        </p>

        <svg
          className="footer-video-wordmark__svg mx-auto block h-auto w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={BRAND_NAME}
        >
          <defs>
            <clipPath id={`${clipId}-text`}>
              <text
                x="720"
                y="230"
                textAnchor="middle"
                className="footer-video-wordmark__clip-text"
              >
                {BRAND_NAME}
              </text>
            </clipPath>

            <linearGradient id={`${clipId}-stroke`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c9a962" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#e8dcc4" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#c9a962" stopOpacity="0.25" />
            </linearGradient>

            <filter id={`${clipId}-glow`} x="-8%" y="-35%" width="116%" height="170%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Video clipped into the wordmark */}
          <foreignObject
            x="0"
            y="0"
            width="1440"
            height="320"
            clipPath={`url(#${clipId}-text)`}
          >
            <div
              className="footer-video-wordmark__film h-full w-full overflow-hidden bg-ink"
            >
              <video
                ref={videoRef}
                className="footer-video-wordmark__film-video h-full w-full object-cover"
                src={HERO_VIDEO_SRC}
                poster={HERO_VIDEO_POSTER}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                tabIndex={-1}
              />
            </div>
          </foreignObject>

          {/* Gold outline for crisp letter edges */}
          <text
            x="720"
            y="230"
            textAnchor="middle"
            className="footer-video-wordmark__outline"
            fill="none"
            stroke={`url(#${clipId}-stroke)`}
            strokeWidth="1.5"
            filter={`url(#${clipId}-glow)`}
            aria-hidden="true"
          >
            {BRAND_NAME}
          </text>
        </svg>

        <p className="mt-3 max-w-md text-center text-small tracking-[0.08em] text-secondary-muted/70">
          Fashion woven into memory
        </p>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-secondary/40 to-transparent"
      />
    </section>
  );
}
