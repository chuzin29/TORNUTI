export type BracketSlot = string | null

export interface BracketMatch {
  id: string
  round: number
  index: number
  team1: BracketSlot
  team2: BracketSlot
}

export interface BracketRound {
  round: number
  label: string
  matches: BracketMatch[]
}

function nextPowerOfTwo(value: number) {
  let size = 1
  while (size < value) size *= 2
  return size
}

/**
 * Standard bracket seed order, built recursively. For eight slots it returns
 * [1, 8, 4, 5, 2, 7, 3, 6], which spreads byes instead of bunching them.
 */
export function seedOrder(size: number): number[] {
  if (size < 1) return []
  if (size === 1) return [1]

  const previous = seedOrder(size / 2)
  return previous.flatMap((seed) => [seed, size + 1 - seed])
}

export function roundLabel(round: number, totalRounds: number) {
  const remaining = totalRounds - round
  if (remaining === 0) return "Final"
  if (remaining === 1) return "Semifinales"
  if (remaining === 2) return "Cuartos"
  if (remaining === 3) return "Octavos"
  return `Ronda ${round}`
}

/**
 * Builds a seeded single-elimination bracket. Byes are spread across the draw
 * so an entrant never receives two consecutive walkovers.
 */
export function buildBracket(entrants: string[]): BracketRound[] {
  if (entrants.length < 2) return []

  const size = nextPowerOfTwo(entrants.length)
  const seeded: BracketSlot[] = seedOrder(size).map(
    (seed) => entrants[seed - 1] ?? null,
  )
  const totalRounds = Math.log2(size)

  const rounds: BracketRound[] = []
  let current: BracketMatch[] = []

  for (let index = 0; index < size; index += 2) {
    current.push({
      id: `r1-m${index / 2 + 1}`,
      round: 1,
      index: index / 2,
      team1: seeded[index] ?? null,
      team2: seeded[index + 1] ?? null,
    })
  }

  rounds.push({ round: 1, label: roundLabel(1, totalRounds), matches: current })

  for (let round = 2; round <= totalRounds; round += 1) {
    const previous = rounds[rounds.length - 1]
    current = []
    for (let index = 0; index < previous.matches.length; index += 2) {
      current.push({
        id: `r${round}-m${index / 2 + 1}`,
        round,
        index: index / 2,
        team1: null,
        team2: null,
      })
    }
    rounds.push({ round, label: roundLabel(round, totalRounds), matches: current })
  }

  return rounds
}

export function championOf(entrants: string[], winner: string | null) {
  if (!winner || entrants.length < 2) return null
  return winner
}
