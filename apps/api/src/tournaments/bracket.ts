import { MatchStatus } from "@prisma/client"

export interface BracketEntrant {
  id: string
  name: string
}

export interface PlannedMatch {
  round: number
  position: number
  stage: string
  team1Id: string | null
  team2Id: string | null
  winnerId: string | null
  status: MatchStatus
}

function nextPowerOfTwo(value: number) {
  let size = 1
  while (size < value) size *= 2
  return size
}

/**
 * Standard bracket seed order, built recursively. For eight slots it returns
 * [1, 8, 4, 5, 2, 7, 3, 6], which spreads byes across the draw instead of
 * letting one entrant walk over an empty half.
 */
export function seedOrder(size: number): number[] {
  if (size < 1) return []
  if (size === 1) return [1]

  const previous = seedOrder(size / 2)
  return previous.flatMap((seed) => [seed, size + 1 - seed])
}

export function stageLabel(round: number, totalRounds: number) {
  const remaining = totalRounds - round
  if (remaining === 0) return "Final"
  if (remaining === 1) return "Semifinal"
  if (remaining === 2) return "Cuartos de final"
  if (remaining === 3) return "Octavos de final"
  return `Ronda ${round}`
}

/**
 * Plans a seeded single-elimination bracket. Byes are resolved immediately:
 * the player paired with an empty slot advances and the match is stored as
 * completed without a score. Later rounds inherit those byes.
 */
export function planSingleElimination(entrants: BracketEntrant[]): PlannedMatch[] {
  if (entrants.length < 2) return []

  const size = nextPowerOfTwo(entrants.length)
  const totalRounds = Math.log2(size)
  const slots: (string | null)[] = seedOrder(size).map(
    (seed) => entrants[seed - 1]?.id ?? null,
  )

  const plan: PlannedMatch[] = []
  let previous: PlannedMatch[] = []

  for (let index = 0; index < size; index += 2) {
    const team1Id = slots[index]
    const team2Id = slots[index + 1] ?? null
    const ready = Boolean(team1Id && team2Id)
    const winnerId = team1Id && !team2Id ? team1Id : !team1Id && team2Id ? team2Id : null

    const match: PlannedMatch = {
      round: 1,
      position: index / 2,
      stage: stageLabel(1, totalRounds),
      team1Id,
      team2Id,
      winnerId,
      status: ready ? MatchStatus.SCHEDULED : MatchStatus.COMPLETED,
    }

    plan.push(match)
    previous.push(match)
  }

  for (let round = 2; round <= totalRounds; round += 1) {
    const current: PlannedMatch[] = []

    for (let index = 0; index < previous.length; index += 2) {
      const feederA = previous[index]
      const feederB = previous[index + 1]
      const team1Id = feederA?.winnerId ?? null
      const team2Id = feederB?.winnerId ?? null
      const feedersDone =
        feederA?.status === MatchStatus.COMPLETED &&
        feederB?.status === MatchStatus.COMPLETED
      const ready = feedersDone && Boolean(team1Id && team2Id)
      const winnerId =
        feedersDone && team1Id && !team2Id
          ? team1Id
          : feedersDone && !team1Id && team2Id
            ? team2Id
            : null

      const match: PlannedMatch = {
        round,
        position: index / 2,
        stage: stageLabel(round, totalRounds),
        team1Id,
        team2Id,
        winnerId,
        status: feedersDone && !ready ? MatchStatus.COMPLETED : MatchStatus.SCHEDULED,
      }

      plan.push(match)
      current.push(match)
    }

    previous = current
  }

  return plan
}

export function nextMatchPosition(position: number) {
  return Math.floor(position / 2)
}

export function nextMatchSlot(position: number): "team1Id" | "team2Id" {
  return position % 2 === 0 ? "team1Id" : "team2Id"
}
