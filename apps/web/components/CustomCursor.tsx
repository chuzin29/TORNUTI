"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = "idle" | "hover" | "down";

const SELECTOR = "main button, [data-cursor]";

/** Custom cursor: appears only over buttons (or elements with data-cursor).
 *  Shows "arrastra" on hover, "suelta" while dragging.
 *  Hidden on touch devices.
 */
export default function CustomCursor() {
  const posRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("idle");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = posRef.current!;
    let tx = 0, ty = 0, x = 0, y = 0;
    let started = false;
    let hovering = false;
    let down = false;
    let raf = 0;

    const sync = () => setState(down ? "down" : hovering ? "hover" : "idle");

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!started) {
        x = tx;
        y = ty;
        started = true;
      }
      const target = e.target as Element | null;
      hovering = !!target?.closest?.(SELECTOR);
      sync();
    };
    const pdown = () => {
      down = hovering;
      sync();
    };
    const pup = () => {
      down = false;
      sync();
    };
    const leave = () => {
      hovering = false;
      down = false;
      sync();
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", pdown);
    window.addEventListener("pointerup", pup);
    window.addEventListener("pointercancel", pup);
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", pdown);
      window.removeEventListener("pointerup", pup);
      window.removeEventListener("pointercancel", pup);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = state === "idle" ? 12 : state === "hover" ? 84 : 62;
  const label = state === "down" ? "suelta" : "arrastra";

  return (
    <>
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          main button, [data-cursor] { cursor: none !important; }
        }
      `}</style>

      <div
        ref={posRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            borderRadius: "50%",
            background: "#f4f1e8",
            color: "#111",
            display: "grid",
            placeItems: "center",
            font: "600 12px/1 system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.01em",
            border: "1px solid rgba(0,0,0,.18)",
            boxShadow: "0 8px 24px rgba(0,0,0,.28)",
            opacity: state === "idle" ? 0 : 1,
            transition:
              "width .28s cubic-bezier(.2,.9,.3,1.2), height .28s cubic-bezier(.2,.9,.3,1.2), margin .28s cubic-bezier(.2,.9,.3,1.2), opacity .2s ease",
          }}
        >
          <span
            style={{
              opacity: state === "idle" ? 0 : 1,
              transition: "opacity .15s ease .08s",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </>
  );
}
