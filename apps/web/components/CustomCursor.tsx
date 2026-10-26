"use client"

import { useEffect, useRef, useState } from "react"
import { clamp } from "@/lib/utils"
import { gripBus, decayGrip } from "@/lib/grip-bus"

/**
 * Cursor personalizado: un guante de caricatura que reemplaza al puntero.
 * Tres poses: señalar (por defecto), abierto (cuando un StretchyButton
 * lo atrae con sus hilos) y puño (mientras se presiona). Los campos de
 * texto y los iframes conservan el cursor nativo y ahí el guante se oculta.
 * Oculto en dispositivos táctiles y respetuoso con prefers-reduced-motion.
 */

const FIELD_SELECTOR = "input, textarea, select, [contenteditable]"
const INTERACTIVE_SELECTOR = "button, a, [role='button'], [data-cursor], [data-grip]"

function gloveStyle(strokeWidth: string) {
  return `fill="var(--glove-fill)" stroke="var(--glove-ink)" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round"`
}
function gloveLine(strokeWidth: string) {
  return `fill="none" stroke="var(--glove-ink)" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round"`
}
function gloveSeam() {
  return `fill="none" stroke="var(--glove-ink)" stroke-width="2.8" stroke-linecap="round"`
}

function cuff(x: number) {
  const st = gloveStyle("3.4")
  return (
    `<path d="M${x} 84 H${x + 36} V94 q-3 3 -6 0 q-3 3 -6 0 q-3 3 -6 0 q-3 3 -6 0 q-3 3 -6 0 q-3 3 -6 0 Z" ${st}/>` +
    `<rect x="${x + 1.7}" y="87" width="32.6" height="3.6" fill="var(--glove-ink)"/>`
  )
}

function buildGloveSvgs() {
  const st = gloveStyle("3.4")
  const line = gloveLine("3.4")
  const shade = "var(--glove-shade)"

  /* Señalar */
  const point =
    `<defs><clipPath id="cpf"><rect x="20" y="46" width="48" height="38" rx="14"/></clipPath>` +
    `<clipPath id="cpi"><path d="M22 60 V15 a7.5 7.5 0 0 1 15 0 V60 Z"/></clipPath></defs>` +
    `<path d="M20 62 C8 58 4 72 12 79 C16 83 23 82 26 77 Z" ${st}/>` +
    `<rect x="20" y="46" width="48" height="38" rx="14" fill="var(--glove-fill)"/>` +
    `<path d="M68 50 Q72 66 60 84 H46 Q60 74 60 50 Z" fill="${shade}" clip-path="url(#cpf)"/>` +
    `<rect x="20" y="46" width="48" height="38" rx="14" ${line}/>` +
    `<rect x="37" y="40" width="10" height="22" rx="5" ${st}/>` +
    `<rect x="47" y="38" width="10" height="22" rx="5" ${st}/>` +
    `<rect x="57" y="42" width="10" height="22" rx="5" ${st}/>` +
    `<path d="M22 60 V15 a7.5 7.5 0 0 1 15 0 V60 Z" fill="var(--glove-fill)"/>` +
    `<path d="M31 8 H39 V60 H31 Z" fill="${shade}" clip-path="url(#cpi)"/>` +
    `<path d="M22 60 V15 a7.5 7.5 0 0 1 15 0 V60" ${line}/>` +
    cuff(26)

  /* Abierto */
  const fing = (cx: number, len: number, ang: number) =>
    `<path d="M${cx - 5} 62 V${62 - len + 5} a5 5 0 0 1 10 0 V62" transform="rotate(${ang} ${cx} 62)" ${st}/>`
  const open =
    `<defs><clipPath id="cpp"><rect x="20" y="52" width="44" height="32" rx="13"/></clipPath></defs>` +
    `<rect x="6" y="46" width="12" height="28" rx="6" transform="rotate(-42 14 66)" ${st}/>` +
    fing(26, 34, -16) + fing(36.5, 42, -6) + fing(47, 38, 5) + fing(57.5, 30, 15) +
    `<rect x="20" y="52" width="44" height="32" rx="13" fill="var(--glove-fill)"/>` +
    `<path d="M62 56 Q68 70 56 84 H46 Q58 74 58 56 Z" fill="${shade}" clip-path="url(#cpp)"/>` +
    `<rect x="20" y="52" width="44" height="32" rx="13" ${line}/>` +
    cuff(24)

  /* Puño */
  const fist =
    `<defs><clipPath id="cpq"><rect x="16" y="34" width="52" height="50" rx="20"/></clipPath></defs>` +
    `<rect x="16" y="34" width="52" height="50" rx="20" fill="var(--glove-fill)"/>` +
    `<path d="M62 40 Q72 62 56 84 H46 Q62 66 60 40 Z" fill="${shade}" clip-path="url(#cpq)"/>` +
    `<rect x="16" y="34" width="52" height="50" rx="20" ${line}/>` +
    `<path d="M26 48 Q42 43 58 48 M26 58 Q42 53 58 58" ${gloveSeam()}/>` +
    `<rect x="24" y="66" width="36" height="14" rx="7" ${st}/>` +
    cuff(24)

  return { point, open, fist }
}

