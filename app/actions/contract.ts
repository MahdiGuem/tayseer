'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getContract(projectId: string) {
  return await prisma.contract.findFirst({
    where: { projectId },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createContract(projectId: string, content: string) {
  const existingContract = await prisma.contract.findFirst({
    where: { projectId },
    orderBy: { version: 'desc' }
  })

  const contract = await prisma.contract.create({
    data: {
      projectId,
      content,
      version: (existingContract?.version ?? 0) + 1
    }
  })

  await prisma.agentLog.create({
    data: {
      action: 'contract',
      message: `Contract v${contract.version} created`,
      projectId,
      severity: 'info'
    }
  })

  revalidatePath('/')
  return contract
}

export async function updateContract(id: string, content: string) {
  const contract = await prisma.contract.findUnique({ where: { id } })
  if (!contract) throw new Error('Contract not found')

  const updated = await prisma.contract.create({
    data: {
      projectId: contract.projectId,
      content,
      version: contract.version + 1
    }
  })

  await prisma.agentLog.create({
    data: {
      action: 'contract',
      message: `Contract v${updated.version} created`,
      projectId: contract.projectId,
      severity: 'info'
    }
  })

  revalidatePath('/')
  return updated
}