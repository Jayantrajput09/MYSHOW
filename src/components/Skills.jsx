import { useEffect, useRef, useState } from "react";
import {
  Code2, Server, Database, Wrench, Brain, Smartphone, Sparkles,
} from "lucide-react";

/* ───────────────────────────────────────────────────── */

const CATEGORIES = [
  {
    id: "frontend",
    title: "Frontend",
    blurb: "Interfaces that feel alive.",
    icon: Code2,
    tint: "accent",
    skills: [
      { name: "React.js",     level: 92 },
      { name: "JavaScript",   level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "HTML5",        level: 96 },
      { name: "CSS3",         level: 90 },
      { name: "React Router", level: 88 },
      { name: "Responsive",   level: 92 },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    blurb: "APIs, auth, realtime.",
    icon: Server,
    tint: "accent-secondary",
    skills: [
      { name: "Node.js",        level: 88 },
      { name: "Express.js",     level: 88 },
      { name: "REST APIs",      level: 90 },
      { name: "JWT Auth",       level: 85 },
      { name: "Socket.IO",      level: 78 },
    ],
  },
  {
    id: "database",
    title: "Database",
    blurb: "Modeling, indexing, scale.",
    icon: Database,
    tint: "accent-third",
    skills: [
      { name: "MongoDB",         level: 88 },
      { name: "MongoDB Atlas",   level: 82 },
      { name: "Database Design", level: 80 },
    ],
  },
  {
    id: "ai",
    title: "AI & Vision",
    blurb: "LLMs and computer vision.",
    icon: Brain,
    tint: "accent",
    skills: [
      { name: "Python",         level: 82 },
      { name: "Ollama",         level: 76 },
      { name: "LLM Integration",level: 80 },
      { name: "MediaPipe",      level: 78 },
      { name: "OpenCV",         level: 74 },
    ],
  },
  {
    id: "tools",
    title: "Tooling",
    blurb: "Ship faster, break less.",
    icon: Wrench,
    tint: "accent-secondary",
    skills: [
      { name: "Git",     level: 90 },
      { name: "GitHub",  level: 92 },
      { name: "Vite",    level: 88 },
      { name: "npm",     level: 88 },
      { name: "Postman", level: 82 },
      { name: "VS Code", level: 96 },
    ],
  },
  {
    id: "mobile",
    title: "Mobile",
    blurb: "Web apps, native skin.",
    icon: Smartphone,
    tint: "accent-third",
    skills: [
      { name: "Capacitor",           level: 74 },
      { name: "Android Studio",      level: 70 },
      { name: "Responsive Web Apps", level: 90 },
      { name: "App Integration",     level: 76 },
    ],
  },
];

/* Compute hexagon node positions (percentage coordinates) */
const RADIUS = 38; // % from center
const CENTER = 50;
const NODES = CATEGORIES.map((_, i) => {
  const angle = (i / CATEGORIES.length) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CENTER + Math.cos(angle) * RADIUS,
    y: CENTER + Math.sin(angle) * RADIUS,
  };
});

/* All unique skills, for the cloud */
const ALL_SKILLS = Array.from(
  new Map(
    CATEGORIES.flatMap((c) =>
      c.skills.map((s) => [`${c.id}:${s.name}`, { ...s, category: c.id, tint: c.tint }])
    )
  ).values()
);

/* ───────────────────────────────────────────────────── */

