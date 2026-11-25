"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; r: number };

const LINK = 130; // max distance between two connected nodes
const MOUSE_R = 200; // radius in which the cursor "catches" the web

/**
 * Interactive spider-web / constellation backdrop.
 * Nodes drift slowly and link to neighbours; the cursor pulls nearby nodes in and
 * spins threads to them. Scrolling drags the web with a little parallax.
 */
export default function WebBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let pts: P[] = [];
    let raf = 0;
    let rgb = "134,239,172";
    const mouse = { x: -9999, y: -9999, on: false };
    let lastScroll = window.scrollY;

    // Resolve the theme accent (may be oklch) into rgb via a 1px canvas.
    const readColor = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 1;
      const x = c.getContext("2d");
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      if (x && accent) {
        x.fillStyle = accent;
        x.fillRect(0, 0, 1, 1);
        const d = x.getImageData(0, 0, 1, 1).data;
        rgb = `${d[0]},${d[1]},${d[2]}`;
      }
    };

    const seed = () => {
      const count = Math.min(130, Math.max(36, Math.floor((w * h) / 12500)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.2 + 0.6,
      }));
    };

    const resize = () => {
      const prevW = w;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // mobile URL bars resize height on scroll — only re-seed on real width changes
      if (w !== prevW || pts.length === 0) seed();
      else if (reduce) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const lineBase = 0.07;
      const dotBase = 0.2;

      // update
      for (const p of pts) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
        }
        if (mouse.on) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < MOUSE_R && d > 24) {
            // gentle pull — like the web tightening toward the cursor
            p.x += (dx / d) * 0.35;
            p.y += (dy / d) * 0.35;
          }
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // threads between nodes
      ctx.lineWidth = 0.7;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const t = 1 - Math.sqrt(d2) / LINK;
            ctx.strokeStyle = `rgba(${rgb},${t * lineBase})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // threads to the cursor
      if (mouse.on) {
        ctx.lineWidth = 0.9;
        for (const p of pts) {
          const d = Math.hypot(mouse.x - p.x, mouse.y - p.y);
          if (d < MOUSE_R) {
            const t = 1 - d / MOUSE_R;
            ctx.strokeStyle = `rgba(${rgb},${t * 0.24})`;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 60);
        g.addColorStop(0, `rgba(${rgb},0.035)`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodes
      for (const p of pts) {
        const near = mouse.on && Math.hypot(mouse.x - p.x, mouse.y - p.y) < MOUSE_R;
        ctx.fillStyle = `rgba(${rgb},${near ? 0.5 : dotBase})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? p.r + 0.8 : p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.on = true;
      if (reduce) draw();
    };
    const onLeave = () => {
      mouse.on = false;
      if (reduce) draw();
    };
    const onScroll = () => {
      const dy = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      if (reduce) return;
      // parallax: web drifts at 15% of scroll speed
      for (const p of pts) p.y -= dy * 0.15;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) loop();
    };

    readColor();
    resize();
    if (reduce) draw();
    else loop();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_95%)]"
    />
  );
}
