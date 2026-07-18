"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { MotionLine, MotionText } from "@/features/experience/motion/MotionText.client";
import { HeroNarration, type StoryBeat } from "@/features/experience/motion/HeroNarration.client";
import { Container } from "@/components/ui/Container";

interface BandProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
}

/**
 * Shared chrome for the lighter "info" pages. Every page below owns a distinct
 * procedural artwork AND its own narrated story beats, so the FAQ, shipping,
 * privacy and terms heroes can never be mistaken for one another — each carries
 * its own small, moving story.
 */
function BandShell({
  art,
  eyebrow,
  title,
  subtitle,
  beats,
}: BandProps & { art: ReactNode; beats?: StoryBeat[] }) {
  return (
    <section
      className="relative overflow-hidden border-b border-border py-16 md:py-24"
      style={{ backgroundColor: "#1a1410" }}
    >
      <div className="absolute inset-0" aria-hidden>
        {art}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-transparent" />
      <Container className="relative z-10">
        <MotionText>
          {eyebrow && (
            <MotionLine>
              <p className="text-eyebrow text-secondary">{eyebrow}</p>
            </MotionLine>
          )}
          <MotionLine delay={eyebrow ? 0.1 : 0}>
            <h1 className="text-display mt-3 text-white">{title}</h1>
          </MotionLine>
          {subtitle && (
            <MotionLine delay={0.2}>
              <p className="text-lead mt-4 max-w-xl text-white/75">{subtitle}</p>
            </MotionLine>
          )}
        </MotionText>
        {beats && <HeroNarration beats={beats} tone="dark" className="mt-7" />}
      </Container>
    </section>
  );
}

const svgProps = {
  className: "h-full w-full",
  preserveAspectRatio: "xMidYMid slice" as const,
  xmlns: "http://www.w3.org/2000/svg",
};

const drawEase = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* FAQ — tangled threads relaxing into order; a knot of questions that  */
/* keeps turning until it comes loose.                                  */
/* ------------------------------------------------------------------ */

function wavePath(baseY: number, amp: number, wavelength: number, width = 1300) {
  let d = "";
  for (let x = -60; x <= width; x += 18) {
    const y = baseY + Math.sin((x / wavelength) * Math.PI * 2) * amp;
    d += `${x === -60 ? "M" : "L"} ${x} ${y.toFixed(1)} `;
  }
  return d;
}

const FAQ_THREADS = [
  { y: 70, amp: 34, wl: 280, color: "#c9a962" },
  { y: 140, amp: 22, wl: 220, color: "#6b2d3c" },
  { y: 210, amp: 40, wl: 320, color: "#c9a962" },
  { y: 280, amp: 18, wl: 190, color: "#2d5c4e" },
  { y: 340, amp: 30, wl: 260, color: "#6b2d3c" },
];

const FAQ_BEATS: StoryBeat[] = [
  { label: "Ask freely", text: "Ordering, sizing, delivery, care — the threads of every common question, gathered in one place." },
  { label: "Still tangled?", text: "If a knot stays stubborn, a real person at the atelier works it loose with you." },
];

