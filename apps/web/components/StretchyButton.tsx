"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  label?: string;
  href: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  type?: "button" | "submit";
  disabled?: boolean;
  strands?: number;
  anchor?: { x: number; y: number };
  maxStretch?: number;
  isLoading?: boolean;
};

export default function StretchyButton({
  children,
  label = "let's collaborate",
  href,
  onClick,
  className,
  style,
  type = "button",
  disabled = false,
  strands = 14,
  anchor = { x: -110, y: 130 },
  maxStretch = 160,
  isLoading = false,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  useEffect(() => {
    const btn = btnRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let x = 0, y = 0, vx = 0, vy = 0;
    let raf = 0;
    let last = performance.now();
    const drag = { active: false, sx: 0, sy: 0, dx: 0, dy: 0, moved: 0 };

    const seeds = Array.from({ length: strands }, (_, i) => Math.sin(i * 12.9898));

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      let tx = 0, ty = 0;
      if (drag.active) {
        const len = Math.hypot(drag.dx, drag.dy);
        const s = len > 0 ? (maxStretch * Math.tanh(len / maxStretch)) / len : 0;
        tx = drag.dx * s;
        ty = drag.dy * s;
      }

      const k = drag.active ? 420 : 170;
      const c = drag.active ? 30 : 11;
      vx += ((tx - x) * k - vx * c) * dt;
      vy += ((ty - y) * k - vy * c) * dt;
      x += vx * dt;
      y += vy * dt;

      const speed = Math.hypot(vx, vy);
      const w = btn.offsetWidth;
      const h = btn.offsetHeight;

      const rot = Math.max(-28, Math.min(28, x * 0.12 + vx * 0.015));
      const blur = reduce ? 0 : Math.min(speed / 120, 5);
      btn.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
      btn.style.filter = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : "none";

      const cx = w / 2;
      const cy = h / 2;
      const ax = cx + anchor.x;
      const ay = cy + anchor.y;

      const ox = -w * 0.28;
      const oy = h * 0.45;
      const rad = (rot * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const bx = cx + x + ox * cos - oy * sin;
      const by = cy + y + ox * sin + oy * cos;

      const restLen = Math.hypot(cx + ox - ax, cy + oy - ay);
      const dx = bx - ax;
      const dy = by - ay;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const slack = Math.max(0, restLen - len);
      const stretch = Math.max(0, len / restLen - 1);

      for (let i = 0; i < strands; i++) {
        const p = pathRefs.current[i];
        if (!p) continue;
        const t = i / (strands - 1) - 0.5;
        const seed = seeds[i];
        const spread = 1 - Math.min(stretch, 0.8);
        const off = t * 20 * spread;

        const sx = ax + nx * off * 0.3;
        const sy = ay + ny * off * 0.3;
        const ex = bx + nx * off;
        const ey = by + ny * off;

        const bow =
          (slack * 0.5 + 14 * (1 - Math.min(stretch * 3, 1))) * seed +
          t * slack * 0.4 +
          vx * 0.02 * seed;
        const mx = (sx + ex) / 2 + nx * bow;
        const my = (sy + ey) / 2 + ny * bow + slack * 0.25;

        p.setAttribute(
          "d",
          `M${sx.toFixed(1)} ${sy.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`
        );
        p.style.strokeWidth = (2.2 - Math.min(stretch, 1) * 1.4).toFixed(2);
      }

      const settled =
        !drag.active && speed < 0.5 && Math.abs(x) < 0.2 && Math.abs(y) < 0.2;
      if (settled) {
        raf = 0;
        x = y = vx = vy = 0;
        btn.style.transform = "translate3d(0,0,0) rotate(0deg)";
        btn.style.filter = "none";
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const down = (e: PointerEvent) => {
      btn.setPointerCapture(e.pointerId);
      drag.active = true;
      drag.sx = e.clientX;
      drag.sy = e.clientY;
      drag.dx = drag.dy = drag.moved = 0;
      wake();
    };
    const move = (e: PointerEvent) => {
      if (!drag.active) return;
      drag.dx = e.clientX - drag.sx;
      drag.dy = e.clientY - drag.sy;
      drag.moved = Math.max(drag.moved, Math.hypot(drag.dx, drag.dy));
    };
    const up = () => {
      if (!drag.active) return;
      drag.active = false;
      if (drag.moved < 6) onClickRef.current?.();
      wake();
    };

    btn.addEventListener("pointerdown", down);
    btn.addEventListener("pointermove", move);
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointercancel", up);

    wake();

    return () => {
      cancelAnimationFrame(raf);
      btn.removeEventListener("pointerdown", down);
      btn.removeEventListener("pointermove", move);
      btn.removeEventListener("pointerup", up);
      btn.removeEventListener("pointercancel", up);
    };
  }, [strands, anchor.x, anchor.y, maxStretch]);

  const containerClassName = cn(
    "relative inline-flex",
    disabled && "pointer-events-none opacity-50",
    className
  );

  return (
    <div ref={wrapRef} className={containerClassName}>
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: strands }).map((_, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            fill="none"
            stroke="#111"
            strokeLinecap="round"
            opacity={0.85}
          />
        ))}
      </svg>

      <Link
        href={href}
        className="relative block overflow-hidden"
        style={
          {
            position: "relative",
            padding: "16px 34px",
            borderRadius: 999,
            border: "none",
            background: "#0b0b0b",
            color: "#fff",
            font: "600 18px/1 system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.02em",
            cursor: disabled ? "not-allowed" : "grab",
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            willChange: "transform, filter",
            boxShadow: "0 10px 30px rgba(0,0,0,.25)",
            ...style,
          } as React.CSSProperties
        }
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            </svg>
            {label || "Cargando..."}
          </span>
        ) : (
          children || label
        )}
      </Link>
    </div>
  );
}
