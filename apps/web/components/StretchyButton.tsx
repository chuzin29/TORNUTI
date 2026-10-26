"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { cn, clamp } from "@/lib/utils"
import { sstep } from "@/lib/stretch-math"
import { publishGrip } from "@/lib/grip-bus"

/**
 * StretchyButton: el botón insignia de Tornuti.
 *
 * Estilo: píldora con bisel (brillo superior, borde interno, caída inferior)
 * que funciona sobre papel claro y tinta oscura sin perder contraste.
 *
 * Comportamiento simbionte: una mancha de pintura reposa en el borde del
 * botón, del lado de la mano, y respira con contorno líquido antes de
 * entrar a su radio invisible; al acercarse se concentra y la masa corre
 * hasta el cursor. El botón se inclina hacia la masa y se comprime al
 * presionar. Fuera de la zona todo descansa y el bucle se apaga; con
 * `prefers-reduced-motion` no hay simbiosis.
 *
 * El guante del cursor (`CustomCursor`) reacciona al atributo `data-grip`.
 */

type Variant = "ink" | "accent" | "aura" | "outline"
type Size = "md" | "lg"

const SIZES: Record<Size, { padX: number; padY: number; font: number }> = {
  md: { padX: 27, padY: 13, font: 15.5 },
  lg: { padX: 33, padY: 16, font: 17.5 },
}

export interface StretchyButtonProps {
  children?: React.ReactNode
  label?: string
  /** Con `href` renderiza un <Link>; sin `href`, un <button>. */
  href?: string
  onClick?: () => void
  variant?: Variant
  size?: Size
  className?: string
  style?: React.CSSProperties
  type?: "button" | "submit"
  disabled?: boolean
  isLoading?: boolean
  /** Radio de alcance en píxeles (no se dibuja). */
  radius?: number
}