const GLOVE = buildGloveSvgs()

export function CustomCursor() {
  const posRef = useRef<HTMLDivElement>(null)
  const gloveRef = useRef<HTMLDivElement>(null)
  const poseRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const pos = posRef.current!
    const glove = gloveRef.current!
    const poseEl = poseRef.current!

    document.documentElement.classList.add("has-glove")

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const mouse = { x: -9999, y: -9999, down: false }
    const state = { over: false, overField: false, on: false, x: -9999, y: -9999, rot: 0, lastX: -9999 }

    let pose: "point" | "open" | "fist" = "point"
    let raf = 0
    let lastWrite = ""

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      decayGrip(0.05)

      /* Inercia del guante: gira levemente con el movimiento horizontal. */
      const vx = mouse.x - state.lastX
      state.lastX = mouse.x
      if (!reduce) {
        state.rot += (clamp(vx * 0.7, -18, 18) - state.rot) * 0.22
      }

      const grip = gripBus.value
      const want: typeof pose = mouse.down && state.over ? "fist" : grip > 0.32 ? "open" : "point"
      if (want !== pose) {
        pose = want
        poseEl.dataset.pose = pose
      }

      /* Temblor del guante mientras sostiene los hilos. */
      const shake = reduce
        ? 0
        : (Math.sin(t * 0.05) * 7 + Math.sin(t * 0.087) * 4) * grip
      poseEl.style.transform = `rotate(${(state.rot + shake).toFixed(1)}deg)`
      pos.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`

      const write = `${state.on}|${pose}`
      if (write !== lastWrite) {
        lastWrite = write
        glove.style.opacity = state.on && !state.overField ? "1" : "0"
      }
    }

    const move = (e: PointerEvent) => {
      state.x = mouse.x = e.clientX
      state.y = mouse.y = e.clientY
      if (!state.on) {
        state.on = true
        state.x = e.clientX
        state.y = e.clientY
      }
      const target = e.target as Element | null
      state.over = !!target?.closest?.(INTERACTIVE_SELECTOR)
      state.overField = !!target?.closest?.(FIELD_SELECTOR)
    }
    const pdown = () => {
      mouse.down = true
    }
    const pup = () => {
      mouse.down = false
    }
    const leave = () => {
      state.on = false
      state.over = false
    }
    const enter = () => {
      state.on = true
    }

    window.addEventListener("pointermove", move, { passive: true })
    window.addEventListener("pointerdown", pdown, { passive: true })
    window.addEventListener("pointerup", pup, { passive: true })
    window.addEventListener("pointercancel", pup)
    document.documentElement.addEventListener("pointerleave", leave)
    document.documentElement.addEventListener("pointerenter", enter)
    raf = requestAnimationFrame(frame)

    return () => {
      document.documentElement.classList.remove("has-glove")
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerdown", pdown)
      window.removeEventListener("pointerup", pup)
      window.removeEventListener("pointercancel", pup)
      document.documentElement.removeEventListener("pointerleave", leave)
      document.documentElement.removeEventListener("pointerenter", enter)
    }
  }, [enabled])

  if (!enabled) return null

  return (
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
        ref={gloveRef}
        style={{
          opacity: 0,
          transition: "opacity .18s ease",
        }}
      >
        <div style={{ width: 52, height: 65 }}>
          <div
            ref={poseRef}
            data-pose="point"
            style={{
              position: "absolute",
              left: -20,
              top: -12,
              filter: "drop-shadow(0 5px 6px rgba(0,0,0,.28))",
              willChange: "transform",
            }}
            dangerouslySetInnerHTML={{ __html: gloveInner() }}
          />
        </div>
      </div>
    </div>
  )
}

/* Tres poses en SVG; solo la pose activa se muestra, con un pop suave. */
function gloveInner() {
  const wrap = (name: string, content: string) =>
    `<svg viewBox="0 0 80 100" width="80" height="100" class="glove-svg" data-glove-svg="${name}" aria-hidden="true">${content}</svg>`
  return (
    wrap("point", GLOVE.point) +
    wrap("open", GLOVE.open) +
    wrap("fist", GLOVE.fist)
  )
}
