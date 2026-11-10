"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Thin accent progress bar tied to page scroll. Purely decorative and does not
 * intercept pointer events.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduced ? scrollYProgress : smooth }}
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-accent"
    />
  );
}
