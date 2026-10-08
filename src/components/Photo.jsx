import { useEffect, useRef, useState } from "react";

/**
 * <Photo
 *   src="/me.jpg"
 *   alt="Jayant Rajput"
 *   caption="Jayant · 2026"       // optional, hidden on small
 *   size="md"                     // "sm" | "md" | "lg" | "xl"
 *   status="online"               // "online" | "offline" | undefined
 *   ring                          // show rotating conic ring (default true)
 * />
 */

const SIZES = {
  sm: "w-12 h-12",
  md: "w-24 h-24",
  lg: "w-40 h-40 sm:w-48 sm:h-48",
  xl: "w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80",
};

export default function Photo({
  src,
  alt = "Profile",
  caption,
  size = "md",
  status,
  ring = true,
  className = "",
}) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  /* Mouse-tracked 3D tilt on the plate */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width).toFixed(3));
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height).toFixed(3));
    };
    const onLeave = () => {
      el.style.setProperty("--mx", 0.5);
      el.style.setProperty("--my", 0.5);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-size={size}
      className={`photo-frame ${SIZES[size]} ${className}`}
      style={ring ? undefined : { "--ring": "none" }}
    >
      <div className="photo-plate">
        {/* Blurred placeholder while the real image loads */}
        {!loaded && (
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-pulse"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--accent) 22%, transparent), color-mix(in oklab, var(--accent-third) 18%, transparent))",
            }}
          />
        )}

        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: "opacity .5s ease" }}
        />
      </div>

      {status && <span className="photo-status" title={`Status: ${status}`} />}
      {caption && <span className="photo-caption">{caption}</span>}
    </div>
  );
}