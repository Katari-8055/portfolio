"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { experience, profile, projects, skills } from "../data/resume";
import { scrollToId } from "../lib/theme";
import { cn } from "../lib/utils";

type Kind = "cmd" | "out" | "ok" | "err" | "dim" | "json" | "head";
type Line = { kind: Kind; text: string };

const COMMANDS = ["help", "about", "whoami", "experience", "projects", "skills", "k6", "neofetch", "contact", "resume", "clear"];
const CHIPS = ["help", "whoami", "projects", "k6", "neofetch", "contact"];

const DEMOS: { cmd: string; out: Line[] }[] = [
  {
    cmd: "curl -s rahul.dev/api/whoami | jq",
    out: [
      { kind: "json", text: "{" },
      { kind: "json", text: `  "name": "${profile.name}",` },
      { kind: "json", text: `  "role": "${profile.role}",` },
      { kind: "json", text: `  "school": "NIT Rourkela '27",` },
      { kind: "json", text: `  "focus": ["APIs", "queues", "caching", "agents"]` },
      { kind: "json", text: "}" },
    ],
  },
  {
    cmd: "k6 run pulseapi-load.js",
    out: [
      { kind: "ok", text: "✓ http_reqs.............: 222,000+" },
      { kind: "ok", text: "✓ throughput..........: 780 rps  (was 310)" },
      { kind: "ok", text: "✓ success_rate........: 99.9%" },
    ],
  },
];

const NEOFETCH: Line[] = [
  { kind: "head", text: "   ____  ____     rahul@nitr" },
  { kind: "head", text: "  |  _ \\| __ )    ----------" },
  { kind: "out", text: "  | |_) |  _ \\    role     backend & full-stack" },
  { kind: "out", text: "  |  _ <| |_) |   solved   700+ dsa problems" },
  { kind: "out", text: "  |_| \\_\\____/    stack    node · pg · redis · rmq" },
  { kind: "out", text: "                  ai       langgraph · rag · mcp" },
  { kind: "out", text: "                  shell    curiosity --verbose" },
];

const HELP: Line[] = [
  { kind: "dim", text: "available commands:" },
  { kind: "out", text: "  about       who I am" },
  { kind: "out", text: "  experience  where I've worked" },
  { kind: "out", text: "  projects    things I've built" },
  { kind: "out", text: "  whoami      me, as JSON" },
  { kind: "out", text: "  skills      what I work with" },
  { kind: "out", text: "  k6          PulseAPI load-test results" },
  { kind: "out", text: "  neofetch    system info, but it's me" },
  { kind: "out", text: "  contact     how to reach me" },
  { kind: "out", text: "  resume      open my resume" },
  { kind: "out", text: "  clear       clear the screen" },
  { kind: "dim", text: "tip: ↑/↓ history · tab completes" },
];

function run(raw: string): Line[] | "clear" {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  switch (cmd.toLowerCase()) {
    case "":
      return [];
    case "help":
    case "ls":
      return HELP;
    case "about":
      return [{ kind: "out", text: profile.summary }];
    case "whoami":
    case "curl":
      return DEMOS[0].out;
    case "k6":
    case "benchmark":
      return DEMOS[1].out;
    case "experience":
    case "work":
      setTimeout(() => scrollToId("experience"), 500);
      return experience.map((e) => ({ kind: "out" as const, text: `• ${e.company} — ${e.role} (${e.from} – ${e.to})` }));
    case "projects":
      setTimeout(() => scrollToId("projects"), 500);
      return projects.map((p) => ({ kind: "out" as const, text: `• ${p.title.padEnd(11)} ${p.tagline}` }));
    case "skills":
      return Object.entries(skills).map(([k, v]) => ({ kind: "out" as const, text: `${k}: ${v.join(", ")}` }));
    case "neofetch":
      return NEOFETCH;
    case "contact":
    case "email":
      return [
        { kind: "out", text: `email     ${profile.email}` },
        { kind: "out", text: `github    ${profile.links.github.replace("https://", "")}` },
        { kind: "out", text: `linkedin  ${profile.links.linkedin.replace("https://www.", "")}` },
      ];
    case "resume":
    case "cv":
      window.open(profile.resume, "_blank", "noopener");
      return [{ kind: "ok", text: "opening resume.pdf…" }];
    case "ping":
      return [{ kind: "ok", text: `pong — ${Math.floor(8 + Math.random() * 20)}ms (p95 still under 65ms)` }];
    case "date":
      return [{ kind: "out", text: new Date().toString() }];
    case "echo":
      return [{ kind: "out", text: args.join(" ") }];
    case "clear":
      return "clear";
    case "sudo":
      return [{ kind: "err", text: "nice try. permission denied 🙂" }];
    case "hire":
    case "hire-me":
      setTimeout(() => scrollToId("contact"), 500);
      return [{ kind: "ok", text: "great choice. routing you to /contact…" }];
    default:
      return [{ kind: "err", text: `command not found: ${cmd} — try 'help'` }];
  }
}

