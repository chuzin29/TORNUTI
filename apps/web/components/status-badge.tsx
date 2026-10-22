import { Badge } from "@/components/ui/badge"
import type { TournamentStatus } from "@/lib/types"
import { STATUS_LABEL } from "@/lib/tournament"

const variant: Record<TournamentStatus, "primary" | "aura" | "live" | "neutral"> = {
  abierto: "primary",
  "ultimos-cupos": "aura",
  "en-curso": "live",
  finalizado: "neutral",
}

export function StatusBadge({ status, className }: { status: TournamentStatus; className?: string }) {
  return (
    <Badge variant={variant[status]} dot={status === "en-curso"} className={className}>
      {STATUS_LABEL[status]}
    </Badge>
  )
}
