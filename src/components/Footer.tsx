"use client";

import { m } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useRef } from "react";
import { profile } from "../data/resume";
import { scrollToId } from "../lib/theme";

export default function Footer() {
  const nameRef = useRef<HTMLDivElement>(null);

  // the filled copy of the name is revealed in a circle around the cursor
  const onMove = (e: React.MouseEvent) => {
    const el = nameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--fx", `${e.clientX - r.left}px`);
    el.style.setProperty("--fy", `${e.clientY - r.top}px`);
    el.style.setProperty("--fr", "180px");
  };
  const onLeave = () => nameRef.current?.style.setProperty("--fr", "0px");

  return (
    <footer className="relative mt-10 overflow-hidden border-t border-border">
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs tracking-wider text-accent uppercase">thanks for scrolling</p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Built with Next.js, Tailwind and Framer Motion.
            </p>
          </div>
          <m.button
            type="button"
            onClick={() => scrollToId("top")}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.94 }}
            className="group flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted hover:text-fg"
          >
            Back to top
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" />
          </m.button>
        </div>
      </div>

      {/* giant interactive name */}
      <div
        ref={nameRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="name-reveal relative mt-8 cursor-default select-none"
        aria-hidden
      >
        <div
          className="text-center text-[14vw] leading-[0.8] whitespace-nowrap font-bold tracking-tighter text-transparent"
          style={{ WebkitTextStroke: "1px var(--border)" }}
        >
          RAHUL BIND
        </div>
        <div
          className="absolute inset-0 text-center text-[14vw] leading-[0.8] whitespace-nowrap font-bold tracking-tighter text-accent"
          style={{
            WebkitMaskImage:
              "radial-gradient(circle var(--fr, 0px) at var(--fx, 50%) var(--fy, 50%), black 30%, transparent 100%)",
            maskImage:
              "radial-gradient(circle var(--fr, 0px) at var(--fx, 50%) var(--fy, 50%), black 30%, transparent 100%)",
          }}
        >
          RAHUL BIND
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 font-mono text-[11px] text-muted sm:flex-row sm:px-6">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="hidden sm:inline">
          press <kbd className="rounded border border-border px-1.5 py-0.5">Ctrl K</kbd> anywhere
        </span>
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent"
        >
          @{profile.handle}
        </a>
      </div>
    </footer>
  );
}
