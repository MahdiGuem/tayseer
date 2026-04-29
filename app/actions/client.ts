'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createClient(projectId: string, data: { name: string; email?: string; platform?: string }) {
  const client = await prisma.client.create({
    data: {
      projectId,
      name: data.name,
      email: data.email ?? null,
      platform: data.platform ?? null
    }
  })
  revalidatePath('/')
  return client
}

export async function deleteClient(id: string) {
  await prisma.client.delete({ where: { id } })
  revalidatePath('/')
}

export async function getClientByToken(token: string) {
  const client = await prisma.client.findUnique({
    where: { clientToken: token },
    include: {
      project: {
        include: {
          milestones: { orderBy: { order: 'asc' } },
          contracts: { orderBy: { createdAt: 'desc' }, take: 1 },
          invoices: {
            include: { items: true },
            orderBy: { createdAt: 'desc' }
          },
          messages: { orderBy: { createdAt: 'asc' } }
        }
      }
    }
  })
  
  if (!client?.project) return client
  
  const project = client.project
  const milestones = project.milestones.map(m => ({
    id: m.id,
    projectId: m.projectId,
    label: m.label,
    amount: Number(m.amount),
    dueDate: m.dueDate,
    isPaid: m.isPaid,
    order: m.order,
    createdAt: new Date().toISOString()
  }))
  
  const invoices = project.invoices.map(inv => ({
    id: inv.id,
    projectId: inv.projectId,
    invoiceNumber: inv.invoiceNumber,
    amount: Number(inv.amount),
    currency: inv.currency,
    stage: inv.stage,
    dueDate: inv.dueDate,
    createdAt: inv.createdAt.toISOString(),
    items: inv.items.map(item => ({
      id: item.id,
      invoiceId: item.invoiceId,
      description: item.description,
      amount: Number(item.amount)
    }))
  }))
  
  const contracts = project.contracts.map(c => ({
    id: c.id,
    projectId: c.projectId,
    content: c.content,
    version: c.version,
    createdAt: c.createdAt.toISOString()
  }))
  
  const messages = project.messages.map(m => ({
    id: m.id,
    projectId: m.projectId,
    senderRole: m.senderRole,
    senderName: m.senderName,
    content: m.content,
    createdAt: m.createdAt.toISOString()
  }))
  
  return {
    ...client,
    project: {
      ...project,
      taxRate: Number(project.taxRate),
      milestones,
      invoices,
      contracts,
      messages
    }
  }
}
