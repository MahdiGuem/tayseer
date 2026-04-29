import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const body = await request.json()
  const { content } = body

  if (!content || typeof content !== 'string') {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  const client = await prisma.client.findUnique({
    where: { clientToken: token },
    include: { project: true }
  })

  if (!client || !client.project) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const message = await prisma.message.create({
    data: {
      projectId: client.project.id,
      senderRole: 'CLIENT',
      senderName: client.name,
      content: content.trim()
    }
  })

  return NextResponse.json({
    id: message.id,
    senderRole: message.senderRole,
    senderName: message.senderName,
    content: message.content,
    createdAt: message.createdAt
  })
}