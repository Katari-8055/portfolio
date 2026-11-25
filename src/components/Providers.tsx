"use client";

import { LazyMotion, MotionConfig } from "framer-motion";

const loadFeatures = () => import("../lib/motion-features").then((mod) => mod.default);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // `strict` makes any accidental full `motion.*` import throw in dev, keeping the bundle lean
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
