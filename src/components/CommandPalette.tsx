"use client";

import { AnimatePresence, m } from "framer-motion";
import {
  ArrowRight,
  Copy,
  CornerDownLeft,
  FileText,
  Github,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profile, projects, sections } from "../data/resume";
import { PALETTE_EVENT, scrollToId } from "../lib/theme";
import { cn } from "../lib/utils";

type Action = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const actions = useMemo<Action[]>(
    () => [
      { id: "top", group: "Navigate", label: "Home", icon: <ArrowRight />, run: () => scrollToId("top") },
      ...sections.map((s) => ({
        id: s.id,
        group: "Navigate",
        label: s.label,
        icon: <ArrowRight />,
        run: () => scrollToId(s.id),
      })),
      ...projects.map((p) => ({
        id: `p-${p.title}`,
        group: "Projects",
        label: p.title,
        hint: p.tagline,
        icon: <Github />,
        run: () => window.open(p.github, "_blank", "noopener"),
      })),
      {
        id: "copy",
        group: "Actions",
        label: "Copy email",
        hint: profile.email,
        icon: <Copy />,
        run: () => {
          navigator.clipboard?.writeText(profile.email).then(() => notify("Email copied"));
        },
      },
      {
        id: "mail",
        group: "Actions",
        label: "Send an email",
        icon: <Mail />,
        run: () => (window.location.href = `mailto:${profile.email}`),
      },
      {
        id: "resume",
        group: "Actions",
        label: "Open resume (PDF)",
        icon: <FileText />,
        run: () => window.open(profile.resume, "_blank", "noopener"),
      },
      {
        id: "gh",
        group: "Links",
        label: "GitHub",
        icon: <Github />,
        run: () => window.open(profile.links.github, "_blank", "noopener"),
      },
      {
        id: "li",
        group: "Links",
        label: "LinkedIn",
        icon: <Linkedin />,
        run: () => window.open(profile.links.linkedin, "_blank", "noopener"),
      },
      {
        id: "x",
        group: "Links",
        label: "X / Twitter",
        icon: <Twitter />,
        run: () => window.open(profile.links.x, "_blank", "noopener"),
      },
    ],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => `${a.label} ${a.hint ?? ""} ${a.group}`.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const runAt = (i: number) => {
    const a = filtered[i];
    if (!a) return;
    close();
    // let the modal close before scrolling
    setTimeout(a.run, 60);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(index);
    } else if (e.key === "Escape") {
      close();
    }
  };

  let lastGroup = "";

  return (
    <>
      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 px-4 pt-[14vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
          >
            <m.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <span className="font-mono text-accent">›</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="Type a command or search…"
                  className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted focus-visible:outline-none"
                  aria-controls="palette-list"
                  aria-activedescendant={filtered[index] ? `cmd-${filtered[index].id}` : undefined}
                />
                <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">
                  esc
                </kbd>
              </div>
              <ul id="palette-list" ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <li className="px-3 py-8 text-center text-sm text-muted">No matches for “{query}”.</li>
                )}
                {filtered.map((a, i) => {
                  const header = a.group !== lastGroup ? a.group : null;
                  lastGroup = a.group;
                  return (
                    <li key={a.id}>
                      {header && (
                        <div className="px-3 pt-3 pb-1 font-mono text-[10px] tracking-wider text-muted uppercase">
                          {header}
                        </div>
                      )}
                      <button
                        id={`cmd-${a.id}`}
                        data-index={i}
                        role="option"
                        aria-selected={i === index}
                        onMouseMove={() => setIndex(i)}
                        onClick={() => runAt(i)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm [&_svg]:size-4",
                          i === index ? "bg-accent-soft text-fg" : "text-muted",
                        )}
                      >
                        <span className={i === index ? "text-accent" : ""}>{a.icon}</span>
                        <span className="text-fg">{a.label}</span>
                        {a.hint && <span className="truncate text-xs text-muted">{a.hint}</span>}
                        {i === index && <CornerDownLeft className="ml-auto shrink-0 text-muted" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center gap-4 border-t border-border px-4 py-2 font-mono text-[10px] text-muted">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span className="ml-auto">rahul.bind</span>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <m.div
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-lg"
          >
            {toast}
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
