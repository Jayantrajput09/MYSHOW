import { useEffect, useRef, useState } from "react";
import { Menu, X, Sun, Moon, Palette, Search, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  { name: "Home",      href: "#home"      },
  { name: "About",     href: "#about"     },
  { name: "Skills",    href: "#skills"    },
  { name: "Projects",  href: "#projects"  },
  { name: "Education", href: "#education" },
  { name: "Contact",   href: "#contact"   },
];

/* Preview colors for the accent picker — match ThemeContext presets */
const ACCENT_SWATCHES = {
  aqua:  "linear-gradient(135deg, #00e5c0, #b6ff3c)",
  lime:  "linear-gradient(135deg, #b6ff3c, #00e5c0)",
  coral: "linear-gradient(135deg, #ff5d8f, #ffb03a)",
  ice:   "linear-gradient(135deg, #5eead4, #7dd3fc)",
};

export default function Navbar() {
  const { theme, toggleTheme, accent, setAccent, ACCENTS } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [colorOpen,  setColorOpen]  = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  const colorRef = useRef(null);

  /* Shrink / elevate nav on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close color popover on outside click / Escape */
  useEffect(() => {
    if (!colorOpen) return;
    const onClick = (e) => {
      if (colorRef.current && !colorRef.current.contains(e.target)) setColorOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setColorOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [colorOpen]);

  /* Lock body scroll while mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 px-4 transition-all duration-500 sm:px-6 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 ${
          scrolled ? "shadow-[0_20px_50px_-20px_rgba(0,0,0,.7)]" : ""
        }`}
      >
        {/* ── Logo ─────────────────────────────────── */}
        <a
          href="#home"
          className="group relative text-xl font-bold tracking-tight"
        >
          <span className="gradient-text">Jayant</span>
          <span className="text-[color:var(--text)]">.</span>
          <span className="pointer-events-none absolute -inset-x-2 -inset-y-1 -z-10 rounded-xl bg-[color:var(--accent)]/0 blur-md transition-all duration-500 group-hover:bg-[color:var(--accent)]/25" />
        </a>

        {/* ── Desktop Nav ──────────────────────────── */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group relative rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--text)]"
            >
              <span className="relative z-10">{item.name}</span>
              <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-secondary)] transition-transform duration-500 group-hover:scale-x-100" />
              <span className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-[color:var(--accent)]/0 transition-all duration-500 group-hover:bg-[color:var(--accent)]/8" />
            </a>
          ))}
        </div>

        {/* ── Controls ─────────────────────────────── */}
        <div className="flex items-center gap-2">
          {/* Command palette trigger — desktop only */}
<button
  type="button"
  onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
  aria-label="Open command palette"
  className="glass hidden h-9 items-center gap-2 rounded-xl px-3 text-[11px] font-medium text-[color:var(--muted)] transition hover:text-[color:var(--text)] md:flex"
>
  <Search size={13} />
  <span>Search</span>
  <kbd>⌘</kbd>
  <kbd>K</kbd>
</button>

          {/* Accent picker */}
          <div className="relative" ref={colorRef}>
            <button
              onClick={() => setColorOpen((v) => !v)}
              className="glass flex h-9 w-9 items-center justify-center rounded-xl transition hover:scale-105"
              aria-label="Change accent color"
              aria-expanded={colorOpen}
            >
              <Palette size={17} className="text-[color:var(--accent)]" />
            </button>

            {colorOpen && (
              <div className="glass absolute right-0 top-12 z-20 w-44 rounded-2xl p-2">
                <p className="px-2 pb-1 pt-1 text-[10px] uppercase tracking-widest text-[color:var(--muted)]">
                  Accent
                </p>
                <div className="flex flex-col gap-1">
                  {ACCENTS.map((name) => {
                    const active = accent === name;
                    return (
                      <button
                        key={name}
                        onClick={() => { setAccent(name); setColorOpen(false); }}
                        className="group flex items-center gap-3 rounded-xl px-2 py-2 text-left text-xs capitalize text-[color:var(--muted)] transition hover:bg-white/5 hover:text-[color:var(--text)]"
                      >
                        <span
                          className="h-5 w-5 shrink-0 rounded-full ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110"
                          style={{ background: ACCENT_SWATCHES[name] }}
                        />
                        <span className="flex-1">{name}</span>
                        {active && (
                          <Check size={14} className="text-[color:var(--accent)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="glass flex h-9 w-9 items-center justify-center rounded-xl transition hover:scale-105"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark"
              ? <Sun  size={17} className="text-[color:var(--accent-secondary)]" />
              : <Moon size={17} className="text-[color:var(--accent)]" />}
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="glass flex h-9 w-9 items-center justify-center rounded-xl md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Sheet ───────────────────────────── */}
      <div
        className={`mx-auto max-w-6xl overflow-hidden transition-[max-height,opacity] duration-500 md:hidden ${
          mobileOpen ? "mt-2 max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass rounded-2xl p-3">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="group relative rounded-xl px-4 py-3 text-sm text-[color:var(--muted)] transition hover:bg-white/5 hover:text-[color:var(--text)]"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="pointer-events-none absolute left-4 right-4 bottom-2 h-px origin-left scale-x-0 bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-secondary)] transition-transform duration-500 group-hover:scale-x-100" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}