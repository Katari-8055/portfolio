"use client";

import { AnimatePresence, m, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Check, Copy, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "../data/resume";
import { scrollToId } from "../lib/theme";
import { MOBILE_QUERY, useMediaQuery } from "../lib/useMediaQuery";
import Terminal from "./Terminal";
import { Magnetic } from "./ui";

// Entrance animations are plain CSS (see .rise / .letter in globals.css) so the hero
// is painted straight from the server HTML — no waiting for JavaScript.
const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % profile.rotating.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-grid align-bottom">
      <AnimatePresence mode="wait">
        <m.span
          key={profile.rotating[i]}
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-70%", opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-accent"
        >
          {profile.rotating[i]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // phones: keep the hero static while scrolling (desktop keeps the parallax fade)
  const mobile = useMediaQuery(MOBILE_QUERY);
  const textY = useTransform(scrollYProgress, (v) => (mobile ? 0 : v * 140));
  const termY = useTransform(scrollYProgress, (v) => (mobile ? 0 : v * 60));
  const fade = useTransform(scrollYProgress, (v) => (mobile ? 1 : Math.max(0, 1 - v / 0.7)));
  const scale = useTransform(scrollYProgress, (v) => (mobile ? 1 : 1 - v * 0.06));

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
    <section ref={ref} id="top" className="relative flex min-h-[100svh] items-center pt-40 pb-14 sm:pt-28 sm:pb-20">
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -z-10 size-[56rem] -translate-x-1/2 bg-[radial-gradient(closest-side,var(--accent-soft),transparent)] opacity-60"
      />

      <m.div
        style={{ opacity: fade, scale }}
        className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14"
      >
        <m.div style={{ y: textY }}>
          <div
            style={delay(0)}
            className="rise mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-muted"
          >
            <span className="relative flex size-2">
              <span className="ping-soft absolute inline-flex size-full rounded-full bg-accent" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {profile.status}
          </div>

          <h1 className="text-5xl font-semibold tracking-tighter sm:text-6xl lg:text-[5.5rem] lg:leading-[0.95]">
            {profile.name.split(" ").map((word, wi, words) => (
              <span key={wi} className="inline-block whitespace-nowrap">
                {word.split("").map((ch, i) => (
                  <span
                    key={i}
                    style={delay(0.05 + (wi * 6 + i) * 0.03)}
                    className="letter inline-block origin-bottom transition-colors duration-200 hover:text-accent"
                  >
                    {ch}
                  </span>
                ))}
                {wi < words.length - 1 && " "}
              </span>
            ))}
          </h1>

          <p style={delay(0.1)} className="rise mt-6 text-xl text-fg/90 sm:text-2xl">
            Backend engineer building <RotatingWord />
          </p>

          {/* no entrance animation: this paragraph is the LCP element, so it must paint immediately */}
          <p className="mt-5 max-w-xl text-pretty text-muted">
            {profile.summary}
          </p>

          <div style={delay(0.35)} className="rise mt-8 flex flex-wrap items-center gap-3">
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
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card/80 px-5 text-sm font-medium transition-colors hover:border-accent/50"
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
          </div>
        </m.div>

        <m.div style={{ y: termY }}>
          <div style={delay(0.3)} className="rise">
            <Terminal />
          </div>
        </m.div>
      </m.div>

      {/* scroll cue */}
      <m.button
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
          <m.span
            className="size-1 rounded-full bg-accent"
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </m.button>
    </section>
  );
}
