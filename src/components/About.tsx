"use client";

import { Award, GraduationCap, Trophy, Users } from "lucide-react";
import { achievements, education } from "../data/resume";
import { Chip, Reveal, Section, SpotlightCard } from "./ui";

const icons = [Trophy, Award, Award, Trophy];

export default function About() {
  return (
    <Section id="about" index="05" eyebrow="About" title="Education & recognition">
      <div className="grid gap-4 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <SpotlightCard className="flex h-full flex-col p-6">
            <div className="flex items-center gap-4">
              <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-white p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={education.logo} alt="NIT Rourkela logo" width={44} height={44} />
              </div>
              <div>
                <h3 className="leading-snug font-semibold">{education.institution}</h3>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
                  <GraduationCap className="size-4" /> {education.degree} · {education.from} – {education.to}
                </p>
              </div>
            </div>
            <p className="mt-6 mb-2 font-mono text-[11px] tracking-wider text-muted uppercase">
              Relevant coursework
            </p>
            <div className="flex flex-wrap gap-1.5">
              {education.coursework.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
            <div className="mt-auto border-t border-border pt-5">
              <p className="flex items-center gap-2 text-sm font-medium">
                <Users className="size-4 text-accent" /> {education.extracurricular.title}
              </p>
              <p className="mt-1 text-sm text-muted">{education.extracurricular.description}</p>
            </div>
          </SpotlightCard>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
          {achievements.map((a, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={a.title} delay={i * 0.06}>
                <SpotlightCard className="h-full p-5">
                  <div className="flex items-center justify-between">
                    <Icon className="size-5 text-accent" />
                    <span className="font-mono text-xs text-muted">{a.title}</span>
                  </div>
                  <div className="mt-4 text-2xl font-semibold tracking-tight">{a.value}</div>
                  <p className="mt-2 text-sm text-pretty text-muted">{a.description}</p>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
