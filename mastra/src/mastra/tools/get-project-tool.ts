import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const getProjectTool = createTool({
  id: "get-project",
  description: "Get detailed information about a specific project including milestones, clients, invoices, and messages. Use when you need full project details or the project contract.",
  inputSchema: z.object({
    project_id: z
      .string()
      .describe("The project ID to fetch details for"),
  }),
  outputSchema: z.object({
    project: z.object({
      id: z.string(),
      title: z.string(),
      taxRate: z.number(),
      status: z.string(),
      currency: z.string(),
      contract: z.any().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
      milestones: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          amount: z.number(),
          dueDate: z.string().nullable(),
          isPaid: z.boolean(),
          order: z.number(),
        })
      ),
      messages: z.array(
        z.object({
          id: z.string(),
          senderRole: z.string(),
          senderName: z.string(),
          content: z.string(),
          createdAt: z.string(),
        })
      ),
      invoices: z.array(
        z.object({
          id: z.string(),
          invoiceNumber: z.string(),
          amount: z.number(),
          currency: z.string(),
          stage: z.number(),
          dueDate: z.string().nullable(),
          createdAt: z.string(),
        })
      ),
      projectClients: z.array(
        z.object({
          id: z.string(),
          clientToken: z.string(),
          client: z.object({
            name: z.string(),
            email: z.string().nullable(),
            platform: z.string().nullable(),
          }),
        })
      ),
    }),
  }),
  execute: async (input) => {
    const response = await fetch(`${TAYSEER_API_URL}/api/tayseer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getProject",
        id: input.project_id,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get project: ${error}`)
    }

    const data = await response.json()

    if (!data.project) {
      return { project: null }
    }

    return { project: data.project }
  },
})