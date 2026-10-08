import { useEffect, useState } from "react";
import { ArrowUp, Heart, Sparkles, Mail } from "lucide-react";
import {
  FaGithub, FaLinkedin, FaXTwitter, FaDev,
} from "react-icons/fa6";

/* ───────────────────────────────────────────────────── */

const EMAIL = "jayantisworking1@gmail.com";

const LINKS = [
  {
    heading: "Explore",
    items: [
      { label: "Home",     href: "#home"     },
      { label: "About",    href: "#about"    },
      { label: "Skills",   href: "#skills"   },
      { label: "Projects", href: "#projects" },
    ],
  },
  {
    heading: "More",
    items: [
      { label: "Education", href: "#education" },
      { label: "Contact",   href: "#contact"   },
      { label: "Résumé",    href: "/resume.pdf", external: true },
      { label: "Writing",   href: "#", upcoming: true },
    ],
  },
];

const SOCIALS = [
  { icon: FaGithub,   label: "GitHub",   href: "https://github.com/Jayantrajput09" },
  { icon: FaLinkedin, label: "LinkedIn", href: "https://linkedin.com/" },
  
  
];

/* ───────────────────────────────────────────────────── */

function useClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`back-to-top-mobile group fixed bottom-6 left-6 z-40 flex h-11 items-center gap-2 rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-4 text-xs font-medium text-[color:var(--muted)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:text-[color:var(--text)] ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp
        size={14}
        className="transition-transform duration-500 group-hover:-translate-y-0.5"
      />
      <span className="hidden sm:inline">Back to top</span>
    </button>
  );
}

/* ───────────────────────────────────────────────────── */

export default function Footer() {
  const time = useClock();
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="relative overflow-hidden border-t border-[color:var(--glass-border)] px-5 pb-10 pt-16 sm:px-8">
        {/* soft aurora above */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="glow left-[-15%] top-[-40%] h-[420px] w-[420px]" />
          <div className="glow-lime right-[-10%] top-[-30%] h-[420px] w-[420px]" />
        </div>

        <div className="mx-auto max-w-6xl">

          {/* ═══════ TOP ROW ═══════ */}
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">

            {/* ── BRAND ── */}
            <div>
              <a
                href="#home"
                className="group inline-flex items-baseline text-2xl font-black tracking-tight"
              >
                <span className="gradient-text">Jayant</span>
                <span className="text-[color:var(--text)]">.</span>
                <span className="ml-2 h-2 w-2 self-center rounded-full bg-[color:var(--accent)] shadow-[0_0_14px_var(--accent)] transition-transform duration-500 group-hover:scale-125" />
              </a>

              <p className="mt-5 max-w-sm text-sm leading-7 text-[color:var(--muted)]">
                Full-stack engineer crafting immersive interfaces,
                scalable backends, and AI-powered products — one
                polished commit at a time.
              </p>

              {/* status chip */}
              <div className="badge-live mt-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent)] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                </span>
                <span className="text-[color:var(--accent)]">
                  Available · {time} IST
                </span>
              </div>

              {/* socials */}
              <div className="mt-6 flex flex-wrap gap-2">
                {SOCIALS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="tag-chip flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] text-[color:var(--muted)] hover:text-[color:var(--text)]"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* ── LINK COLUMNS ── */}
            {LINKS.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <h4 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--muted)]">
                  {col.heading}
                </h4>
                <ul className="mt-5 space-y-3">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noreferrer" : undefined}
                        className="group inline-flex items-center gap-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--text)]"
                      >
                        <span className="h-px w-0 bg-[color:var(--accent)] transition-all duration-500 group-hover:w-4" />
                        {item.label}
                        {item.upcoming && (
                          <span className="rounded-full border border-[color:var(--glass-border)] px-2 py-0.5 text-[9px] uppercase tracking-widest text-[color:var(--muted)]">
                            soon
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* ═══════ DIVIDER ═══════ */}
          <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-[color:var(--glass-border)] to-transparent" />

          {/* ═══════ BOTTOM ROW ═══════ */}
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">

            <p className="flex flex-wrap items-center justify-center gap-1.5 text-center text-xs text-[color:var(--muted)] sm:text-left">
              <span>© {year} Jayant Rajput.</span>
              <span className="hidden sm:inline">Built with</span>
              <Heart
                size={12}
                className="fill-[color:var(--accent-third)] text-[color:var(--accent-third)]"
              />
              <span className="hidden sm:inline">and</span>
              <Sparkles size={12} className="text-[color:var(--accent)]" />
              <span className="hidden sm:inline">
                — using React · Tailwind · CSS
              </span>
            </p>

            <a
              href={`mailto:${EMAIL}`}
              className="group inline-flex max-w-full items-center gap-2 rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] px-4 py-2 text-xs font-medium text-[color:var(--muted)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-[color:var(--text)]"
            >
              <Mail size={13} className="shrink-0 text-[color:var(--accent)]" />
              <span className="truncate">{EMAIL}</span>
              <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>
        </div>
      </footer>

      {/* Floating back-to-top (outlives the footer) */}
      <BackToTop />
    </>
  );
}