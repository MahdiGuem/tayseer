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
  return await prisma.client.findUnique({
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
}