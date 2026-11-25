"use client";

import { m, useSpring } from "framer-motion";
import { useRef } from "react";
import { cn } from "../lib/utils";

export function Section({
  id,
  index,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-20 sm:py-28">
      <m.header
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10 sm:mb-14"
      >
        <p className="mb-3 font-mono text-xs tracking-wider text-accent uppercase">
          <span className="text-muted">{index} /</span> {eyebrow}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          <WordReveal text={title} />
        </h2>
        {description && <p className="mt-4 max-w-2xl text-pretty text-muted">{description}</p>}
      </m.header>
      {children}
    </section>
  );
}

/** Heading whose words rise in one after another. */
export function WordReveal({ text }: { text: string }) {
  return (
    <m.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.06 }}
      className="inline"
    >
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
          <m.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            {word}
            {i < text.split(" ").length - 1 && " "}
          </m.span>
        </span>
      ))}
    </m.span>
  );
}

/** Wrapper that leans its child toward the cursor. */
export function Magnetic({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 250, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 250, damping: 18, mass: 0.4 });
  return (
    <m.div
      ref={ref}
      style={{ x, y }}
      className="inline-block"
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </m.div>
  );
}

/** Card whose border glow follows the cursor. */
export function SpotlightCard({
  children,
  className,
  as: Tag = "div",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "a" | "article";
} & React.HTMLAttributes<HTMLElement> & { href?: string; target?: string; rel?: string }) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const Comp = Tag as React.ElementType;
  return (
    <Comp
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "spotlight rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-accent/40",
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-subtle px-2 py-0.5 font-mono text-[11px] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
