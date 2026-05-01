import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const listMilestonesTool = createTool({
  id: "list-milestones",
  description: "List all milestones for a project. Use this to see project progress, what has been completed, and what's remaining. Filter by unpaid to find milestones that need invoices.",
  inputSchema: z.object({
    project_id: z
      .string()
      .describe("The project ID to list milestones for"),
    only_unpaid: z
      .boolean()
      .optional()
      .describe("Filter to show only unpaid milestones"),
  }),
  outputSchema: z.object({
    milestones: z.array(
      z.object({
        id: z.string(),
        projectId: z.string(),
        label: z.string(),
        amount: z.number(),
        dueDate: z.string().nullable(),
        isPaid: z.boolean(),
        order: z.number(),
      })
    ),
  }),
  execute: async (input) => {
    const response = await fetch(`${TAYSEER_API_URL}/api/tayseer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getMilestones",
        projectId: input.project_id,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to list milestones: ${error}`)
    }

    const data = await response.json()

    let milestones = data.milestones || []

    // Filter by paid status if requested
    if (input.only_unpaid === true) {
      milestones = milestones.filter((m: any) => !m.isPaid)
    } else if (input.only_unpaid === false) {
      milestones = milestones.filter((m: any) => m.isPaid)
    }

    return { milestones }
  },
})