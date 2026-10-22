import { MatchStatus } from "@prisma/client"
import {
  nextMatchPosition,
  nextMatchSlot,
  planSingleElimination,
  seedOrder,
  stageLabel,
} from "../src/tournaments/bracket"

const entrant = (index: number) => ({ id: `team-${index}`, name: `Equipo ${index}` })

describe("planSingleElimination", () => {
  it("returns no matches with fewer than two entrants", () => {
    expect(planSingleElimination([])).toEqual([])
    expect(planSingleElimination([entrant(1)])).toEqual([])
  })

  it("builds a single final for two entrants", () => {
    const plan = planSingleElimination([entrant(1), entrant(2)])

    expect(plan).toHaveLength(1)
    expect(plan[0]).toMatchObject({
      round: 1,
      position: 0,
      stage: "Final",
      team1Id: "team-1",
      team2Id: "team-2",
      winnerId: null,
      status: MatchStatus.SCHEDULED,
    })
  })

  it("uses a power-of-two bracket and distributes byes", () => {
    const plan = planSingleElimination([1, 2, 3, 4, 5].map(entrant))

    expect(plan).toHaveLength(7)
    expect(plan.filter((match) => match.round === 1)).toHaveLength(4)
    expect(plan.filter((match) => match.round === 2)).toHaveLength(2)
    expect(plan.filter((match) => match.round === 3)).toHaveLength(1)

    const firstBye = plan.find((match) => match.round === 1 && match.position === 0)
    expect(firstBye).toMatchObject({
      team1Id: "team-1",
      team2Id: null,
      winnerId: "team-1",
      status: MatchStatus.COMPLETED,
    })

    const realMatch = plan.find((match) => match.round === 1 && match.position === 1)
    expect(realMatch).toMatchObject({
      team1Id: "team-4",
      team2Id: "team-5",
      winnerId: null,
      status: MatchStatus.SCHEDULED,
    })

    // Later rounds wait for their feeders instead of being auto-completed.
    const waiting = plan.find((match) => match.round === 2 && match.position === 0)
    expect(waiting).toMatchObject({
      team1Id: "team-1",
      team2Id: null,
      winnerId: null,
      status: MatchStatus.SCHEDULED,
    })

    // Two byes can meet in round two only when both feeders are resolved.
    const byesMeet = plan.find((match) => match.round === 2 && match.position === 1)
    expect(byesMeet).toMatchObject({
      team1Id: "team-2",
      team2Id: "team-3",
      winnerId: null,
      status: MatchStatus.SCHEDULED,
    })
  })

  it("keeps every first-round match scheduled when the field is full", () => {
    const plan = planSingleElimination([1, 2, 3, 4].map(entrant))

    expect(plan).toHaveLength(3)
    expect(plan.filter((match) => match.round === 1).every((match) => match.status === MatchStatus.SCHEDULED)).toBe(true)
    expect(plan.find((match) => match.round === 2)).toMatchObject({
      stage: "Final",
      status: MatchStatus.SCHEDULED,
    })
  })
})

describe("seedOrder", () => {
  it("spreads the highest seeds across the bracket", () => {
    expect(seedOrder(2)).toEqual([1, 2])
    expect(seedOrder(4)).toEqual([1, 4, 2, 3])
    expect(seedOrder(8)).toEqual([1, 8, 4, 5, 2, 7, 3, 6])
  })
})

describe("bracket helpers", () => {
  it("maps a match position to the next round slot", () => {
    expect(nextMatchPosition(0)).toBe(0)
    expect(nextMatchPosition(1)).toBe(0)
    expect(nextMatchPosition(2)).toBe(1)
    expect(nextMatchSlot(0)).toBe("team1Id")
    expect(nextMatchSlot(1)).toBe("team2Id")
  })

  it("labels the closing rounds in Spanish", () => {
    expect(stageLabel(1, 1)).toBe("Final")
    expect(stageLabel(1, 2)).toBe("Semifinal")
    expect(stageLabel(1, 3)).toBe("Cuartos de final")
    expect(stageLabel(1, 4)).toBe("Octavos de final")
    expect(stageLabel(1, 6)).toBe("Ronda 1")
  })
})
