import { useEffect, useRef, useState } from "react";
import {
  GraduationCap, BookOpen, Award, Sparkles, School,
  CheckCircle2, Clock,
} from "lucide-react";

/* ───────────────────────────────────────────────────── */

const TIMELINE = [
  {
    id: "btech",
    period: "2023 — 2027",
    status: "current",
    title: "B.Tech — Information Technology",
    org: "AKTU",
    location: "Uttar Pradesh, India",
    icon: GraduationCap,
    tint: "accent",
    description:
      "Pursuing a Bachelor of Technology in Information Technology with a focus on web development, software engineering, and AI-powered applications.",
    coursework: [
      { name: "Data Structures & Algorithms", level: 88 },
      { name: "Web Development",              level: 92 },
      { name: "Database Systems",             level: 82 },
      { name: "Operating Systems",            level: 78 },
    ],
    highlights: [
      "Building production-grade web apps",
      "Studying distributed systems & system design",
      "Exploring LLMs and RAG pipelines",
    ],
  },
  {
    id: "xii",
    period: "2021 — 2023",
    status: "done",
    title: "Senior Secondary (XII) — PCM",
    org: "Narayan College of Science and Arts",
    location: "Uttar Pradesh, India",
    icon: BookOpen,
    tint: "accent-secondary",
    description:
      "Physics, Chemistry, and Mathematics — the foundation that led me into engineering and, eventually, into software.",
    highlights: [
      "Built first HTML/CSS pages in free time",
      "First exposure to Python & logic building",
    ],
  },
  {
    id: "x",
    period: "2019 — 2021",
    status: "done",
    title: "Secondary (X)",
    org: "Narayan College of Science and Arts",
    location: "Uttar Pradesh, India",
    icon: School,
    tint: "accent-third",
    description:
      "Where the curiosity started — first computer lab, first `Hello, World`, first itch that never went away.",
    highlights: [],
  },
];

const GROWTH = [
  { label: "Full Stack Development", level: 90, tint: "accent" },
  { label: "React.js",               level: 92, tint: "accent-secondary" },
  { label: "Node.js",                level: 88, tint: "accent-third" },
  { label: "MongoDB",                level: 88, tint: "accent" },
  { label: "AI Integration",         level: 80, tint: "accent-secondary" },
  { label: "Problem Solving",        level: 85, tint: "accent-third" },
];

/* ───────────────────────────────────────────────────── */

// FIX #2 — primitive threshold, proper deps
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ───────────────────────────────────────────────────── */

