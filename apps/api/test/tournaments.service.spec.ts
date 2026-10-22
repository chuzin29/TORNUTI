import { BadRequestException, ForbiddenException } from "@nestjs/common"
import { RegistrationStatus, TournamentStatus } from "@prisma/client"
import { PrismaService } from "../src/prisma/prisma.service"
import { TournamentsService } from "../src/tournaments/tournaments.service"

const future = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
const past = () => new Date(Date.now() - 24 * 60 * 60 * 1000)

function buildPrismaMock() {
  const tx = {
    tournamentRegistration: {
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    auraTransaction: { create: jest.fn().mockResolvedValue({ id: "aura-1" }) },
    user: { update: jest.fn().mockResolvedValue({}) },
  }

  const prisma = {
    tournament: {
      findUnique: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
    tournamentRegistration: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
    team: { findUnique: jest.fn() },
    match: { count: jest.fn() },
    $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
  }

  return { prisma, tx }
}

describe("TournamentsService.register", () => {
  it("rejects registrations after the deadline", async () => {
    const { prisma } = buildPrismaMock()
    prisma.tournament.findUnique.mockResolvedValue({
      id: "t-1",
      name: "Copa",
      status: TournamentStatus.PUBLISHED,
      registrationEndsAt: past(),
      maxParticipants: 8,
      auraPrize: 100,
    })

    const service = new TournamentsService(prisma as unknown as PrismaService)

    await expect(service.register("copa", {}, "user-1")).rejects.toBeInstanceOf(
      BadRequestException,
    )
  })

  it("rejects registrations when the tournament is full", async () => {
    const { prisma, tx } = buildPrismaMock()
    prisma.tournament.findUnique.mockResolvedValue({
      id: "t-1",
      name: "Copa",
      status: TournamentStatus.PUBLISHED,
      registrationEndsAt: future(),
      maxParticipants: 8,
      auraPrize: 100,
    })
    prisma.tournamentRegistration.findUnique.mockResolvedValue(null)
    tx.tournamentRegistration.count.mockResolvedValue(8)

    const service = new TournamentsService(prisma as unknown as PrismaService)

    await expect(service.register("copa", {}, "user-1")).rejects.toBeInstanceOf(
      BadRequestException,
    )
    expect(tx.tournamentRegistration.create).not.toHaveBeenCalled()
  })

  it("creates an accepted registration and records Aura", async () => {
    const { prisma, tx } = buildPrismaMock()
    prisma.tournament.findUnique.mockResolvedValue({
      id: "t-1",
      name: "Copa Cadejos",
      status: TournamentStatus.PUBLISHED,
      registrationEndsAt: future(),
      maxParticipants: 8,
      auraPrize: 100,
    })
    prisma.tournamentRegistration.findUnique.mockResolvedValue(null)
    tx.tournamentRegistration.count.mockResolvedValue(3)
    tx.tournamentRegistration.create.mockResolvedValue({
      id: "reg-1",
      status: RegistrationStatus.ACCEPTED,
    })

    const service = new TournamentsService(prisma as unknown as PrismaService)
    const result = await service.register("copa", {}, "user-1")

    expect(result).toMatchObject({ id: "reg-1" })
    expect(tx.tournamentRegistration.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tournamentId: "t-1",
          userId: "user-1",
          status: RegistrationStatus.ACCEPTED,
          seed: 4,
        }),
      }),
    )
    expect(tx.auraTransaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: "user-1", amount: 40 }),
      }),
    )
    expect(tx.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { aura: { increment: 40 } } }),
    )
  })

  it("does not let a different player generate the bracket", async () => {
    const { prisma } = buildPrismaMock()
    prisma.tournament.findUnique.mockResolvedValue({
      organizerId: "someone-else",
      status: TournamentStatus.PUBLISHED,
      registrations: [],
      startsAt: future(),
    })

    const service = new TournamentsService(prisma as unknown as PrismaService)

    await expect(
      service.generateBracket("copa", {}, { userId: "user-1", role: "PLAYER" }),
    ).rejects.toBeInstanceOf(ForbiddenException)
  })
})
