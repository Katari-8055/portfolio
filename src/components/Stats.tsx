"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { stats } from "../data/resume";
import { Reveal, SpotlightCard } from "./ui";

function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    const c = animate(0, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: setVal });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{val.toFixed(decimals)}</span>;
}

export default function Stats() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.06}>
          <SpotlightCard className="h-full p-5">
            <div className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
              <CountUp to={s.value} decimals={s.decimals} />
              <span className="text-accent">{s.suffix}</span>
            </div>
            <div className="mt-2 text-sm text-fg/90">{s.label}</div>
            <div className="mt-1 font-mono text-[11px] text-muted">{s.note}</div>
          </SpotlightCard>
        </Reveal>
      ))}
    </div>
  );
}
