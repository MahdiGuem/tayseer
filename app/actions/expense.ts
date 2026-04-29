'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getExpenses(projectId?: string) {
  return await prisma.expense.findMany({
    where: projectId ? { projectId } : undefined,
    orderBy: { date: 'desc' }
  })
}

export async function createExpense(data: {
  projectId?: string
  description: string
  amount: number
  category?: string
  date?: string
}) {
  const expense = await prisma.expense.create({
    data: {
      projectId: data.projectId ?? null,
      description: data.description,
      amount: data.amount,
      category: data.category ?? null,
      date: data.date ? new Date(data.date) : new Date()
    }
  })

  await prisma.agentLog.create({
    data: {
      action: 'expense',
      message: `Expense recorded: ${data.description} - $${data.amount}`,
      projectId: data.projectId ?? undefined,
      severity: 'info'
    }
  })

  revalidatePath('/')
  return expense
}

export async function deleteExpense(id: string) {
  await prisma.expense.delete({ where: { id } })
  revalidatePath('/')
}