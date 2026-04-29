'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getMessages(projectId: string) {
  return await prisma.message.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' }
  })
}

export async function createMessage(projectId: string, data: {
  senderRole: 'DEV' | 'CLIENT'
  senderName: string
  content: string
}) {
  const message = await prisma.message.create({
    data: {
      projectId,
      senderRole: data.senderRole,
      senderName: data.senderName,
      content: data.content
    }
  })
  revalidatePath('/')
  return message
}

export async function createDevMessage(projectId: string, content: string) {
  return await createMessage(projectId, {
    senderRole: 'DEV',
    senderName: 'Dev',
    content
  })
}

export async function createClientMessage(projectId: string, clientName: string, content: string) {
  return await createMessage(projectId, {
    senderRole: 'CLIENT',
    senderName: clientName,
    content
  })
}