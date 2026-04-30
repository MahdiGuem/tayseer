'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

interface ContractData {
  description: string
  milestones: Array<{
    label: string
    amount: number
    dueDate?: string
  }>
  clientNames: string[]
  devName: string
}

interface ContractJSON extends ContractData {
  createdAt: string
  status: 'draft' | 'sent' | 'confirmed'
}

export async function getContract(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { contract: true }
  })
  return project?.contract as ContractJSON | null
}

export async function saveContract(projectId: string, data: ContractData) {
  const contract: ContractJSON = {
    ...data,
    createdAt: new Date().toISOString(),
    status: 'draft'
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { contract: contract as unknown as Prisma.InputJsonValue }
  })

  await prisma.agentLog.create({
    data: {
      action: 'contract',
      message: 'Contract created',
      projectId,
      severity: 'info'
    }
  })

  revalidatePath('/')
  return project.contract as unknown as ContractJSON
}

export async function sendContract(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { contract: true, projectClients: { include: { client: true } } }
  })

  if (!project?.contract) {
    throw new Error('No contract to send')
  }

  const contract = project.contract as unknown as ContractJSON
  
  // Update status to sent
  const updatedContract: ContractJSON = {
    ...contract,
    status: 'sent'
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { contract: updatedContract as unknown as Prisma.InputJsonValue }
  })

  // Send message
  await prisma.message.create({
    data: {
      projectId,
      senderRole: 'DEV',
      senderName: 'Mahdi',
      content: 'View Contract'
    }
  })

  await prisma.agentLog.create({
    data: {
      action: 'contract',
      message: 'Contract sent to client',
      projectId,
      severity: 'info'
    }
  })

  revalidatePath('/')
  return updatedContract
}

export async function confirmContract(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { contract: true }
  })

  if (!project?.contract) {
    throw new Error('No contract to confirm')
  }

  const contract = project.contract as unknown as ContractJSON
  
  if (contract.status !== 'sent') {
    throw new Error('Contract must be sent before confirming')
  }

  // Update status to confirmed
  const updatedContract: ContractJSON = {
    ...contract,
    status: 'confirmed'
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { 
      contract: updatedContract as unknown as Prisma.InputJsonValue,
      status: 'ACTIVE'
    }
  })

  // Create milestones from contract
  if (contract.milestones && contract.milestones.length > 0) {
    await prisma.milestone.createMany({
      data: contract.milestones.map((m, index) => ({
        projectId,
        label: m.label,
        amount: m.amount,
        dueDate: m.dueDate ? new Date(m.dueDate) : null,
        order: index
      }))
    })
  }

  await prisma.agentLog.create({
    data: {
      action: 'contract',
      message: 'Contract confirmed - milestones created',
      projectId,
      severity: 'success'
    }
  })

  revalidatePath('/')
  return updatedContract
}

export async function getProjectWithContract(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      projectClients: { include: { client: true } }
    }
  })

  if (!project) return null

  return {
    id: project.id,
    title: project.title,
    taxRate: project.taxRate ? Number(project.taxRate) : 0,
    status: project.status,
    currency: project.currency,
    contract: project.contract as ContractJSON | null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    projectClients: project.projectClients.map(pc => ({
      id: pc.id,
      clientToken: pc.clientToken,
      createdAt: pc.createdAt.toISOString(),
      client: {
        id: pc.client.id,
        name: pc.client.name,
        email: pc.client.email,
        platform: pc.client.platform,
        createdAt: pc.client.createdAt.toISOString()
      }
    }))
  }
}