function OrbitScene({ selected, onSelect, tiltRef }) {
  return (
    <div
      ref={tiltRef}
      className="skill-scene relative mx-auto aspect-square w-full max-w-[520px]"
    >
      {/* soft halo behind */}
      <div className="orbit-halo" />

      {/* SVG connecting lines */}
      <svg
        className="orbit-lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon
          points={NODES.map((n) => `${n.x},${n.y}`).join(" ")}
        />
        {NODES.map((n, i) => (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={n.x}
            y2={n.y}
          />
        ))}
        {/* center dot */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r="1.4"
          fill="color-mix(in oklab, var(--accent) 60%, transparent)"
        />
      </svg>

      {/* Center glass core */}
      <div className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] glass">
        <span className="gradient-text text-2xl font-black">JR</span>
      </div>

      {/* Category nodes */}
      {CATEGORIES.map((cat, i) => {
        const { x, y } = NODES[i];
        const Icon = cat.icon;
        const isSelected = selected === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            data-selected={isSelected}
            onClick={() => onSelect(cat.id)}
            aria-pressed={isSelected}
            aria-label={`Show ${cat.title} skills`}
            className="orbit-node"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              color: isSelected ? `var(--${cat.tint})` : undefined,
            }}
          >
            <Icon size={22} />
            <span className="orbit-label">{cat.title}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────────────────────────────────── */

function DetailPanel({ category }) {
  const Icon = category.icon;

  return (
    <div
      key={category.id} /* forces re-mount → bars re-animate */
      className="glass reveal relative overflow-hidden rounded-3xl p-7 sm:p-8"
    >
      {/* tinted ambient glow */}
      <span
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
        style={{
          background: `color-mix(in oklab, var(--${category.tint}) 40%, transparent)`,
          opacity: .35,
        }}
      />

      {/* header */}
      <div className="relative flex items-center gap-4">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--bg-2)]/60"
          style={{ color: `var(--${category.tint})` }}
        >
          <Icon size={20} />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold tracking-tight">{category.title}</h3>
          <p className="text-xs text-[color:var(--muted)]">{category.blurb}</p>
        </div>

        <span className="hidden shrink-0 rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted)] sm:inline-block">
          {category.skills.length} skills
        </span>
      </div>

      {/* divider */}
      <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-[color:var(--glass-border)] to-transparent" />

      {/* skill bars */}
      <ul className="space-y-4">
        {category.skills.map((s, i) => (
          <li key={s.name} className="flex items-center gap-4">
            <span className="w-36 shrink-0 text-sm font-medium text-[color:var(--text)] sm:w-44">
              {s.name}
            </span>
            <span
              className="skill-bar flex-1"
              data-tint={category.tint}
            >
              <i
                style={{
                  "--fill": s.level / 100,
                  "--i": i,
                }}
              />
            </span>
            <span className="w-10 shrink-0 text-right text-xs tabular-nums text-[color:var(--muted)]">
              {s.level}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────────────────────────────────── */

function StackCloud({ selectedId, onSelect }) {
  return (
    <div className="glass reveal rounded-3xl p-6 sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Full Stack Cloud</h3>
          <p className="mt-0.5 text-[11px] text-[color:var(--muted)]">
            Click a chip to jump to its category.
          </p>
        </div>
        <span className="hidden text-[10px] uppercase tracking-[0.35em] text-[color:var(--muted)] sm:block">
          / {ALL_SKILLS.length} items
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {ALL_SKILLS.map((s) => (
          <button
            key={`${s.category}:${s.name}`}
            type="button"
            data-active={selectedId === s.category}
            onClick={() => onSelect(s.category)}
            className="stack-chip rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-3 py-1.5 text-xs text-[color:var(--muted)]"
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────── */

export default function Skills() {
  const [selected, setSelected] = useState(CATEGORIES[0].id);
  const tiltRef = useRef(null);
  const rafRef = useRef(0);

  /* Mouse-tracked 3D tilt for the orbit scene */
  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--sy", `${nx * 14}deg`);
        el.style.setProperty("--sx", `${-ny * 14}deg`);
      });
    };
    const onLeave = () => {
      el.style.setProperty("--sy", "0deg");
      el.style.setProperty("--sx", "0deg");
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const category =
    CATEGORIES.find((c) => c.id === selected) ?? CATEGORIES[0];

  return (
    <section id="skills" className="relative px-5 py-28 sm:px-8">
      {/* background aurora */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="glow      left-[-10%] top-[15%] h-[440px] w-[440px]" />
        <div className="glow-lime right-[-8%]  bottom-[8%] h-[520px] w-[520px]" />
        <div className="grid-3d opacity-40" />
      </div>

      <div className="mx-auto max-w-6xl">

        {/* ═══════ HEADER ═══════ */}
        <div className="reveal mb-14 max-w-3xl">
          <div className="badge-live mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium">
            <Sparkles size={12} className="text-[color:var(--accent-secondary)]" />
            <span className="text-[color:var(--accent)]">My Skills</span>
          </div>

          <h2 className="dynamic-text text-4xl font-black leading-[1.15] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
  Technologies I work with.
</h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            Six skill clusters, one orbit. Click any core to inspect the
            tools inside — every bar reflects where I actually am, not
            where I'd like to be.
          </p>
        </div>

        {/* ═══════ ORBITAL MATRIX ═══════ */}
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">

          {/* Left: orbit scene */}
          <div className="reveal">
            <OrbitScene
              selected={selected}
              onSelect={setSelected}
              tiltRef={tiltRef}
            />

            {/* category ticker for mobile / accessibility */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 lg:hidden">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelected(c.id)}
                  className="filter-pill rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-3 py-1.5 text-[11px] font-medium text-[color:var(--muted)]"
                  data-active={selected === c.id}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>

          {/* Right: detail panel */}
          <div className="reveal">
            <DetailPanel category={category} />
          </div>
        </div>

        {/* ═══════ STACK CLOUD ═══════ */}
        <div className="mt-10">
          <StackCloud selectedId={selected} onSelect={setSelected} />
        </div>

      </div>
    </section>
  );
}