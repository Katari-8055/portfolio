"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Check, Copy, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "../data/resume";
import { scrollToId } from "../lib/theme";
import Terminal from "./Terminal";
import { Magnetic } from "./ui";

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.08 * i, duration: 0.6, ease: "easeOut" as const },
  }),
};

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % profile.rotating.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-grid align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={profile.rotating[i]}
          initial={{ y: "70%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-70%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-accent"
        >
          {profile.rotating[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const termY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] items-center pt-28 pb-20">
      <div
        aria-hidden
        className="absolute top-1/4 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-accent/[0.05] blur-[140px]"
      />

      <motion.div
        style={{ opacity: fade, scale }}
        className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-14"
      >
        <motion.div style={{ y: textY }}>
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="ping-soft absolute inline-flex size-full rounded-full bg-accent" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {profile.status}
          </motion.div>

          <h1 className="text-5xl font-semibold tracking-tighter sm:text-6xl lg:text-[5.5rem] lg:leading-[0.95]">
            {profile.name.split(" ").map((word, wi, words) => (
              <span key={wi} className="inline-block whitespace-nowrap">
                {word.split("").map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40, rotateX: -80 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: 0.15 + (wi * 6 + i) * 0.04, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block origin-bottom transition-colors duration-200 hover:text-accent"
                  >
                    {ch}
                  </motion.span>
                ))}
                {wi < words.length - 1 && " "}
              </span>
            ))}
          </h1>

          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 text-xl text-fg/90 sm:text-2xl"
          >
            Backend engineer building <RotatingWord />
          </motion.p>

          <motion.p
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-5 max-w-xl text-pretty text-muted"
          >
            {profile.summary}
          </motion.p>

          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToId("projects")}
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg shadow-lg shadow-black/20"
              >
                See my work
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </button>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card/60 px-5 text-sm font-medium backdrop-blur transition-colors hover:border-accent/50"
              >
                <FileText className="size-4" /> Resume
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex h-11 items-center gap-2 rounded-full px-3 font-mono text-sm text-muted transition-colors hover:text-fg"
              aria-label="Copy email address"
            >
              {copied ? <Check className="size-4 text-accent" /> : <Copy className="size-4" />}
              {copied ? "copied!" : profile.email}
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: termY }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        >
          <Terminal />
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        type="button"
        onClick={() => scrollToId("experience")}
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-widest text-muted uppercase sm:flex"
        aria-label="Scroll to content"
      >
        scroll
        <span className="flex h-9 w-5 justify-center rounded-full border border-border pt-1.5">
          <motion.span
            className="size-1 rounded-full bg-accent"
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.button>
    </section>
  );
}
