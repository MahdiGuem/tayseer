import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const listProjectsTool = createTool({
  id: "list-projects",
  description: "List all projects with optional status filter. Use this to get an overview of all projects.",
  inputSchema: z.object({
    status: z
      .enum(["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"])
      .optional()
      .describe("Optional project status to filter by"),
  }),
  outputSchema: z.object({
    projects: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        status: z.string(),
        currency: z.string(),
        createdAt: z.string(),
        milestoneCount: z.number(),
        clientCount: z.number(),
      })
    ),
  }),
  execute: async (input) => {
    const response = await fetch(`${TAYSEER_API_URL}/api/tayseer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "listProjectSummaries" }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to list projects: ${error}`)
    }

    const data = await response.json()

    let projects = data.summaries || []

    // Filter by status if provided
    if (input.status) {
      projects = projects.filter(
        (p: any) => p.status === input.status
      )
    }

    return { projects }
  },
})