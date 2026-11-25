// Single source of truth for all portfolio content.
// Update this file when your resume changes — every section reads from here.

export const profile = {
  name: "Rahul Bind",
  handle: "katari",
  role: "Backend & Full-Stack Engineer",
  headline: "I build backends that stay fast when traffic doesn't stay polite.",
  summary:
    "B.Tech student at NIT Rourkela (2027) focused on backend engineering — scalable APIs, event-driven systems and AI-powered applications. I care about performance, reliability and secure-by-default design.",
  rotating: ["scalable APIs", "event-driven systems", "real-time platforms", "agentic AI apps"],
  location: "Rourkela, India",
  status: "Open to SDE roles · Graduating May 2027",
  email: "rahulbind8055@gmail.com",
  resume: "/resume.pdf",
  githubUser: "katari-8055",
  links: {
    github: "https://github.com/Katari-8055",
    linkedin: "https://www.linkedin.com/in/link-katari",
    x: "https://twitter.com/bind_rahul78277",
  },
};

export const stats = [
  { value: 700, suffix: "+", label: "DSA problems solved", note: "LeetCode & Codeforces" },
  { value: 13, suffix: "+", label: "PRs merged into webpack", note: "+ 20 more during GSSoC '25" },
  { value: 2.5, suffix: "×", decimals: 1, label: "throughput gain", note: "PulseAPI · 310 → 780 RPS" },
  { value: 64, suffix: "%", label: "P95 latency cut", note: "Skite 360 · 180 → 65 ms" },
];

export type Metric = { value: string; label: string };

export type Experience = {
  company: string;
  role: string;
  from: string;
  to: string;
  link?: string;
  summary: string;
  bullets: string[];
  metrics: Metric[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    company: "Skite 360",
    role: "Software Development Intern",
    from: "May 2026",
    to: "Jun 2026",
    summary: "Real-time ad auction platform — APIs, live bidding and caching.",
    bullets: [
      "Built Node.js/Express REST APIs on PostgreSQL for auction lifecycle management, bid validation and transactional bid persistence with full bid history.",
      "Implemented real-time bidding with Socket.IO per-auction rooms and PostgreSQL row-level locking — zero incorrect accepts across 100 concurrent bids.",
      "Added Redis caching for highest bids and auction data with TTL invalidation and DB fallback, cutting P95 latency from 180 ms to 65 ms in k6 benchmarks.",
    ],
    metrics: [
      { value: "0", label: "incorrect accepts / 100 concurrent bids" },
      { value: "85%", label: "cache hit ratio" },
      { value: "180→65ms", label: "P95 latency" },
    ],
    stack: ["Node.js", "Express.js", "PostgreSQL", "Socket.IO", "Redis", "k6"],
  },
  {
    company: "Webpack",
    role: "Open Source Contributor",
    from: "Mar 2026",
    to: "Apr 2026",
    link: "https://github.com/webpack/webpack.js.org",
    summary: "Frontend & docs experience on webpack.js.org.",
    bullets: [
      "Contributed 13+ merged pull requests to webpack.js.org, improving the overall frontend experience and usability.",
      "Built a reading progress bar for webpack.js.org, improving navigation across 20+ documentation pages.",
      "Added date-based sorting and content previews to the Webpack blog for better article discovery.",
    ],
    metrics: [
      { value: "13+", label: "merged PRs" },
      { value: "20+", label: "docs pages improved" },
    ],
    stack: ["JavaScript", "React.js", "Git", "GitHub"],
  },
];

export type FlowNode = { label: string; note: string };

export type Project = {
  title: string;
  tagline: string;
  period: string;
  category: "Backend" | "AI" | "Full-Stack";
  description: string;
  metrics: Metric[];
  highlights: string[];
  technologies: string[];
  flow: FlowNode[];
  github: string;
  live?: string;
};