export default function StretchyButton({
  children,
  label,
  href,
  onClick,
  variant = "ink",
  size = "md",
  className,
  style,
  type = "button",
  disabled = false,
  isLoading = false,
  radius = 150,
}: StretchyButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const btnRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const bodyRef = useRef<SVGPathElement>(null)
  const spillRef = useRef<SVGPathElement>(null)
  const blobRef = useRef<SVGEllipseElement>(null)
  const poolRef = useRef<SVGPathElement>(null)
  const poolWideRef = useRef<SVGPathElement>(null)
  const hazeRef = useRef<SVGPathElement>(null)
  const onClickRef = useRef(onClick)
  onClickRef.current = onClick

  const shown = disabled || isLoading

  useEffect(() => {
    const wrap = wrapRef.current
    const btn = btnRef.current
    const svg = svgRef.current
    if (!wrap || !btn || !svg) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    if (reduce || !finePointer) return

    const R = radius
    const TILT = 9
    const SHIFT = 7
    const GOO_STIFF = 46
    const GOO_DAMP = 0.82

    const pt = { x: -9999, y: -9999, active: false }
    let w = 0
    let h = 0
    let margin = 0
    let rect = wrap.getBoundingClientRect() as DOMRect | null
    let rectDirty = false
    let raf = 0
    let last = performance.now()
    let t = 0

    let es = 0
    let rest = 0
    let sx = 0
    let sy = 0
    let tilt = 0
    let press = 0
    let tipX = 0
    let tipY = 0
    let tipVX = 0
    let tipVY = 0

    const measure = () => {
      w = btn.offsetWidth
      h = btn.offsetHeight
      margin = R + 30
      const W = w + margin * 2
      const H = h + margin * 2
      svg.style.left = `${-margin}px`
      svg.style.top = `${-margin}px`
      svg.style.width = `${W}px`
      svg.style.height = `${H}px`
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`)
      rect = wrap.getBoundingClientRect()
      rectDirty = false
    }

    const resetInk = () => {
      btn.style.transform = ""
      btn.style.filter = "none"
      spillRef.current?.setAttribute("d", "")
      bodyRef.current?.setAttribute("d", "")
      blobRef.current?.setAttribute("rx", "0")
      blobRef.current?.setAttribute("ry", "0")
      poolRef.current?.setAttribute("d", "")
      poolWideRef.current?.setAttribute("d", "")
      hazeRef.current?.setAttribute("d", "")
    }

    const settle = () => {
      raf = 0
      es = 0
      sx = sy = tilt = press = 0
      tipVX = tipVY = 0
      resetInk()
    }

    const tick = (now: number) => {
      const dt = clamp((now - last) / 1000, 1 / 240, 1 / 30)
      last = now
      t += dt * 1000

      if (rectDirty || !rect) rect = wrap.getBoundingClientRect()
      const px = rect ? pt.x - rect.left : -9999
      const py = rect ? pt.y - rect.top : -9999
      const cx = w / 2
      const cy = h / 2

      /* Distancia al borde de la píldora (cápsula). */
      const qx = clamp(px, h / 2, w - h / 2)
      const qy = clamp(py, h / 2, h - h / 2)
      const dEdge = Math.max(0, Math.hypot(px - qx, py - qy) - h / 2)

      const ddx = px - cx
      const ddy = py - cy
      const dl = Math.hypot(ddx, ddy) || 1
      const ux = ddx / dl
      const uy = ddy / dl

      const e = pt.active ? clamp((R - dEdge) / (R * 0.62), 0, 1) : 0
      /* Zona de reposo: antes de entrar al radio la mancha ya respira. */
      const restR = R * 1.9
      const eRest = pt.active ? clamp((restR - dEdge) / (restR - R), 0, 1) : 0
      es += (sstep(e) - es) * 0.16
      rest += (sstep(eRest) - rest) * 0.11
      if (es < 0.004 && rest < 0.02) {
        settle()
        return
      }

      const engaged = es > 0.002
      const ramp = clamp(es * 1.4, 0, 1)

      /* Majar el cuerpo: inclinación y desplazamiento hacia la masa. */
      const rx = qx - cx + ux * (h / 2 - 4)
      const ry = uy * (h / 2 - 4)
      const torque = rx * uy - ry * ux
      const tiltT = clamp((torque / (w * 0.5)) * TILT, -TILT, TILT) * es
      const sxT = ux * SHIFT * es
      const syT = uy * SHIFT * es
      press += ((btn.hasAttribute("data-pressed") ? 1 : 0) - press) * 0.22

      sx += (sxT - sx) * 0.12
      sy += (syT - sy) * 0.12
      tilt += (tiltT - tilt) * 0.12

      /* Difuminación muy liviana: solo como estela en movimiento rápido y
         con tope corto para que el botón siempre se lea con nitidez. */
      const move = Math.hypot(sxT - sx, syT - sy) + Math.abs(tiltT - tilt) * 2
      const blur = move > 0.55 ? Math.min(move * 0.22, 0.65) : 0

      btn.style.transform =
        `translate(${sx.toFixed(2)}px, ${sy.toFixed(2)}px) ` +
        `rotate(${tilt.toFixed(2)}deg) ` +
        `scale(${(1 - 0.04 * press).toFixed(3)}, ${(1 - 0.06 * press).toFixed(3)})`
      btn.style.filter = blur > 0.35 ? `blur(${blur.toFixed(2)}px)` : "none"

      /* Punta babosa: resorte con inercia y rebote gelatinoso. */
      if (engaged) {
        const reach = Math.min(1, es * 1.2)
        const targetX = cx + ddx * reach
        const targetY = cy + ddy * reach
        tipVX += (targetX - tipX) * GOO_STIFF * dt
        tipVY += (targetY - tipY) * GOO_STIFF * dt
        const damp = Math.pow(GOO_DAMP, dt * 60)
        tipVX *= damp
        tipVY *= damp
        tipX += tipVX
        tipY += tipVY
      } else {
        tipVX *= 0.7
        tipVY *= 0.7
        tipX += (cx - tipX) * 0.24
        tipY += (cy - tipY) * 0.24
      }
      tipX = clamp(tipX, -margin, w + margin)
      tipY = clamp(tipY, -margin, h + margin)

      /* Masa homogénea de pintura: una sola silueta rellena que sale del
         botón y corre hacia la mano. Nace EN el borde de la píldora, del
         lado del puntero (punto de fuga del estadio), nunca en medio. */
      const A = (w - h) / 2
      const segX = clamp(ddx, -A, A)
      const ox2 = ddx - segX
      const oy2 = ddy
      const olen = Math.hypot(ox2, oy2)
      const rimOk = olen > 0.6
      const BX =
        margin + cx + sx + (rimOk ? segX + (ox2 / olen) * (h / 2 - 3) : 0)
      const BY = margin + cy + sy + (rimOk ? (oy2 / olen) * (h / 2 - 3) : 0)
      const tdx = margin + tipX - BX
      const tdy = margin + tipY - BY
      const tl = Math.hypot(tdx, tdy) || 1
      const dirX = tdx / tl
      const dirY = tdy / tl
      let nx = -dirY
      let ny = dirX
      if (ny < 0) {
        nx = -nx
        ny = -ny
      }

      const sag = (10 + tl * 0.16) * (1 - 0.78 * es)
      const slow = 1 - 0.86 * press
      const whipAmp = (2.6 + tl * 0.052) * (1 - 0.4 * press)
      const whipPh = t * 0.0042
      /* Culebreo lento: la masa serpentea a un lado y regresa — pinta viva. */
      const meanderAmp = (7 + tl * 0.075) * Math.max(0.25, 1 - press)
      const meanderPh = Math.sin(t * 0.0011) * 1.6

      const K = 13
      const cxs: number[] = []
      const cys: number[] = []
      for (let k = 0; k <= K; k++) {
        const u = k / K
        const taper = Math.sin(u * Math.PI)
        const grow = 0.32 + 0.68 * u
        const g =
          sag * 0.55 * taper +
          meanderAmp *
            Math.sin(u * 1.9 + meanderPh) *
            (0.18 + 0.82 * u) +
          slow *
            whipAmp *
            (Math.sin(u * 2.9 - whipPh) + 0.45 * Math.sin(u * 6.2 + whipPh * 1.7)) *
            taper *
            grow
        cxs.push(BX + tdx * u + nx * g)
        cys.push(BY + tdy * u + ny * g)
      }
      /* Vaivén gelatinoso de la cabeza. */
      const tipJit = nx * 1.6 * Math.sin(t * 0.0061) + ny * 0.9 * Math.sin(t * 0.0048 + 1)
      cxs[K] += tipJit
      cys[K] += tipJit

      const headR = (6.5 + 14 * es * es * es + press * 3.4) * (1 + 0.05 * Math.sin(t * 0.0045))
      /* Estirón por velocidad: la masa se alarga con inercia, como pintura. */
      /* Perfil de anchura de pintura: fina al escapar por el borde,
         panza en medio, cabeza gorda. Con ondulación en las paredes. */
      const velQ = clamp(Math.hypot(tipVX, tipVY) / 1200, 0, 0.55)
      /* Concentración: al asomar es delgada, al agarrar la mano engorda. */
      const cEs = 0.62 + 0.38 * es
      const hwAt = (u: number) =>
        (h * (0.27 - 0.09 * u) + h * 0.11 * Math.sin(u * Math.PI * 0.9) + headR * 0.5 * u * u) *
        (1 + 0.16 * Math.sin(u * 4.1 - whipPh * 1.25) * slow) *
        (1 + 0.14 * press) *
        (1 + velQ * 0.25 * u) *
        cEs

      /* Normales por muestra desde la tangente de la cadena. */
      const normalsX: number[] = []
      const normalsY: number[] = []
      for (let k = 0; k <= K; k++) {
        const a = Math.max(0, k - 1)
        const b = Math.min(K, k + 1)
        const tx2 = cxs[b] - cxs[a]
        const ty2 = cys[b] - cys[a]
        const tn = Math.hypot(tx2, ty2) || 1
        normalsX.push(-ty2 / tn)
        normalsY.push(tx2 / tn)
      }

      /* Contorno cerrado: lado izquierdo, cabeza redonda, lado derecho.
         Cada pared ondula con su propia fase — borde líquido de pintura. */
      const wallPh = t * 0.0034
      const buildRing = (wMul: number, ox: number, oy: number) => {
        const out: number[] = []
        const outY: number[] = []
        for (let k = 0; k <= K; k++) {
          const u = k / K
          const reach = 0.22 + 0.78 * u
          const hwL =
            hwAt(u) * wMul * (1 + 0.12 * Math.sin(u * 5.3 - wallPh * 1.4) * reach)
          out.push(cxs[k] + normalsX[k] * hwL + ox)
          outY.push(cys[k] + normalsY[k] * hwL + oy)
        }
        const capSide = hwAt(1) * wMul * (1 - velQ * 0.3) * 0.55
        const capLen = headR * 1.25 * wMul * (1 + velQ * 0.6)
        out.push(cxs[K] + normalsX[K] * capSide + dirX * capLen * 0.82 + ox)
        outY.push(cys[K] + normalsY[K] * capSide + dirY * capLen * 0.82 + oy)
        out.push(cxs[K] + dirX * capLen + ox)
        outY.push(cys[K] + dirY * capLen + oy)
        out.push(cxs[K] - normalsX[K] * capSide + dirX * capLen * 0.82 + ox)
        outY.push(cys[K] - normalsY[K] * capSide + dirY * capLen * 0.82 + oy)
        for (let k = K; k >= 0; k--) {
          const u = k / K
          const reach = 0.22 + 0.78 * u
          const hwR =
            hwAt(u) * wMul * (1 + 0.14 * Math.sin(u * 4.4 + wallPh * 1.85 + 1.3) * reach)
          out.push(cxs[k] - normalsX[k] * hwR + ox)
          outY.push(cys[k] - normalsY[k] * hwR + oy)
        }
        return gooBlob(out, outY)
      }

      /* Visibilidad: sin acercamiento de veras, la masa y su cabeza no se
         dibujan — solo respira la mancha asentada en el borde. */
      const gone = clamp((es - 0.012) / 0.055, 0, 1)

      /* Mancha en reposo: pintura que ya se sienta en el borde del lado de
         la mano, con contorno líquido (armónicos) y aliento propio, aun sin
         entrar al radio. Se concentra al acercarse. */
      const poolVis = Math.max(rest, es)
      if (poolVis > 0.03) {
        const wob = t * 0.0011
        const poolBlob = (wideMul: number) => {
          const xs2: number[] = []
          const ys2: number[] = []
          const base = h * (0.28 + 0.44 * poolVis) * wideMul
          const px2 = BX - ux * base * 0.32
          const py2 = BY - uy * base * 0.32
          for (let i = 0; i < 15; i++) {
            const ang = (i / 15) * Math.PI * 2
            const wobR =
              1 +
              0.17 * Math.sin(ang * 3 + wob * 1.7) +
              0.12 * Math.sin(ang * 5 - wob * 1.15) +
              0.08 * Math.sin(ang * 8 + wob * 2.3) +
              0.06 * Math.sin(ang * 2 - wob * 0.6)
            const breathe = 1 + 0.07 * Math.sin(t * 0.0016 + ang * 1.35)
            const rr = base * wobR * breathe
            /* Gota tirando hacia la mano: se alarga delante y se recoge
               detrás — nunca sangra al lado opuesto del botón. */
            const ox3 = Math.cos(ang) * rr
            const oy3 = Math.sin(ang) * rr
            const along = ox3 * ux + oy3 * uy
            const perp = -ox3 * uy + oy3 * ux
            const alongF = along >= 0 ? 1 + 0.42 * poolVis : 1 - 0.46 * poolVis
            const sq = 1 - 0.12 * poolVis
            xs2.push(px2 + (along * alongF) * ux + perp * sq * -uy)
            ys2.push(py2 + (along * alongF) * uy + perp * sq * ux)
          }
          return gooBlob(xs2, ys2)
        }
        hazeRef.current?.setAttribute("d", poolBlob(1.6))
        poolWideRef.current?.setAttribute("d", poolBlob(1.26))
        poolRef.current?.setAttribute("d", poolBlob(0.95))
      } else {
        hazeRef.current?.setAttribute("d", "")
        poolWideRef.current?.setAttribute("d", "")
        poolRef.current?.setAttribute("d", "")
      }

      if (gone > 0.001) {
        /* Halo suave detrás y cuerpo: la masa corre hacia la mano. */
        spillRef.current?.setAttribute("d", buildRing(1.5 * gone, nx * 4.5, ny * 4.5))
        bodyRef.current?.setAttribute("d", buildRing(gone, 0, 0))

        /* Cabeza: elipse orientada al punto de anclaje, que late y se alarga. */
        const angle = (Math.atan2(dirY, dirX) * 180) / Math.PI
        const cxHead = cxs[K].toFixed(1)
        const cyHead = cys[K].toFixed(1)
        blobRef.current?.setAttribute("cx", cxHead)
        blobRef.current?.setAttribute("cy", cyHead)
        blobRef.current?.setAttribute("rx", (headR * 0.95 * gone).toFixed(1))
        blobRef.current?.setAttribute("ry", (headR * (1.02 + velQ * 0.8) * gone).toFixed(1))
        blobRef.current?.setAttribute(
          "transform",
          `rotate(${angle.toFixed(1)} ${cxHead} ${cyHead})`,
        )
      } else {
        spillRef.current?.setAttribute("d", "")
        bodyRef.current?.setAttribute("d", "")
        blobRef.current?.setAttribute("rx", "0")
        blobRef.current?.setAttribute("ry", "0")
      }

      publishGrip(es > 0.28 ? (es - 0.28) / 0.72 : 0)
      raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }

    /* El rect se invalida al hacer scroll; no relee layout dentro del handler. */
    const onMove = (e: PointerEvent) => {
      pt.x = e.clientX
      pt.y = e.clientY
      pt.active = true
      wake()
    }
    const onLeave = () => {
      pt.active = false
      wake()
    }
    const onScroll = () => {
      rectDirty = true
      wake()
    }
    const down = () => btn.setAttribute("data-pressed", "")
    const up = () => btn.removeAttribute("data-pressed")

    measure()
    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    window.addEventListener("scroll", onScroll, { passive: true, capture: true })
    btn.addEventListener("pointerdown", down)
    window.addEventListener("pointerup", up, { passive: true })
    window.addEventListener("pointercancel", up)
    const ro = new ResizeObserver(measure)
    ro.observe(btn)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("scroll", onScroll, { capture: true })
      btn.removeEventListener("pointerdown", down)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", up)
      ro.disconnect()
    }
  }, [radius, size])

  const sizeStyle: React.CSSProperties = {
    padding: `${SIZES[size].padY}px ${SIZES[size].padX}px`,
    fontSize: SIZES[size].font,
    lineHeight: 1,
  }

  const btnClasses = cn("stretch-btn", shown && "pointer-events-none opacity-55")

  const content = isLoading ? (
    <span className="flex items-center justify-center gap-2">
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      Cargando…
    </span>
  ) : (
    (children ?? label)
  )

  const stage = (
    <svg ref={svgRef} className="stretch-stage" aria-hidden="true">
      <path ref={hazeRef} fill="var(--sb-thread)" opacity="0.1" />
      <path ref={poolWideRef} fill="var(--sb-thread)" opacity="0.2" />
      <path ref={poolRef} fill="var(--sb-thread)" opacity="0.78" />
      <path ref={spillRef} fill="var(--sb-thread)" opacity="0.14" />
      <path ref={bodyRef} fill="var(--sb-thread)" opacity="0.97" />
      <ellipse ref={blobRef} fill="var(--sb-thread)" cx="0" cy="0" rx="0" ry="0" opacity="0.97" />
    </svg>
  )

  if (href) {
    return (
      <span
        ref={wrapRef}
        className={cn("stretch", className)}
        style={style}
        data-variant={variant}
        data-grip={disabled ? undefined : ""}
        aria-disabled={disabled || undefined}
      >
        {stage}
        <Link
          ref={btnRef as React.Ref<HTMLAnchorElement>}
          href={href}
          aria-label={label}
          aria-busy={isLoading || undefined}
          className={btnClasses}
          style={sizeStyle}
          onClick={disabled || isLoading ? (e) => e.preventDefault() : undefined}
          tabIndex={disabled ? -1 : undefined}
        >
          {content}
        </Link>
      </span>
    )
  }

  return (
    <span
      ref={wrapRef}
      className={cn("stretch", className)}
      style={style}
      data-variant={variant}
      data-grip={disabled ? undefined : ""}
    >
      {stage}
      <button
        ref={btnRef as React.Ref<HTMLButtonElement>}
        type={type}
        aria-label={label}
        aria-busy={isLoading || undefined}
        disabled={disabled || isLoading}
        className={btnClasses}
        style={sizeStyle}
        onClick={() => onClickRef.current?.()}
      >
        {content}
      </button>
    </span>
  )
}

/* Contorno cerrado y suavizado por puntos medios: silueta continua de la
   masa líquida — garantiza que todos los bordes sean curvas, nunca rectas. */
function gooBlob(xs: number[], ys: number[]): string {
  const m = xs.length
  if (m < 3) return ""
  const j = m - 1
  let d = `M${((xs[j] + xs[0]) / 2).toFixed(1)} ${((ys[j] + ys[0]) / 2).toFixed(1)}`
  for (let i = 0; i < m; i++) {
    const k = (i + 1) % m
    d += ` Q${xs[i].toFixed(1)} ${ys[i].toFixed(1)} ${((xs[i] + xs[k]) / 2).toFixed(1)} ${((ys[i] + ys[k]) / 2).toFixed(1)}`
  }
  return `${d} Z`
}
