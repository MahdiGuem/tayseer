'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getProjects() {
  return await prisma.project.findMany({
    include: {
      clients: true,
      milestones: { orderBy: { order: 'asc' } },
      _count: { select: { messages: true, invoices: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getProject(id: string) {
  return await prisma.project.findUnique({
    where: { id },
    include: {
      clients: true,
      milestones: { orderBy: { order: 'asc' } },
      messages: { orderBy: { createdAt: 'asc' } },
      invoices: {
        include: { items: true },
        orderBy: { createdAt: 'desc' }
      },
      contracts: { orderBy: { createdAt: 'desc' }, take: 1 },
      expenses: true,
      agentLogs: { orderBy: { createdAt: 'desc' }, take: 50 }
    }
  })
}

export async function createProject(data: { title: string; taxRate?: number; currency?: string }) {
  const project = await prisma.project.create({
    data: {
      title: data.title,
      taxRate: data.taxRate ?? 0,
      currency: data.currency ?? 'USD'
    }
  })
  revalidatePath('/')
  return project
}

export async function updateProject(id: string, data: { title?: string; taxRate?: number; currency?: string; status?: string }) {
  const updateData: Record<string, unknown> = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.taxRate !== undefined) updateData.taxRate = data.taxRate
  if (data.currency !== undefined) updateData.currency = data.currency
  if (data.status !== undefined) updateData.status = data.status

  const project = await prisma.project.update({
    where: { id },
    data: updateData
  })
  revalidatePath('/')
  return project
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } })
  revalidatePath('/')
}