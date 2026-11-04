"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useAnimate, useInView, useReducedMotion } from "motion/react";

export function Reveal({ children }: { children: ReactNode }) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { amount: 0.15, once: true });
  const reduceMotion = useReducedMotion();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || reduceMotion || hasAnimated.current) return;

    hasAnimated.current = true;
    void animate(
      scope.current,
      { opacity: [0, 1], y: [8, 0] },
      { duration: 0.32, ease: [0.2, 0, 0, 1] },
    );
  }, [animate, isInView, reduceMotion, scope]);

  return <div ref={scope}>{children}</div>;
}
