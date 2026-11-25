"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { useRef } from "react";
import { projects, type Project } from "../data/resume";
import ArchitectureFlow from "./ArchitectureFlow";
import { Chip, Section, SpotlightCard } from "./ui";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // card tilts up and settles as it scrolls into view
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 55%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.2, 1]);
  const numberY = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <div ref={ref} className="relative" style={{ perspective: 1400 }}>
      <motion.div style={{ scale, rotateX, opacity, transformOrigin: "center top" }}>
        <SpotlightCard as="article" className="relative overflow-hidden p-5 sm:p-8">
          {/* big index number */}
          <motion.span
            aria-hidden
            style={{ y: numberY }}
            className="pointer-events-none absolute -top-4 right-4 font-mono text-[7rem] leading-none font-bold text-fg/[0.04] select-none sm:text-[10rem]"
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>

          <div className="relative grid gap-8 lg:grid-cols-[1fr_1.15fr]">
            {/* left: story */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 font-mono text-xs text-muted">
                <span className="rounded-md bg-accent-soft px-2 py-0.5 text-accent">{project.category}</span>
                {project.period}
              </div>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h3>
              <p className="mt-1 text-accent">{project.tagline}</p>
              <p className="mt-4 text-sm text-pretty text-muted">{project.description}</p>

              <ul className="mt-5 space-y-2.5 text-sm text-fg/85">
                {project.highlights.map((h, hi) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + hi * 0.1 }}
                    className="flex gap-3"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-pretty">{h}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>

              <div className="mt-6 flex gap-2 lg:mt-auto lg:pt-6">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm transition-colors hover:border-accent/50 hover:text-accent"
                >
                  <Github className="size-4" /> Source
                </a>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-10 items-center gap-1 rounded-full bg-accent px-4 text-sm font-medium text-accent-contrast"
                  >
                    Live demo
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
              </div>
            </div>

            {/* right: numbers + architecture */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {project.metrics.map((m, mi) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + mi * 0.1 }}
                    className="rounded-xl border border-border bg-bg/40 px-4 py-3"
                  >
                    <div className="font-mono text-xl font-semibold text-accent">{m.value}</div>
                    <div className="mt-0.5 text-xs text-muted">{m.label}</div>
                  </motion.div>
                ))}
              </div>
              <ArchitectureFlow nodes={project.flow} />
            </div>
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  return (
    <Section
      id="projects"
      index="02"
      eyebrow="Projects"
      title="Systems I've designed and load-tested"
      description="Each diagram traces a real request through the stack — hover a node to pause and inspect it."
    >
      <div className="space-y-8 sm:space-y-12">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </div>
    </Section>
  );
}
