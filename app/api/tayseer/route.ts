import { NextRequest, NextResponse } from 'next/server'
import { getProjects, getProject } from '@/app/actions/project'
import { getMilestones, createMilestone } from '@/app/actions/milestone'
import { getInvoices, createInvoice } from '@/app/actions/invoice'
import { createMessage, getMessages } from '@/app/actions/message'

const TAYSEER_ACTIONS = {
  getProjects: async (body: any) => {
    const projects = await getProjects()
    return { projects }
  },

  getProject: async (body: { id: string }) => {
    const project = await getProject(body.id)
    return { project }
  },

  getMilestones: async (body: { projectId: string }) => {
    const milestones = await getMilestones(body.projectId)
    return { milestones }
  },

  createMilestone: async (body: { projectId: string; data: { label: string; amount: number; dueDate?: string } }) => {
    const milestone = await createMilestone(body.projectId, body.data)
    return { milestone }
  },

  getInvoices: async (body: { projectId: string }) => {
    const invoices = await getInvoices(body.projectId)
    return { invoices }
  },

  createInvoice: async (body: { projectId: string; data: { items: { description: string; amount: number }[]; dueDate?: string; currency?: string } }) => {
    const invoice = await createInvoice(body.projectId, body.data)
    return { invoice }
  },

  getMessages: async (body: { projectId: string }) => {
    const messages = await getMessages(body.projectId)
    return { messages }
  },

  createMessage: async (body: { projectId: string; data: { senderRole: 'DEV' | 'CLIENT'; senderName: string; content: string } }) => {
    const message = await createMessage(body.projectId, body.data)
    return { message }
  },

  // Convenience: get contract from project
  getContract: async (body: { projectId: string }) => {
    const project = await getProject(body.projectId)
    return { contract: project?.contract ?? null }
  },

  // List all project summaries (lighter than full getProjects)
  listProjectSummaries: async () => {
    const projects = await getProjects()
    return {
      summaries: projects.map((p: any) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        currency: p.currency,
        createdAt: p.createdAt,
        milestoneCount: p.milestones?.length ?? 0,
        clientCount: p.projectClients?.length ?? 0
      }))
    }
  }
} as const

type ActionName = keyof typeof TAYSEER_ACTIONS

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...params } = body

    if (!action || !(action in TAYSEER_ACTIONS)) {
      return NextResponse.json(
        { error: `Invalid action. Valid actions: ${Object.keys(TAYSEER_ACTIONS).join(', ')}` },
        { status: 400 }
      )
    }

    const handler = TAYSEER_ACTIONS[action as ActionName]
    const result = await handler(params)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[tayseer-api] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Tayseer API',
    availableActions: Object.keys(TAYSEER_ACTIONS)
  })
}