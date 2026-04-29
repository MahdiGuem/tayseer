'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getInvoices(projectId: string) {
  const invoices = await prisma.invoice.findMany({
    where: { projectId },
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  })
  return invoices.map(inv => ({
    ...inv,
    amount: Number(inv.amount),
    items: inv.items.map(item => ({ ...item, amount: Number(item.amount) }))
  }))
}

export async function createInvoice(projectId: string, data: {
  items: { description: string; amount: number }[]
  dueDate?: string
  currency?: string
}) {
  const invoiceCount = await prisma.invoice.count({ where: { projectId } })
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(3, '0')}`

  const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0)

  const invoice = await prisma.invoice.create({
    data: {
      projectId,
      invoiceNumber,
      amount: totalAmount,
      currency: data.currency ?? 'USD',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      stage: 1,
      items: {
        create: data.items.map(item => ({
          description: item.description,
          amount: item.amount
        }))
      }
    },
    include: { items: true }
  })

  await prisma.agentLog.create({
    data: {
      action: 'invoice',
      message: `Invoice ${invoiceNumber} generated - $${totalAmount}`,
      projectId,
      severity: 'info'
    }
  })

  revalidatePath('/')
  return {
    ...invoice,
    amount: Number(invoice.amount),
    items: invoice.items.map(item => ({ ...item, amount: Number(item.amount) }))
  }
}

export async function updateInvoiceStage(id: string, stage: number) {
  const invoice = await prisma.invoice.update({
    where: { id },
    data: { stage },
    include: { items: true }
  })

  const stageLabels = ['', 'Generated', 'Received', 'Funded', 'Released']
  await prisma.agentLog.create({
    data: {
      action: 'invoice',
      message: `Invoice ${invoice.invoiceNumber} moved to ${stageLabels[stage]}`,
      projectId: invoice.projectId,
      severity: 'info'
    }
  })

  revalidatePath('/')
  return {
    ...invoice,
    amount: Number(invoice.amount),
    items: invoice.items.map(item => ({ ...item, amount: Number(item.amount) }))
  }
}

export async function deleteInvoice(id: string) {
  await prisma.invoice.delete({ where: { id } })
  revalidatePath('/')
}