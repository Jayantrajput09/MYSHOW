import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────
   Default greetings — module-level so the reference is
   stable across renders. Never put this inside the
   component or the effect will re-run on every state change.
   ───────────────────────────────────────────────────── */
const DEFAULT_GREETINGS = [
  "Namaste 👋",
  "Hey there!",
  "Welcome to my corner ✨",
  "Kaise ho? 🙂",
  "Scroll around, dekho sab",
  "Nice to see you!",
  "Kuch dhundh rahe ho? 👀",
  "Thanks for stopping by ❤️",
];

/**
 * <WatchfulEyes />
 *
 * A cute dummy face as a faint background character.
 * • Eyes track pointer / finger
 * • Eyebrows lift + mouth widens on activity
 * • Random blinking every 2–6s (occasional double-blink)
 * • Greeting bubble cycles through messages every few seconds
 */
export default function WatchfulEyes({
  idleBlushMs = 900,
  followRadius = 180,
  greetings = DEFAULT_GREETINGS,
  greetingHoldMs = 3200,
  greetingGapMs  = 1400,
  greetingFirstDelayMs = 1800,
} = {}) {
  const [blinking, setBlinking] = useState(false);
  const [blushing, setBlushing] = useState(false);
  const [greetIdx, setGreetIdx] = useState(0);
  const [greetVisible, setGreetVisible] = useState(false);

  const eyeL = useRef(null);
  const eyeR = useRef(null);

  /* Keep the latest greetings array in a ref so the cycle effect
     never needs it as a dependency. Fixes the "Namaste stuck" bug. */
  const greetingsRef = useRef(greetings);
  useEffect(() => {
    greetingsRef.current = greetings;
  }, [greetings]);

  /* ── Blink loop ── */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let alive = true;
    let t1, t2;

    const blinkOnce = (dur = 130) => {
      setBlinking(true);
      t2 = setTimeout(() => setBlinking(false), dur);
    };

    const loop = () => {
      if (!alive) return;
      blinkOnce();
      if (Math.random() < 0.15) {
        setTimeout(() => alive && blinkOnce(110), 260);
      }
      t1 = setTimeout(loop, 2200 + Math.random() * 3800);
    };

    t1 = setTimeout(loop, 1200);
    return () => {
      alive = false;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  /* ── Greeting rotation ──
     Deps intentionally exclude `greetings` — we read it from the ref.
     This effect runs exactly once. */
  useEffect(() => {
    let alive = true;
    let tShow, tHide, tNext;

    const cycle = () => {
      if (!alive) return;

      // Show current greeting
      setGreetVisible(true);

      tHide = setTimeout(() => {
        if (!alive) return;
        // Hide
        setGreetVisible(false);

        // Wait, then advance index and start again
        tNext = setTimeout(() => {
          if (!alive) return;
          const len = greetingsRef.current.length;
          setGreetIdx((i) => (i + 1) % len);
          cycle();
        }, greetingGapMs);
      }, greetingHoldMs);
    };

    tShow = setTimeout(cycle, greetingFirstDelayMs);

    return () => {
      alive = false;
      clearTimeout(tShow);
      clearTimeout(tHide);
      clearTimeout(tNext);
    };
  }, [greetingHoldMs, greetingGapMs, greetingFirstDelayMs]);

  /* ── Pointer tracker ── */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const refs = [eyeL, eyeR];
    let raf = 0;
    let blushTimer = 0;

    const onMove = (e) => {
      const t = e.touches?.[0] ?? e;
      const x = t.clientX;
      const y = t.clientY;

      setBlushing(true);
      clearTimeout(blushTimer);
      blushTimer = setTimeout(() => setBlushing(false), idleBlushMs);

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        refs.forEach((ref) => {
          const pupil = ref.current;
          if (!pupil) return;
          const sclera = pupil.parentElement;
          if (!sclera) return;

          const r = sclera.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.hypot(dx, dy) || 1;

          const maxOffset = r.width * 0.22;
          const factor = Math.min(1, dist / followRadius);
          const ox = (dx / dist) * maxOffset * factor;
          const oy = (dy / dist) * maxOffset * factor;

          pupil.style.setProperty("--px", `${ox.toFixed(2)}px`);
          pupil.style.setProperty("--py", `${oy.toFixed(2)}px`);
        });
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove",   onMove, { passive: true });
    window.addEventListener("touchstart",  onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(blushTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove",   onMove);
      window.removeEventListener("touchstart",  onMove);
    };
  }, [idleBlushMs, followRadius]);

  return (
    <div
      className="face-holder"
      data-blushing={blushing}
      aria-hidden="true"
    >
      <div className="face">
        {/* Greeting bubble — keyed so enter animation replays */}
        <div
          key={greetIdx}
          className="greeting"
          data-show={greetVisible}
        >
          <span className="greeting-wave">✨</span>
          {greetingsRef.current[greetIdx]}
        </div>

        {/* Eyebrows */}
        <div className="brow brow--left" />
        <div className="brow brow--right" />

        {/* Eyes */}
        <div className="eye eye--left" data-blinking={blinking}>
          <div className="eye-sclera">
            <div className="pupil" ref={eyeL}>
              <span className="pupil-shine" />
            </div>
          </div>
          <div className="blush" />
        </div>

        <div className="eye eye--right" data-blinking={blinking}>
          <div className="eye-sclera">
            <div className="pupil" ref={eyeR}>
              <span className="pupil-shine" />
            </div>
          </div>
          <div className="blush" />
        </div>

        {/* Nose */}
        <div className="nose" />

        {/* Mouth */}
        <div className="mouth" />
      </div>
    </div>
  );
}