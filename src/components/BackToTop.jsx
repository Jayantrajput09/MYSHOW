import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
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