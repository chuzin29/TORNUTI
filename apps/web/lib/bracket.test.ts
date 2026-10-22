import { describe, expect, it } from "vitest"
import { buildBracket, roundLabel } from "./bracket"

describe("buildBracket", () => {
  it("returns nothing with fewer than two entrants", () => {
    expect(buildBracket([])).toEqual([])
    expect(buildBracket(["Solo uno"])).toEqual([])
  })

  it("creates one final for two entrants", () => {
    const rounds = buildBracket(["Las Cadejas", "Vista Hermosa"])
    expect(rounds).toHaveLength(1)
    expect(rounds[0].label).toBe("Final")
    expect(rounds[0].matches[0].team1).toBe("Las Cadejas")
    expect(rounds[0].matches[0].team2).toBe("Vista Hermosa")
  })

  it("spreads byes through an odd field without losing entrants", () => {
    const entrants = ["A", "B", "C", "D", "E"]
    const rounds = buildBracket(entrants)
    const firstRound = rounds[0].matches.flatMap((match) => [match.team1, match.team2])
    expect(firstRound.filter(Boolean).sort()).toEqual([...entrants].sort())
    expect(firstRound).toHaveLength(8)
    expect(rounds).toHaveLength(3)
    expect(rounds[rounds.length - 1].matches).toHaveLength(1)
    // A, B and C receive byes; D and E play each other.
    expect(firstRound[1]).toBeNull()
    expect([firstRound[2], firstRound[3]]).toEqual(["D", "E"])
  })

  it("builds a full tree for eight entrants", () => {
    const rounds = buildBracket(["A", "B", "C", "D", "E", "F", "G", "H"])
    expect(rounds.map((round) => round.matches.length)).toEqual([4, 2, 1])
    expect(rounds.map((round) => round.label)).toEqual(["Cuartos", "Semifinales", "Final"])
  })

  it("labels rounds by distance to the final", () => {
    expect(roundLabel(1, 4)).toBe("Octavos")
    expect(roundLabel(2, 4)).toBe("Cuartos")
    expect(roundLabel(3, 4)).toBe("Semifinales")
    expect(roundLabel(4, 4)).toBe("Final")
  })
})
