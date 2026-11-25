"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { FlowNode } from "../data/resume";
import { cn } from "../lib/utils";

/**
 * A request's path through the system, drawn as a vertical pipeline.
 * While on screen, a "request" walks down the hops on its own; hovering a hop pauses
 * on it. Packets keep flowing along the connectors.
 */
export default function ArchitectureFlow({ nodes }: { nodes: FlowNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const [step, setStep] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? step;

  useEffect(() => {
    if (!inView || hover !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setStep((s) => (s + 1) % nodes.length), 1100);
    return () => clearInterval(t);
  }, [inView, hover, nodes.length]);

  return (
    <div ref={ref} className="rounded-xl border border-border bg-bg/40 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] tracking-wider text-muted uppercase">
        <span>request path</span>
        <span className="flex items-center gap-1.5">
          <span className="relative flex size-1.5">
            <span className="ping-soft absolute inline-flex size-full rounded-full bg-accent" />
            <span className="relative size-1.5 rounded-full bg-accent" />
          </span>
          {hover !== null ? "inspecting" : "live"}
        </span>
      </div>

      <ol onMouseLeave={() => setHover(null)}>
        {nodes.map((n, i) => {
          const isActive = active === i;
          const passed = i < active;
          return (
            <li key={n.label} className="relative flex gap-4">
              {/* rail */}
              <div className="flex flex-col items-center">
                <motion.span
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-lg border font-mono text-[10px] transition-colors duration-300",
                    isActive
                      ? "border-accent bg-accent text-accent-contrast shadow-[0_0_8px_var(--accent-glow)]"
                      : passed
                        ? "border-accent/50 text-accent"
                        : "border-border text-muted",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>
                {i < nodes.length - 1 && (
                  <span aria-hidden className="relative my-1 w-px flex-1 overflow-hidden bg-border">
                    <span
                      className="packet-y absolute left-0 h-3 w-px bg-gradient-to-b from-transparent to-accent"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  </span>
                )}
              </div>

              {/* label + note */}
              <button
                type="button"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className={cn(
                  "mb-2 flex-1 rounded-lg px-3 py-1.5 text-left transition-colors duration-300",
                  isActive ? "bg-accent-soft" : "hover:bg-subtle",
                )}
              >
                <div className={cn("font-mono text-xs", isActive ? "text-fg" : "text-fg/80")}>{n.label}</div>
                <div className={cn("text-xs transition-colors", isActive ? "text-fg/80" : "text-muted")}>
                  {n.note}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
