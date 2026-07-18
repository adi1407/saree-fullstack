"use client";

import { motion } from "framer-motion";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

interface FabricMotifPanelProps {
  className?: string;
  animate?: boolean;
}

export function FabricMotifPanel({ className = "", animate = true }: FabricMotifPanelProps) {
  const { fadeInView } = useInViewMotion();

  return (
    <motion.div
      {...(animate
        ? fadeInView({ opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1 })
        : {})}
      transition={{ duration: 0.8 }}
      className={`relative aspect-square overflow-hidden border border-secondary/30 bg-ink ${className}`}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="weavePattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 L20 10 M10 0 L10 20" stroke="#c9a962" strokeWidth="0.5" opacity="0.4" />
            <circle cx="10" cy="10" r="1.5" fill="#6b2d3c" opacity="0.6" />
          </pattern>
          <linearGradient id="fabricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b2d3c" />
            <stop offset="50%" stopColor="#1a1410" />
            <stop offset="100%" stopColor="#c9a962" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#weavePattern)" />
        <path
          d="M20,180 Q100,40 180,180"
          fill="none"
          stroke="url(#fabricGrad)"
          strokeWidth="3"
          className={animate ? "fabric-stroke-animate" : undefined}
        />
        <path
          d="M40,160 Q100,60 160,160"
          fill="none"
          stroke="#c9a962"
          strokeWidth="1.5"
          opacity="0.6"
          className={animate ? "fabric-stroke-animate-delayed" : undefined}
        />
      </svg>
      {animate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-secondary/20"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
