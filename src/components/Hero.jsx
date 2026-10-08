import Typewriter from "./Typewriter";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, Download, Sparkles, Terminal } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import RotatablePhoto from "./RotatablePhoto";

/* ───────────────────────────────────────────────────── */

const SOCIAL = [
  { icon: FaGithub,   label: "GitHub",   href: "https://github.com/Jayantrajput09" },
  { icon: FaLinkedin, label: "LinkedIn", href: "https://linkedin.com/" },
  { icon: Download,   label: "Résumé",   href: "/resume.pdf" },
];

const FLOATING = [
  { label: "Frontend", stack: "React · Next.js", width: "92%",
    bar: "from-[color:var(--accent)] to-[color:var(--accent-secondary)]" },
  { label: "Backend",  stack: "Node · MongoDB",  width: "88%",
    bar: "from-[color:var(--accent-secondary)] to-[color:var(--accent-third)]" },
];

/* ───────────────────────────────────────────────────── */

export default function Hero() {
  const sceneRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const el = sceneRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { innerWidth: w, innerHeight: h } = window;
        const nx = (e.clientX / w) * 2 - 1;
        const ny = (e.clientY / h) * 2 - 1;
        el.style.setProperty("--ry", `${nx * 4}deg`);
        el.style.setProperty("--rx", `${-ny * 4}deg`);
        el.style.setProperty("--tx", `${nx * 6}px`);
        el.style.setProperty("--ty", `${ny * 6}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden px-5 pb-24 pt-32 sm:px-8"
    >
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="glow      left-[-12%] top-[6%]  h-[520px] w-[520px]" />
        <div className="glow-lime right-[-8%] top-[28%] h-[600px] w-[600px]" />
        <div className="glow-pink bottom-[-18%] left-[38%] h-[520px] w-[520px]" />

        <div className="grid-3d opacity-60" />
        <div className="stars" />
        <div className="beam absolute left-1/2 top-1/3 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>

      <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-20 lg:grid-cols-[1.05fr_0.95fr]">

        {/* ═══════════ LEFT : COPY ═══════════ */}
        <div
          className={`relative z-10 transition-all duration-1000 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Availability chip */}
          <div className="badge-live mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--accent)]" />
            </span>
            <span className="text-[color:var(--accent)]">Open to new missions</span>
            <Sparkles size={12} className="text-[color:var(--accent)]" />
          </div>

          {/* Role */}
          <p className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.42em] text-[color:var(--muted)]">
            <Terminal size={14} className="text-[color:var(--accent)]" />
            Full Stack Engineer
          </p>

          {/* ═══════ HEADLINE — unified, dynamic ═══════ */}
<h1 className="dynamic-text dynamic-text--slow max-w-4xl text-6xl font-black leading-[1] tracking-[-0.055em] sm:text-7xl lg:text-[6.75rem]">Build Some Amazing</h1>

          {/* Sub-copy */}
          <p className="mt-9 max-w-xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            I engineer immersive web experiences where{" "}
            <span className="font-medium text-[color:var(--text)]">design systems</span>,{" "}
            <span className="font-medium text-[color:var(--text)]">scalable backends</span>, and{" "}
            <span className="font-medium text-[color:var(--text)]">AI</span> converge — shipped
            with obsessive attention to motion and detail.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="btn-shimmer group inline-flex items-center gap-2 px-7 py-3.5 text-sm"
            >
              <span className="relative z-10">Explore Projects</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>

            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-7 py-3.5 text-sm font-semibold text-[color:var(--text)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--accent)]/40 hover:shadow-[0_0_40px_-10px_color-mix(in_oklab,var(--accent)_60%,transparent)]"
            >
              Let&apos;s Talk
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)] transition-all duration-300 group-hover:w-6" />
            </a>
          </div>

          {/* Social row */}
          <div className="mt-12 flex flex-wrap items-center gap-3">
            {SOCIAL.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="tag-chip inline-flex items-center gap-2 rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-4 py-2 text-xs font-medium text-[color:var(--muted)] backdrop-blur-xl hover:text-[color:var(--text)]"
              >
                <Icon size={14} />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* ═══════════ RIGHT : 3D ROTATABLE PHOTO ═══════════ */}
        <div
          ref={sceneRef}
          className="scene-3d relative flex min-h-[560px] items-center justify-center"
        >
          <RotatablePhoto
            src="/me.jpg"
            alt="Jayant Rajput"
            name="Jayant Rajput"
            role="Full Stack Engineer"
            status="Open to work"
          />

          {/* Floating satellites */}
          <div className="floating-card absolute left-[-6%] top-[10%] -rotate-12 rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-5 py-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,.6)] backdrop-blur-2xl">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted)]">
              {FLOATING[0].label}
            </p>
            <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">
              {FLOATING[0].stack}
            </p>
            <div className="mt-2 h-1 w-24 overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${FLOATING[0].bar}`}
                style={{ width: FLOATING[0].width }}
              />
            </div>
          </div>

          <div className="floating-card-delay absolute bottom-[8%] right-[-6%] rotate-[10deg] rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-5 py-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,.6)] backdrop-blur-2xl">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted)]">
              {FLOATING[1].label}
            </p>
            <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">
              {FLOATING[1].stack}
            </p>
            <div className="mt-2 h-1 w-24 overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${FLOATING[1].bar}`}
                style={{ width: FLOATING[1].width }}
              />
            </div>
          </div>

          <div className="floating-card absolute right-[6%] top-[6%] rounded-2xl border border-[color:var(--accent)]/35 bg-[color:var(--glass)] px-4 py-3 shadow-[0_0_30px_-8px_color-mix(in_oklab,var(--accent)_70%,transparent)] backdrop-blur-2xl">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-[color:var(--accent)]">
              <Sparkles size={12} /> AI × Web
            </p>
          </div>

          {/* Status pill */}
          <div className="absolute bottom-[6%] left-[8%] flex items-center gap-2 rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-[color:var(--muted)] backdrop-blur-xl">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--accent-secondary)]" />
            v2026 · shipping
          </div>
        </div>
      </div>

      {/* ═══════════ SCROLL CUE ═══════════ */}
      <a
        href="#about"
        className="group absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--muted)] transition group-hover:text-[color:var(--accent)]">
          Scroll
        </span>
        <div className="scroll-mouse" />
        <ArrowDown size={16} className="animate-bounce text-[color:var(--accent)]" />
      </a>
    </section>
  );
}