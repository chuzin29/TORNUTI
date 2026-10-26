import type * as React from "react"
import Image from "next/image"
import type { Category, CoverPattern } from "@/lib/types"
import { cn } from "@/lib/utils"

const toneClass: Record<Category, string> = {
  deportes: "tone-deportes",
  gaming: "tone-gaming",
  comunidad: "tone-comunidad",
  cultura: "tone-cultura",
  empresas: "tone-empresas",
}

function CourtArt() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="24" y="24" width="352" height="177" rx="2" />
      <path d="M200 24v177M24 112.5h352" />
      <circle cx="200" cy="112.5" r="42" />
      <path d="M24 62h58v101H24M376 62h-58v101h58" />
      <path d="M82 86a44 44 0 0 1 0 53M318 86a44 44 0 0 0 0 53" />
      <path d="M24 24 376 201" strokeOpacity="0.18" strokeDasharray="7 9" />
    </g>
  )
}

function GridArt() {
  return (
    <g fill="currentColor">
      {Array.from({ length: 7 }).map((_, column) =>
        Array.from({ length: 4 }).map((__, row) => {
          const opacity = 0.1 + ((column + row) % 4) * 0.07
          return (
            <rect
              key={`${column}-${row}`}
              x={34 + column * 47}
              y={28 + row * 43}
              width="38"
              height="34"
              opacity={opacity}
            />
          )
        }),
      )}
      <path d="M310 26 382 96 348 200 258 176Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <circle cx="326" cy="96" r="6" fill="currentColor" opacity="0.85" />
      <circle cx="326" cy="96" r="22" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </g>
  )
}

function ArcArt() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="338" cy="172" r="28" fill="currentColor" fillOpacity="0.85" stroke="none" />
      <path d="M-30 214c62-96 164-143 288-143M30 234c55-78 143-115 258-115M92 250c48-57 118-83 208-83" />
      <path d="M32 48h84M32 62h56M32 76h34" strokeLinecap="round" />
    </g>
  )
}

function ScoreArt() {
  return (
    <g>
      <g fill="currentColor" opacity="0.9">
        {[
          [62, 62],
          [138, 62],
        ].map(([x, y], index) => (
          <g key={index} transform={`translate(${x} ${y})`}>
            <rect x="0" y="0" width="42" height="9" rx="1" />
            <rect x="0" y="24" width="42" height="9" rx="1" />
            <rect x="0" y="48" width="42" height="9" rx="1" />
            <rect x="0" y="72" width="42" height="9" rx="1" />
            <rect x="0" y="96" width="42" height="9" rx="1" />
            <rect x="0" y="0" width="9" height="42" rx="1" />
            <rect x="33" y="54" width="9" height="51" rx="1" />
          </g>
        ))}
      </g>
      <path d="M200 46h14v124h-14zM224 46h14v124h-14z" fill="currentColor" opacity="0.32" />
      <g fill="none" stroke="currentColor" strokeWidth="2" opacity="0.75">
        <path d="M268 46h96v124h-96z" />
        <path d="M284 78h64M284 104h64M284 130h40" strokeLinecap="round" />
      </g>
    </g>
  )
}

function FlagArt() {
  return (
    <g>
      <path d="M-10 196 74 26h48L38 196ZM102 196l84-170h48l-84 170ZM214 196 298 26h48l-84 170Z" fill="currentColor" opacity="0.14" />
      <g fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8">
        <path d="M40 62h84M40 84h56M268 142h88M296 120h60" strokeLinecap="round" />
        <circle cx="326" cy="62" r="20" />
        <path d="M326 42v40M306 62h40" />
      </g>
    </g>
  )
}

function BracketArt() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M44 42h38v52h38M44 94h38M44 138h38v48h38M44 186h38M174 68h38v52h38M174 162h38v-42h38" opacity="0.6" />
      <g fill="currentColor" stroke="none">
        <rect x="82" y="90" width="10" height="10" />
        <rect x="82" y="182" width="10" height="10" />
        <rect x="212" y="116" width="10" height="10" />
        <circle cx="318" cy="114" r="18" opacity="0.9" />
      </g>
      <path d="M250 114h50" strokeWidth="2" />
      <path d="M130 42v144" strokeDasharray="4 8" opacity="0.35" />
    </g>
  )
}

const art: Record<CoverPattern, React.ReactNode> = {
  court: <CourtArt />,
  grid: <GridArt />,
  arc: <ArcArt />,
  score: <ScoreArt />,
  flag: <FlagArt />,
  bracket: <BracketArt />,
}

export function TournamentCover({
  pattern,
  category,
  photo,
  sizes = "100vw",
  priority = false,
  className,
  label,
}: {
  pattern: CoverPattern
  category: Category
  /** Foto real del lugar: cubre la portada por arriba del arte. */
  photo?: string
  sizes?: string
  priority?: boolean
  className?: string
  label?: string
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[hsl(var(--tone))] text-[hsl(var(--tone-foreground))]",
        toneClass[category],
        className,
      )}
      aria-hidden="true"
    >
      {photo ? (
        <Image
          src={photo}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="absolute inset-0 object-cover"
        />
      ) : (
        <svg
          viewBox="0 0 400 225"
          className="absolute inset-0 h-full w-full"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {art[pattern]}
        </svg>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_55%,hsl(var(--tone))_55.2%)] opacity-35" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,hsl(var(--tone))_0%,transparent_70%)] opacity-40" />
      {label ? (
        <span className="absolute bottom-3 right-3.5 text-2xs font-bold uppercase tracking-[0.18em] opacity-70">
          {label}
        </span>
      ) : null}
    </div>
  )
}
