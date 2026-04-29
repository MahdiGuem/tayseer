'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getMilestones(projectId: string) {
  const milestones = await prisma.milestone.findMany({
    where: { projectId },
    orderBy: { order: 'asc' }
  })
  return milestones.map(m => ({ ...m, amount: Number(m.amount) }))
}

export async function createMilestone(projectId: string, data: { label: string; amount: number; dueDate?: string }) {
  const lastMilestone = await prisma.milestone.findFirst({
    where: { projectId },
    orderBy: { order: 'desc' }
  })

  const milestone = await prisma.milestone.create({
    data: {
      projectId,
      label: data.label,
      amount: data.amount,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      order: (lastMilestone?.order ?? 0) + 1
    }
  })
  revalidatePath('/')
  return { ...milestone, amount: Number(milestone.amount) }
}

export async function updateMilestone(id: string, data: { label?: string; amount?: number; dueDate?: string; isPaid?: boolean; order?: number }) {
  const updateData: Record<string, unknown> = {}
  if (data.label !== undefined) updateData.label = data.label
  if (data.amount !== undefined) updateData.amount = data.amount
  if (data.isPaid !== undefined) updateData.isPaid = data.isPaid
  if (data.order !== undefined) updateData.order = data.order
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null

  const milestone = await prisma.milestone.update({
    where: { id },
    data: updateData
  })
  revalidatePath('/')
  return milestone
}

export async function deleteMilestone(id: string) {
  await prisma.milestone.delete({ where: { id } })
  revalidatePath('/')
}

export async function markMilestonePaid(id: string, isPaid: boolean) {
  const milestone = await prisma.milestone.update({
    where: { id },
    data: { isPaid }
  })
  revalidatePath('/')
  return milestone
}