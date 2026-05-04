import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const createProjectTool = createTool({
  id: "create-project",
  description: "Create a new project for a client. Use this when the user wants to start a new project or engagement.",
  inputSchema: z.object({
    title: z.string().describe("Project title/name"),
    clientIds: z.array(z.string()).optional().describe("Array of client IDs to associate with project"),
    taxRate: z.number().optional().describe("Tax rate percentage"),
    currency: z.string().optional().describe("Currency code (default: USD)"),
    status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"]).optional().describe("Initial status (default: DRAFT)"),
  }),
  outputSchema: z.object({
    project: z.object({
      id: z.string(),
      title: z.string(),
      status: z.string(),
      currency: z.string(),
    }),
    success: z.boolean(),
  }),
  execute: async (input) => {
    const response = await fetch(`${TAYSEER_API_URL}/api/tayseer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "createProject",
        title: input.title,
        clientIds: input.clientIds ?? [],
        taxRate: input.taxRate,
        currency: input.currency ?? "USD",
        status: input.status ?? "DRAFT"
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create project: ${error}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return { project: data.project, success: true }
  },
})