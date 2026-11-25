"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { skills, usagesOf } from "../data/resume";
import { cn } from "../lib/utils";
import { Reveal, Section } from "./ui";

export default function Skills() {
  const [active, setActive] = useState<string | null>("Node.js");
  const used = active ? usagesOf(active) : [];

  return (
    <Section
      id="skills"
      index="04"
      eyebrow="Skills"
      title="The toolbox"
      description="Click any skill to see where I've used it in production or projects."
    >
      <div className="space-y-6">
        {Object.entries(skills).map(([group, items], gi) => (
          <Reveal key={group} delay={gi * 0.05}>
            <div className="grid gap-3 sm:grid-cols-[180px_1fr] sm:items-baseline">
              <h3 className="font-mono text-xs tracking-wider text-muted uppercase">{group}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((s) => {
                  const isActive = active === s;
                  const hasUsage = usagesOf(s).length > 0;
                  return (
                    <motion.button
                      key={s}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActive(isActive ? null : s)}
                      aria-pressed={isActive}
                      className={cn(
                        "relative rounded-lg border px-3 py-1.5 text-sm transition-colors",
                        isActive
                          ? "border-accent bg-accent text-accent-contrast"
                          : "border-border bg-card text-fg/85 hover:border-accent/50",
                      )}
                    >
                      {s}
                      {hasUsage && !isActive && (
                        <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-accent" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 min-h-14 rounded-xl border border-dashed border-border px-4 py-3 font-mono text-sm" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={active ?? "none"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap items-center gap-2"
          >
            {!active ? (
              <span className="text-muted">select a skill ↑ — dots mark ones with shipped work</span>
            ) : used.length ? (
              <>
                <span className="text-accent">{active}</span>
                <span className="text-muted">used in →</span>
                {used.map((u) => (
                  <span key={u} className="rounded-md bg-subtle px-2 py-0.5 text-fg">
                    {u}
                  </span>
                ))}
              </>
            ) : (
              <>
                <span className="text-accent">{active}</span>
                <span className="text-muted">→ coursework, competitive programming & side projects</span>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