/** Light JSON syntax colouring: keys, strings, punctuation. */
function Json({ text }: { text: string }) {
  const parts = text.split(/("(?:[^"\\]|\\.)*"(?:\s*:)?)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('"') ? (
          p.trimEnd().endsWith(":") ? (
            <span key={i} className="text-sky-600 dark:text-sky-300">
              {p}
            </span>
          ) : (
            <span key={i} className="text-amber-600 dark:text-amber-200">
              {p}
            </span>
          )
        ) : (
          <span key={i} className="text-muted">
            {p}
          </span>
        ),
      )}
    </>
  );
}

function Clock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="tabular-nums">{now}</span>;
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const ready = true;
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const [count, setCount] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt following the cursor
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 150, damping: 18 });
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 150, damping: 18 });
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);
  const borderBg = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(340px circle at ${x} ${y}, var(--accent-glow), transparent 60%), linear-gradient(var(--border), var(--border))`,
  );


  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const exec = (value: string) => {
    setHIdx(-1);
    if (value.trim()) setHistory((h) => [value, ...h].slice(0, 20));
    setCount((c) => c + 1);
    const result = run(value);
    if (result === "clear") {
      setLines([]);
      return;
    }
    setLines((l) => [...l, { kind: "cmd", text: value }, ...result]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input;
    setInput("");
    exec(v);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const n = Math.min(hIdx + 1, history.length - 1);
      setHIdx(n);
      setInput(history[n]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = hIdx - 1;
      setHIdx(n);
      setInput(n >= 0 ? history[n] : "");
    } else if (e.key === "Tab") {
      const match = COMMANDS.find((c) => input && c.startsWith(input.toLowerCase()));
      if (match) {
        e.preventDefault();
        setInput(match);
      }
    }
  };

  const suggestion = input ? COMMANDS.find((c) => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase()) : undefined;

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => {
          const r = cardRef.current?.getBoundingClientRect();
          if (!r) return;
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        className="group relative rounded-2xl p-px"
      >
        {/* glowing gradient border that follows the cursor */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-70 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: borderBg }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-accent/6 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        />

        <div
          className="relative overflow-hidden rounded-2xl bg-card/90 shadow-2xl shadow-black/20 backdrop-blur-xl"
          onClick={() => ready && inputRef.current?.focus({ preventScroll: true })}
        >
          {/* title bar */}
          <div className="flex items-center gap-2 border-b border-border bg-subtle/60 px-4 py-2.5">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
            <div className="ml-3 flex items-center gap-1 font-mono text-[11px]">
              <span className="rounded-md bg-card px-2 py-0.5 text-fg">~/portfolio</span>
              <span className="hidden px-2 py-0.5 text-muted sm:inline">zsh</span>
            </div>
            <span className="ml-auto font-mono text-[10px] text-muted">80×24</span>
          </div>

          {/* body */}
          <div
            ref={bodyRef}
            className="h-72 overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed sm:h-80"
            aria-live="polite"
          >
            {lines.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "break-words whitespace-pre-wrap",
                  l.kind === "cmd" && "mt-1 text-fg",
                  l.kind === "out" && "text-muted",
                  l.kind === "ok" && "text-accent",
                  l.kind === "head" && "text-accent",
                  l.kind === "err" && "text-red-500 dark:text-red-400",
                  l.kind === "dim" && "text-muted/70 italic",
                )}
              >
                {l.kind === "cmd" && (
                  <span>
                    <span className="text-accent">➜ </span>
                    <span className="text-sky-600 dark:text-sky-300">~ </span>
                  </span>
                )}
                {l.kind === "json" ? <Json text={l.text} /> : l.text}
              </motion.div>
            ))}
            {ready && (
              <form onSubmit={submit} className="relative mt-1 flex items-center text-fg">
                <label htmlFor="term-input" className="shrink-0">
                  <span className="text-accent">➜ </span>
                  <span className="text-sky-600 dark:text-sky-300">~&nbsp;</span>
                </label>
                <div className="relative flex-1">
                  {suggestion && (
                    <span aria-hidden className="pointer-events-none absolute inset-0 text-muted/40">
                      {input}
                      {suggestion.slice(input.length)}
                    </span>
                  )}
                  <input
                    id="term-input"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKey}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="type 'help' and press enter"
                    aria-label="Terminal command"
                    className="relative w-full bg-transparent caret-accent outline-none placeholder:text-muted/50 focus-visible:outline-none"
                  />
                </div>
              </form>
            )}
          </div>

          {/* clickable commands */}
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-t border-border px-3 py-2">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                disabled={!ready}
                onClick={(e) => {
                  e.stopPropagation();
                  exec(c);
                }}
                className="shrink-0 rounded-md border border-border bg-subtle/60 px-2 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-40"
              >
                {c}
              </button>
            ))}
          </div>

          {/* status bar */}
          <div className="flex items-center gap-3 border-t border-border bg-subtle/70 px-3 py-1 font-mono text-[10px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" /> <span className="text-accent">online</span>
            </span>
            <span className="hidden sm:inline">⎇ main ✓</span>
            <span>cmds: {count}</span>
            <span className="ml-auto">
              <Clock />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
