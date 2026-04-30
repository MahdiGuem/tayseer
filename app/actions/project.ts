'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Prisma } from '@prisma/client'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

export async function getProjects() {
  const projects = await prisma.project.findMany({
    include: {
      projectClients: {
        include: { client: true }
      },
      milestones: { orderBy: { order: 'asc' } },
      messages: { orderBy: { createdAt: 'asc' } },
      invoices: {
        include: { items: true },
        orderBy: { createdAt: 'desc' }
      },
      expenses: true,
      agentLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
      _count: { select: { messages: true, invoices: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  return projects.map(p => ({
    id: p.id,
    title: p.title,
    taxRate: Number(p.taxRate),
    status: p.status,
    currency: p.currency,
    planDescription: p.planDescription,
    planMilestones: p.planMilestones as any,
    isPlanFinalized: p.isPlanFinalized,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    milestones: p.milestones.map((m) => ({
      id: m.id,
      projectId: m.projectId,
      label: m.label,
      amount: Number(m.amount),
      dueDate: m.dueDate?.toISOString() || null,
      isPaid: m.isPaid,
      order: m.order,
      createdAt: new Date().toISOString()
    })),
    messages: p.messages.map(m => ({
      ...m,
      createdAt: m.createdAt.toISOString()
    })),
    invoices: p.invoices.map(inv => ({
      ...inv,
      amount: Number(inv.amount),
      dueDate: inv.dueDate?.toISOString() || null,
      createdAt: inv.createdAt.toISOString(),
      items: inv.items.map(item => ({ ...item, amount: Number(item.amount) }))
    })),
    expenses: p.expenses.map((e) => ({
      id: e.id,
      projectId: e.projectId,
      description: e.description,
      amount: Number(e.amount),
      category: e.category,
      date: e.date.toISOString(),
      createdAt: new Date().toISOString()
    })),
    agentLogs: p.agentLogs.map(l => ({
      ...l,
      createdAt: l.createdAt.toISOString()
    })),
    projectClients: p.projectClients.map(pc => ({
      id: pc.id,
      clientToken: pc.clientToken,
      client: {
        ...pc.client,
        createdAt: pc.client.createdAt.toISOString()
      },
      createdAt: pc.createdAt.toISOString()
    }))
  }))
}

export async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      projectClients: {
        include: { client: true }
      },
      milestones: { orderBy: { order: 'asc' } },
      messages: { orderBy: { createdAt: 'asc' } },
      invoices: {
        include: { items: true },
        orderBy: { createdAt: 'desc' }
      },
      expenses: true,
      agentLogs: { orderBy: { createdAt: 'desc' }, take: 50 }
    }
  })
  if (!project) return null
  return {
    id: project.id,
    title: project.title,
    taxRate: Number(project.taxRate),
    status: project.status,
    currency: project.currency,
    planDescription: project.planDescription,
    planMilestones: project.planMilestones as any,
    isPlanFinalized: project.isPlanFinalized,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    milestones: project.milestones.map(m => ({
      id: m.id,
      projectId: m.projectId,
      label: m.label,
      amount: Number(m.amount),
      dueDate: m.dueDate?.toISOString() || null,
      isPaid: m.isPaid,
      order: m.order,
      createdAt: new Date().toISOString()
    })),
    messages: project.messages.map(m => ({
      ...m,
      createdAt: m.createdAt.toISOString()
    })),
    invoices: project.invoices.map(inv => ({
      ...inv,
      amount: Number(inv.amount),
      dueDate: inv.dueDate?.toISOString() || null,
      createdAt: inv.createdAt.toISOString(),
      items: inv.items.map(item => ({ ...item, amount: Number(item.amount) }))
    })),
    expenses: project.expenses.map(e => ({
      id: e.id,
      projectId: e.projectId,
      description: e.description,
      amount: Number(e.amount),
      category: e.category,
      date: e.date.toISOString(),
      createdAt: new Date().toISOString()
    })),
    agentLogs: project.agentLogs.map(l => ({
      ...l,
      createdAt: l.createdAt.toISOString()
    })),
    projectClients: project.projectClients.map(pc => ({
      id: pc.id,
      clientToken: pc.clientToken,
      client: {
        ...pc.client,
        createdAt: pc.client.createdAt.toISOString()
      },
      createdAt: pc.createdAt.toISOString()
    }))
  }
}

export async function createProject(data: { 
  title: string
  clientIds: string[]
  taxRate?: number
  currency?: string
}) {
  const project = await prisma.project.create({
    data: {
      title: data.title,
      taxRate: data.taxRate ?? 0,
      currency: data.currency ?? 'USD',
      projectClients: {
        create: data.clientIds.map(clientId => ({
          clientId
        }))
      }
    },
    include: {
      projectClients: {
        include: { client: true }
      }
    }
  })
  revalidatePath('/')
  return {
    ...project,
    taxRate: Number(project.taxRate),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    projectClients: project.projectClients.map(pc => ({
      id: pc.id,
      clientToken: pc.clientToken,
      client: {
        ...pc.client,
        createdAt: pc.client.createdAt.toISOString()
      },
      createdAt: pc.createdAt.toISOString()
    }))
  }
}

export async function updateProject(id: string, data: { 
  title?: string
  taxRate?: number
  currency?: string
  status?: string
  planDescription?: string | null
  planMilestones?: JsonValue | null
  isPlanFinalized?: boolean
}) {
  const updateData: Record<string, unknown> = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.taxRate !== undefined) updateData.taxRate = data.taxRate
  if (data.currency !== undefined) updateData.currency = data.currency
  if (data.status !== undefined) updateData.status = data.status
  if (data.planDescription !== undefined) updateData.planDescription = data.planDescription
  if (data.planMilestones !== undefined) updateData.planMilestones = data.planMilestones
  if (data.isPlanFinalized !== undefined) updateData.isPlanFinalized = data.isPlanFinalized

  const project = await prisma.project.update({
    where: { id },
    data: updateData
  })
  revalidatePath('/')
  return {
    ...project,
    taxRate: Number(project.taxRate),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  }
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } })
  revalidatePath('/')
}

