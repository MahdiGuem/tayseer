'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getProjects() {
  const projects = await prisma.project.findMany({
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
      agentLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
      _count: { select: { messages: true, invoices: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  return projects.map(p => ({
    ...p,
    taxRate: Number(p.taxRate),
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
    clients: p.clients.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString()
    })),
    contracts: p.contracts.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString()
    }))
  }))
}

export async function getProject(id: string) {
  const project = await prisma.project.findUnique({
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
  if (!project) return null
  return {
    ...project,
    taxRate: Number(project.taxRate),
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
    contracts: project.contracts.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString()
    })),
    clients: project.clients.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString()
    }))
  }
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
  return {
    ...project,
    taxRate: Number(project.taxRate),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  }
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