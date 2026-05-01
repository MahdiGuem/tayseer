'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getClients() {
  const clients = await prisma.client.findMany({
    include: {
      projectClients: {
        include: { project: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  return clients.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    projectClients: c.projectClients.map(pc => ({
      ...pc,
      createdAt: pc.createdAt.toISOString()
    }))
  }))
}

export async function getClient(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      projectClients: {
        include: { project: true }
      }
    }
  })
  if (!client) return null
  return {
    ...client,
    createdAt: client.createdAt.toISOString(),
    projectClients: client.projectClients.map(pc => ({
      ...pc,
      createdAt: pc.createdAt.toISOString()
    }))
  }
}

export async function createClient(data: { name: string; email?: string; platform?: string }) {
  const client = await prisma.client.create({
    data: {
      name: data.name,
      email: data.email ?? null,
      platform: data.platform ?? null
    }
  })
  revalidatePath('/')
  return {
    ...client,
    createdAt: client.createdAt.toISOString()
  }
}

export async function getClientByName(name: string) {
  const normalizedName = name.trim().toLowerCase()
  const clients = await prisma.client.findMany({
    where: {
      name: {
        equals: normalizedName,
        mode: 'insensitive'
      }
    }
  })
  return clients.length > 0 ? clients[0] : null
}

export async function updateClient(id: string, data: { name?: string; email?: string; platform?: string }) {
  const updateData: Record<string, unknown> = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.email !== undefined) updateData.email = data.email
  if (data.platform !== undefined) updateData.platform = data.platform

  const client = await prisma.client.update({
    where: { id },
    data: updateData
  })
  revalidatePath('/')
  return {
    ...client,
    createdAt: client.createdAt.toISOString()
  }
}

export async function deleteClient(id: string) {
  await prisma.client.delete({ where: { id } })
  revalidatePath('/')
}

export async function assignClientToProject(projectId: string, clientId: string) {
  const projectClient = await prisma.projectClient.create({
    data: {
      projectId,
      clientId
    },
    include: {
      client: true,
      project: true
    }
  })
  revalidatePath('/')
  return {
    ...projectClient,
    createdAt: projectClient.createdAt.toISOString()
  }
}

export async function removeClientFromProject(projectId: string, clientId: string) {
  await prisma.projectClient.deleteMany({
    where: {
      projectId,
      clientId
    }
  })
  revalidatePath('/')
}

export async function getProjectClients(projectId: string) {
  const projectClients = await prisma.projectClient.findMany({
    where: { projectId },
    include: {
      client: true
    }
  })
  return projectClients.map(pc => ({
    id: pc.id,
    clientToken: pc.clientToken,
    client: {
      ...pc.client,
      createdAt: pc.client.createdAt.toISOString()
    },
    createdAt: pc.createdAt.toISOString()
  }))
}

export async function getClientByToken(token: string) {
  const projectClient = await prisma.projectClient.findUnique({
    where: { clientToken: token },
    include: {
      client: true,
      project: {
        include: {
          milestones: { orderBy: { order: 'asc' } },
          invoices: {
            include: { items: true },
            orderBy: { createdAt: 'desc' }
          },
          messages: { orderBy: { createdAt: 'asc' } }
        }
      }
    }
  })

  if (!projectClient?.project) return null

  const project = projectClient.project
  return {
    client: {
      ...projectClient.client,
      createdAt: projectClient.client.createdAt.toISOString()
    },
    project: {
      id: project.id,
      title: project.title,
      taxRate: project.taxRate ? Number(project.taxRate) : 0,
      currency: project.currency,
      status: project.status,
      contract: project.contract as any,
      milestones: project.milestones.map(m => ({
        id: m.id,
        projectId: m.projectId,
        label: m.label,
        amount: Number(m.amount),
        dueDate: m.dueDate?.toISOString() || null,
        isPaid: m.isPaid,
        order: m.order
      })),
      invoices: project.invoices.map(inv => ({
        id: inv.id,
        projectId: inv.projectId,
        invoiceNumber: inv.invoiceNumber,
        amount: Number(inv.amount),
        currency: inv.currency,
        stage: inv.stage,
        dueDate: inv.dueDate?.toISOString() || null,
        createdAt: inv.createdAt.toISOString(),
        items: inv.items.map(item => ({
          id: item.id,
          invoiceId: item.invoiceId,
          description: item.description,
          amount: Number(item.amount)
        }))
      })),
      messages: project.messages.map(m => ({
        id: m.id,
        projectId: m.projectId,
        senderRole: m.senderRole,
        senderName: m.senderName,
        content: m.content,
        createdAt: m.createdAt.toISOString()
      }))
    }
  }
}