export function FaqThreadBand(props: BandProps) {
  return (
    <BandShell
      {...props}
      beats={FAQ_BEATS}
      art={
        <svg viewBox="0 0 1200 400" {...svgProps}>
          <motion.g
            animate={{ x: [0, -28, 0], y: [0, 8, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          >
            {FAQ_THREADS.map((t, i) => (
              <motion.path
                key={i}
                d={wavePath(t.y, t.amp, t.wl)}
                fill="none"
                stroke={t.color}
                strokeWidth={1.4}
                strokeOpacity={0.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.4, delay: i * 0.25, ease: drawEase }}
              />
            ))}
          </motion.g>

          {/* the knot of questions, slowly working itself loose */}
          <g transform="translate(980 200)">
            {[0, 1, 2].map((i) => (
              <motion.ellipse
                key={i}
                rx={60}
                ry={22}
                fill="none"
                stroke="#c9a962"
                strokeWidth={1.2}
                strokeOpacity={0.35}
                animate={{ rotate: [i * 60, i * 60 + 360] }}
                transition={{ duration: 26 - i * 4, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "center" }}
              />
            ))}
            <motion.circle
              r={5}
              fill="#c9a962"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>

          {[
            { x: 250, y: 120 },
            { x: 600, y: 250 },
            { x: 1090, y: 95 },
          ].map((q, i) => (
            <motion.text
              key={i}
              x={q.x}
              y={q.y}
              fontSize={46}
              fontFamily="Georgia, serif"
              fill="#c9a962"
              fillOpacity={0.22}
              animate={{ y: [q.y, q.y - 16, q.y], opacity: [0.12, 0.3, 0.12] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            >
              ?
            </motion.text>
          ))}
        </svg>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Shipping — a parcel travelling a hand-drawn route, the path lighting  */
/* up behind it and a beacon marking the moment it arrives.             */
/* ------------------------------------------------------------------ */

const ROUTE = [
  { x: 40, y: 300 },
  { x: 280, y: 170 },
  { x: 540, y: 250 },
  { x: 800, y: 130 },
  { x: 1040, y: 220 },
  { x: 1180, y: 110 },
];

const ROUTE_PATH = ROUTE.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
const END = ROUTE[ROUTE.length - 1];

const SHIPPING_BEATS: StoryBeat[] = [
  { label: "Packed with care", text: "Each saree leaves us wrapped in muslin inside a rigid box, fully insured for the road ahead." },
  { label: "Tracked all the way", text: "From dispatch to your doorstep, every stop on the journey reaches you by email." },
  { label: "Home safely", text: "Metro cities in 3–5 days, everywhere else in 5–8 — and free above ₹10,000." },
];

export function ShippingJourneyBand(props: BandProps) {
  return (
    <BandShell
      {...props}
      beats={SHIPPING_BEATS}
      art={
        <svg viewBox="0 0 1200 400" {...svgProps}>
          {[60, 130, 200, 270, 340].map((y, i) => (
            <line
              key={i}
              x1={-50}
              x2={1250}
              y1={y}
              y2={y}
              stroke="#c9a962"
              strokeOpacity={0.08}
              strokeDasharray="2 14"
            />
          ))}
          {/* the faint planned route */}
          <path
            d={ROUTE_PATH}
            fill="none"
            stroke="#c9a962"
            strokeWidth={1.5}
            strokeOpacity={0.18}
            strokeDasharray="6 10"
          />
          {/* the route lighting up as the parcel covers ground */}
          <motion.path
            d={ROUTE_PATH}
            fill="none"
            stroke="#c9a962"
            strokeWidth={2.4}
            strokeOpacity={0.7}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", times: [0, 0.85, 1] }}
          />
          {[ROUTE[0], ROUTE[2]].map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={4} fill="#c9a962" />
          ))}
          {/* arrival beacon */}
          <motion.circle
            cx={END.x}
            cy={END.y}
            r={6}
            fill="none"
            stroke="#2d5c4e"
            strokeWidth={1.6}
            animate={{ r: [6, 26], opacity: [0.7, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
          />
          <circle cx={END.x} cy={END.y} r={5} fill="#2d5c4e" />
          {/* the parcel */}
          <motion.rect
            width={16}
            height={16}
            rx={2}
            fill="#c45c3e"
            stroke="#fdf8f3"
            strokeOpacity={0.6}
            animate={{
              x: ROUTE.map((p) => p.x - 8),
              y: ROUTE.map((p) => p.y - 8),
            }}
            transition={{ duration: 7, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          />
        </svg>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Privacy — a shield that draws itself in while stray data packets      */
/* approach and are turned harmlessly away.                              */
/* ------------------------------------------------------------------ */

const PRIVACY_BEATS: StoryBeat[] = [
  { label: "Yours alone", text: "We collect only what an order genuinely needs — and never sell or trade a single detail." },
  { label: "Kept behind glass", text: "Your information sits behind encryption and tightly limited access, every step of the way." },
];

const PACKETS = [
  { y: 90, delay: 0 },
  { y: 200, delay: 1.3 },
  { y: 300, delay: 2.6 },
];

export function PrivacyShieldBand(props: BandProps) {
  const lattice: ReactNode[] = [];
  for (let x = 0; x <= 1200; x += 80) {
    for (let y = 0; y <= 400; y += 80) {
      lattice.push(
        <path
          key={`${x}-${y}`}
          d={`M ${x} ${y} l 40 40 l -40 40 l -40 -40 z`}
          fill="none"
          stroke="#2d5c4e"
          strokeWidth={1}
          strokeOpacity={0.18}
        />
      );
    }
  }

  return (
    <BandShell
      {...props}
      beats={PRIVACY_BEATS}
      art={
        <svg viewBox="0 0 1200 400" {...svgProps}>
          <motion.g
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {lattice}
          </motion.g>

          {/* stray packets approach the shield and are deflected away */}
          {PACKETS.map((p, i) => (
            <motion.rect
              key={i}
              width={11}
              height={11}
              rx={2}
              fill="#6b2d3c"
              stroke="#c9a962"
              strokeOpacity={0.5}
              animate={{
                x: [1180, 1035, 1180],
                y: [p.y, 196, p.y > 200 ? 360 : 60],
                opacity: [0, 0.85, 0],
              }}
              transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            />
          ))}

          <g transform="translate(960 200)">
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                r={70 + i * 26}
                fill="none"
                stroke="#c9a962"
                strokeWidth={1}
                strokeOpacity={0.18 - i * 0.04}
                strokeDasharray="3 12"
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 40 + i * 14, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "center" }}
              />
            ))}
            <motion.path
              d="M 0 -64 L 52 -40 L 52 16 C 52 52 28 74 0 86 C -28 74 -52 52 -52 16 L -52 -40 Z"
              fill="#6b2d3c"
              fillOpacity={0.16}
              stroke="#c9a962"
              strokeWidth={2}
              strokeOpacity={0.75}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.6, ease: drawEase }}
            />
            <motion.path
              d="M -20 6 L -6 24 L 26 -16"
              fill="none"
              stroke="#c9a962"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 2.4, ease: "easeOut" }}
            />
          </g>
        </svg>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Terms — a measured blueprint of ruled lines, signed off with a hand   */
/* drawn signature and a turning wax seal.                               */
/* ------------------------------------------------------------------ */

const TERMS_BEATS: StoryBeat[] = [
  { label: "Clear by design", text: "Plain language, no fine-print traps — what you agree to is exactly what you receive." },
  { label: "A fair exchange", text: "Authentic handloom, honest pricing, and a straightforward seven-day return." },
];

export function TermsLedgerBand(props: BandProps) {
  const rules = [80, 130, 180, 230, 280, 330];

  return (
    <BandShell
      {...props}
      beats={TERMS_BEATS}
      art={
        <svg viewBox="0 0 1200 400" {...svgProps}>
          {Array.from({ length: 40 }).map((_, i) => (
            <line
              key={i}
              x1={i * 30}
              x2={i * 30}
              y1={30}
              y2={i % 5 === 0 ? 52 : 42}
              stroke="#c9a962"
              strokeOpacity={0.18}
              strokeWidth={1}
            />
          ))}
          {rules.map((y, i) => (
            <motion.line
              key={y}
              x1={40}
              x2={1000}
              y1={y}
              y2={y}
              stroke="#c9a962"
              strokeWidth={1}
              strokeOpacity={0.3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, delay: i * 0.18, ease: drawEase }}
            />
          ))}
          <line x1={40} x2={40} y1={70} y2={345} stroke="#6b2d3c" strokeWidth={1.5} strokeOpacity={0.4} />

          {/* a hand signs the agreement on the final rule */}
          <motion.path
            d="M 640 332 C 660 300 672 360 690 320 C 700 298 712 350 728 318 C 740 296 756 340 786 322 C 800 314 808 330 828 318"
            fill="none"
            stroke="#c9a962"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeOpacity={0.85}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, delay: 1.4, ease: "easeInOut" }}
          />

          {/* wax seal */}
          <g transform="translate(1060 270)">
            <motion.circle
              r={56}
              fill="none"
              stroke="#c9a962"
              strokeWidth={1}
              strokeOpacity={0.3}
              strokeDasharray="4 10"
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            />
            <circle r={40} fill="#6b2d3c" fillOpacity={0.18} stroke="#c9a962" strokeOpacity={0.5} strokeWidth={1.5} />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={34}
              fontFamily="Georgia, serif"
              fill="#c9a962"
              fillOpacity={0.7}
            >
              A
            </text>
          </g>
        </svg>
      }
    />
  );
}
