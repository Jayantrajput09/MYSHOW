import { useEffect, useRef, useState } from "react";
import {
  GraduationCap, MapPin, Target, CircleDot, Sparkles,
  Code2, Server, BrainCircuit, Layers, Zap, BookOpen,
} from "lucide-react";

/* ──────────────────────────────────────────────── */

const BIO = [
  "I'm a B.Tech Information Technology student and aspiring Full Stack Developer who enjoys building practical, user-focused web applications from the first sketch to the final deploy.",
  "I work mainly with React, JavaScript, Node.js, Express, and MongoDB — designing interfaces that feel alive while keeping the backend fast, typed, and predictable.",
  "Right now I'm exploring AI-powered web applications and modern dev tooling to build products that are genuinely smarter, not just shinier.",
];

const QUICK_INFO = [
  { icon: GraduationCap, label: "Education", value: "B.Tech — Information Technology" },
  { icon: Target,        label: "Focus",     value: "Full Stack & AI Web Development" },
  { icon: MapPin,        label: "Location",  value: "Uttar Pradesh, India" },
  { icon: CircleDot,     label: "Status",    value: "Open to Opportunities",
    live: true },
];

const FOCUS_AREAS = [
  { icon: Code2,        title: "Frontend",  text: "React · Next.js · Tailwind",  tint: "accent" },
  { icon: Server,       title: "Backend",   text: "Node · Express · REST",       tint: "accent-secondary" },
  { icon: BrainCircuit, title: "AI × Web",  text: "LLMs · RAG · Agents",         tint: "accent-third" },
  { icon: Layers,       title: "Systems",   text: "Design systems · DX",         tint: "accent" },
];

const STATS = [
  { value: 12,  suffix: "+", label: "Projects shipped" },
  { value: 3,   suffix: "y", label: "Years coding" },
  { value: 20,  suffix: "+", label: "Tech in toolkit" },
  { value: 100, suffix: "%", label: "Curiosity" },
];

/* ──────────────────────────────────────────────── */

function useCountUp(target, { duration = 1400, start = 0 } = {}) {
  const [value, setValue] = useState(start);
  const ref = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const t0 = performance.now();
            const tick = (now) => {
              const p = Math.min(1, (now - t0) / duration);
              // easeOutCubic
              const e = 1 - Math.pow(1 - p, 3);
              setValue(Math.round(target * e));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        }
      },
      { threshold: 0.35 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return [value, ref];
}

function Stat({ value, suffix, label }) {
  const [n, ref] = useCountUp(value);
  return (
    <div ref={ref} className="flex flex-col">
      <span className="stat-num text-3xl font-black text-[color:var(--text)] sm:text-4xl">
        {n}
        <span className="gradient-text">{suffix}</span>
      </span>
      <span className="mt-1 text-[11px] uppercase tracking-[0.25em] text-[color:var(--muted)]">
        {label}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────── */

export default function About() {
  return (
    <section id="about" className="relative px-5 py-28 sm:px-8">
      {/* soft aurora behind the section */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="glow      left-[-15%] top-[10%] h-[420px] w-[420px]" />
        <div className="glow-lime right-[-12%] bottom-[0%] h-[460px] w-[460px]" />
      </div>

      <div className="mx-auto max-w-6xl">

        {/* ═══════ HEADER ═══════ */}
        <div className="reveal mb-14 max-w-3xl">
          <div className="badge-live mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium">
            <Sparkles size={12} className="text-[color:var(--accent-secondary)]" />
            <span className="text-[color:var(--accent)]">About Me</span>
          </div>

          <h2 className="dynamic-text text-4xl font-black leading-[1.15] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
  Turning ideas into digital experiences.
</h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            A quick look at who I am, how I work, and the tools I reach for
            when a blank canvas needs a product on the other side of it.
          </p>
        </div>

        {/* ═══════ BENTO GRID ═══════ */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── MAIN BIO (2 cols) ── */}
          <article className="glass card-3d reveal rounded-3xl p-7 sm:p-9 lg:col-span-2">
            {/* corner accent */}
            <div className="mb-7 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[color:var(--accent)] shadow-[0_0_16px_var(--accent)]" />
              <span className="h-px flex-1 bg-gradient-to-r from-[color:var(--accent)]/60 via-[color:var(--glass-border)] to-transparent" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--muted)]">
                / profile
              </span>
            </div>

            <div className="space-y-5">
              {BIO.map((p, i) => (
                <p
                  key={i}
                  className="text-base leading-8 text-[color:var(--muted)] sm:text-[17px]"
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Divider */}
            <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-[color:var(--glass-border)] to-transparent" />

            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <Stat key={s.label} {...s} />
              ))}
            </div>
          </article>

          {/* ── QUICK INFO ── */}
          <aside className="glass card-3d reveal rounded-3xl p-7">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">Quick Info</h3>
              <BookOpen size={16} className="text-[color:var(--accent)]" />
            </div>

            <ul className="space-y-5">
              {QUICK_INFO.map(({ icon: Icon, label, value, live }) => (
                <li
                  key={label}
                  className="group flex items-start gap-3 rounded-2xl p-2 -m-2 transition-colors duration-300 hover:bg-white/[0.03]"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] text-[color:var(--accent)] transition-all duration-300 group-hover:border-[color:var(--accent)]/50 group-hover:shadow-[0_0_20px_-6px_color-mix(in_oklab,var(--accent)_70%,transparent)]">
                    <Icon size={14} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted)]">
                      {label}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 text-sm font-medium text-[color:var(--text)]">
                      {value}
                      {live && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent-secondary)] opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--accent-secondary)]" />
                        </span>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* mini CTA */}
            <a
              href="#contact"
              className="group mt-7 flex items-center justify-between rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-4 py-3 text-xs font-semibold text-[color:var(--text)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--accent)]/50 hover:shadow-[0_0_30px_-10px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
            >
              <span className="flex items-center gap-2">
                <Zap size={13} className="text-[color:var(--accent)]" />
                Start a project
              </span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </aside>

          {/* ── FOCUS AREAS (full-width row) ── */}
          <div className="glass reveal rounded-3xl p-7 lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Focus Areas</h3>
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  Where I spend most of my keyboard time.
                </p>
              </div>
              <span className="hidden text-[10px] uppercase tracking-[0.35em] text-[color:var(--muted)] sm:block">
                / stack
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FOCUS_AREAS.map(({ icon: Icon, title, text, tint }) => (
                <div
                  key={title}
                  className="focus-tile group relative overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-5"
                >
                  {/* tinted glow on hover */}
                  <span
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                    style={{
                      background: `color-mix(in oklab, var(--${tint}) 60%, transparent)`,
                    }}
                  />

                  <span
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--bg-2)]/60 transition-all duration-500 group-hover:scale-110"
                    style={{ color: `var(--${tint})` }}
                  >
                    <Icon size={16} />
                  </span>

                  <p className="relative mt-4 text-sm font-semibold text-[color:var(--text)]">
                    {title}
                  </p>
                  <p className="relative mt-1 text-xs leading-6 text-[color:var(--muted)]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════ NOW / MARQUEE STRIP ═══════ */}
        <div className="reveal mt-10 overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] py-4 backdrop-blur-xl">
          <div className="marquee">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center gap-8 pl-8">
                {[
                  "Building a RAG-powered notes app",
                  "Learning system design",
                  "Writing about DX",
                  "Refactoring old side-projects",
                  "Reading the React 19 changelog",
                ].map((t) => (
                  <span
                    key={`${dup}-${t}`}
                    className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}