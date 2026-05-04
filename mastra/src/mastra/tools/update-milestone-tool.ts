import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const updateMilestoneTool = createTool({
  id: "update-milestone",
  description: "Update an existing milestone. Use this to change milestone details or mark it as paid/unpaid.",
  inputSchema: z.object({
    id: z.string().describe("Milestone ID to update"),
    label: z.string().optional().describe("New milestone label"),
    amount: z.number().optional().describe("New amount"),
    dueDate: z.string().optional().describe("New due date in ISO format"),
    isPaid: z.boolean().optional().describe("Mark as paid or unpaid"),
    order: z.number().optional().describe("New sort order"),
  }),
  outputSchema: z.object({
    milestone: z.object({
      id: z.string(),
      projectId: z.string(),
      label: z.string(),
      amount: z.number(),
      dueDate: z.string().nullable(),
      isPaid: z.boolean(),
      order: z.number(),
    }),
    success: z.boolean(),
  }),
  execute: async (input) => {
    const response = await fetch(`${TAYSEER_API_URL}/api/tayseer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateMilestone",
        id: input.id,
        label: input.label,
        amount: input.amount,
        dueDate: input.dueDate,
        isPaid: input.isPaid,
        order: input.order,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update milestone: ${error}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return { milestone: data.milestone, success: true }
  },
})