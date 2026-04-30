import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const body = await request.json()

  if (body.action === 'confirmContract') {
    const projectClient = await prisma.projectClient.findUnique({
      where: { clientToken: token },
      include: { project: true }
    })

    if (!projectClient || !projectClient.project) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const project = projectClient.project
    const contract = project.contract as any

    if (!contract || contract.status !== 'sent') {
      return NextResponse.json({ error: 'Contract not ready' }, { status: 400 })
    }

    const updatedContract = {
      ...contract,
      status: 'confirmed'
    }

    await prisma.project.update({
      where: { id: project.id },
      data: { 
        contract: updatedContract as unknown as import('@prisma/client').Prisma.InputJsonValue,
        status: 'ACTIVE'
      }
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

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

  if (!projectClient || !projectClient.project) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const project = projectClient.project

  return NextResponse.json({
    client: {
      id: projectClient.client.id,
      name: projectClient.client.name,
      platform: projectClient.client.platform
    },
    project: {
      id: project.id,
      title: project.title,
      currency: project.currency,
      status: project.status,
      contract: project.contract as any
    },
    milestones: project.milestones.map(m => ({
      id: m.id,
      label: m.label,
      amount: Number(m.amount),
      dueDate: m.dueDate,
      isPaid: m.isPaid,
      order: m.order
    })),
    invoices: project.invoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      amount: Number(inv.amount),
      currency: inv.currency,
      stage: inv.stage,
      dueDate: inv.dueDate,
      createdAt: inv.createdAt,
      items: inv.items.map(item => ({
        id: item.id,
        description: item.description,
        amount: Number(item.amount)
      }))
    })),
    messages: project.messages.map(msg => ({
      id: msg.id,
      senderRole: msg.senderRole,
      senderName: msg.senderName,
      content: msg.content,
      createdAt: msg.createdAt
    }))
  })
}