import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

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

  if (!client || !client.project) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  return NextResponse.json({
    client: {
      id: client.id,
      name: client.name,
      platform: client.platform
    },
    project: {
      id: client.project.id,
      title: client.project.title,
      currency: client.project.currency,
      status: client.project.status
    },
    milestones: client.project.milestones.map(m => ({
      id: m.id,
      label: m.label,
      amount: Number(m.amount),
      dueDate: m.dueDate,
      isPaid: m.isPaid,
      order: m.order
    })),
    contract: client.project.contracts[0] ? {
      id: client.project.contracts[0].id,
      content: client.project.contracts[0].content,
      version: client.project.contracts[0].version,
      createdAt: client.project.contracts[0].createdAt
    } : null,
    invoices: client.project.invoices.map(inv => ({
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
    messages: client.project.messages.map(msg => ({
      id: msg.id,
      senderRole: msg.senderRole,
      senderName: msg.senderName,
      content: msg.content,
      createdAt: msg.createdAt
    }))
  })
}