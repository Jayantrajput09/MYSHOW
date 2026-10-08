import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";

export default function RotatablePhoto({
  src = "/me.jpg",
  alt = "Profile",
  name,
  role,
  status = "Open to work",
}) {
  const stageRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  const rot = useRef({ x: -6, y: 14, vx: 0, vy: 0 });
  const rafRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      const r = rot.current;

      if (!dragging) {
        r.y += r.vy;
        r.x += r.vx;
        r.vy *= 0.94;
        r.vx *= 0.94;
        if (Math.abs(r.vy) < 0.08) r.vy += 0.09;   // idle spin
        r.x += (-6 - r.x) * 0.025;                 // pitch spring
      }

      el.style.setProperty("--rx", `${r.x.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${r.y.toFixed(2)}deg`);

      rafRef.current = requestAnimationFrame(tick);
    };

    if (!prefersReduced) rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dragging]);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(true);
    setHintVisible(false);
    pointerRef.current = { x: e.clientX, y: e.clientY };
    rot.current.vx = 0;
    rot.current.vy = 0;
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - pointerRef.current.x;
    const dy = e.clientY - pointerRef.current.y;
    pointerRef.current = { x: e.clientX, y: e.clientY };

    rot.current.y += dx * 0.55;
    rot.current.x -= dy * 0.55;
    rot.current.x = Math.max(-55, Math.min(55, rot.current.x));

    rot.current.vy = dx * 0.55;
    rot.current.vx = -dy * 0.55;
  };

  const onPointerUp = (e) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    setDragging(false);
  };

  return (
    <div className="rotatable-wrap">
      <div
        ref={stageRef}
        className={`rotatable-stage ${dragging ? "is-dragging" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        role="img"
        aria-label={alt}
      >
        <div className="rotatable-halo" aria-hidden="true" />

        <div className="rotatable-card">
          <div className="rotatable-frame">
            <img src={src} alt={alt} draggable={false} />
          </div>

          {name && (
            <div className="rotatable-plate">
              <span className="rotatable-name">{name}</span>
              {role && <span className="rotatable-role">{role}</span>}
            </div>
          )}

          {status && (
            <span className="rotatable-status">
              <span className="rotatable-status-dot" />
              {status}
            </span>
          )}
        </div>
      </div>

      {hintVisible && (
        <div className="rotatable-hint">
          <RotateCw size={11} />
          drag to rotate
        </div>
      )}
    </div>
  );
}