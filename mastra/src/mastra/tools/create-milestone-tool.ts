import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const createMilestoneTool = createTool({
  id: "create-milestone",
  description: "Create a new milestone for a project. Use this when the user wants to add a deliverable or phase to a project.",
  inputSchema: z.object({
    project_id: z.string().describe("The project ID to create milestone for"),
    label: z.string().describe("Milestone description/title"),
    amount: z.number().describe("Milestone payment amount"),
    dueDate: z.string().optional().describe("Due date in ISO format (e.g., 2026-06-30)"),
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
        action: "createMilestone",
        projectId: input.project_id,
        data: {
          label: input.label,
          amount: input.amount,
          dueDate: input.dueDate,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create milestone: ${error}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return { milestone: data.milestone, success: true }
  },
})