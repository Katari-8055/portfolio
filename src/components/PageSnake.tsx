"use client";

import { useEffect, useRef } from "react";

/**
 * One continuous snake that winds left ↔ right down the whole page.
 * Its head follows the reader (~60% down the viewport); the body behind it is drawn,
 * the path ahead stays as a faint dotted track. Scrolling up rewinds it.
 */
export default function PageSnake() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const bodyRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const track = trackRef.current;
    const body = bodyRef.current;
    const head = headRef.current;
    if (!wrap || !svg || !track || !body || !head) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let total = 0;
    let samples: { len: number; y: number }[] = [];
    let current = 0; // drawn length (smoothed)
    let target = 0;
    let raf = 0;

    const build = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));

      // zig-zag between the two sides; one turn roughly every 650px
      const left = w * (w < 640 ? 0.06 : 0.04);
      const right = w - left;
      const turns = Math.max(2, Math.round(h / 650));
      const step = h / turns;
      let x = w / 2;
      let y = 0;
      let d = `M ${x} ${y}`;
      for (let i = 0; i < turns; i++) {
        const nx = i === turns - 1 ? w / 2 : i % 2 === 0 ? left : right;
        const ny = y + step;
        d += ` C ${x} ${y + step * 0.55}, ${nx} ${ny - step * 0.55}, ${nx} ${ny}`;
        x = nx;
        y = ny;
      }
      track.setAttribute("d", d);
      body.setAttribute("d", d);

      total = body.getTotalLength();
      body.style.strokeDasharray = `${total}`;
      samples = [];
      const n = Math.max(200, Math.round(total / 25));
      for (let i = 0; i <= n; i++) {
        const len = (total * i) / n;
        samples.push({ len, y: body.getPointAtLength(len).y });
      }
      update(true);
    };

    // length along the path whose y matches the reading line
    const lengthAtY = (y: number) => {
      if (!samples.length) return 0;
      if (y <= samples[0].y) return 0;
      if (y >= samples[samples.length - 1].y) return total;
      let lo = 0;
      let hi = samples.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (samples[mid].y < y) lo = mid;
        else hi = mid;
      }
      const a = samples[lo];
      const b = samples[hi];
      const t = (y - a.y) / (b.y - a.y || 1);
      return a.len + (b.len - a.len) * t;
    };

    const render = () => {
      body.style.strokeDashoffset = `${total - current}`;
      const p = body.getPointAtLength(current);
      head.setAttribute("transform", `translate(${p.x} ${p.y})`);
      head.style.opacity = current > 4 && current < total - 4 ? "1" : "0";
    };

    const update = (snap = false) => {
      const top = wrap.getBoundingClientRect().top;
      target = reduce ? total : lengthAtY(window.innerHeight * 0.6 - top);
      if (snap) {
        current = target;
        render();
      }
    };

    const loop = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.5) current = target;
      render();
      raf = requestAnimationFrame(loop);
    };

    const onScroll = () => update();
    const ro = new ResizeObserver(() => build());
    ro.observe(wrap);
    build();
    if (!reduce) raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg ref={svgRef} className="absolute inset-0 overflow-visible">
        {/* path ahead: faint dotted track */}
        <path ref={trackRef} fill="none" stroke="var(--border)" strokeWidth="1.2" strokeDasharray="3 9" opacity="0.6" />
        {/* body already travelled */}
        <path
          ref={bodyRef}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.45"
        />
        {/* head */}
        <g ref={headRef} style={{ opacity: 0, transition: "opacity 0.3s" }}>
          <circle r="10" fill="var(--accent)" opacity="0.08" />
          <circle r="4" fill="var(--accent)" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
}
