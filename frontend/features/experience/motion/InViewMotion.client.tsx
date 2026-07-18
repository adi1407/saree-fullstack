"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useInViewMotion, type FadeState } from "@/features/experience/motion/useInViewMotion.client";

interface InViewStaggerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}

/** Stagger children with fadeUp — mobile-safe (no stuck opacity:0 on iOS). */
export function InViewStagger({ children, className, ...rest }: InViewStaggerProps) {
  const { staggerProps } = useInViewMotion();

  return (
    <motion.div {...staggerProps} variants={staggerContainer} className={className} {...rest}>
      {children}
    </motion.div>
  );
}

interface InViewFadeProps extends Omit<HTMLMotionProps<"div">, "hidden"> {
  children: ReactNode;
  from?: FadeState;
  to?: FadeState;
}

/** Single block fade/slide — mobile-safe. */
export function InViewFade({
  children,
  className,
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  ...rest
}: InViewFadeProps) {
  const { fadeInView } = useInViewMotion();

  return (
    <motion.div {...fadeInView(from, to)} className={className} {...rest}>
      {children}
    </motion.div>
  );
}
