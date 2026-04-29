'use server'

import { prisma } from '@/lib/prisma'

export async function getAgentLogs(projectId?: string, limit = 50) {
  return await prisma.agentLog.findMany({
    where: projectId ? { projectId } : undefined,
    orderBy: { createdAt: 'desc' },
    take: limit
  })
}