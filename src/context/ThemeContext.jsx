import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const THEMES   = ["dark", "light"];
const ACCENTS  = ["aqua", "lime", "coral", "ice"];
const STORAGE  = { theme: "portfolio-theme", accent: "portfolio-accent" };
const DEFAULTS = { theme: "dark", accent: "aqua" };

function safeGet(key, allowed, fallback) {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  return allowed.includes(v) ? v : fallback;
}

export function ThemeProvider({ children }) {
  const [theme,  setTheme]  = useState(() => safeGet(STORAGE.theme,  THEMES,  DEFAULTS.theme));
  const [accent, setAccent] = useState(() => safeGet(STORAGE.accent, ACCENTS, DEFAULTS.accent));

  // Keep DOM + storage in sync
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE.theme, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
    window.localStorage.setItem(STORAGE.accent, accent);
  }, [accent]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const cycleAccent = () =>
    setAccent((a) => {
      const i = ACCENTS.indexOf(a);
      return ACCENTS[(i + 1) % ACCENTS.length];
    });

  const value = {
    theme, accent,
    setTheme, setAccent,
    toggleTheme, cycleAccent,
    ACCENTS,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}