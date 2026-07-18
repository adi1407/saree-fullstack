"use client";

import { motion } from "framer-motion";

interface AnimatedProceduralFallbackProps {
  variant?: "wine" | "gold" | "ink" | "accent";
  className?: string;
}

const palettes = {
  wine: { a: "#6b2d3c", b: "#1a1410", c: "#c9a962" },
  gold: { a: "#c9a962", b: "#6b2d3c", c: "#fdf8f3" },
  ink: { a: "#1a1410", b: "#6b2d3c", c: "#2d5c4e" },
  accent: { a: "#2d5c4e", b: "#1a1410", c: "#c9a962" },
};

export function AnimatedProceduralFallback({
  variant = "wine",
  className = "",
}: AnimatedProceduralFallbackProps) {
  const p = palettes[variant];

  return (
    <div className={`animated-procedural-fallback absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <motion.div
        className="absolute -inset-[50%] opacity-70"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${p.a} 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, ${p.b} 0%, transparent 45%),
            radial-gradient(circle at 50% 80%, ${p.c}33 0%, transparent 40%)`,
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <div className="weave-grid absolute inset-0 opacity-20" />
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-secondary"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.9, 0.2],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 3 + (i % 5),
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-background/90" />
    </div>
  );
}
