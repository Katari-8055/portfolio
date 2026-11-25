"use client";

import { m } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { sections } from "../data/resume";
import { openPalette, scrollToId } from "../lib/theme";
import { cn } from "../lib/utils";
import Monkey from "./Monkey";

function useActiveSection() {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let best = "";
        let bestRatio = 0;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        });
        setActive(best);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export default function Navbar() {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [isMac, setIsMac] = useState(false);
  // phones only: tuck the bar (and the monkey) away while scrolling down, bring it back on scroll up
  const [tucked, setTucked] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (window.innerWidth >= 640 || y < 160) setTucked(false);
      else if (y > lastY + 6) setTucked(true);
      else if (y < lastY - 6) setTucked(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 transition-transform duration-300 ease-out sm:top-5",
        tucked && "-translate-y-[11rem]",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "pointer-events-auto relative flex w-full max-w-3xl items-center gap-1 rounded-full border border-border px-2 py-1.5 transition-[background-color,box-shadow] duration-300",
          scrolled ? "bg-bg/95 shadow-lg shadow-black/20" : "bg-bg/70",
        )}
      >
        <Monkey />
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("top");
          }}
          className="mr-1 flex items-center gap-2 rounded-full px-2 py-1 font-mono text-sm font-semibold"
          aria-label="Back to top"
        >
          <span className="grid size-7 place-items-center rounded-full bg-accent text-[11px] text-accent-contrast">
            rb
          </span>
          <span className="hidden sm:inline">rahul.bind</span>
        </a>

        <ul className="no-scrollbar hidden flex-1 items-center justify-center gap-0.5 overflow-x-auto md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(s.id);
                  history.replaceState(null, "", `#${s.id}`);
                }}
                className={cn(
                  "relative isolate block rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
                  active === s.id ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {active === s.id && (
                  <m.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-subtle"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <button
            type="button"
            onClick={openPalette}
            className="flex h-9 items-center gap-2 rounded-full border border-border bg-card/60 pr-1.5 pl-3 text-sm text-muted transition-colors hover:text-fg"
            aria-label="Open command palette"
          >
            <Search className="size-3.5" />
            <span className="md:hidden">Menu</span>
            <kbd className="hidden rounded-md border border-border bg-subtle px-1.5 py-0.5 font-mono text-[10px] sm:inline">
              {isMac ? "⌘" : "Ctrl"} K
            </kbd>
          </button>
        </div>
      </nav>
    </header>
  );
}
