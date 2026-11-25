"use client";

import { m, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { experience } from "../data/resume";
import { Chip, Section, SpotlightCard } from "./ui";

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.3 });

  return (
    <Section
      id="experience"
      index="01"
      eyebrow="Experience"
      title="Where I've shipped"
      description="Production backends and open-source work."
    >
      <ol ref={listRef} className="relative space-y-8 pl-8 sm:pl-12">
        {/* timeline track + scroll-driven fill */}
        <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-border sm:left-[11px]" />
        <m.span
          aria-hidden
          style={{ scaleY: fill }}
          className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-accent shadow-[0_0_6px_var(--accent-glow)] sm:left-[11px]"
        />

        {experience.map((job, i) => (
          <m.li
            key={job.company}
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              aria-hidden
              className="absolute top-7 -left-[31px] grid size-3.5 place-items-center rounded-full border-2 border-accent bg-bg sm:-left-[43px]"
            >
              <m.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ margin: "-40% 0px -40% 0px" }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="size-1.5 rounded-full bg-accent"
              />
            </span>
            <SpotlightCard className="overflow-hidden">
              <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_1.4fr] lg:gap-10">
                {/* meta */}
                <div>
                  <p className="font-mono text-xs text-muted">
                    {job.from} — {job.to}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">{job.company}</h3>
                  <p className="text-sm text-accent">{job.role}</p>
                  <p className="mt-3 text-sm text-muted">{job.summary}</p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {job.metrics.map((metric, mi) => (
                      <m.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + mi * 0.1 }}
                        className={`rounded-xl bg-subtle px-3 py-2.5 ${mi === 2 ? "col-span-2" : ""}`}
                      >
                        <div className="font-mono text-lg font-semibold text-accent">{metric.value}</div>
                        <div className="text-[11px] leading-tight text-muted">{metric.label}</div>
                      </m.div>
                    ))}
                  </div>
                </div>

                {/* details */}
                <div className="flex flex-col">
                  <ul className="space-y-3 text-sm text-fg/85">
                    {job.bullets.map((b, bi) => (
                      <m.li
                        key={b}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + bi * 0.1, duration: 0.5 }}
                        className="flex gap-3"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                        <span className="text-pretty">{b}</span>
                      </m.li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
                    {job.stack.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                    {job.link && (
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-flex items-center gap-1 text-xs text-muted hover:text-accent"
                      >
                        repository <ArrowUpRight className="size-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </m.li>
        ))}
      </ol>
    </Section>
  );
}
