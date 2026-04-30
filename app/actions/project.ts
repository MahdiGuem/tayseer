'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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
    taxRate: p.taxRate ? Number(p.taxRate) : 0,
    status: p.status,
    currency: p.currency,
    contract: p.contract as any,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    milestones: p.milestones.map((m) => ({
      id: m.id,
      projectId: m.projectId,
      label: m.label,
      amount: m.amount ? Number(m.amount) : 0,
      dueDate: m.dueDate?.toISOString() || null,
      isPaid: m.isPaid,
      order: m.order
    })),
    messages: p.messages.map(m => ({
      id: m.id,
      projectId: m.projectId,
      senderRole: m.senderRole,
      senderName: m.senderName,
      content: m.content,
      createdAt: m.createdAt.toISOString()
    })),
    invoices: p.invoices.map(inv => ({
      id: inv.id,
      projectId: inv.projectId,
      invoiceNumber: inv.invoiceNumber,
      amount: inv.amount ? Number(inv.amount) : 0,
      currency: inv.currency,
      stage: inv.stage,
      dueDate: inv.dueDate?.toISOString() || null,
      createdAt: inv.createdAt.toISOString(),
      items: inv.items.map(item => ({
        id: item.id,
        invoiceId: item.invoiceId,
        description: item.description,
        amount: item.amount ? Number(item.amount) : 0
      }))
    })),
    expenses: p.expenses.map((e) => ({
      id: e.id,
      projectId: e.projectId,
      description: e.description,
      amount: e.amount ? Number(e.amount) : 0,
      category: e.category,
      date: e.date.toISOString()
    })),
    agentLogs: p.agentLogs.map(l => ({
      id: l.id,
      projectId: l.projectId,
      action: l.action,
      message: l.message,
      severity: l.severity,
      createdAt: l.createdAt.toISOString()
    })),
    projectClients: p.projectClients.map(pc => ({
      id: pc.id,
      clientToken: pc.clientToken,
      client: {
        id: pc.client.id,
        name: pc.client.name,
        email: pc.client.email,
        platform: pc.client.platform,
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
    taxRate: project.taxRate ? Number(project.taxRate) : 0,
    status: project.status,
    currency: project.currency,
    contract: project.contract as any,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    milestones: project.milestones.map(m => ({
      id: m.id,
      projectId: m.projectId,
      label: m.label,
      amount: m.amount ? Number(m.amount) : 0,
      dueDate: m.dueDate?.toISOString() || null,
      isPaid: m.isPaid,
      order: m.order
    })),
    messages: project.messages.map(m => ({
      id: m.id,
      projectId: m.projectId,
      senderRole: m.senderRole,
      senderName: m.senderName,
      content: m.content,
      createdAt: m.createdAt.toISOString()
    })),
    invoices: project.invoices.map(inv => ({
      id: inv.id,
      projectId: inv.projectId,
      invoiceNumber: inv.invoiceNumber,
      amount: inv.amount ? Number(inv.amount) : 0,
      currency: inv.currency,
      stage: inv.stage,
      dueDate: inv.dueDate?.toISOString() || null,
      createdAt: inv.createdAt.toISOString(),
      items: inv.items.map(item => ({
        id: item.id,
        invoiceId: item.invoiceId,
        description: item.description,
        amount: item.amount ? Number(item.amount) : 0
      }))
    })),
    expenses: project.expenses.map(e => ({
      id: e.id,
      projectId: e.projectId,
      description: e.description,
      amount: e.amount ? Number(e.amount) : 0,
      category: e.category,
      date: e.date.toISOString()
    })),
    agentLogs: project.agentLogs.map(l => ({
      id: l.id,
      projectId: l.projectId,
      action: l.action,
      message: l.message,
      severity: l.severity,
      createdAt: l.createdAt.toISOString()
    })),
    projectClients: project.projectClients.map(pc => ({
      id: pc.id,
      clientToken: pc.clientToken,
      client: {
        id: pc.client.id,
        name: pc.client.name,
        email: pc.client.email,
        platform: pc.client.platform,
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
    id: project.id,
    title: project.title,
    taxRate: project.taxRate ? Number(project.taxRate) : 0,
    status: project.status,
    currency: project.currency,
    contract: project.contract as any,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    projectClients: project.projectClients.map(pc => ({
      id: pc.id,
      clientToken: pc.clientToken,
      client: {
        id: pc.client.id,
        name: pc.client.name,
        email: pc.client.email,
        platform: pc.client.platform,
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
  contract?: unknown
}) {
  const updateData: Record<string, unknown> = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.taxRate !== undefined) updateData.taxRate = data.taxRate
  if (data.currency !== undefined) updateData.currency = data.currency
  if (data.status !== undefined) updateData.status = data.status
  if (data.contract !== undefined) updateData.contract = data.contract

  const project = await prisma.project.update({
    where: { id },
    data: updateData
  })
  revalidatePath('/')
  return {
    id: project.id,
    title: project.title,
    taxRate: project.taxRate ? Number(project.taxRate) : 0,
    status: project.status,
    currency: project.currency,
    contract: project.contract as any,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  }
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } })
  revalidatePath('/')
}