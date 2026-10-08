import { useEffect, useRef, useState } from "react";

/**
 * Scroll-triggered typewriter.
 *
 * Props:
 *   text       — string or array of strings (one per line)
 *   speed      — ms per character (default 32)
 *   startDelay — ms before typing starts (default 200)
 *   lineDelay  — ms between lines when text is an array (default 260)
 *   loop       — if true, cycles through array lines forever (default false)
 *   pauseMs    — how long to hold a completed line before next (loop only)
 *   as         — wrapper tag (default "span")
 *   className  — pass-through
 *   cursor     — show blinking cursor (default true)
 */
export default function Typewriter({
  text,
  speed = 32,
  startDelay = 200,
  lineDelay = 260,
  loop = false,
  pauseMs = 1400,
  as: Tag = "span",
  className = "",
  cursor = true,
  ...rest
}) {
  const lines = Array.isArray(text) ? text : [text];
  const ref = useRef(null);

  const [started, setStarted]   = useState(false);
  const [lineIdx, setLineIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [done, setDone]         = useState(false);

  /* ── Trigger when scrolled into view ── */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion — reveal immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStarted(true);
      setDone(true);
      setCharIdx(lines[0]?.length ?? 0);
      setLineIdx(lines.length - 1);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lines]);

  /* ── Type characters ── */
  useEffect(() => {
    if (!started || done) return;

    const currentLine = lines[lineIdx] ?? "";
    const isLastLine  = lineIdx === lines.length - 1;

    // Timeout for initial delay
    const initialWait = lineIdx === 0 && charIdx === 0 ? startDelay : 0;

    // Between lines pause
    const betweenWait = charIdx === 0 && lineIdx > 0 ? lineDelay : 0;

    const wait = Math.max(initialWait, betweenWait);

    const timer = setTimeout(() => {
      if (charIdx < currentLine.length) {
        setCharIdx((i) => i + 1);
      } else if (!isLastLine) {
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      } else if (loop) {
        // Restart from line 0 after a pause
        setTimeout(() => {
          setLineIdx(0);
          setCharIdx(0);
        }, pauseMs);
      } else {
        setDone(true);
      }
    }, wait || speed);

    return () => clearTimeout(timer);
  }, [started, done, charIdx, lineIdx, lines, speed, startDelay, lineDelay, loop, pauseMs]);

  /* ── Build visible output ── */
  const visibleLines = lines.map((line, i) => {
    if (i < lineIdx)  return line;                 // fully typed
    if (i > lineIdx)  return "";                   // not yet started
    return line.slice(0, charIdx);                 // currently typing
  });

  const showCursor = cursor && (started || done);

  return (
    <Tag
      ref={ref}
      className={`${className}`}
      {...rest}
    >
      <span className="type-lines">
        {visibleLines.map((line, i) => (
          <span key={i}>
            {line}
            {/* Cursor sits at the active line only */}
            {showCursor && i === lineIdx && (
              <span
                className={`type-cursor ${done && !loop ? "type-cursor--hidden" : ""}`}
                aria-hidden="true"
              />
            )}
          </span>
        ))}
      </span>

      {/* Screen reader gets full text instantly */}
      <span className="sr-only">{lines.join(" ")}</span>
    </Tag>
  );
}