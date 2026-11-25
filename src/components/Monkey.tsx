"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const LINES = [
  "ooh ooh! hire Rahul 🍌",
  "I debug with console.log, too.",
  "p95 latency? 65ms. I checked.",
  "try Ctrl + K 👀",
  "type 'neofetch' in the terminal…",
  "stop poking me, go read the projects!",
  "RabbitMQ? more like RabbitMonkey.",
];

/**
 * A little monkey hanging from the navbar.
 * Real pendulum physics: idles with a gentle sway, gets kicked by scroll velocity and clicks.
 * Its eyes follow the cursor.
 */
export default function Monkey() {
  const swingRef = useRef<SVGGElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [say, setSay] = useState<string | null>(null);
  const kick = useRef(0);
  const lineIdx = useRef(0);

  // pendulum simulation
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let angle = 0; // degrees
    let vel = 0;
    let raf = 0;
    let last = performance.now();
    let lastY = window.scrollY;

    const step = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      const y = window.scrollY;
      const scrollV = y - lastY;
      lastY = y;

      const drive = reduce ? 0 : Math.sin(now / 900) * 0.025; // idle sway
      const scrollPush = reduce ? 0 : Math.max(-6, Math.min(6, scrollV * 0.04));
      vel += (-0.012 * angle - 0.035 * vel + drive + scrollPush * 0.15 + kick.current) * dt;
      kick.current = 0;
      angle += vel * dt;
      angle = Math.max(-75, Math.min(75, angle));

      if (swingRef.current) swingRef.current.style.transform = `rotate(${angle}deg)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // eyes follow cursor
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = svgRef.current?.getBoundingClientRect();
      if (!r) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.42;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.hypot(dx, dy) || 1;
      const m = Math.min(1.3, d / 60);
      setPupil({ x: (dx / d) * m, y: (dy / d) * m });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (!say) return;
    const t = setTimeout(() => setSay(null), 2600);
    return () => clearTimeout(t);
  }, [say]);

  const poke = () => {
    kick.current = (Math.random() > 0.5 ? 1 : -1) * 3.2;
    setSay(LINES[lineIdx.current % LINES.length]);
    lineIdx.current += 1;
  };

  const brown = "#7a4a2a";
  const dark = "#5b351c";
  const tan = "#efc9a0";

  return (
    <div className="pointer-events-none absolute top-[calc(100%-7px)] left-14 z-10 sm:left-20">
      <svg
        ref={svgRef}
        width="54"
        height="100"
        viewBox="0 0 60 110"
        className="pointer-events-auto cursor-pointer overflow-visible drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)]"
        onClick={poke}
        role="button"
        aria-label="A monkey hanging from the navbar — click it"
      >
        <g ref={swingRef} style={{ transformOrigin: "40px 4px", transformBox: "view-box" }}>
          {/* gripping arm (drawn behind head) */}
          <path d="M40 4 Q46 28 38 60" stroke={brown} strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx="40" cy="5" r="4.2" fill={dark} />

          {/* tail */}
          <path
            d="M38 82 C56 90 58 70 49 66 C44 64 43 72 48 72"
            stroke={brown}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* body */}
          <ellipse cx="30" cy="72" rx="11" ry="14" fill={brown} />
          <ellipse cx="30" cy="75" rx="7" ry="9" fill={tan} />

          {/* dangling arm holding a banana */}
          <path d="M21 64 Q13 74 15 84" stroke={brown} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M9 84 Q14 96 23 90 Q15 92 11 84 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="15" cy="85" r="3" fill={dark} />

          {/* legs */}
          <path d="M25 84 Q22 92 23 98" stroke={brown} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M35 84 Q38 92 37 98" stroke={brown} strokeWidth="5" fill="none" strokeLinecap="round" />
          <ellipse cx="22" cy="99.5" rx="3.6" ry="2.4" fill={dark} />
          <ellipse cx="38" cy="99.5" rx="3.6" ry="2.4" fill={dark} />

          {/* ears */}
          <circle cx="15" cy="44" r="5.5" fill={brown} />
          <circle cx="45" cy="44" r="5.5" fill={brown} />
          <circle cx="15" cy="44" r="2.8" fill={tan} />
          <circle cx="45" cy="44" r="2.8" fill={tan} />

          {/* head + face */}
          <circle cx="30" cy="44" r="14" fill={brown} />
          <circle cx="25.5" cy="42" r="5.2" fill={tan} />
          <circle cx="34.5" cy="42" r="5.2" fill={tan} />
          <ellipse cx="30" cy="49" rx="9.5" ry="7.5" fill={tan} />

          {/* eyes */}
          <circle cx="25.5" cy="42" r="2.9" fill="#fff" />
          <circle cx="34.5" cy="42" r="2.9" fill="#fff" />
          <circle cx={25.5 + pupil.x} cy={42 + pupil.y} r="1.7" fill="#1a1a1a" />
          <circle cx={34.5 + pupil.x} cy={42 + pupil.y} r="1.7" fill="#1a1a1a" />
          <circle cx={25 + pupil.x} cy={41.4 + pupil.y} r="0.5" fill="#fff" />
          <circle cx={34 + pupil.x} cy={41.4 + pupil.y} r="0.5" fill="#fff" />

          {/* nose + smile + cheeks */}
          <circle cx="28.6" cy="48.5" r="0.8" fill={dark} />
          <circle cx="31.4" cy="48.5" r="0.8" fill={dark} />
          <path d="M25.5 51.5 Q30 56 34.5 51.5" stroke={dark} strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <circle cx="22.5" cy="50" r="1.6" fill="#f59e9e" opacity="0.6" />
          <circle cx="37.5" cy="50" r="1.6" fill="#f59e9e" opacity="0.6" />
        </g>
      </svg>

      <AnimatePresence>
        {say && (
          <motion.div
            key={say}
            initial={{ opacity: 0, scale: 0.6, x: -6 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="absolute top-12 left-14 w-max max-w-52 origin-left rounded-xl rounded-tl-sm border border-border bg-card px-3 py-1.5 text-xs shadow-lg"
          >
            {say}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
