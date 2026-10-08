import { useMemo, useState } from "react";
import { ExternalLink, Sparkles, ArrowUpRight, Star } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

/* ────────────────────────────────────────────────── */

const PROJECTS = [
  {
    id: "nearyfix",
    title: "NearyFix",
    tagline: "Local services, on demand.",
    category: "Full Stack",
    description:
      "A service marketplace connecting users with verified technicians — electricians, plumbers, AC repair, carpentry, and more. Real-time job tracking, chat, and booking.",
    tech: ["React", "Node.js", "Express", "MongoDB", "JWT", "Socket.IO"],
    live:   "https://nearyfix.netlify.app",
    github: "https://github.com/Jayantrajput09/nearbyfix-frontend",
    featured: true,
    metric: { value: "10k+", label: "lines shipped" },
  },
  {
    id: "gesturegear",
    title: "GestureGear",
    tagline: "Drive with your hands.",
    category: "Computer Vision",
    description:
      "A gesture-controlled driving game using MediaPipe hand tracking to steer, accelerate, and brake — all through webcam input.",
    tech: ["Python", "Pygame", "MediaPipe", "OpenCV"],
    live:   "",
    github: "",
    featured: false,
    metric: { value: "60fps", label: "hand tracking" },
  },
  {
    id: "portfolio",
    title: "Neon Abyss",
    tagline: "This very portfolio.",
    category: "Frontend",
    description:
      "A spatial 3D portfolio built with React, Tailwind, and native CSS custom properties — featuring mouse-tracked parallax, glass depth, and themeable accents.",
    tech: ["React", "Tailwind", "Vite", "CSS @property"],
    live:   "#",
    github: "#",
    featured: false,
    metric: { value: "100", label: "lighthouse" },
  },
];

/* Derived filter list — "All" + unique categories */
const FILTERS = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.category)))];

/* ────────────────────────────────────────────────── */