function TimelineEntry({ item, index }) {
  const [ref, inView] = useInView(0.15);
  const Icon = item.icon;

  return (
    <li
      ref={ref}
      className="relative grid grid-cols-[36px_1fr] gap-4 pb-10 sm:grid-cols-[44px_1fr] sm:gap-6"
    >
      {/* ── NODE ── */}
      <div className="relative flex flex-col items-center">
        <div
          className="timeline-node"
          data-current={item.status === "current"}
          style={{ color: `var(--${item.tint})` }}
        >
          <Icon size={16} className="sm:hidden" />
          <Icon size={18} className="hidden sm:block" />
        </div>

        <span className="timeline-period mt-3 hidden sm:block">
          {item.period}
        </span>
      </div>

      {/* ── ENTRY CARD ── */}
      <article
        className={`glass card-3d timeline-entry rounded-3xl p-5 transition-all duration-700 sm:p-7 ${
          inView
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: `${Math.min(index * 80, 240)}ms` }}
      >
        {/* header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag-status" data-status={item.status}>
                {item.status === "current" ? (
                  <>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                    </span>
                    In progress
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={11} />
                    Completed
                  </>
                )}
              </span>

              <span className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)] sm:hidden">
                {item.period}
              </span>
            </div>

            <h3 className="mt-3 text-lg font-bold tracking-tight sm:text-2xl">
              {item.title}
            </h3>

            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[color:var(--muted)]">
              <span className="font-medium text-[color:var(--text)]">
                {item.org}
              </span>
              <span className="h-1 w-1 rounded-full bg-[color:var(--muted)]/60" />
              <span>{item.location}</span>
            </p>
          </div>

          {/* tinted corner glyph — desktop only */}
          <span
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--bg-2)]/60 sm:flex"
            style={{ color: `var(--${item.tint})` }}
          >
            <Icon size={18} />
          </span>
        </div>

        {/* description */}
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:mt-5">
          {item.description}
        </p>

        {/* highlights */}
        {item.highlights?.length > 0 && (
          <ul className="mt-5 space-y-2">
            {item.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2.5 text-xs leading-6 text-[color:var(--muted)]"
              >
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full"
                  style={{ background: `var(--${item.tint})` }}
                />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {/* coursework bars — FIX #3: percentage widths, wraps instead of truncating */}
        {item.coursework?.length > 0 && (
          <>
            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-[color:var(--glass-border)] to-transparent" />

            <p className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
              <Award size={11} className="text-[color:var(--accent)]" />
              Core coursework
            </p>

            <ul className="space-y-3.5">
              {item.coursework.map((c, i) => (
                <li key={c.name} className="flex items-center gap-3">
                  <span className="w-[46%] shrink-0 text-xs leading-5 text-[color:var(--text)] sm:w-[48%]">
                    {c.name}
                  </span>
                  <span className="skill-bar flex-1" data-tint={item.tint}>
                    <i
                      style={{
                        "--fill": c.level / 100,
                        "--i": i,
                      }}
                    />
                  </span>
                  <span className="hidden w-8 shrink-0 text-right text-[11px] tabular-nums text-[color:var(--muted)] sm:inline-block">
                    {c.level}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </article>
    </li>
  );
}

/* ───────────────────────────────────────────────────── */

function GrowthPanel() {
  const [ref, inView] = useInView(0.2);

  // FIX #1 — removed `reveal` class (double animation)
  return (
    <aside
      ref={ref}
      className={`glass card-3d rounded-3xl p-7 transition-all duration-700 sm:p-8 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            Continuous Growth
          </h3>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            What I'm actively sharpening this year.
          </p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] text-[color:var(--accent)]">
          <Clock size={16} />
        </span>
      </div>

      <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-[color:var(--glass-border)] to-transparent" />

      <ul className="space-y-5">
        {GROWTH.map((g, i) => (
          <li key={g.label}>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm font-medium text-[color:var(--text)]">
                {g.label}
              </span>
              <span className="text-[11px] tabular-nums text-[color:var(--muted)]">
                {g.level}
              </span>
            </div>

            <span className="skill-bar block" data-tint={g.tint}>
              <i
                style={{
                  "--fill": g.level / 100,
                  "--i": i,
                }}
              />
            </span>
          </li>
        ))}
      </ul>

      <div className="badge-live mt-7 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium">
        <Sparkles size={11} className="text-[color:var(--accent-secondary)]" />
        <span className="text-[color:var(--accent)]">
          Iterating every single week
        </span>
      </div>
    </aside>
  );
}

/* ───────────────────────────────────────────────────── */

export default function Education() {
  return (
    <section id="education" className="relative px-5 py-24 sm:px-8 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="glow      left-[-12%] top-[8%]  h-[440px] w-[440px]" />
        <div className="glow-lime right-[-10%] bottom-[6%] h-[480px] w-[480px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="reveal mb-14 max-w-3xl">
          <div className="badge-live mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium">
            <GraduationCap size={12} className="text-[color:var(--accent-secondary)]" />
            <span className="text-[color:var(--accent)]">Education</span>
          </div>

          <h2 className="dynamic-text text-4xl font-black leading-[1.15] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
  My journey so far.
</h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            The classrooms, the coursework, and the constant side-quests —
            every step that shaped how I build today.
          </p>
        </div>

        {/* LAYOUT */}
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* TIMELINE */}
          <div className="relative">
            <div className="timeline-rail" aria-hidden="true" />
            <ol className="relative">
              {TIMELINE.map((item, i) => (
                <TimelineEntry key={item.id} item={item} index={i} />
              ))}
            </ol>
          </div>

          {/* GROWTH PANEL */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <GrowthPanel />
          </div>
        </div>
      </div>
    </section>
  );
}