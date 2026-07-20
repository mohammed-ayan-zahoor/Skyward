"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  /** Direction from which the element slides in (defaults to 'up') */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Delay before animation starts in seconds (defaults to 0) */
  delay?: number;
  /** Duration of transition in seconds (defaults to 0.6) */
  duration?: number;
  /** Additional CSS class names */
  className?: string;
  /** Offset value for when the trigger fires (defaults to '-80px') */
  offset?: string;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className,
  offset = "-80px",
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  // Accessibility floor: skip animations if user prefers reduced motion
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const offsetAmount = 24; // clean, subtle slide amount in pixels

  const directions = {
    up: { y: offsetAmount, x: 0 },
    down: { y: -offsetAmount, x: 0 },
    left: { x: offsetAmount, y: 0 },
    right: { x: -offsetAmount, y: 0 },
    none: { x: 0, y: 0 },
  };

  const initial = {
    opacity: 0,
    ...directions[direction],
  };

  const animate = {
    opacity: 1,
    x: 0,
    y: 0,
  };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: `0px 0px ${offset} 0px` }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // premium cubic-bezier ease-out
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