function ProjectCard({ project, index }) {
  const {
    title, tagline, category, description, tech,
    live, github, featured, metric,
  } = project;

  const hasLive   = live   && live   !== "#";
  const hasGithub = github && github !== "#";

  return (
    <article
      className={`glass card-3d reveal group relative overflow-hidden rounded-3xl ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      {/* ══════ Preview ══════ */}
      <div
        className={`mesh mesh-scan relative overflow-hidden ${
          featured ? "h-64 sm:h-72" : "h-52"
        }`}
      >
        {/* watermark index */}
        <span className="index-mark pointer-events-none absolute -bottom-6 right-4 select-none text-[7rem] font-black leading-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* floating monogram tile */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glass flex h-24 w-24 rotate-6 items-center justify-center rounded-3xl transition-transform duration-700 ease-out group-hover:rotate-0 group-hover:scale-110">
            <Sparkles
              size={30}
              className="text-[color:var(--accent)] drop-shadow-[0_0_12px_var(--accent)]"
            />
          </div>
        </div>

        {/* badges */}
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          {featured && (
            <span className="flex items-center gap-1.5 rounded-full border border-[color:var(--accent)]/40 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--accent)] backdrop-blur-md">
              <Star size={10} className="fill-current" /> Featured
            </span>
          )}
          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-white/80 backdrop-blur-md">
            {category}
          </span>
        </div>

        {/* metric pill */}
        {metric && (
          <div className="absolute bottom-4 left-5 flex items-baseline gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 backdrop-blur-md">
            <span className="text-sm font-bold text-white">{metric.value}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/60">
              {metric.label}
            </span>
          </div>
        )}

        {/* hover arrow (top-right) */}
        <span className="absolute right-5 top-5 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </span>
      </div>

      {/* ══════ Content ══════ */}
      <div className="p-7">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[color:var(--accent)]">
          {category}
        </p>

        <h3 className="mt-2 text-2xl font-bold tracking-tight">
          {title}
          <span className="block text-sm font-normal italic text-[color:var(--muted)]">
            {tagline}
          </span>
        </h3>

        <p className="mt-4 leading-7 text-[color:var(--muted)]">{description}</p>

        {/* Tech chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="tech-chip rounded-lg border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-3 py-1.5 text-xs text-[color:var(--muted)]"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-wrap gap-3">
          {hasLive && (
            <a
              href={live}
              target="_blank"
              rel="noreferrer"
              className="btn-shimmer group/btn inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <ExternalLink size={15} className="relative z-10" />
              <span className="relative z-10">Live Demo</span>
            </a>
          )}

          {hasGithub && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="tag-chip inline-flex items-center gap-2 rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-5 py-2.5 text-sm font-semibold text-[color:var(--text)] backdrop-blur-xl"
            >
              <FaGithub size={15} />
              Source
            </a>
          )}

          {!hasLive && !hasGithub && (
            <span className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[color:var(--glass-border)] px-5 py-2.5 text-xs uppercase tracking-widest text-[color:var(--muted)]">
              Private build
            </span>
          )}
        </div>
      </div>

      {/* hover accent bar */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-[color:var(--accent)] via-[color:var(--accent-secondary)] to-transparent transition-transform duration-700 group-hover:scale-x-100" />
    </article>
  );
}

/* ────────────────────────────────────────────────── */

export default function Projects() {
  const [filter, setFilter] = useState("All");

  const visible = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section id="projects" className="relative px-5 py-28 sm:px-8">
      {/* soft aurora behind */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="glow-lime left-[-10%] top-[10%] h-[420px] w-[420px]" />
        <div className="glow-pink right-[-12%] bottom-[5%] h-[480px] w-[480px]" />
      </div>

      <div className="mx-auto max-w-6xl">

        {/* ══════ HEADER ══════ */}
        <div className="reveal mb-12 max-w-3xl">
          <div className="badge-live mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium">
            <Sparkles size={12} className="text-[color:var(--accent-secondary)]" />
            <span className="text-[color:var(--accent)]">Selected Work</span>
          </div>

          <h2 className="dynamic-text text-4xl font-black leading-[1.15] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
  Technologies I work with.
</h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            Real applications, experiments, and side quests — engineered
            end-to-end from concept to deployment.
          </p>
        </div>

        {/* ══════ FILTERS ══════ */}
        <div className="reveal mb-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                data-active={active}
                onClick={() => setFilter(f)}
                className="filter-pill rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-4 py-2 text-xs font-medium text-[color:var(--muted)] backdrop-blur-xl hover:text-[color:var(--text)]"
              >
                {f}
              </button>
            );
          })}

          <span className="ml-auto hidden items-center gap-2 self-center text-[10px] uppercase tracking-[0.35em] text-[color:var(--muted)] sm:flex">
            {visible.length} {visible.length === 1 ? "project" : "projects"}
          </span>
        </div>

        {/* ══════ GRID ══════ */}
        <div className="grid gap-6 lg:grid-cols-2">
          {visible.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Empty state */}
        {visible.length === 0 && (
          <div className="glass mt-6 rounded-3xl p-10 text-center text-sm text-[color:var(--muted)]">
            Nothing here yet — try a different filter.
          </div>
        )}

        {/* ══════ FOOTER CTA ══════ */}
        <div className="reveal mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-7 backdrop-blur-xl sm:flex-row">
          <div>
            <p className="text-sm font-semibold text-[color:var(--text)]">
              Want the full archive?
            </p>
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              Every commit, experiment, and half-finished idea lives on GitHub.
            </p>
          </div>

          <a
            href="https://github.com/Jayantrajput09"
            target="_blank"
            rel="noreferrer"
            className="btn-shimmer group/btn inline-flex items-center gap-2 px-6 py-3 text-sm"
          >
            <FaGithub size={15} className="relative z-10" />
            <span className="relative z-10">Browse GitHub</span>
            <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
              →
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}