export const projects: Project[] = [
  {
    title: "PulseAPI",
    tagline: "Event-driven API monitoring platform",
    period: "Jan – Feb 2026",
    category: "Backend",
    description:
      "A centralized dashboard tracking request volume, latency, success/error rates and API health across services and endpoints — with tenant isolation and secure data access.",
    metrics: [
      { value: "2.5×", label: "throughput (310 → 780 RPS)" },
      { value: "−52%", label: "redundant MongoDB reads" },
      { value: "99.9%+", label: "success over 222K requests" },
    ],
    highlights: [
      "Hardened the telemetry pipeline with retries, circuit breakers, idempotency keys and dead-letter queues.",
      "In-memory LRU cache for API-key auth raised throughput 2.5× from 310 to 780 RPS.",
      "Load-tested with 200 concurrent users and 222K+ requests over 5 minutes at a 99.9%+ success rate.",
    ],
    technologies: ["Node.js", "Express.js", "RabbitMQ", "MongoDB", "PostgreSQL", "React.js", "Docker", "k6"],
    flow: [
      { label: "Client SDK", note: "Services emit telemetry events" },
      { label: "Ingest API", note: "LRU-cached API-key auth" },
      { label: "RabbitMQ", note: "Durable queue + DLQ" },
      { label: "Workers", note: "Retry · circuit breaker · idempotency" },
      { label: "Mongo + PG", note: "Tenant-isolated storage" },
      { label: "Dashboard", note: "Latency, volume, error rates" },
    ],
    github: "https://github.com/Katari-8055/PulseAPI",
    live: "https://pulse-api-nine-dusky.vercel.app",
  },
  {
    title: "Splity",
    tagline: "Agentic expense-sharing app",
    period: "Jul – Aug 2026",
    category: "AI",
    description:
      "Expense sharing with a LangGraph agent (17 tools + MCP server) where every change needs user approval, Gemini Vision OCR for receipts and item-level splitting.",
    metrics: [
      { value: "93%", label: "Text-to-SQL accuracy" },
      { value: "32/32", label: "attacks blocked across 71 tests" },
      { value: "17", label: "agent tools via MCP" },
    ],
    highlights: [
      "Secured Text-to-SQL with per-user views, a read-only Postgres role, sqlglot validation and 3s timeouts — 6/6 malicious questions handled safely.",
      "Hybrid RAG: pgvector + Postgres full-text search fused with RRF, LLM reranking and source citations.",
      "Langfuse tracing for LLM calls, latency, tokens and errors, with automatic model fallback.",
    ],
    technologies: ["Python", "FastAPI", "PostgreSQL", "pgvector", "LangGraph", "MCP", "Langfuse", "React.js", "Docker"],
    flow: [
      { label: "React UI", note: "Chat + receipt upload" },
      { label: "FastAPI", note: "Auth, routing, OCR via Gemini Vision" },
      { label: "LangGraph", note: "Agent with 17 tools" },
      { label: "Approval", note: "Human-in-the-loop on every write" },
      { label: "MCP tools", note: "Guarded Text-to-SQL + RAG" },
      { label: "PG + pgvector", note: "Per-user views, hybrid search" },
    ],
    github: "https://github.com/Katari-8055/Splity",
  },
  {
    title: "WorkSphere",
    tagline: "Multi-tenant HRM SaaS",
    period: "2025",
    category: "Full-Stack",
    description:
      "HR management across isolated workspaces — employees, departments, projects, tasks, attendance and leave, with real-time notifications.",
    metrics: [
      { value: "RBAC", label: "tenant-aware authorization" },
      { value: "Live", label: "Socket.IO notifications" },
    ],
    highlights: [
      "Backend on Node.js, Express, PostgreSQL and Prisma with RBAC and tenant-aware authorization.",
      "Socket.IO real-time notifications and modular services for multiple user roles.",
    ],
    technologies: ["Node.js", "Express.js", "PostgreSQL", "Prisma", "React.js", "Socket.IO"],
    flow: [
      { label: "React", note: "Role-based dashboards" },
      { label: "Express API", note: "RBAC + tenant guard middleware" },
      { label: "Prisma", note: "Tenant-scoped queries" },
      { label: "PostgreSQL", note: "Isolated workspaces" },
      { label: "Socket.IO", note: "Real-time notifications" },
    ],
    github: "https://github.com/Katari-8055/MultiTenantHRM",
    live: "https://multi-tenant-hrm.vercel.app",
  },
];

export const skills: Record<string, string[]> = {
  Languages: ["Java", "JavaScript", "Python", "SQL", "HTML", "CSS"],
  "Frameworks & APIs": ["React.js", "Node.js", "Express.js", "FastAPI", "REST APIs", "Socket.IO", "RabbitMQ"],
  Databases: ["PostgreSQL", "MongoDB", "Redis", "pgvector"],
  "GenAI & Agents": ["LangGraph", "LangChain", "RAG", "MCP", "Tool Calling", "Embeddings"],
  "Cloud & Tools": ["Docker", "k6", "Git", "GitHub", "Postman", "Linux", "Azure"],
};

export const achievements = [
  {
    title: "Problem Solving",
    value: "700+",
    description: "Problems solved on LeetCode and Codeforces. Rank 844 in LeetCode Weekly Contest 508.",
  },
  {
    title: "UHACK 4.0",
    value: "2nd Runner-Up",
    description: "Secured Second Runner-Up at UHACK 4.0, UIT Prayagraj.",
  },
  {
    title: "GSSoC 2025",
    value: "20+ PRs",
    description: "Contributed to open-source projects with 20+ merged pull requests.",
  },
  {
    title: "Flipkart GRID 2025",
    value: "Semifinalist",
    description: "Qualified as a semifinalist in Flipkart GRID, a national software development competition.",
  },
];

export const education = {
  institution: "National Institute of Technology, Rourkela",
  degree: "B.Tech",
  from: "2023",
  to: "May 2027",
  logo: "/NIT_Rourkela.svg",
  coursework: [
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
    "DBMS",
    "Operating Systems",
    "Computer Networks",
    "System Design",
    "Web Development",
  ],
  extracurricular: {
    title: "Management Head — Inter NIT Sports Meet",
    description: "Led a team of 15+ members to organize collegiate events, coordinate activities and manage logistics.",
  },
};

export const sections = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "open-source", label: "Open Source" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

// Where each skill was used — derived, so it stays in sync with the data above.
export function usagesOf(skill: string): string[] {
  const s = skill.toLowerCase();
  return [
    ...experience.filter((e) => e.stack.some((t) => t.toLowerCase() === s)).map((e) => e.company),
    ...projects.filter((p) => p.technologies.some((t) => t.toLowerCase() === s)).map((p) => p.title),
  ];
}