export interface PlanMilestoneInput {
  label: string
  amount: number
  dueDate?: string
}

export async function savePlan(
  projectId: string, 
  data: { 
    description?: string
    milestones: PlanMilestoneInput[]
  }
) {
  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      planDescription: data.description ?? undefined,
      planMilestones: data.milestones.length > 0 ? data.milestones as unknown as Prisma.InputJsonValue : undefined,
      isPlanFinalized: false
    }
  })
  
  await prisma.agentLog.create({
    data: {
      action: 'plan',
      message: 'Plan updated',
      projectId,
      severity: 'info'
    }
  })
  
  revalidatePath('/')
  return {
    ...project,
    planDescription: project.planDescription,
    planMilestones: project.planMilestones as PlanMilestoneInput[] | null,
    isPlanFinalized: project.isPlanFinalized
  }
}

export async function finalizePlan(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { planMilestones: true, isPlanFinalized: true }
  })

  if (!project) throw new Error('Project not found')
  if (project.isPlanFinalized) throw new Error('Plan already finalized')

  const milestones = project.planMilestones as PlanMilestoneInput[] | null
  if (!milestones || milestones.length === 0) {
    throw new Error('No milestones in plan')
  }

  // Create milestones from plan
  await prisma.milestone.createMany({
    data: milestones.map((m, index) => ({
      projectId,
      label: m.label,
      amount: m.amount,
      dueDate: m.dueDate ? new Date(m.dueDate) : null,
      order: index
    }))
  })

  // Mark plan as finalized and set status to ACTIVE
  await prisma.project.update({
    where: { id: projectId },
    data: { 
      isPlanFinalized: true,
      status: 'ACTIVE'
    }
  })

  await prisma.agentLog.create({
    data: {
      action: 'plan',
      message: 'Plan finalized - milestones created',
      projectId,
      severity: 'success'
    }
  })

  revalidatePath('/')
  return { success: true }
}