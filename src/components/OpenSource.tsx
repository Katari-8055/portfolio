"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, GitMerge, GitPullRequest, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { featuredPrIds } from "../data/featured-prs";
import { profile } from "../data/resume";
import { cn } from "../lib/utils";
import { Reveal, Section, SpotlightCard } from "./ui";

type PR = {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: "open" | "closed";
  created_at: string;
  repository_url: string;
  pull_request?: { merged_at: string | null };
};

type Status = "merged" | "open" | "closed";
const statusOf = (pr: PR): Status => (pr.pull_request?.merged_at ? "merged" : pr.state === "open" ? "open" : "closed");
const repoOf = (pr: PR) => pr.repository_url.split("/").slice(-2).join("/");
const ownerOf = (pr: PR) => pr.repository_url.split("/").slice(-2)[0];

const CACHE_KEY = "gh-prs-v1";
const CACHE_TTL = 10 * 60 * 1000;
const EXCLUDE_OWNERS = [profile.githubUser.toLowerCase()]; // only show contributions to others' repos

const filters = ["Featured", "Merged", "All"] as const;

export default function OpenSource() {
  const [prs, setPrs] = useState<PR[] | null>(null);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<(typeof filters)[number]>("Featured");
  const [org, setOrg] = useState<string>("all");

  const load = useCallback(async (force = false) => {
    setError(false);
    try {
      if (!force) {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { at, items } = JSON.parse(cached);
          if (Date.now() - at < CACHE_TTL) {
            setPrs(items);
            return;
          }
        }
      }
    } catch {
      /* ignore cache errors */
    }
    setPrs(null);
    try {
      const res = await fetch(
        `https://api.github.com/search/issues?q=author%3A${profile.githubUser}+type%3Apr&per_page=100&sort=created`,
      );
      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json();
      const items: PR[] = (json.items ?? []).filter(
        (p: PR) => !EXCLUDE_OWNERS.includes(ownerOf(p).toLowerCase()),
      );
      setPrs(items);
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), items }));
      } catch {
        /* ignore */
      }
    } catch {
      setError(true);
      setPrs([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const orgs = useMemo(() => {
    const map = new Map<string, { total: number; merged: number }>();
    (prs ?? []).forEach((p) => {
      const o = ownerOf(p);
      const v = map.get(o) ?? { total: 0, merged: 0 };
      v.total++;
      if (statusOf(p) === "merged") v.merged++;
      map.set(o, v);
    });
    return [...map.entries()].sort((a, b) => b[1].merged - a[1].merged);
  }, [prs]);

  const totals = useMemo(() => {
    const all = prs ?? [];
    return { total: all.length, merged: all.filter((p) => statusOf(p) === "merged").length, orgs: orgs.length };
  }, [prs, orgs]);

  const list = useMemo(() => {
    let l = prs ?? [];
    if (org !== "all") l = l.filter((p) => ownerOf(p) === org);
    if (filter === "Merged") l = l.filter((p) => statusOf(p) === "merged");
    if (filter === "Featured") {
      const featured = new Set(featuredPrIds);
      const f = l.filter((p) => featured.has(p.id));
      // if none of the curated IDs came back, fall back to merged
      l = f.length ? f : l.filter((p) => statusOf(p) === "merged");
    }
    return l;
  }, [prs, filter, org]);

  return (
    <Section
      id="open-source"
      index="03"
      eyebrow="Open Source"
      title="Merged upstream"
      description="Pulled live from the GitHub API. Filter by organization or status."
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* summary + orgs */}
        <Reveal className="space-y-4">
          <SpotlightCard className="p-5">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { v: totals.merged, l: "merged" },
                { v: totals.total, l: "total PRs" },
                { v: totals.orgs, l: "orgs" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-semibold tabular-nums">
                    {prs ? s.v : <span className="inline-block h-7 w-8 animate-pulse rounded bg-subtle" />}
                  </div>
                  <div className="font-mono text-[10px] text-muted uppercase">{s.l}</div>
                </div>
              ))}
            </div>
          </SpotlightCard>

          <div className="flex flex-wrap gap-2 lg:flex-col">
            <button
              type="button"
              onClick={() => setOrg("all")}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm transition-colors",
                org === "all" ? "border-accent/50 bg-card" : "border-border text-muted hover:bg-card",
              )}
            >
              All organizations
            </button>
            {orgs.map(([name, v]) => (
              <button
                key={name}
                type="button"
                onClick={() => setOrg(name)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                  org === name ? "border-accent/50 bg-card text-fg" : "border-border text-muted hover:bg-card",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://github.com/${name}.png?size=48`}
                  alt=""
                  width={22}
                  height={22}
                  className="rounded-md bg-white"
                  loading="lazy"
                />
                <span className="flex-1 truncate">{name}</span>
                <span className="font-mono text-[11px] text-accent">{v.merged}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* PR list */}
        <Reveal delay={0.1}>
          <SpotlightCard className="flex h-full flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-border p-3">
              <div role="tablist" className="flex gap-1">
                {filters.map((f) => (
                  <button
                    key={f}
                    role="tab"
                    aria-selected={filter === f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "rounded-lg px-3 py-1 text-sm transition-colors",
                      filter === f ? "bg-subtle text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => load(true)}
                aria-label="Refresh from GitHub"
                className="grid size-8 place-items-center rounded-lg text-muted hover:bg-subtle hover:text-fg"
              >
                <RefreshCw className={cn("size-3.5", prs === null && "animate-spin")} />
              </button>
            </div>

            <div className="max-h-[28rem] flex-1 overflow-y-auto p-2">
              {prs === null &&
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="m-1 h-14 animate-pulse rounded-lg bg-subtle" />
                ))}

              {error && (
                <div className="p-6 text-center text-sm text-muted">
                  GitHub's API is rate-limiting right now.{" "}
                  <a
                    className="text-accent underline-offset-4 hover:underline"
                    href={`https://github.com/pulls?q=is%3Apr+author%3A${profile.githubUser}+is%3Amerged`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    See my merged PRs on GitHub →
                  </a>
                </div>
              )}

              {prs && !error && list.length === 0 && (
                <div className="p-6 text-center text-sm text-muted">No pull requests match this filter.</div>
              )}

              <AnimatePresence initial={false}>
                {prs &&
                  list.map((pr) => {
                    const s = statusOf(pr);
                    return (
                      <motion.a
                        layout
                        key={pr.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        href={pr.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-subtle"
                      >
                        {s === "merged" ? (
                          <GitMerge className="mt-0.5 size-4 shrink-0 text-purple-500" />
                        ) : (
                          <GitPullRequest
                            className={cn("mt-0.5 size-4 shrink-0", s === "open" ? "text-accent" : "text-muted")}
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="line-clamp-1 text-sm">{pr.title}</div>
                          <div className="mt-0.5 flex gap-3 font-mono text-[11px] text-muted">
                            <span className="truncate">{repoOf(pr)}</span>
                            <span>#{pr.number}</span>
                            <span className="shrink-0">
                              {new Date(pr.created_at).toLocaleDateString("en", { month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight className="size-4 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                      </motion.a>
                    );
                  })}
              </AnimatePresence>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </Section>
  );
}
