import { AuraReason, Prisma } from "@prisma/client"

interface RecordAuraInput {
  userId: string
  amount: number
  reason: AuraReason
  description: string
  tournamentId?: string
  matchId?: string
}

/**
 * Writes the ledger entry and updates the cached total in one transaction.
 * Must be called with a transaction client so the operation stays atomic with
 * whatever triggered it (registration, match result, podium).
 */
export async function recordAura(tx: Prisma.TransactionClient, input: RecordAuraInput) {
  if (input.amount === 0) return null

  const transaction = await tx.auraTransaction.create({
    data: {
      userId: input.userId,
      amount: input.amount,
      reason: input.reason,
      description: input.description,
      tournamentId: input.tournamentId,
      matchId: input.matchId,
    },
  })

  await tx.user.update({
    where: { id: input.userId },
    data: { aura: { increment: input.amount } },
  })

  return transaction
}
