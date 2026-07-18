"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { fadeUp, motionTransition, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

interface MotionTextProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "h1" | "h2" | "p";
}

export function MotionText({ children, className, as = "div" }: MotionTextProps) {
  const { staggerProps } = useInViewMotion();
  const Component = motion[as] as typeof motion.div;

  return (
    <Component className={cn(className)} {...staggerProps} variants={staggerContainer}>
      {children}
    </Component>
  );
}

interface MotionLineProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function MotionLine({ children, className, delay = 0 }: MotionLineProps) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      transition={{ ...motionTransition, delay }}
    >
      {children}
    </motion.div>
  );
}
