"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, FileText, Github, Linkedin, Loader2, Send, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "../data/resume";
import { cn } from "../lib/utils";
import { Magnetic, Reveal, Section, SpotlightCard } from "./ui";

const socials = [
  { label: "GitHub", handle: "@Katari-8055", href: profile.links.github, icon: Github },
  { label: "LinkedIn", handle: "in/link-katari", href: profile.links.linkedin, icon: Linkedin },
  { label: "X / Twitter", handle: "@bind_rahul78277", href: profile.links.x, icon: Twitter },
  { label: "Resume", handle: "resume.pdf", href: profile.resume, icon: FileText },
];

function LocalTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () =>
      setT(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t || "--:--:--"}</span>;
}

type Phase = "idle" | "sending" | "done" | "invalid";

/** A contact form dressed up as an API request — fitting for a backend engineer. */
function HireRequest() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setPhase("invalid");
      return;
    }
    setPhase("sending");
    setTimeout(() => {
      setPhase("done");
      const subject = encodeURIComponent(`Hi Rahul — from ${name.trim()}`);
      const body = encodeURIComponent(`${message.trim()}\n\n— ${name.trim()}${email.trim() ? ` (${email.trim()})` : ""}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    }, 900);
  };

  const field =
    "rounded-md bg-transparent px-1 text-amber-600 outline-none placeholder:text-muted/50 focus:bg-accent-soft dark:text-amber-200 focus-visible:outline-none";

  return (
    <SpotlightCard className="overflow-hidden font-mono text-[13px]">
      {/* request line */}
      <div className="flex items-center gap-2 border-b border-border bg-subtle/60 px-4 py-3">
        <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-contrast">POST</span>
        <span className="truncate text-muted">
          https://rahul.dev<span className="text-fg">/api/hire</span>
        </span>
        <span className="ml-auto hidden text-[10px] text-muted sm:inline">HTTP/1.1</span>
      </div>

      <form onSubmit={send} className="p-4 sm:p-5">
        <div className="mb-3 text-[11px] text-muted">
          <span className="text-sky-600 dark:text-sky-300">Content-Type</span>: application/json
        </div>
        <div className="leading-7">
          <div className="text-muted">{"{"}</div>
          <label className="flex min-w-0 items-center gap-1 pl-4">
            <span className="shrink-0 text-sky-600 dark:text-sky-300">&quot;name&quot;:</span>
            <span className="text-muted">&quot;</span>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (phase !== "sending") setPhase("idle");
              }}
              placeholder="Your name"
              className={cn(field, "min-w-[9ch] max-w-full [field-sizing:content]")}
              aria-label="Your name"
            />
            <span className="text-muted">&quot;,</span>
          </label>
          <label className="flex min-w-0 items-center gap-1 pl-4">
            <span className="shrink-0 text-sky-600 dark:text-sky-300">&quot;email&quot;:</span>
            <span className="text-muted">&quot;</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com (optional)"
              className={cn(field, "min-w-[9ch] max-w-full [field-sizing:content]")}
              aria-label="Your email"
            />
            <span className="text-muted">&quot;,</span>
          </label>
          <label className="flex min-w-0 items-start gap-1 pl-4">
            <span className="shrink-0 text-sky-600 dark:text-sky-300">&quot;message&quot;:</span>
            <span className="text-muted">&quot;</span>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (phase !== "sending") setPhase("idle");
              }}
              placeholder="We're hiring a backend engineer…"
              rows={3}
              className={cn(field, "w-full flex-1 resize-none leading-6")}
              aria-label="Your message"
            />
            <span className="text-muted">&quot;</span>
          </label>
          <div className="text-muted">{"}"}</div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Magnetic strength={0.2}>
            <button
              type="submit"
              disabled={phase === "sending"}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 font-sans text-sm font-medium text-accent-contrast disabled:opacity-70"
            >
              {phase === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {phase === "sending" ? "Sending…" : "Send request"}
            </button>
          </Magnetic>
          <span className="text-[11px] text-muted">opens your mail app, ready to send</span>
        </div>

        {/* response */}
        <AnimatePresence mode="wait">
          {(phase === "done" || phase === "invalid") && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-5 rounded-lg border border-border bg-bg/50 p-3 text-xs leading-6">
                {phase === "done" ? (
                  <>
                    <div>
                      <span className="text-accent">201 Created</span>{" "}
                      <span className="text-muted">· 42ms</span>
                    </div>
                    <div className="text-muted">
                      {"{ "}
                      <span className="text-sky-600 dark:text-sky-300">&quot;status&quot;</span>:{" "}
                      <span className="text-amber-600 dark:text-amber-200">&quot;queued&quot;</span>,{" "}
                      <span className="text-sky-600 dark:text-sky-300">&quot;reply_eta&quot;</span>:{" "}
                      <span className="text-amber-600 dark:text-amber-200">&quot;&lt; 24h&quot;</span>
                      {" }"}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-red-500 dark:text-red-400">422 Unprocessable Entity</div>
                    <div className="text-muted">
                      {"{ "}
                      <span className="text-sky-600 dark:text-sky-300">&quot;error&quot;</span>:{" "}
                      <span className="text-amber-600 dark:text-amber-200">
                        &quot;name and message are required&quot;
                      </span>
                      {" }"}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </SpotlightCard>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <Section id="contact" index="06" eyebrow="Contact" title="Let's build something that holds up under load.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        {/* left: who/where/how */}
        <Reveal className="flex flex-col gap-4">
          <p className="max-w-md text-pretty text-muted">
            I&apos;m looking for SDE internship and new-grad roles where reliability and performance matter. Send a
            request — I usually reply within a day.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <SpotlightCard className="p-4">
              <div className="font-mono text-[10px] tracking-wider text-muted uppercase">Local time · IST</div>
              <div className="mt-1 font-mono text-xl font-semibold">
                <LocalTime />
              </div>
              <div className="mt-0.5 text-xs text-muted">{profile.location}</div>
            </SpotlightCard>
            <SpotlightCard className="p-4">
              <div className="font-mono text-[10px] tracking-wider text-muted uppercase">Status</div>
              <div className="mt-1 flex items-center gap-2 text-xl font-semibold">
                <span className="relative flex size-2.5">
                  <span className="ping-soft absolute inline-flex size-full rounded-full bg-accent" />
                  <span className="relative size-2.5 rounded-full bg-accent" />
                </span>
                Available
              </div>
              <div className="mt-0.5 text-xs text-muted">Graduating May 2027</div>
            </SpotlightCard>
          </div>

          <button
            type="button"
            onClick={copy}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-4 text-left transition-colors hover:border-accent/50"
          >
            <div className="min-w-0">
              <div className="font-mono text-[10px] tracking-wider text-muted uppercase">Email</div>
              <div className="mt-0.5 truncate font-mono text-sm sm:text-base">{profile.email}</div>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-subtle px-3 py-1.5 text-xs text-muted group-hover:text-fg">
              {copied ? <Check className="size-3.5 text-accent" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            {socials.map(({ label, handle, href, icon: Icon }) => (
              <SpotlightCard
                key={label}
                as="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4"
              >
                <Icon className="size-5 shrink-0 text-muted transition-colors group-hover:text-accent" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{label}</div>
                  <div className="truncate font-mono text-[11px] text-muted">{handle}</div>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
              </SpotlightCard>
            ))}
          </div>
        </Reveal>

        {/* right: the request */}
        <Reveal delay={0.1}>
          <HireRequest />
        </Reveal>
      </div>
    </Section>
  );
}
