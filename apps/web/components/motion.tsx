"use client"

import {
  createElement,
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react"

/* ── Reveal: entrada al detalle al hacer scroll ──────────────────────────
   Un solo IntersectionObserver compartido para todo el árbol. Al entrar la
   pieza en el camarín se agrega la clase `is-in` y el CSS hace el resto
   (solo opacity y transform). Sin JS o con `prefers-reduced-motion`, el
   contenido se ve completo de inmediato. */

let sharedObserver: IntersectionObserver | null = null
const revealTargets = new WeakMap<Element, IntersectionObserver>()

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          revealTargets.get(entry.target)?.unobserve(entry.target)
          revealTargets.delete(entry.target)
          const el = entry.target as HTMLElement
          el.classList.add("is-in")
          /* Al terminar la entrada, el nodo vuelve a sus propias
             transiciones (hover, foco) sin heredar el retardo del reveal. */
          const ms = toDelay(el) + 980
          window.setTimeout(() => {
            el.removeAttribute("data-reveal")
            el.style.removeProperty("--reveal-d")
          }, ms)
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )
  }
  return sharedObserver
}

function toDelay(el: Element): number {
  const raw = getComputedStyle(el).getPropertyValue("--reveal-d")
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : 0
}

interface RevealProps {
  children?: ReactNode
  /** Etiqueta real para no romper la semántica (li, section, aside, …). */
  as?: ElementType
  className?: string
  style?: React.CSSProperties
  /** Retardo en ms para escalonar segundas piezas. */
  delay?: number
  from?: "up" | "left" | "right" | "fade"
}

export function Reveal({
  children,
  as,
  className,
  style,
  delay = 0,
  from = "up",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const observer = reduce ? null : getObserver()
    if (reduce || !observer) {
      el.classList.add("is-in")
      return
    }
    revealTargets.set(el, observer)
    observer.observe(el)
    return () => {
      observer.unobserve(el)
      revealTargets.delete(el)
    }
  }, [])

  const props: React.ComponentPropsWithoutRef<ElementType> = {
    ref,
    className,
    "data-reveal": from,
    "data-reveal-ready": "",
    style: { ...style, ["--reveal-d" as string]: `${delay}ms` },
  }
  return createElement(as ?? "div", props, children)
}

/* ── Parallax: profundidad al hacer scroll ───────────────────────────────
   Mueve la pieza con translate3d en un rAF coalescido. Solo cuando la
   pieza está en el camarín; el listener es pasivo y no lee layout en el
   frame (solo getBoundingClientRect coalescido). */

export function Parallax({
  children,
  className,
  strength = 0.07,
}: {
  children?: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    let rect: DOMRect | null = null
    let rectDirty = true

    const update = () => {
      raf = 0
      if (rectDirty || !rect) rect = el.getBoundingClientRect()
      const r = rect as DOMRect
      const vh = window.innerHeight
      if (r.bottom < 0 || r.top > vh) return
      /* 0 cuando entra por abajo, 1 cuando sale por arriba. */
      const p = (vh - r.top) / (vh + r.height)
      const y = (p - 0.5) * strength * vh * 2
      el.style.transform = `translate3d(0, ${(-y).toFixed(1)}px, 0)`
    }

    const wake = () => {
      rectDirty = true
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", wake, { passive: true })
    window.addEventListener("resize", wake, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", wake)
      window.removeEventListener("resize", wake)
    }
  }, [strength])

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  )
}

/* ── ScrollProgress: hilo de lectura fijo en el borde superior ─────────── */

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      el.style.transform = `scaleX(${p.toFixed(4)})`
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", wake, { passive: true })
    window.addEventListener("resize", wake, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", wake)
      window.removeEventListener("resize", wake)
    }
  }, [])

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />
}
