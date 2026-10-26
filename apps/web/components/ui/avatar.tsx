import { cn, initials } from "@/lib/utils"

const palettes = [
  "bg-primary text-primary-foreground",
  "bg-foreground text-background",
  "bg-aura text-aura-foreground",
  "bg-success text-success-foreground",
  "bg-danger text-danger-foreground",
]

function hash(value: string) {
  let result = 0
  for (let index = 0; index < value.length; index += 1) {
    result = (result * 31 + value.charCodeAt(index)) % 997
  }
  return result
}

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string
  src?: string
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
}) {
  const palette = palettes[hash(name) % palettes.length]
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold uppercase",
        {
          xs: "h-6 w-6 text-[0.5rem]",
          sm: "h-8 w-8 text-[0.625rem]",
          md: "h-10 w-10 text-xs",
          lg: "h-14 w-14 text-base",
        }[size],
        palette,
        className,
      )}
      aria-hidden="true"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        initials(name)
      )}
    </span>
  )
}
