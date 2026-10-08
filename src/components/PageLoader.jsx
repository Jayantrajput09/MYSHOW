import { useEffect, useState } from "react";

/**
 * Boot screen with monogram stroke animation + progress bar.
 * Fades out when the window `load` event fires (or after `maxMs`).
 */
export default function PageLoader({ maxMs = 2400, minMs = 900 }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden]     = useState(false);
  const [removed, setRemoved]   = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-loading", "true");
    const start = performance.now();

    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const ratio = Math.min(elapsed / maxMs, 1);
      // ease-out so it feels like it's "loading"
      const eased = 1 - Math.pow(1 - ratio, 2);
      setProgress(Math.round(eased * 100));
      if (ratio < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const finish = () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minMs - elapsed);
      setTimeout(() => {
        setProgress(100);
        // let the bar hit 100% for a beat
        setTimeout(() => {
          setHidden(true);
          document.documentElement.removeAttribute("data-loading");
          // fully remove from DOM after fade
          setTimeout(() => setRemoved(true), 800);
        }, 180);
      }, wait);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.removeAttribute("data-loading");
    };
  }, [maxMs, minMs]);

  if (removed) return null;

  return (
    <div className="loader" data-hidden={hidden}>
      <div className="loader-inner">
        {/* Monogram SVG with gradient stroke */}
        <div className="loader-mark">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="loaderGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="var(--accent)" />
                <stop offset="55%"  stopColor="var(--accent-secondary)" />
                <stop offset="100%" stopColor="var(--accent-third)" />
              </linearGradient>
            </defs>
            <text
              x="50"
              y="66"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              JR
            </text>
          </svg>
        </div>

        {/* Progress rail */}
        <div className="loader-rail" aria-hidden="true">
          <i style={{ width: `${progress}%` }} />
        </div>

        {/* Caption */}
        <p className="loader-caption">
          Loading portfolio
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </p>
      </div>
    </div>
  );
}