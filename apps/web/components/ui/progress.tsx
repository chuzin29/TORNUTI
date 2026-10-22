import { cn, clamp } from "@/lib/utils"

export function Progress({
  value,
  max,
  className,
  label,
  tone = "primary",
}: {
  value: number
  max: number
  className?: string
  label?: string
  tone?: "primary" | "aura" | "success" | "tone"
}) {
  const percent = max > 0 ? clamp(Math.round((value / max) * 100), 0, 100) : 0
  return (
    <div className={className}>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label ?? "Cupos ocupados"}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-500", {
            "bg-primary": tone === "primary",
            "bg-aura": tone === "aura",
            "bg-success": tone === "success",
            "bg-tone": tone === "tone",
          })}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
